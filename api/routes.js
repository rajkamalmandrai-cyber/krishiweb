/**
 * VERCEL SERVERLESS FUNCTION: /api/routes
 * Computes road travel distance and duration via Google Maps Routes API or commercial transit model
 */

const { computeRoute } = require("../lib/mandi-core");

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
  const originLat = reqUrl.searchParams.get("originLat");
  const originLng = reqUrl.searchParams.get("originLng") || reqUrl.searchParams.get("originLon");
  const destLat = reqUrl.searchParams.get("destLat");
  const destLng = reqUrl.searchParams.get("destLng") || reqUrl.searchParams.get("destLon");
  const destPlaceId = reqUrl.searchParams.get("destPlaceId") || reqUrl.searchParams.get("placeId");
  const marketId = reqUrl.searchParams.get("marketId") || reqUrl.searchParams.get("mandiId");

  try {
    const routeInfo = await computeRoute(originLat, originLng, destLat, destLng, destPlaceId, marketId);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.writeHead(200);
    res.end(JSON.stringify(routeInfo));
  } catch (err) {
    console.error("[/api/routes] Serverless Error:", err.message);
    res.setHeader("Content-Type", "application/json");
    res.writeHead(500);
    res.end(
      JSON.stringify({
        status: "error",
        message: "Failed to compute travel route",
        error: err.message
      })
    );
  }
};

