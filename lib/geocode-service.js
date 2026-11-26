/**
 * KRISHIWEB SERVER-SIDE REVERSE GEOCODING SERVICE
 * Accurate, hierarchical address resolution for Indian agricultural regions.
 * Prioritizes Google Geocoding API when GOOGLE_MAPS_API_KEY is configured;
 * falls back to OpenStreetMap Nominatim and offline geographic reference coordinates.
 * Never exposes server-side API keys to the browser.
 */

const https = require("https");
const http = require("http");
const { MANDI_COORDINATES, DISTRICT_COORDINATES } = require("./constants");
const { MAHARASHTRA_PLACES } = require("./maharashtra-places");

// Cache geocode results in memory: Key -> "lat,lon" rounded to 4 decimals (~11 meters)
const geocodeCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Calculates straight-line distance in kilometres between two coordinates (Haversine formula)
 */
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Offline fallback: Finds the nearest verified mandi or district center in Maharashtra
 */
function findNearestMaharashtraPlace(lat, lon) {
  let nearest = null;
  let minDistance = Infinity;

  // Check verified settlements first (most granular and accurate)
  if (Array.isArray(MAHARASHTRA_PLACES)) {
    for (const place of MAHARASHTRA_PLACES) {
      const dist = haversineDistanceKm(lat, lon, place.lat, place.lon);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = {
          name: place.name,
          district: place.district || "Maharashtra",
          taluka: place.taluka || "",
          distanceKm: Math.round(dist * 10) / 10
        };
      }
    }
  }

  // Check mandis
  for (const [key, mandi] of Object.entries(MANDI_COORDINATES)) {
    const dist = haversineDistanceKm(lat, lon, mandi.lat, mandi.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = {
        name: mandi.name.replace(/\s*APMC\s*/gi, "").trim(),
        district: mandi.district || "Maharashtra",
        distanceKm: Math.round(dist * 10) / 10
      };
    }
  }

  // Check districts
  for (const [distKey, distCoords] of Object.entries(DISTRICT_COORDINATES)) {
    const dist = haversineDistanceKm(lat, lon, distCoords.lat, distCoords.lon);
    if (dist < minDistance) {
      minDistance = dist;
      const formattedName = distKey.charAt(0).toUpperCase() + distKey.slice(1);
      nearest = {
        name: formattedName,
        district: formattedName,
        distanceKm: Math.round(dist * 10) / 10
      };
    }
  }

  return nearest;
}

/**
 * Performs HTTP/HTTPS GET request with timeout
 */
function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https://");
    const client = isHttps ? https : http;
    const req = client.get(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error("Invalid JSON response: " + e.message));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.setTimeout(options.timeout || 7000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

/**
 * Reverse geocodes using Google Geocoding API
 */
async function reverseGeocodeWithGoogle(lat, lon, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=en`;
  const data = await fetchJson(url, { timeout: 6000 });

  if (data.status !== "OK" || !data.results || data.results.length === 0) {
    throw new Error(`Google Geocoding API returned status: ${data.status}`);
  }

  const result = data.results[0];
  const components = result.address_components || [];

  let village = "";
  let sublocality = "";
  let locality = "";
  let taluka = "";
  let district = "";
  let state = "";
  let postalCode = "";

  for (const c of components) {
    const types = c.types || [];
    if (types.includes("sublocality_level_2") || types.includes("sublocality_level_3") || types.includes("village") || types.includes("hamlet")) {
      if (!village) village = c.long_name;
    }
    if (types.includes("sublocality_level_1") || types.includes("sublocality") || types.includes("neighborhood")) {
      if (!sublocality) sublocality = c.long_name;
    }
    if (types.includes("locality") || types.includes("postal_town")) {
      if (!locality) locality = c.long_name;
    }
    if (types.includes("administrative_area_level_3")) {
      if (!taluka) taluka = c.long_name;
    }
    if (types.includes("administrative_area_level_2")) {
      if (!district) district = c.long_name;
    }
    if (types.includes("administrative_area_level_1")) {
      if (!state) state = c.long_name;
    }
    if (types.includes("postal_code")) {
      postalCode = c.long_name;
    }
  }

  // Locality selection priority for India:
  // If in a city/town, locality is paramount. If in rural village, village or sublocality is prioritized.
  const chosenLocality = locality || sublocality || village || taluka || district || "Maharashtra";
  const chosenDistrict = district || locality || "Maharashtra";
  const chosenState = state || "Maharashtra";

  return {
    status: "success",
    provider: "google",
    locality: chosenLocality,
    sublocality,
    village,
    taluka,
    district: chosenDistrict,
    state: chosenState,
    postalCode,
    formattedAddress: result.formatted_address || `${chosenLocality}, ${chosenDistrict}, ${chosenState}`,
    displayName: `${chosenLocality}, ${chosenState}`,
    lat,
    lon
  };
}

/**
 * Reverse geocodes using OpenStreetMap Nominatim
 */
async function reverseGeocodeWithNominatim(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;
  const options = {
    headers: {
      "User-Agent": "KrishiWeb-MandiIntelligence/2.0 (college-decision-support-project; contact: rajkamalmandrai@gmail.com)"
    },
    timeout: 7000
  };

  const data = await fetchJson(url, options);
  if (!data || !data.address) {
    throw new Error("Invalid address format from Nominatim");
  }

  const addr = data.address;
  const village = addr.village || addr.hamlet || "";
  const sublocality = addr.suburb || addr.neighbourhood || addr.residential || "";
  const locality = addr.city || addr.town || addr.municipality || "";
  const taluka = addr.subdistrict || addr.county || "";
  const district = addr.state_district || addr.district || addr.county || locality || "Maharashtra";
  const state = addr.state || "Maharashtra";
  const postalCode = addr.postcode || "";

  // Priority selection for Indian administrative divisions:
  // 1. If city or town exists, use it.
  // 2. If it's a known metropolitan suburb (e.g. Kopri, Naupada in Thane, or Vashi in Navi Mumbai), use suburb.
  // 3. Fall back to village, taluka, or district.
  let chosenLocality = locality;
  if (!chosenLocality) {
    chosenLocality = sublocality || village || taluka || district || "Maharashtra";
  }

  return {
    status: "success",
    provider: "nominatim",
    locality: chosenLocality,
    sublocality,
    village,
    taluka,
    district,
    state,
    postalCode,
    formattedAddress: data.display_name || `${chosenLocality}, ${district}, ${state}`,
    displayName: `${chosenLocality}, ${state}`,
    lat,
    lon
  };
}

/**
 * Main Reverse Geocoding Function
 * Resolves latitude and longitude to authoritative locality, district, and state.
 */
async function reverseGeocode(latitude, longitude) {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error(`Invalid geographic coordinates: lat=${latitude}, lon=${longitude}`);
  }

  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  const cached = geocodeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY || "";
  let result = null;

  // 1. Try Google Geocoding API if key is present
  if (googleApiKey.trim().length > 10) {
    try {
      result = await reverseGeocodeWithGoogle(lat, lon, googleApiKey.trim());
    } catch (err) {
      console.warn(`[ReverseGeocode] Google Geocoding failed: ${err.message}. Falling back to Nominatim.`);
    }
  }

  // 2. Fall back to OpenStreetMap Nominatim
  if (!result) {
    try {
      result = await reverseGeocodeWithNominatim(lat, lon);
    } catch (err) {
      console.warn(`[ReverseGeocode] Nominatim failed: ${err.message}. Falling back to offline regional match.`);
    }
  }

  // 3. Offline / network-restricted fallback (ensures offline sandbox & test resilience)
  if (!result) {
    const nearest = findNearestMaharashtraPlace(lat, lon);
    if (nearest) {
      result = {
        status: "success",
        provider: "local_geo_fallback",
        locality: nearest.name,
        sublocality: "",
        village: "",
        taluka: nearest.taluka || "",
        district: nearest.district,
        state: "Maharashtra",
        postalCode: "",
        formattedAddress: `${nearest.name}, ${nearest.district}, Maharashtra`,
        displayName: `${nearest.name}, Maharashtra`,
        lat,
        lon,
        isFallback: true
      };
    } else {
      result = {
        status: "success",
        provider: "local_geo_fallback",
        locality: "Thane",
        sublocality: "",
        village: "",
        taluka: "Thane",
        district: "Thane",
        state: "Maharashtra",
        postalCode: "400601",
        formattedAddress: "Thane, Maharashtra",
        displayName: "Thane, Maharashtra",
        lat,
        lon,
        isFallback: true
      };
    }
  }

  // Cache response
  geocodeCache.set(cacheKey, {
    data: result,
    timestamp: Date.now()
  });

  return result;
}

module.exports = {
  reverseGeocode,
  findNearestMaharashtraPlace,
  geocodeCache
};
