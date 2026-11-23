/**
 * KRISHIWEB MARKET INTELLIGENCE SERVER (LOCAL & TESTING HARNESS)
 * Delegates /api/* requests to Vercel-compatible serverless handlers in api/
 * Serves static assets for local development
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const mandiPricesHandler = require("./api/mandi-prices");
const routesHandler = require("./api/routes");
const healthHandler = require("./api/health");
const {
  fetchMandiDataFromGov,
  computeRoute,
  hasDataGovKey,
  hasGoogleMapsKey,
  mandiStore,
  routingService
} = require("./lib/mandi-core");

const PORT = parseInt(process.env.PORT, 10) || 3000;

// Static file MIME types
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const reqUrl = new URL(req.url, `http://${host}`);
  const pathname = reqUrl.pathname;

  // Delegate API routes to Vercel serverless handlers
  if (pathname === "/api/health") {
    return healthHandler(req, res);
  }
  if (pathname === "/api/mandi-prices") {
    return mandiPricesHandler(req, res);
  }
  if (pathname === "/api/routes") {
    return routesHandler(req, res);
  }
  if (pathname === "/api/sync") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Content-Type", "application/json");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }
    const syncRes = await mandiStore.syncFromDataGov();
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "ok", sync: syncRes, meta: mandiStore.store.meta }));
  }

  // Static File Serving
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, "");
  if (safePath === "/" || safePath === "\\") {
    safePath = "index.html";
  }

  let filePath = path.join(__dirname, safePath);

  // If path doesn't have an extension, try appending .html
  if (!path.extname(filePath) && !fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    }
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const notFoundPath = path.join(__dirname, "404.html");
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        fs.createReadStream(notFoundPath).pipe(res);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400"
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌾 KrishiWeb Market Intelligence Server running on port ${PORT}`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Mandi API: http://localhost:${PORT}/api/mandi-prices?crop=Onion`);
    console.log(`   Routes API: http://localhost:${PORT}/api/routes`);
    console.log(`   Routing Engine: ${routingService.googleProvider ? "Google Maps Routes API" : "OSRM / OpenStreetMap (Free Road Network)"}`);
    console.log(`   data.gov.in key: ${hasDataGovKey() ? "CONFIGURED (present)" : "MISSING"}`);
    console.log(`   Data Store: ${mandiStore.store ? "INITIALIZED (" + mandiStore.store.meta.lastSuccessfulSync + ")" : "PENDING"}`);
    console.log(`=======================================================`);

    // Start Daily Scheduled Data Fetching Process
    mandiStore.startDailyScheduler();
  });
}

module.exports = { server, fetchMandiDataFromGov, computeRoute };

// Clean shutdown
process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
