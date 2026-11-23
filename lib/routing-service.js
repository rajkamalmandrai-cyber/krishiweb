/**
 * KRISHIWEB ROUTING SERVICE & PROVIDER ABSTRACTION
 * Real road-distance and travel-time routing using OpenStreetMap data via OSRM
 * Includes provider abstraction, request caching, rate throttling, and clear attribution.
 */

const fs = require("fs");
const path = require("path");

// In-Memory & Persistent Cache Configuration
const ROUTE_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (road geometry is stable)
const memoryRouteCache = new Map();
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 1000; // Respect OSRM public service usage policy (1 req/sec max)

/**
 * Throttle helper to respect public API usage policies
 */
async function throttleOsrm() {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_REQUEST_INTERVAL_MS) {
    const delay = MIN_REQUEST_INTERVAL_MS - timeSinceLast;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  lastRequestTime = Date.now();
}

/**
 * Open Source Routing Machine (OSRM) Provider using OpenStreetMap road data
 * IMPORTANT: OSRM expects coordinates in {longitude},{latitude} order!
 */
class OsrmRoutingProvider {
  constructor() {
    this.name = "OSRM / OpenStreetMap";
    this.attribution = "Route data © OpenStreetMap contributors, routing powered by OSRM";
  }

  async computeRoute(originLat, originLon, destLat, destLon) {
    const oLat = parseFloat(originLat);
    const oLon = parseFloat(originLon);
    const dLat = parseFloat(destLat);
    const dLon = parseFloat(destLon);

    if (isNaN(oLat) || isNaN(oLon) || isNaN(dLat) || isNaN(dLon)) {
      throw new Error("Invalid geographic coordinates provided for route computation");
    }

    // Coordinate validation
    if (oLat < -90 || oLat > 90 || dLat < -90 || dLat > 90 || oLon < -180 || oLon > 180 || dLon < -180 || dLon > 180) {
      throw new Error("Coordinates out of valid planetary bounds");
    }

    // OSRM requires {longitude},{latitude};{longitude},{latitude}
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${oLon.toFixed(6)},${oLat.toFixed(6)};${dLon.toFixed(6)},${dLat.toFixed(6)}?overview=false&steps=false`;

    await throttleOsrm();

    const response = await fetch(osrmUrl, {
      method: "GET",
      headers: {
        "User-Agent": "KrishiWeb-AcademicDecisionSupport/2.0 (Agricultural Mandi College Project; contact: krishiweb@example.edu)",
        "Accept": "application/json"
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      throw new Error(`OSRM HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.code !== "Ok" || !data.routes || !data.routes[0]) {
      throw new Error(`OSRM routing failed: ${data.message || data.code || "No route found"}`);
    }

    const route = data.routes[0];
    const distanceMeters = route.distance || 0;
    const durationSeconds = route.duration || 0;

    const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10; // 1 decimal place
    const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

    return {
      status: "success",
      distanceKm: Math.max(1, distanceKm),
      durationMinutes: durationMinutes,
      isEstimated: false,
      provider: this.name,
      attribution: this.attribution,
      origin: { lat: oLat, lon: oLon },
      destination: { lat: dLat, lon: dLon }
    };
  }
}

/**
 * Optional Google Maps Routes API Provider (activated if GOOGLE_MAPS_API_KEY is configured)
 */
class GoogleRoutesProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.name = "Google Maps Routes API";
    this.attribution = "Map & Traffic data © Google Maps";
  }

  async computeRoute(originLat, originLon, destLat, destLon) {
    const oLat = parseFloat(originLat);
    const oLon = parseFloat(originLon);
    const dLat = parseFloat(destLat);
    const dLon = parseFloat(destLon);

    const googleUrl = "https://routes.googleapis.com/directions/v2:computeRoutes";
    const body = {
      origin: { location: { latLng: { latitude: oLat, longitude: oLon } } },
      destination: { location: { latLng: { latitude: dLat, longitude: dLon } } },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE"
    };

    const res = await fetch(googleUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok) {
      throw new Error(`Google Routes API error: ${res.status}`);
    }

    const gData = await res.json();
    if (!gData.routes || !gData.routes[0]) {
      throw new Error("Google Routes API returned no routes");
    }

    const route = gData.routes[0];
    const distMeters = route.distanceMeters || 0;
    const durSecondsStr = (route.duration || "0s").replace("s", "");
    const durSeconds = parseFloat(durSecondsStr) || 0;

    return {
      status: "success",
      distanceKm: Math.max(1, Math.round((distMeters / 1000) * 10) / 10),
      durationMinutes: Math.max(1, Math.round(durSeconds / 60)),
      isEstimated: false,
      provider: this.name,
      attribution: this.attribution,
      origin: { lat: oLat, lon: oLon },
      destination: { lat: dLat, lon: dLon }
    };
  }
}

/**
 * Routing Service Manager with Caching and Provider Fallback
 */
class RoutingService {
  constructor() {
    this.osrmProvider = new OsrmRoutingProvider();
    const googleKey = process.env.GOOGLE_MAPS_API_KEY || "";
    this.googleProvider = (googleKey && googleKey.length > 15) ? new GoogleRoutesProvider(googleKey) : null;
  }

  getCacheKey(oLat, oLon, dLat, dLon) {
    return `${parseFloat(oLon).toFixed(4)},${parseFloat(oLat).toFixed(4)}->${parseFloat(dLon).toFixed(4)},${parseFloat(dLat).toFixed(4)}`;
  }

  async getRoute(originLat, originLon, destLat, destLon) {
    const oLat = parseFloat(originLat);
    const oLon = parseFloat(originLon);
    const dLat = parseFloat(destLat);
    const dLon = parseFloat(destLon);

    if (isNaN(oLat) || isNaN(oLon) || isNaN(dLat) || isNaN(dLon)) {
      return {
        status: "error",
        message: "Invalid origin or destination coordinates"
      };
    }

    const cacheKey = this.getCacheKey(oLat, oLon, dLat, dLon);
    const now = Date.now();

    // Check memory cache
    if (memoryRouteCache.has(cacheKey)) {
      const cached = memoryRouteCache.get(cacheKey);
      if (now - cached.timestamp < ROUTE_CACHE_TTL_MS) {
        return { ...cached.data, cached: true };
      }
    }

    // Attempt routing with primary provider (Google if key present, else OSRM)
    const primaryProvider = this.googleProvider || this.osrmProvider;
    try {
      const result = await primaryProvider.computeRoute(oLat, oLon, dLat, dLon);
      memoryRouteCache.set(cacheKey, { timestamp: now, data: result });
      return result;
    } catch (err) {
      console.warn(`[RoutingService] Primary provider (${primaryProvider.name}) failed:`, err.message);

      // Fallback to OSRM if Google was primary and failed
      if (primaryProvider !== this.osrmProvider) {
        try {
          console.log("[RoutingService] Falling back to OSRM OpenStreetMap routing...");
          const osrmResult = await this.osrmProvider.computeRoute(oLat, oLon, dLat, dLon);
          memoryRouteCache.set(cacheKey, { timestamp: now, data: osrmResult });
          return osrmResult;
        } catch (osrmErr) {
          console.error("[RoutingService] OSRM fallback also failed:", osrmErr.message);
        }
      }

      // NO fake travel-time fallback! Return clear error state per Priority 2 requirement.
      return {
        status: "error",
        message: `Route computation failed: ${err.message}. Driving distance cannot be verified without real road network access.`,
        provider: "none"
      };
    }
  }
}

const routingServiceInstance = new RoutingService();

module.exports = {
  RoutingService,
  routingService: routingServiceInstance,
  OsrmRoutingProvider,
  GoogleRoutesProvider
};

