/**
 * VERCEL SERVERLESS FUNCTION: /api/geocode
 * Accurate reverse geocoding proxy using Google Geocoding API with Nominatim fallback.
 * Strictly executes on the server to prevent exposing GOOGLE_MAPS_API_KEY to the client.
 */

const { reverseGeocode } = require("../lib/geocode-service");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host || "localhost";
  const reqUrl = new URL(req.url, `http://${host}`);
  const lat = reqUrl.searchParams.get("lat") || reqUrl.searchParams.get("latitude");
  const lon = reqUrl.searchParams.get("lon") || reqUrl.searchParams.get("lng") || reqUrl.searchParams.get("longitude");

  if (!lat || !lon) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(400);
    res.end(
      JSON.stringify({
        status: "error",
        message: "Missing required query parameters: 'lat' and 'lon'"
      })
    );
    return;
  }

  try {
    const geoInfo = await reverseGeocode(lat, lon);
    res.setHeader("Content-Type", "application/json");
    // Cache on CDN for 1 day, stale while revalidate 7 days
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.writeHead(200);
    res.end(JSON.stringify(geoInfo));
  } catch (err) {
    console.error("[/api/geocode] Serverless Error:", err.message);
    res.setHeader("Content-Type", "application/json");
    res.writeHead(500);
    res.end(
      JSON.stringify({
        status: "error",
        message: "Failed to reverse geocode coordinates",
        error: err.message
      })
    );
  }
};
