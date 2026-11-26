/**
 * KRISHIWEB ROUTING SERVICE & PROVIDER ABSTRACTION
 * Real road-distance and travel-time routing using Google Maps Routes API (Primary)
 * and OpenStreetMap / OSRM (Secondary fallback when Google key is not present)
 * Includes strict distance validation sanity checks, provider attribution, and verified Place IDs.
 */

const fs = require("fs");
const path = require("path");
const dns = require("dns");
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

// In-Memory Cache Configuration
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
 * Great-circle Haversine Distance (Crow-fly straight-line in km)
 */
function haversineCrowFlyKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Strict Road Distance Sanity Validation
 * Road distance must not be substantially shorter than the straight-line geographic distance.
 * Rejects invalid coordinates, unit bugs, and suspiciously short routes.
 */
function validateRoadDistanceSanity(roadDistKm, oLat, oLon, dLat, dLon) {
  if (typeof roadDistKm !== "number" || isNaN(roadDistKm) || roadDistKm <= 0) {
    throw new Error(`Invalid non-positive road distance: ${roadDistKm}`);
  }

  const crowFlyKm = haversineCrowFlyKm(oLat, oLon, dLat, dLon);

  // If points are within 250 metres of each other, road distance is essentially zero/local entrance
  if (crowFlyKm < 0.25) {
    return true;
  }

  // A road route can NEVER be physically shorter than 85% of straight-line distance on Earth.
  // Any road distance < 0.85 * crowFly indicates wrong coordinates or corrupt routing.
  if (crowFlyKm > 2.0 && roadDistKm < crowFlyKm * 0.85) {
    throw new Error(
      `Sanity check failed: Road distance (${roadDistKm} km) is impossibly shorter than straight-line distance (${crowFlyKm.toFixed(1)} km) between [${oLat}, ${oLon}] and [${dLat}, ${dLon}].`
    );
  }

  // Long-range transit check: If straight line is > 50 km, road distance cannot be < 10 km (e.g. Pune 1 km bug)
  if (crowFlyKm > 50 && roadDistKm < 15) {
    throw new Error(
      `Suspicious route rejected: Road distance (${roadDistKm} km) is inconsistent with inter-city transit (${crowFlyKm.toFixed(1)} km straight-line).`
    );
  }

  return true;
}

/**
 * Open Source Routing Machine (OSRM) Provider using OpenStreetMap road data
 * IMPORTANT: OSRM expects coordinates in {longitude},{latitude} order!
 * Fallback provider when GOOGLE_MAPS_API_KEY is not configured or unavailable.
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
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${oLon.toFixed(6)},${oLat.toFixed(6)};${dLon.toFixed(6)},${dLat.toFixed(6)}?overview=false&steps=false`;

    await throttleOsrm();

    const response = await fetch(osrmUrl, {
      method: "GET",
      headers: {
        "User-Agent": "KrishiWeb-AcademicDecisionSupport/2.0 (Agricultural Mandi College Project; contact: krishiweb@example.edu)",
        "Accept": "application/json"
      },
      signal: AbortSignal.timeout(15000)
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

    // Single unit conversion: distanceMeters into kilometres exactly once
    const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;
    const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

    // Strict distance sanity check
    validateRoadDistanceSanity(distanceKm, oLat, oLon, dLat, dLon);

    return {
      status: "success",
      distanceKm: distanceKm,
      durationMinutes: durationMinutes,
      distanceMeters: distanceMeters,
      durationSeconds: durationSeconds,
      isLiveRoute: true,
      provider: this.name,
      attribution: this.attribution,
      origin: { lat: oLat, lon: oLon },
      destination: { lat: dLat, lon: dLon }
    };
  }
}

/**
 * Google Maps Routes API Provider (Primary Provider)
 * Endpoint: https://routes.googleapis.com/directions/v2:computeRoutes
 * Features: DRIVE travelMode, TRAFFIC_UNAWARE routingPreference, verified Place IDs, field mask.
 */
class GoogleRoutesProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.name = "Google Maps Routes API";
    this.attribution = "Map & Route data © Google Maps";
  }

  async computeRoute(originLat, originLon, destLat, destLon, destPlaceId = null) {
    const oLat = parseFloat(originLat);
    const oLon = parseFloat(originLon);
    const dLat = parseFloat(destLat);
    const dLon = parseFloat(destLon);

    if (isNaN(oLat) || isNaN(oLon) || isNaN(dLat) || isNaN(dLon)) {
      throw new Error("Invalid geographic coordinates provided for Google Routes computation");
    }

    // Planetary bounds validation
    if (oLat < -90 || oLat > 90 || dLat < -90 || dLat > 90 || oLon < -180 || oLon > 180 || dLon < -180 || dLon > 180) {
      throw new Error("Coordinates out of valid planetary bounds");
    }

    const googleUrl = "https://routes.googleapis.com/directions/v2:computeRoutes";

    // Use verified Place ID if available, otherwise exact entrance coordinates
    const destinationTarget = (destPlaceId && typeof destPlaceId === "string" && destPlaceId.startsWith("ChIJ"))
      ? { placeId: destPlaceId }
      : { location: { latLng: { latitude: dLat, longitude: dLon } } };

    const body = {
      origin: {
        location: {
          latLng: {
            latitude: oLat,
            longitude: oLon
          }
        }
      },
      destination: destinationTarget,
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE"
    };

    const res = await fetch(googleUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration"
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Google Routes API error ${res.status}: ${errText.slice(0, 150)}`);
    }

    const gData = await res.json();
    if (!gData.routes || !gData.routes[0]) {
      throw new Error("Google Routes API returned no routes");
    }

    const route = gData.routes[0];
    const distMeters = route.distanceMeters || 0;
    const durSecondsStr = (route.duration || "0s").replace("s", "");
    const durSeconds = parseFloat(durSecondsStr) || 0;

    // Single unit conversion: distanceMeters into kilometres exactly once
    const distanceKm = Math.round((distMeters / 1000) * 10) / 10;
    const durationMinutes = Math.max(1, Math.round(durSeconds / 60));

    // Strict distance sanity check
    validateRoadDistanceSanity(distanceKm, oLat, oLon, dLat, dLon);

    return {
      status: "success",
      distanceKm: distanceKm,
      durationMinutes: durationMinutes,
      distanceMeters: distMeters,
      durationSeconds: durSeconds,
      isLiveRoute: true,
      provider: this.name,
      attribution: this.attribution,
      origin: { lat: oLat, lon: oLon },
      destination: { lat: dLat, lon: dLon },
      destPlaceId: destPlaceId || null
    };
  }
}

/**
 * Routing Service Manager with Caching, Validation and Provider Fallback
 */
class RoutingService {
  constructor() {
    this.osrmProvider = new OsrmRoutingProvider();
    const googleKey = process.env.GOOGLE_MAPS_API_KEY || "";
    this.googleProvider = (googleKey && googleKey.length > 15) ? new GoogleRoutesProvider(googleKey) : null;
  }

  getCacheKey(oLat, oLon, dLat, dLon, destPlaceId = null, providerName = "osrm", travelMode = "DRIVE") {
    const p = (providerName && typeof providerName === "string" && providerName.includes("Google")) ? "groutes" : "osrm";
    const destId = destPlaceId || `${parseFloat(dLon).toFixed(4)},${parseFloat(dLat).toFixed(4)}`;
    return `${p}:${parseFloat(oLon).toFixed(4)},${parseFloat(oLat).toFixed(4)}->${destId}:${travelMode}`;
  }

  async getRoute(originLat, originLon, destLat, destLon, destPlaceId = null, marketId = null) {
    const oLat = parseFloat(originLat);
    const oLon = parseFloat(originLon);
    const dLat = parseFloat(destLat);
    const dLon = parseFloat(destLon);

    if (isNaN(oLat) || isNaN(oLon) || isNaN(dLat) || isNaN(dLon)) {
      return {
        status: "unavailable",
        distanceKm: null,
        durationMinutes: null,
        isLiveRoute: false,
        message: "Invalid origin or destination coordinates provided.",
        provider: "none"
      };
    }

    // Quick sanity check on coordinates bounds
    if (oLat < -90 || oLat > 90 || dLat < -90 || dLat > 90 || oLon < -180 || oLon > 180 || dLon < -180 || dLon > 180) {
      return {
        status: "unavailable",
        distanceKm: null,
        durationMinutes: null,
        isLiveRoute: false,
        message: "Geographic coordinates out of bounds.",
        provider: "none"
      };
    }

    // Attempt routing with primary provider (Google Routes if key is present, otherwise OSRM)
    const primaryProvider = this.googleProvider || this.osrmProvider;
    const cacheKey = this.getCacheKey(oLat, oLon, dLat, dLon, destPlaceId || marketId, primaryProvider.name);
    const now = Date.now();

    // Check memory cache
    if (memoryRouteCache.has(cacheKey)) {
      const cached = memoryRouteCache.get(cacheKey);
      if (now - cached.timestamp < ROUTE_CACHE_TTL_MS) {
        return { ...cached.data, cached: true };
      }
    }

    try {
      let result;
      if (primaryProvider === this.googleProvider) {
        result = await this.googleProvider.computeRoute(oLat, oLon, dLat, dLon, destPlaceId);
      } else {
        result = await this.osrmProvider.computeRoute(oLat, oLon, dLat, dLon);
      }

      memoryRouteCache.set(cacheKey, { timestamp: now, data: result });
      return result;
    } catch (err) {
      console.warn(`[RoutingService] Primary provider (${primaryProvider.name}) failed:`, err.message);

      // Fallback to OSRM if Google was primary and failed
      if (primaryProvider !== this.osrmProvider) {
        try {
          console.log("[RoutingService] Falling back to verified OSRM OpenStreetMap routing...");
          const osrmResult = await this.osrmProvider.computeRoute(oLat, oLon, dLat, dLon);
          const osrmCacheKey = this.getCacheKey(oLat, oLon, dLat, dLon, destPlaceId || marketId, this.osrmProvider.name);
          memoryRouteCache.set(osrmCacheKey, { timestamp: now, data: osrmResult });
          return osrmResult;
        } catch (osrmErr) {
          console.error("[RoutingService] OSRM fallback also failed:", osrmErr.message);
        }
      }

      // NO fake travel-time fallback! Return clear unavailable state per Priority 2 & 5 requirements.
      return {
        status: "unavailable",
        distanceKm: null,
        durationMinutes: null,
        isLiveRoute: false,
        message: `Road distance unavailable: ${err.message}`,
        provider: "none",
        attribution: "N/A"
      };
    }
  }

  clearCache() {
    memoryRouteCache.clear();
  }
}

const routingServiceInstance = new RoutingService();

module.exports = {
  RoutingService,
  routingService: routingServiceInstance,
  OsrmRoutingProvider,
  GoogleRoutesProvider,
  haversineCrowFlyKm,
  validateRoadDistanceSanity
};
