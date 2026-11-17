/**
 * VERCEL SERVERLESS FUNCTION: /api/health
 * System health and configuration status without exposing API key secrets
 */

const { hasDataGovKey, hasGoogleMapsKey } = require("../lib/mandi-core");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(
    JSON.stringify({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      dataGovConfigured: hasDataGovKey(),
      googleMapsConfigured: hasGoogleMapsKey()
    })
  );
};

