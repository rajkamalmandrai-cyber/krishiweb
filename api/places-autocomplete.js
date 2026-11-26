/**
 * VERCEL SERVERLESS FUNCTION: /api/places-autocomplete
 * Serves debounced location suggestions for Maharashtra farmers.
 * Prioritizes Google Places Autocomplete API with verified local settlements fallback.
 */

const { autocompletePlaces } = require("../lib/places-service");

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
  const q = reqUrl.searchParams.get("q") || reqUrl.searchParams.get("input") || "";
  const lang = reqUrl.searchParams.get("lang") || "en";

  if (!q || q.trim().length < 3) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok", predictions: [] }));
    return;
  }

  try {
    const predictions = await autocompletePlaces(q, lang);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok", predictions }));
  } catch (err) {
    console.error("[/api/places-autocomplete] Error:", err.message);
    res.setHeader("Content-Type", "application/json");
    res.writeHead(500);
    res.end(JSON.stringify({ status: "error", message: err.message, predictions: [] }));
  }
};
