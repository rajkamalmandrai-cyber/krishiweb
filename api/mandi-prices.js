/**
 * VERCEL SERVERLESS FUNCTION: /api/mandi-prices
 * Securely proxies AGMARKNET mandi prices without exposing credentials to client
 */

const { fetchMandiDataFromGov } = require("../lib/mandi-core");

module.exports = async (req, res) => {
  // CORS Headers
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
  const crop = reqUrl.searchParams.get("crop") || "Onion";
  const state = reqUrl.searchParams.get("state") || "Maharashtra";

  try {
    const data = await fetchMandiDataFromGov(crop, state);
    res.setHeader("Content-Type", "application/json");
    // Edge cache on Vercel CDN: 1 hour edge TTL, stale-while-revalidate 24h
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } catch (err) {
    console.error("[/api/mandi-prices] Serverless Error:", err.message);
    res.setHeader("Content-Type", "application/json");
    res.writeHead(500);
    res.end(
      JSON.stringify({
        status: "error",
        message: "Failed to fetch government mandi prices",
        error: err.message
      })
    );
  }
};

