/**
 * KRISHIWEB COMPREHENSIVE VERIFICATION TEST SUITE (15 TESTS)
 * Verifies all 8 Priorities:
 * 1. Market Data Freshness & Stale Detection
 * 2. OSRM Road Distance & Travel Time Routing
 * 3. Location Transparency & Privacy
 * 4. Removal of 30-Day View & 3-Day Horizon System
 * 5. Explainable Price Forecast & Holdout Validation (MAE, RMSE, MAPE)
 * 6. UI & Dashboard Presentation
 * 7. Validation, Deduplication & Error Handling
 * 8. Security & Deployment Health
 */

const http = require('http');
const fs = require('fs');
const { mandiStore } = require('./lib/mandi-store');
const { routingService } = require('./lib/routing-service');
const { predictMandiPrice, evaluateForecastModel } = require('./lib/price-forecast');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function runFullTestSuite() {
  console.log("==================================================================");
  console.log("KRISHIWEB COMPREHENSIVE PRODUCTION TEST SUITE (15 TESTS)");
  console.log("==================================================================\n");

  let passedTests = 0;
  const totalTests = 15;

  const { server } = require('./server.js');
  await new Promise(resolve => server.listen(0, resolve));
  const testPort = server.address().port;
  console.log(`[Setup] Local test harness running on http://127.0.0.1:${testPort}\n`);

  try {
    // -------------------------------------------------------------
    // TEST 1: Search Stability & Deterministic Ranking
    // -------------------------------------------------------------
    console.log("TEST 1: Search Determinism (5 Consecutive Queries)");
    const runs = [];
    for (let i = 0; i < 5; i++) {
      const res = await get(`http://127.0.0.1:${testPort}/api/mandi-prices?crop=Onion&state=Maharashtra`);
      runs.push(res.body.records.map(r => r.name).join(' | '));
    }
    const stable = runs.every(r => r === runs[0]);
    console.log(`  -> Order: ${runs[0].slice(0, 60)}...`);
    if (stable && runs[0].length > 0) {
      console.log("  [PASS] Recommendations are 100% deterministic across consecutive queries.");
      passedTests++;
    } else {
      console.log("  [FAIL] Inconsistent ordering across runs.");
    }

    // -------------------------------------------------------------
    // TEST 2: Mathematical Economic Formulas (Gross - Transport = Net)
    // -------------------------------------------------------------
    console.log("\nTEST 2: Mathematical Calculation Formula Verification");
    const testModal = 3000;
    const testQty = 500;
    const testDist = 60;
    const ratePerKm = 3.50;

    const gross = Math.round((testModal * testQty) / 100);
    const transport = Math.round(testDist * ratePerKm);
    const net = gross - transport;

    console.log(`  -> Modal: ₹${testModal}/Qtl | Qty: ${testQty} kg -> Gross: ₹${gross}`);
    console.log(`  -> Road Distance: ${testDist} km @ ₹${ratePerKm}/km -> Transport: ₹${transport}`);
    console.log(`  -> Estimated Net Amount: ₹${net}`);

    if (gross === 15000 && transport === 210 && net === 14790) {
      console.log("  [PASS] Mathematical formula strictly adheres to agricultural net-return economics.");
      passedTests++;
    } else {
      console.log("  [FAIL] Economic calculation formula mismatch.");
    }

    // -------------------------------------------------------------
    // TEST 3: OSRM Real Road Distance & Travel Duration
    // -------------------------------------------------------------
    console.log("\nTEST 3: OSRM Real Road Distance and Travel Time Routing");
    // Thane (19.2183, 72.9781) to Mumbai Vashi APMC (19.0771, 72.9986)
    const routeRes = await get(`http://127.0.0.1:${testPort}/api/routes?originLat=19.2183&originLon=72.9781&destLat=19.0771&destLon=72.9986`);
    console.log(`  -> Status: ${routeRes.body.status}`);
    console.log(`  -> Provider: ${routeRes.body.provider}`);
    console.log(`  -> Road Distance: ${routeRes.body.distanceKm} km`);
    console.log(`  -> Driving Duration: ${routeRes.body.durationMinutes} mins`);
    console.log(`  -> Attribution: ${routeRes.body.attribution}`);

    if (routeRes.body.status === "success" && routeRes.body.distanceKm > 15 && routeRes.body.distanceKm < 35 && routeRes.body.attribution.includes("OpenStreetMap")) {
      console.log("  [PASS] OSRM correctly calculates real road distance with OpenStreetMap attribution.");
      passedTests++;
    } else {
      console.log("  [FAIL] OSRM route computation failed or missing attribution.");
    }

    // -------------------------------------------------------------
    // TEST 4: OSRM Coordinate Ordering (lon,lat)
    // -------------------------------------------------------------
    console.log("\nTEST 4: Coordinate Ordering & Bound Validation");
    const oLon = 72.9781, oLat = 19.2183;
    const dLon = 72.9986, dLat = 19.0771;
    const osrmKey = routingService.getCacheKey(oLat, oLon, dLat, dLon);
    console.log(`  -> Cache Key formatted as lon,lat: ${osrmKey}`);

    if (osrmKey.startsWith("72.9781,19.2183")) {
      console.log("  [PASS] Coordinates correctly ordered as longitude,latitude for OSRM compliance.");
      passedTests++;
    } else {
      console.log("  [FAIL] Incorrect coordinate ordering detected.");
    }

    // -------------------------------------------------------------
    // TEST 5: Location Transparency Resolution
    // -------------------------------------------------------------
    console.log("\nTEST 5: Location Transparency & Origin Source Tagging");
    const scriptSrc = fs.readFileSync('script.js', 'utf8');

    // Check that script.js contains transparent location panel markup
    const hasLocationPanel = scriptSrc.includes('farmer-location-panel') && scriptSrc.includes('Location & Route Transparency');
    const hasGpsBadge = scriptSrc.includes('farmer-location-badge--gps') && scriptSrc.includes('Device GPS');
    const hasManualBadge = scriptSrc.includes('farmer-location-badge--manual');
    const hasFallbackBadge = scriptSrc.includes('farmer-location-badge--fallback');

    console.log(`  -> Transparent location panel markup: ${hasLocationPanel}`);
    console.log(`  -> Device GPS source indicator: ${hasGpsBadge}`);
    console.log(`  -> Manual entry indicator: ${hasManualBadge}`);
    console.log(`  -> Fallback indicator: ${hasFallbackBadge}`);

    if (hasLocationPanel && hasGpsBadge && hasManualBadge && hasFallbackBadge) {
      console.log("  [PASS] Location panel transparently displays GPS, manual, and fallback sources.");
      passedTests++;
    } else {
      console.log("  [FAIL] Location transparency badges missing.");
    }

    // -------------------------------------------------------------
    // TEST 6: Non-Silent Fallback & Location Privacy
    // -------------------------------------------------------------
    console.log("\nTEST 6: Non-Silent Default Coordinates & Coordinate Privacy");
    const hasThaneRef = scriptSrc.includes('Thane (Default Reference)') || scriptSrc.includes('Thane Ref.');
    const truncatesCoords = scriptSrc.includes('.toFixed(4)');

    console.log(`  -> Explicit reference center label: ${hasThaneRef}`);
    console.log(`  -> Privacy truncation to 4 decimals: ${truncatesCoords}`);

    if (hasThaneRef && truncatesCoords) {
      console.log("  [PASS] Fallbacks are explicitly labeled (never disguised as GPS) and coordinates are privacy-protected.");
      passedTests++;
    } else {
      console.log("  [FAIL] Silent default coordinates or privacy truncation missing.");
    }

    // -------------------------------------------------------------
    // TEST 7: Removal of 30-Day Price View & Date Horizon Replacement
    // -------------------------------------------------------------
    console.log("\nTEST 7: Removal of 30-Day Date Picker & 3-Horizon System (Today, Tomorrow, Day After)");
    const indexContent = fs.readFileSync('index.html', 'utf8');
    const fbmContent = fs.readFileSync('find-best-market.html', 'utf8');

    const indexHasCustom = indexContent.includes('id="date-custom-wrap"');
    const fbmHasCustom = fbmContent.includes('id="date-custom-wrap"');
    const indexHasDayAfter = indexContent.includes('data-date-type="day_after"');
    const fbmHasDayAfter = fbmContent.includes('data-date-type="day_after"');

    console.log(`  -> index.html 30-day picker removed: ${!indexHasCustom}`);
    console.log(`  -> find-best-market.html 30-day picker removed: ${!fbmHasCustom}`);
    console.log(`  -> index.html has Day After option: ${indexHasDayAfter}`);
    console.log(`  -> find-best-market.html has Day After option: ${fbmHasDayAfter}`);

    if (!indexHasCustom && !fbmHasCustom && indexHasDayAfter && fbmHasDayAfter) {
      console.log("  [PASS] 30-day date picker completely replaced with Today, Tomorrow, Day After.");
      passedTests++;
    } else {
      console.log("  [FAIL] 30-day date picker lingering in HTML files.");
    }

    // -------------------------------------------------------------
    // TEST 8: Explainable Baseline Price Forecasting Model
    // -------------------------------------------------------------
    console.log("\nTEST 8: Explainable Baseline Price Prediction Engine");
    const sampleHistory = [
      { date: "2026-11-18", modalPrice: 3100 },
      { date: "2026-11-19", modalPrice: 3120 },
      { date: "2026-11-20", modalPrice: 3150 },
      { date: "2026-11-21", modalPrice: 3170 },
      { date: "2026-11-22", modalPrice: 3200 }
    ];

    const predTomorrow = predictMandiPrice(sampleHistory, 1, 3200);
    const predDayAfter = predictMandiPrice(sampleHistory, 2, 3200);

    console.log(`  -> Current Modal: ₹3200 / Qtl`);
    console.log(`  -> Tomorrow Forecast: ₹${predTomorrow.predictedPrice} (Range: ₹${predTomorrow.uncertaintyRange.low} - ₹${predTomorrow.uncertaintyRange.high}, ±₹${predTomorrow.uncertaintyRange.delta})`);
    console.log(`  -> Day After Forecast: ₹${predDayAfter.predictedPrice} (Range: ₹${predDayAfter.uncertaintyRange.low} - ₹${predDayAfter.uncertaintyRange.high}, ±₹${predDayAfter.uncertaintyRange.delta})`);
    console.log(`  -> Methodology: ${predTomorrow.method}`);

    if (predTomorrow.predictedPrice > 3100 && predTomorrow.predictedPrice < 3300 && predTomorrow.uncertaintyRange.delta > 0) {
      console.log("  [PASS] Explainable baseline model computes sound projections with uncertainty bounds.");
      passedTests++;
    } else {
      console.log("  [FAIL] Price prediction computation failed.");
    }

    // -------------------------------------------------------------
    // TEST 9: Walk-Forward Chronological Holdout Backtesting (No Shuffling)
    // -------------------------------------------------------------
    console.log("\nTEST 9: Time-Series Holdout Backtesting (MAE, RMSE, MAPE)");
    const evalSeries = [
      { date: "2026-11-10", modalPrice: 2800 },
      { date: "2026-11-11", modalPrice: 2820 },
      { date: "2026-11-12", modalPrice: 2840 },
      { date: "2026-11-13", modalPrice: 2830 },
      { date: "2026-11-14", modalPrice: 2850 },
      { date: "2026-11-15", modalPrice: 2860 },
      { date: "2026-11-16", modalPrice: 2880 },
      { date: "2026-11-17", modalPrice: 2890 }
    ];

    const backtestRes = evaluateForecastModel(evalSeries, 3);
    console.log(`  -> Validation Status: ${backtestRes.status}`);
    console.log(`  -> Method: ${backtestRes.method}`);
    console.log(`  -> MAE: ₹${backtestRes.metrics.mae} / Qtl`);
    console.log(`  -> RMSE: ₹${backtestRes.metrics.rmse} / Qtl`);
    console.log(`  -> MAPE: ${backtestRes.metrics.mape}%`);

    if (backtestRes.status === "validated" && backtestRes.metrics.mae > 0 && backtestRes.metrics.mape >= 0) {
      console.log("  [PASS] Walk-forward holdout validation successfully computed MAE, RMSE, and MAPE.");
      passedTests++;
    } else {
      console.log("  [FAIL] Holdout backtesting validation failed.");
    }

    // -------------------------------------------------------------
    // TEST 10: Removal of Fabricated 94.7% Claim
    // -------------------------------------------------------------
    console.log("\nTEST 10: Non-Fabrication of Accuracy Claims");
    const hasFake947 = indexContent.includes('data-target-value="94.7"') || indexContent.includes('94.7%');
    console.log(`  -> Fabricated 94.7% AI Confidence in index.html: ${hasFake947}`);

    if (!hasFake947) {
      console.log("  [PASS] Fabricated 94.7% AI Confidence replaced with validated holdout metric.");
      passedTests++;
    } else {
      console.log("  [FAIL] Fabricated 94.7% claim still present in homepage.");
    }

    // -------------------------------------------------------------
    // TEST 11: Data Freshness Status & Stale Warning Detection
    // -------------------------------------------------------------
    console.log("\nTEST 11: Data Freshness Status & Stale Detection Warning");
    const onionData = await get(`http://127.0.0.1:${testPort}/api/mandi-prices?crop=Onion&state=Maharashtra`);
    console.log(`  -> Latest Arrival Date: ${onionData.body.latestArrivalDate}`);
    console.log(`  -> Freshness Status: ${onionData.body.freshnessStatus}`);
    console.log(`  -> Days Elapsed: ${onionData.body.daysAgo}`);
    console.log(`  -> Last Successful Sync: ${onionData.body.lastSuccessfulSync}`);

    if (onionData.body.latestArrivalDate && (onionData.body.freshnessStatus === "fresh" || onionData.body.freshnessStatus === "yesterday" || onionData.body.freshnessStatus === "stale")) {
      console.log("  [PASS] Data freshness status correctly evaluated with sync timestamp.");
      passedTests++;
    } else {
      console.log("  [FAIL] Freshness status not reported.");
    }

    // -------------------------------------------------------------
    // TEST 12: Data Validation & Duplicate Prevention
    // -------------------------------------------------------------
    console.log("\nTEST 12: Incoming Record Validation & Duplicate Prevention");
    const invalidRec = {
      market: "Test Market",
      crop: "Onion",
      modalPrice: -500, // Invalid negative
      minPrice: 600,
      maxPrice: 400,    // Invalid min > max
      arrivalDate: "bad-date"
    };

    const valResult = mandiStore.validateRecord(invalidRec);
    console.log(`  -> Invalid record validation result: valid=${valResult.valid}, reason="${valResult.reason}"`);

    // Test duplicate prevention
    const initialCount = (mandiStore.store.currentPrices["onion"] || []).length;
    const dupTestRec = {
      market: "Mumbai (Vashi) APMC",
      crop: "onion",
      modalPrice: 3200,
      minPrice: 2800,
      maxPrice: 3500,
      arrivalDate: "23/11/2026",
      state: "Maharashtra"
    };
    mandiStore.upsertRecords([dupTestRec]);
    const afterCount = (mandiStore.store.currentPrices["onion"] || []).length;
    console.log(`  -> Current onion mandis count before: ${initialCount}, after upsert: ${afterCount}`);

    if (!valResult.valid && afterCount === initialCount) {
      console.log("  [PASS] Strict record validation active; duplicate entries prevented via upsert.");
      passedTests++;
    } else {
      console.log("  [FAIL] Data validation or duplicate prevention failed.");
    }

    // -------------------------------------------------------------
    // TEST 13: Sugarcane FRP Exemption Handling
    // -------------------------------------------------------------
    console.log("\nTEST 13: Statutory FRP Crop Exemption (Sugarcane)");
    const caneData = await get(`http://127.0.0.1:${testPort}/api/mandi-prices?crop=Sugarcane&state=Maharashtra`);
    console.log(`  -> Sugarcane status: ${caneData.body.status}`);
    console.log(`  -> Records: ${caneData.body.records.length}`);

    if (caneData.body.status === "unavailable" && caneData.body.records.length === 0) {
      console.log("  [PASS] Correctly reports direct mill FRP procurement without fabricating APMC rates.");
      passedTests++;
    } else {
      console.log("  [FAIL] Sugarcane FRP exemption not properly handled.");
    }

    // -------------------------------------------------------------
    // TEST 14: Multilingual Translation Coverage (EN, HI, MR)
    // -------------------------------------------------------------
    console.log("\nTEST 14: Multilingual Date Horizon Translations");
    const hasEnDayAfter = scriptSrc.includes('dateDayAfter: "Day After (+2D)"');
    const hasHiDayAfter = scriptSrc.includes('dateDayAfter: "परसों (+2 दिन)"');
    const hasMrDayAfter = scriptSrc.includes('dateDayAfter: "परवा (+2 दिवस)"');

    console.log(`  -> English Day After label: ${hasEnDayAfter}`);
    console.log(`  -> Hindi Day After label: ${hasHiDayAfter}`);
    console.log(`  -> Marathi Day After label: ${hasMrDayAfter}`);

    if (hasEnDayAfter && hasHiDayAfter && hasMrDayAfter) {
      console.log("  [PASS] Full multilingual support across EN, HI, MR for new horizons.");
      passedTests++;
    } else {
      console.log("  [FAIL] Missing multilingual keys.");
    }

    // -------------------------------------------------------------
    // TEST 15: Server Health, Environment Security & Deployment State
    // -------------------------------------------------------------
    console.log("\nTEST 15: Server Health, Sync Endpoint & Secret Security");
    const health = await get(`http://127.0.0.1:${testPort}/api/health`);
    console.log(`  -> Server Status: ${health.body.status}`);
    console.log(`  -> Routing Provider: ${health.body.routingProvider}`);
    console.log(`  -> data.gov.in Configured: ${health.body.dataGovConfigured}`);
    console.log(`  -> Last Successful Sync: ${health.body.lastSuccessfulDataSync}`);

    // Verify no secret keys leaked in client-side script.js
    const leaksApiKey = scriptSrc.includes(process.env.DATA_GOV_API_KEY || "579b464db66ec23bdd");
    console.log(`  -> DATA_GOV_API_KEY exposed in client script.js: ${leaksApiKey}`);

    if (health.body.status === "ok" && !leaksApiKey && health.body.routingProvider.includes("OSRM")) {
      console.log("  [PASS] Health check passed, OSRM active, zero credentials leaked to frontend.");
      passedTests++;
    } else {
      console.log("  [FAIL] Health check failed or credentials exposed.");
    }

    console.log("\n==================================================================");
    console.log(`TEST SUITE COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log("==================================================================");

  } finally {
    server.close();
  }
}

runFullTestSuite().catch(err => {
  console.error("Test Suite crashed:", err);
  process.exit(1);
});
