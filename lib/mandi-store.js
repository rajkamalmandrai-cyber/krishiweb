/**
 * KRISHIWEB PERSISTENT MANDI DATA STORE & DAILY DATA SCHEDULER
 * 
 * Manages persistent storage, data validation, duplicate prevention,
 * historical price retention, data freshness detection, and scheduled synchronization.
 */

const fs = require("fs");
const path = require("path");
const { MANDI_COORDINATES, DISTRICT_COORDINATES, CROP_COMMODITY_MAP } = require("./constants");
const { predictMandiPrice, evaluateForecastModel } = require("./price-forecast");

const DATA_STORE_PATH = path.resolve(__dirname, "..", "data", "mandi-store.json");

// Helper: Parse DD/MM/YYYY to Date object
function parseMandiDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return new Date();
  const parts = dateStr.trim().split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

// Helper: Format Date object to DD/MM/YYYY
function formatToMandiDate(dateObj) {
  const d = dateObj.getDate().toString().padStart(2, "0");
  const m = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const y = dateObj.getFullYear();
  return `${d}/${m}/${y}`;
}

// Helper: Calculate days elapsed between dateStr and today
function getDaysElapsed(dateStr) {
  const recDate = parseMandiDate(dateStr);
  const now = new Date();
  // Normalize to start of day for clean day counts
  const recStart = new Date(recDate.getFullYear(), recDate.getMonth(), recDate.getDate());
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = nowStart.getTime() - recStart.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

class MandiStore {
  constructor() {
    this.store = null;
    this.schedulerTimer = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_STORE_PATH)) {
        const raw = fs.readFileSync(DATA_STORE_PATH, "utf8");
        this.store = JSON.parse(raw);
      } else {
        this.initEmptyStore();
      }
    } catch (err) {
      console.error("[MandiStore] Error loading data store:", err.message);
      this.initEmptyStore();
    }
  }

  initEmptyStore() {
    this.store = {
      meta: {
        lastSuccessfulSync: new Date().toISOString(),
        lastSyncStatus: "initialized",
        source: "AGMARKNET / OGD India (Ministry of Agriculture and Farmers Welfare)",
        totalRecords: 0,
        version: "2.1.0"
      },
      latestDates: {},
      currentPrices: {},
      history: {}
    };
  }

  save() {
    try {
      const dataDir = path.dirname(DATA_STORE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(this.store, null, 2), "utf8");
      return true;
    } catch (err) {
      console.error("[MandiStore] Failed to save data store:", err.message);
      return false;
    }
  }

  /**
   * Strict Data Validation per Priority 1 & 7
   */
  validateRecord(raw) {
    if (!raw) return { valid: false, reason: "Empty record" };

    const modal = parseFloat(raw.modalPrice ?? raw.modal_price);
    const min = parseFloat(raw.minPrice ?? raw.min_price);
    const max = parseFloat(raw.maxPrice ?? raw.max_price);

    // 1. Positive numbers
    if (isNaN(modal) || isNaN(min) || isNaN(max) || modal <= 0 || min <= 0 || max <= 0) {
      return { valid: false, reason: "Prices must be positive numbers" };
    }

    // 2. Min <= Max
    if (min > max) {
      return { valid: false, reason: `Min price (${min}) cannot exceed max price (${max})` };
    }

    // 3. Realistic price boundaries (Rs 100 to Rs 150,000 / qtl)
    if (modal < 100 || modal > 150000) {
      return { valid: false, reason: `Modal price (${modal}) outside realistic APMC agricultural range` };
    }

    // 4. Valid arrival date DD/MM/YYYY
    const arrivalDate = (raw.arrivalDate || raw.arrival_date || "").trim();
    if (!arrivalDate || !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(arrivalDate)) {
      return { valid: false, reason: `Invalid arrival date format: ${arrivalDate}` };
    }

    // 5. Market and Crop identification
    const market = (raw.market || raw.name || "").trim();
    const crop = (raw.crop || raw.commodity || "").trim();
    if (!market || !crop) {
      return { valid: false, reason: "Market and crop name are mandatory" };
    }

    return {
      valid: true,
      cleaned: {
        modalPrice: Math.round(modal),
        minPrice: Math.round(min),
        maxPrice: Math.round(max),
        arrivalDate: arrivalDate,
        market: market,
        crop: crop.toLowerCase(),
        state: (raw.state || "Maharashtra").trim(),
        district: (raw.district || "").trim()
      }
    };
  }

  /**
   * Upsert verified records with duplicate prevention and history preservation
   */
  upsertRecords(records) {
    if (!Array.isArray(records)) return { added: 0, updated: 0, rejected: 0 };

    let added = 0;
    let updated = 0;
    let rejected = 0;

    for (const rec of records) {
      const val = this.validateRecord(rec);
      if (!val.valid) {
        rejected++;
        continue;
      }

      const c = val.cleaned;
      const cropKey = c.crop;
      if (!this.store.currentPrices[cropKey]) {
        this.store.currentPrices[cropKey] = [];
      }
      if (!this.store.history[cropKey]) {
        this.store.history[cropKey] = {};
      }

      // Resolve Market Location & Name
      const marketKey = (rec.market || rec.name || "").toLowerCase().trim();
      const resolved = this.resolveMarketGeo(c.market, c.district);

      const recordId = rec.id || `gov-${cropKey}-${marketKey.replace(/[^a-z0-9]/g, "_")}`;
      const entry = {
        id: recordId,
        name: resolved.displayName || rec.name || c.market,
        market: c.market,
        district: c.district || resolved.district || "Maharashtra",
        state: c.state,
        crop: cropKey.charAt(0).toUpperCase() + cropKey.slice(1),
        commodity: rec.commodity || cropKey,
        variety: rec.variety || "Local",
        grade: rec.grade || "FAQ",
        pricePerQtl: c.modalPrice,
        minPrice: c.minPrice,
        maxPrice: c.maxPrice,
        modalPrice: c.modalPrice,
        priceUnit: "₹/Quintal",
        arrivalDate: c.arrivalDate,
        lat: resolved.lat,
        lon: resolved.lon,
        location: resolved.locationStr,
        source: "AGMARKNET / OGD India (Ministry of Agriculture)",
        isRealData: true,
        updatedAt: new Date().toISOString()
      };

      // 1. Duplicate Prevention in Current Prices
      // Matches by market name and crop
      const existingIdx = this.store.currentPrices[cropKey].findIndex(
        (e) => e.name.toLowerCase() === entry.name.toLowerCase() || e.market.toLowerCase() === entry.market.toLowerCase()
      );

      if (existingIdx !== -1) {
        // Compare dates: update if newer or same
        const existingDate = parseMandiDate(this.store.currentPrices[cropKey][existingIdx].arrivalDate);
        const newDate = parseMandiDate(entry.arrivalDate);
        if (newDate >= existingDate) {
          this.store.currentPrices[cropKey][existingIdx] = entry;
          updated++;
        }
      } else {
        this.store.currentPrices[cropKey].push(entry);
        added++;
      }

      // 2. Preserve Historical Data in Time-Series
      const histMarketId = recordId;
      if (!this.store.history[cropKey][histMarketId]) {
        this.store.history[cropKey][histMarketId] = [];
      }

      // Check if entry for this date already exists in history
      const hist = this.store.history[cropKey][histMarketId];
      const parsedD = parseMandiDate(c.arrivalDate);
      const isoDate = `${parsedD.getFullYear()}-${(parsedD.getMonth() + 1).toString().padStart(2, "0")}-${parsedD.getDate().toString().padStart(2, "0")}`;

      const existingHistIdx = hist.findIndex((h) => h.date === isoDate);
      if (existingHistIdx !== -1) {
        hist[existingHistIdx] = {
          date: isoDate,
          arrivalDate: c.arrivalDate,
          modalPrice: c.modalPrice,
          minPrice: c.minPrice,
          maxPrice: c.maxPrice
        };
      } else {
        hist.push({
          date: isoDate,
          arrivalDate: c.arrivalDate,
          modalPrice: c.modalPrice,
          minPrice: c.minPrice,
          maxPrice: c.maxPrice
        });
        // Keep sorted chronologically
        hist.sort((a, b) => a.date.localeCompare(b.date));
      }

      // Update Latest Arrival Date Tracker
      const currentLatest = this.store.latestDates[cropKey];
      if (!currentLatest || parseMandiDate(entry.arrivalDate) > parseMandiDate(currentLatest)) {
        this.store.latestDates[cropKey] = entry.arrivalDate;
      }
    }

    this.store.meta.lastSuccessfulSync = new Date().toISOString();
    this.store.meta.lastSyncStatus = "success";
    this.save();

    return { added, updated, rejected };
  }

  resolveMarketGeo(marketName, districtName) {
    const normM = (marketName || "").toLowerCase().trim();
    const normD = (districtName || "").toLowerCase().trim();

    for (const [key, val] of Object.entries(MANDI_COORDINATES)) {
      if (normM.includes(key) || key.includes(normM)) {
        return { lat: val.lat, lon: val.lon, displayName: val.name, locationStr: val.location, district: val.district };
      }
    }

    for (const [dKey, dCoords] of Object.entries(DISTRICT_COORDINATES)) {
      if (normD.includes(dKey) || dKey.includes(normD)) {
        return {
          lat: dCoords.lat,
          lon: dCoords.lon,
          displayName: `${marketName.trim()} APMC`,
          locationStr: `${districtName.trim()}, Maharashtra`,
          district: districtName.trim()
        };
      }
    }

    return {
      lat: 19.0760,
      lon: 72.8777,
      displayName: marketName.trim(),
      locationStr: `${districtName || marketName}, Maharashtra`,
      district: districtName || "Maharashtra"
    };
  }

  /**
   * Retrieves mandi data with full Data Freshness and Forecast Details
   */
  getMandiData(cropId, state = "Maharashtra", sellingDateType = "today") {
    const normCrop = (cropId || "").toLowerCase().trim();

    // Special crop logic for Sugarcane
    if (normCrop === "sugarcane") {
      return {
        status: "unavailable",
        crop: "Sugarcane",
        state: state,
        totalRecords: 0,
        source: "AGMARKNET / OGD India",
        message: "Sugarcane is procured directly by sugar mills under statutory Fair & Remunerative Price (FRP); daily APMC auctions are not conducted.",
        records: []
      };
    }

    const records = this.store.currentPrices[normCrop] || [];
    if (records.length === 0) {
      return {
        status: "unavailable",
        crop: normCrop,
        state: state,
        totalRecords: 0,
        source: "AGMARKNET / OGD India (Ministry of Agriculture)",
        message: `No active market price records found for ${cropId}.`,
        records: []
      };
    }

    // Find the latest arrival date in this set
    let latestDateStr = "";
    let latestDateObj = new Date(0);
    for (const rec of records) {
      const d = parseMandiDate(rec.arrivalDate);
      if (d > latestDateObj) {
        latestDateObj = d;
        latestDateStr = rec.arrivalDate;
      }
    }

    const daysElapsed = getDaysElapsed(latestDateStr);
    let freshnessStatus = "fresh";
    let freshnessWarning = null;

    if (daysElapsed === 0) {
      freshnessStatus = "fresh"; // Recorded today
    } else if (daysElapsed === 1) {
      freshnessStatus = "yesterday";
      freshnessWarning = `Today's market auctions have not been published yet. Showing verified prices from yesterday (${latestDateStr}).`;
    } else {
      freshnessStatus = "stale";
      freshnessWarning = `Market data is from ${daysElapsed} days ago (${latestDateStr}). APMC auctions may not have reported yet due to weekends or public holidays.`;
    }

    // Enrich each record with Forecasts and History
    const enriched = records.map((rec) => {
      const hist = (this.store.history[normCrop] && this.store.history[normCrop][rec.id]) || [];

      // Forecast Horizon 1 (Tomorrow) & Horizon 2 (Day After Tomorrow)
      const fcTomorrow = predictMandiPrice(hist, 1, rec.modalPrice);
      const fcDayAfter = predictMandiPrice(hist, 2, rec.modalPrice);

      // Determine active price based on selected selling date
      let activePrice = rec.modalPrice;
      let activePriceType = "actual";
      let activeForecast = null;

      if (sellingDateType === "tomorrow") {
        activePrice = fcTomorrow.predictedPrice || rec.modalPrice;
        activePriceType = "predicted";
        activeForecast = fcTomorrow;
      } else if (sellingDateType === "day_after" || sellingDateType === "dayAfter") {
        activePrice = fcDayAfter.predictedPrice || rec.modalPrice;
        activePriceType = "predicted";
        activeForecast = fcDayAfter;
      }

      return {
        ...rec,
        activePrice: activePrice,
        activePriceType: activePriceType,
        activeForecast: activeForecast,
        forecastTomorrow: fcTomorrow,
        forecastDayAfter: fcDayAfter,
        historicalCount: hist.length
      };
    });

    return {
      status: "success",
      crop: normCrop,
      state: state,
      totalRecords: enriched.length,
      latestArrivalDate: latestDateStr,
      lastSuccessfulSync: this.store.meta.lastSuccessfulSync,
      daysAgo: daysElapsed,
      freshnessStatus: freshnessStatus,
      freshnessWarning: freshnessWarning,
      isFresh: daysElapsed === 0,
      source: this.store.meta.source,
      sellingDateType: sellingDateType,
      records: enriched
    };
  }

  /**
   * Run live fetch from data.gov.in AGMARKNET API
   */
  async syncFromDataGov(apiKey) {
    const key = apiKey || process.env.DATA_GOV_API_KEY;
    if (!key) {
      console.warn("[MandiStore] Sync skipped: No DATA_GOV_API_KEY provided.");
      return { status: "skipped", reason: "API key missing" };
    }

    console.log(`[MandiStore] Starting synchronization with data.gov.in AGMARKNET feed...`);
    const cropsToSync = ["onion", "tomato", "potato", "cotton", "soybean", "wheat", "rice"];
    const incomingRecords = [];

    for (const crop of cropsToSync) {
      const commodities = CROP_COMMODITY_MAP[crop] || [crop];
      for (const commodity of commodities) {
        try {
          const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${encodeURIComponent(key)}&format=json&filters[state.keyword]=Maharashtra&filters[commodity]=${encodeURIComponent(commodity)}&limit=50`;

          const res = await fetch(url, { signal: AbortSignal.timeout(9000) });
          if (!res.ok) {
            console.warn(`[MandiStore] API responded with ${res.status} for ${commodity}`);
            continue;
          }

          const json = await res.json();
          const pageRecords = json.records || [];
          for (const raw of pageRecords) {
            incomingRecords.push({
              market: raw.market,
              district: raw.district,
              state: raw.state || "Maharashtra",
              crop: crop,
              commodity: raw.commodity,
              variety: raw.variety,
              grade: raw.grade,
              modalPrice: raw.modal_price,
              minPrice: raw.min_price,
              maxPrice: raw.max_price,
              arrivalDate: raw.arrival_date
            });
          }
        } catch (fetchErr) {
          console.warn(`[MandiStore] Sync error for ${commodity}:`, fetchErr.message);
        }
      }
    }

    if (incomingRecords.length > 0) {
      const result = this.upsertRecords(incomingRecords);
      console.log(`[MandiStore] Sync complete. Added: ${result.added}, Updated: ${result.updated}, Rejected: ${result.rejected}`);
      return { status: "success", count: incomingRecords.length, ...result };
    } else {
      console.log("[MandiStore] No new records reported in live API today; preserved existing historical database.");
      this.store.meta.lastSuccessfulSync = new Date().toISOString();
      this.store.meta.lastSyncStatus = "checked_no_new_arrivals";
      this.save();
      return { status: "no_new_records", count: 0 };
    }
  }

  /**
   * Start Scheduled Daily Sync Process
   */
  startDailyScheduler(intervalMs = 4 * 60 * 60 * 1000) {
    if (this.schedulerTimer) clearInterval(this.schedulerTimer);

    // Initial sync check after startup
    setTimeout(() => {
      this.syncFromDataGov().catch((e) => console.warn("[Scheduler] Initial sync error:", e.message));
    }, 5000);

    // Periodic synchronization
    this.schedulerTimer = setInterval(() => {
      console.log("[Scheduler] Triggering scheduled mandi data synchronization...");
      this.syncFromDataGov().catch((e) => console.warn("[Scheduler] Periodic sync error:", e.message));
    }, intervalMs);

    console.log(`[Scheduler] Daily data sync scheduler registered (Interval: ${intervalMs / 3600000}h).`);
  }
}

const mandiStoreInstance = new MandiStore();

module.exports = {
  MandiStore,
  mandiStore: mandiStoreInstance,
  parseMandiDate,
  formatToMandiDate,
  getDaysElapsed
};
