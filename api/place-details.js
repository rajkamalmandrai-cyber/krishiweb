/**
 * VERCEL SERVERLESS FUNCTION: /api/place-details
 * Resolves a selected location placeId or query into verified geographic coordinates.
 */

const { resolvePlaceDetails } = require("../lib/places-service");

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
  const placeId = reqUrl.searchParams.get("placeId") || reqUrl.searchParams.get("place_id") || "";
  const query = reqUrl.searchParams.get("q") || reqUrl.searchParams.get("name") || "";

  if (!placeId && !query) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(400);
    res.end(JSON.stringify({ status: "error", message: "Missing required parameter: placeId or q" }));
    return;
  }

  try {
    const details = await resolvePlaceDetails(placeId, query);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.writeHead(200);
    res.end(JSON.stringify(details));
  } catch (err) {
    console.error("[/api/place-details] Error:", err.message);
    res.setHeader("Content-Type", "application/json");
    res.writeHead(404);
    res.end(JSON.stringify({ status: "error", message: err.message }));
  }
};
