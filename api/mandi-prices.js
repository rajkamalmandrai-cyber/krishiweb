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
  const sellingDateType = reqUrl.searchParams.get("sellingDate") || reqUrl.searchParams.get("dateType") || "today";

  try {
    const data = await fetchMandiDataFromGov(crop, state, sellingDateType);
    res.setHeader("Content-Type", "application/json");
    // Edge cache on Vercel CDN: 15 min edge TTL, stale-while-revalidate 1h
    res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
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

