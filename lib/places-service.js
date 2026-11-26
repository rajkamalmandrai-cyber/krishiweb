/**
 * KRISHIWEB PLACES AUTOCOMPLETE & DETAILS SERVICE
 * Secure server-side location search engine.
 * Prioritizes Google Places Autocomplete API when GOOGLE_MAPS_API_KEY is configured;
 * uses verified Maharashtra Settlements database as compliant fallback.
 * Strictly avoids public Nominatim for autocomplete to respect OSM Fair Use policies.
 */

const https = require("https");
const http = require("http");
const { searchMaharashtraPlaces, resolveMaharashtraPlace } = require("./maharashtra-places");

function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https://");
    const client = isHttps ? https : http;
    const req = client.get(url, options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error("Invalid JSON: " + e.message));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(options.timeout || 6000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}

/**
 * Autocomplete location suggestions
 */
async function autocompletePlaces(query, lang = "en") {
  if (!query || typeof query !== "string") return [];
  const clean = query.trim();
  if (clean.length < 3) return [];

  const apiKey = (process.env.GOOGLE_MAPS_API_KEY || "").trim();

  // 1. Try Google Places Autocomplete API if key is available
  if (apiKey.length > 10) {
    try {
      // Prioritize India and bias towards Maharashtra center (19.7515, 75.7139, 450km radius)
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(clean)}&components=country:in&location=19.7515,75.7139&radius=450000&language=${encodeURIComponent(lang)}&key=${apiKey}`;
      const data = await fetchJson(url, { timeout: 4500 });

      if (data && data.status === "OK" && Array.isArray(data.predictions) && data.predictions.length > 0) {
        // Return up to 5 suggestions
        return data.predictions.slice(0, 5).map(p => ({
          placeId: p.place_id,
          description: p.description,
          mainText: p.structured_formatting?.main_text || p.description.split(",")[0],
          secondaryText: p.structured_formatting?.secondary_text || p.description,
          source: "google"
        }));
      }
    } catch (err) {
      console.warn("[PlacesAutocomplete] Google API error:", err.message, "- falling back to verified local database.");
    }
  }

  // 2. Compliant fallback using verified Maharashtra settlements database
  return searchMaharashtraPlaces(clean, 5);
}

/**
 * Resolves a selected place to verified coordinates
 */
async function resolvePlaceDetails(placeId, fallbackQuery = "") {
  if (!placeId) {
    throw new Error("Missing placeId");
  }

  // A. Check if it's a verified local settlement ID
  if (placeId.startsWith("maha-")) {
    const localPlace = resolveMaharashtraPlace(placeId);
    if (localPlace) {
      return {
        status: "success",
        name: localPlace.name,
        lat: localPlace.lat,
        lon: localPlace.lon,
        district: localPlace.district,
        taluka: localPlace.taluka,
        state: localPlace.state,
        formattedAddress: `${localPlace.name}, ${localPlace.district}, Maharashtra`,
        source: "verified_local"
      };
    }
  }

  const apiKey = (process.env.GOOGLE_MAPS_API_KEY || "").trim();

  // B. Resolve via Google Places API Place Details
  if (apiKey.length > 10 && !placeId.startsWith("maha-")) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,geometry,formatted_address,address_components&key=${apiKey}`;
      const data = await fetchJson(url, { timeout: 5000 });

      if (data && data.status === "OK" && data.result && data.result.geometry) {
        const loc = data.result.geometry.location;
        const comps = data.result.address_components || [];
        let district = "";
        let state = "Maharashtra";

        for (const c of comps) {
          if (c.types.includes("administrative_area_level_2")) district = c.long_name;
          if (c.types.includes("administrative_area_level_1")) state = c.long_name;
        }

        return {
          status: "success",
          name: data.result.name,
          lat: loc.lat,
          lon: loc.lng,
          district: district || data.result.name,
          state: state,
          formattedAddress: data.result.formatted_address,
          placeId: placeId,
          source: "google"
        };
      }
    } catch (err) {
      console.warn("[PlaceDetails] Google API error:", err.message);
    }
  }

  // C. Fallback: try searching in local database by query string or placeId
  const query = fallbackQuery || placeId.replace(/^maha-/, "").replace(/-/g, " ");
  const localMatch = resolveMaharashtraPlace(query);
  if (localMatch) {
    return {
      status: "success",
      name: localMatch.name,
      lat: localMatch.lat,
      lon: localMatch.lon,
      district: localMatch.district,
      taluka: localMatch.taluka,
      state: localMatch.state,
      formattedAddress: `${localMatch.name}, ${localMatch.district}, Maharashtra`,
      source: "verified_local"
    };
  }

  throw new Error("Unable to resolve coordinates for location: " + (fallbackQuery || placeId));
}

module.exports = {
  autocompletePlaces,
  resolvePlaceDetails
};
