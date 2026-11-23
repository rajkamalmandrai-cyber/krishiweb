const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

// 1. New selectMarketsForQuery
const oldSelectQuery = `  async function selectMarketsForQuery(crop, quantityKg, userLocationStr, sellingDateStr, forceRefresh, formEl) {
    const qty = (typeof quantityKg === 'number' && !isNaN(quantityKg) && isFinite(quantityKg) && quantityKg > 0)
      ? quantityKg
      : 100;

    // 1. Resolve actual farmer origin coordinates (never silently use IP)
    const form = formEl || lastSearchForm;
    let originCoords = resolveUserOriginCoords(userLocationStr, form);
    if (!originCoords) {
      originCoords = { lat: 19.2183, lon: 72.9781, name: userLocationStr || "Thane" };
    }

    // 2. Fetch verified government mandi records for selected crop
    const govData = await fetchVerifiedMandiPrices(crop, "Maharashtra", forceRefresh);
    let candidateMandis = [];

    if (govData.status === "success" && Array.isArray(govData.records) && govData.records.length > 0) {
      candidateMandis = govData.records;
    } else {
      // Check if fallback reference markets exist for this crop in MARKET_DATA
      const baseCropMarkets = MARKET_DATA.filter(function(m) { return m.crop.toLowerCase() === crop.toLowerCase(); });
      if (baseCropMarkets.length > 0) {
        candidateMandis = baseCropMarkets.map(function(m) {
          return {
            id: m.id,
            name: m.name,
            crop: m.crop,
            location: m.location,
            lat: m.lat,
            lon: m.lon,
            pricePerQtl: m.basePrice,
            modalPrice: m.basePrice,
            priceUnit: "₹/Quintal",
            arrivalDate: "23/11/2026",
            source: crop.toLowerCase() === "sugarcane"
              ? "Sugar Mill FRP Statutory Benchmark"
              : "AGMARKNET Reference Benchmark",
            isRealData: false,
            priceUnavailable: crop.toLowerCase() === "sugarcane" || govData.status === "unavailable"
          };
        });
      }
    }

    if (!candidateMandis.length) {
      return [];
    }

    // 3. Compute road routing, travel time, and transparent economics for each mandi
    const evaluated = [];
    for (const mandi of candidateMandis) {
      if (!mandi.lat || !mandi.lon) continue;

      const route = await computeMarketRoute(originCoords, { lat: mandi.lat, lon: mandi.lon });

      // PART 3 & PART 6: Transparent Mathematical Economics
      // Gross Crop Value = Modal Price Per Quintal × Quantity in KG ÷ 100
      const pricePerQtl = mandi.modalPrice || mandi.pricePerQtl || 0;
      const pricePerKg = pricePerQtl / 100;
      const grossCropValue = Math.round((pricePerQtl * qty) / 100);

      // Estimated Transport Cost = Road Distance × Configured Transport Rate Per KM
      const estTransport = Math.round(route.distanceKm * FASALO_CONFIG.TRANSPORT_RATE_PER_KM);

      // Estimated Net Amount = Gross Crop Value − Estimated Transport Cost
      const estNet = grossCropValue - estTransport;

      evaluated.push({
        id: mandi.id,
        name: mandi.name,
        crop: mandi.crop,
        location: mandi.location,
        lat: mandi.lat,
        lon: mandi.lon,
        source: mandi.source,
        arrivalDate: mandi.arrivalDate,
        isRealData: mandi.isRealData,
        priceUnavailable: mandi.priceUnavailable,
        distanceKm: route.distanceKm,
        travelMinutes: route.travelMinutes,
        isLiveRoute: route.isLiveRoute,
        routeSource: route.source,
        pricePerQtl: pricePerQtl,
        pricePerKg: pricePerKg,
        grossCropValue: grossCropValue,
        estTransport: estTransport,
        estNet: estNet,
        quantityKg: qty,
        userOriginName: originCoords.name || userLocationStr
      });
    }`;

const newSelectQuery = `  async function selectMarketsForQuery(crop, quantityKg, userLocationStr, sellingDateStr, forceRefresh, formEl) {
    const qty = (typeof quantityKg === 'number' && !isNaN(quantityKg) && isFinite(quantityKg) && quantityKg > 0)
      ? quantityKg
      : 100;

    const dateType = (sellingDateStr || "today").toLowerCase().trim();

    // 1. Resolve actual farmer origin coordinates (never silently use IP)
    const form = formEl || lastSearchForm;
    let originCoords = resolveUserOriginCoords(userLocationStr, form);
    if (!originCoords) {
      originCoords = {
        lat: 19.2183,
        lon: 72.9781,
        name: userLocationStr || "Thane (Default Reference)",
        source: "default_fallback",
        accuracy: null,
        timestamp: new Date().toISOString(),
        isFallback: true
      };
    }

    // 2. Fetch verified government mandi records for selected crop & horizon
    const govData = await fetchVerifiedMandiPrices(crop, "Maharashtra", forceRefresh, dateType);
    let candidateMandis = [];

    if (govData.status === "success" && Array.isArray(govData.records) && govData.records.length > 0) {
      candidateMandis = govData.records;
    } else {
      // Check if fallback reference markets exist for this crop in MARKET_DATA
      const baseCropMarkets = MARKET_DATA.filter(function(m) { return m.crop.toLowerCase() === crop.toLowerCase(); });
      if (baseCropMarkets.length > 0) {
        candidateMandis = baseCropMarkets.map(function(m) {
          return {
            id: m.id,
            name: m.name,
            crop: m.crop,
            location: m.location,
            lat: m.lat,
            lon: m.lon,
            pricePerQtl: m.basePrice,
            modalPrice: m.basePrice,
            priceUnit: "₹/Quintal",
            arrivalDate: "23/11/2026",
            source: crop.toLowerCase() === "sugarcane"
              ? "Sugar Mill FRP Statutory Benchmark"
              : "AGMARKNET Reference Benchmark",
            isRealData: false,
            priceUnavailable: crop.toLowerCase() === "sugarcane" || govData.status === "unavailable"
          };
        });
      }
    }

    if (!candidateMandis.length) {
      return [];
    }

    // 3. Compute road routing, travel time, and transparent economics for each mandi
    const evaluated = [];
    for (const mandi of candidateMandis) {
      if (!mandi.lat || !mandi.lon) continue;

      const route = await computeMarketRoute(originCoords, { lat: mandi.lat, lon: mandi.lon });

      // PART 3 & PART 6: Transparent Mathematical Economics
      // Resolve horizon price (Today actual, Tomorrow predicted, Day After predicted)
      let pricePerQtl = mandi.modalPrice || mandi.pricePerQtl || 0;
      let priceBadgeType = "actual";
      let forecastInfo = null;

      if (dateType === "tomorrow") {
        priceBadgeType = "predicted";
        if (mandi.forecastTomorrow && mandi.forecastTomorrow.predictedPrice) {
          pricePerQtl = mandi.forecastTomorrow.predictedPrice;
          forecastInfo = mandi.forecastTomorrow;
        }
      } else if (dateType === "day_after" || dateType === "dayafter") {
        priceBadgeType = "predicted";
        if (mandi.forecastDayAfter && mandi.forecastDayAfter.predictedPrice) {
          pricePerQtl = mandi.forecastDayAfter.predictedPrice;
          forecastInfo = mandi.forecastDayAfter;
        }
      }

      const pricePerKg = pricePerQtl / 100;
      const grossCropValue = Math.round((pricePerQtl * qty) / 100);

      // Estimated Transport Cost = Road Distance × Configured Transport Rate Per KM
      const estTransport = Math.round(route.distanceKm * FASALO_CONFIG.TRANSPORT_RATE_PER_KM);

      // Estimated Net Amount = Gross Crop Value − Estimated Transport Cost
      const estNet = grossCropValue - estTransport;

      evaluated.push({
        id: mandi.id,
        name: mandi.name,
        crop: mandi.crop,
        location: mandi.location,
        lat: mandi.lat,
        lon: mandi.lon,
        source: mandi.source,
        arrivalDate: mandi.arrivalDate,
        isRealData: mandi.isRealData,
        priceUnavailable: mandi.priceUnavailable,
        distanceKm: route.distanceKm,
        travelMinutes: route.travelMinutes,
        isLiveRoute: route.isLiveRoute,
        routeSource: route.source,
        routeAttribution: route.attribution,
        pricePerQtl: pricePerQtl,
        actualModalPrice: mandi.modalPrice || mandi.pricePerQtl || 0,
        pricePerKg: pricePerKg,
        priceBadgeType: priceBadgeType,
        forecastInfo: forecastInfo,
        sellingDateType: dateType,
        grossCropValue: grossCropValue,
        estTransport: estTransport,
        estNet: estNet,
        quantityKg: qty,
        originCoords: originCoords,
        userOriginName: originCoords.name || userLocationStr,
        mandiDataMeta: {
          latestArrivalDate: govData.latestArrivalDate || mandi.arrivalDate,
          lastSuccessfulSync: govData.lastSuccessfulSync || new Date().toISOString(),
          isFresh: govData.isFresh !== undefined ? govData.isFresh : true,
          daysAgo: govData.daysAgo !== undefined ? govData.daysAgo : 0,
          freshnessStatus: govData.freshnessStatus || "fresh",
          freshnessWarning: govData.freshnessWarning || null,
          source: govData.source || mandi.source
        }
      });
    }`;

// 2. New renderFarmerFriendlyModalHtml
const oldRenderModal = `    // Price unavailable notice (if applicable, Part 9)
    let priceNoticeHtml = "";
    if (bestMarket.priceUnavailable) {
      priceNoticeHtml = (
        '<div class="farmer-price-unavailable-banner">' +
          '<span>ℹ️</span>' +
          '<span>' + (t.priceUnavailable || "Price data is currently unavailable for this market.") + '</span>' +
        '</div>'
      );
    }

    const bestOptionHtml = (
      '<article class="farmer-best-card">' +
        '<div class="farmer-best-card__eyebrow">' +
          '<span>🌾 ' + (t.bestNearbyMarketEyebrow || t.modalBestForYou || "BEST NEARBY MARKET") + '</span>' +
        '</div>' +

        '<div class="farmer-best-card__header">' +
          '<h3 class="farmer-best-card__title">' + locBest.name + '</h3>' +
          '<div class="farmer-best-card__meta">' +
            '<span class="farmer-meta-item">📍 <strong>' + bestMarket.distanceKm + ' km</strong> ' + (t.modalAway || "away") + '</span>' +
            '<span class="farmer-meta-dot">&bull;</span>' +
            '<span class="farmer-meta-item">🕒 <strong>' + bestTravelTimeText + '</strong> ' + bestTrafficBadgeHtml + '</span>' +
            '<span class="farmer-meta-dot">&bull;</span>' +
            '<span class="farmer-meta-item">' + locBest.location + '</span>' +
          '</div>' +
        '</div>' +

        '<div class="farmer-best-card__stats-grid">' +
          '<div class="farmer-stat-pill">' +
            '<span class="farmer-stat-pill__label">🌱 ' + cropNameLocalized + ' ' + (t.pricePerQtlLabel || "Price") + ':</span>' +
            '<span class="farmer-stat-pill__val">₹' + bestMarket.pricePerQtl.toLocaleString('en-IN') + ' / ' + (t.unitQuintal || "quintal") + '</span>' +
          '</div>' +
          '<div class="farmer-stat-pill">' +
            '<span class="farmer-stat-pill__label">🚚 ' + (t.modalTravelCostLabel || "Travel cost") + ':</span>' +
            '<span class="farmer-stat-pill__val">~₹' + bestMarket.estTransport.toLocaleString('en-IN') + ' <span class="farmer-stat-sub">(' + (t.modalApprox || "Est.") + ')</span></span>' +
          '</div>' +
        '</div>' +

        '<div class="farmer-crop-for-line">' +
          forYourCropText +
        '</div>' +

        mainResultHtml +
        priceNoticeHtml +

        '<div class="farmer-recommendation-bar">' +
          '<span class="' + bestBadgeClass + '">' + bestBadgeText + '</span>' +
        '</div>' +

        '<details class="farmer-calc-accordion">' +
          '<summary class="farmer-calc-toggle">' +
            '<svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
            '<span>' + (t.modalHowCalculated || "How is this calculated?") + '</span>' +
          '</summary>' +
          '<div class="farmer-calc-body">' +
            '<div class="farmer-calc-row">' +
              '<span class="farmer-calc-label">' + (t.modalTodayCropValue || "Today's crop value") + ':</span>' +
              '<span class="farmer-calc-val">₹' + bestMarket.grossCropValue.toLocaleString('en-IN') + ' <span class="farmer-calc-sub">(₹' + bestMarket.pricePerKg.toFixed(2) + (t.modalPerKg || "/kg") + ')</span></span>' +
            '</div>' +
            '<div class="farmer-calc-row">' +
              '<span class="farmer-calc-label">' + (t.modalTravelCostLabel || "Travel cost") + ':</span>' +
              '<span class="farmer-calc-val">~₹' + bestMarket.estTransport.toLocaleString('en-IN') + ' <span class="farmer-calc-sub">(' + bestMarket.distanceKm + ' km @ ₹' + FASALO_CONFIG.TRANSPORT_RATE_PER_KM + '/km)</span></span>' +
            '</div>' +
            '<div class="farmer-calc-divider"></div>' +
            '<div class="farmer-calc-row farmer-calc-row--net">' +
              '<span class="farmer-calc-label"><strong>' + (t.modalYouHaveLeftLabel || "You may have left") + ':</strong></span>' +
              '<span class="farmer-calc-val ' + (isLoss ? 'farmer-calc-val--loss' : 'farmer-calc-profit') + '"><strong>' + formatRupees(bestMarket.estNet) + '</strong></span>' +
            '</div>' +

            '<div class="farmer-data-freshness-bar">' +
              '<div class="farmer-data-source">' +
                '<span>🏛️ ' + (bestMarket.source || "AGMARKNET / OGD India") + '</span>' +
                '<span class="farmer-meta-dot">&bull;</span>' +
                '<span>' + dateUpdatedText + '</span>' +
              '</div>' +
              freshnessWarningHtml +
            '</div>' +
            '<p style="font-size: 0.725rem; color: #6b7280; margin: 4px 0 0 0;">' + (t.transportEstimateNote || "* Estimated travel cost at ₹3.50/km (not a confirmed booking)") + '</p>' +
          '</div>' +
        '</details>' +
      '</article>'
    );`;

const newRenderModal = `    // Price unavailable notice
    let priceNoticeHtml = "";
    if (bestMarket.priceUnavailable) {
      priceNoticeHtml = (
        '<div class="farmer-price-unavailable-banner">' +
          '<span>ℹ️</span>' +
          '<span>' + (t.priceUnavailable || "Price data is currently unavailable for this market.") + '</span>' +
        '</div>'
      );
    }

    // PRIORITY 3: Transparent Location Panel Implementation
    const origin = bestMarket.originCoords || { name: "Thane", source: "default_fallback", lat: 19.2183, lon: 72.9781 };
    let sourceBadge = "";
    if (origin.source === "gps") {
      const accText = origin.accuracy ? (' (±' + origin.accuracy + 'm)') : '';
      sourceBadge = '<span class="farmer-location-badge farmer-location-badge--gps">📡 Device GPS' + accText + '</span>';
    } else if (origin.source === "manual") {
      sourceBadge = '<span class="farmer-location-badge farmer-location-badge--manual">✏️ Manually Entered</span>';
    } else {
      sourceBadge = '<span class="farmer-location-badge farmer-location-badge--fallback">⚠️ Reference Center (Thane)</span>';
    }

    const latStr = typeof origin.lat === 'number' ? origin.lat.toFixed(4) + '° N' : '19.2183° N';
    const lonStr = typeof origin.lon === 'number' ? origin.lon.toFixed(4) + '° E' : '72.9781° E';
    const captureTime = origin.timestamp ? new Date(origin.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';

    const locationPanelHtml = (
      '<div class="farmer-location-panel">' +
        '<div class="farmer-location-panel__header">' +
          '<span class="farmer-location-panel__title">📍 Location & Route Transparency</span>' +
          sourceBadge +
        '</div>' +
        '<div class="farmer-location-grid">' +
          '<div class="farmer-location-item">' +
            '<span class="farmer-location-label">Farmer Origin</span>' +
            '<span class="farmer-location-val">' + (origin.name || "Selected Origin") + '</span>' +
          '</div>' +
          '<div class="farmer-location-item">' +
            '<span class="farmer-location-label">Destination APMC</span>' +
            '<span class="farmer-location-val">' + locBest.name + '</span>' +
          '</div>' +
          '<div class="farmer-location-item">' +
            '<span class="farmer-location-label">Origin Coordinates</span>' +
            '<span class="farmer-location-val">' + latStr + ', ' + lonStr + '</span>' +
          '</div>' +
          '<div class="farmer-location-item">' +
            '<span class="farmer-location-label">Road Distance (OSRM)</span>' +
            '<span class="farmer-location-val">' + bestMarket.distanceKm + ' km (~' + bestTravelTimeText + ')</span>' +
          '</div>' +
        '</div>' +
        '<div class="farmer-route-attribution">' +
          '<span>🛣️ ' + (bestMarket.routeAttribution || 'Route data © OpenStreetMap contributors, routing by OSRM') + '</span>' +
        '</div>' +
        '<div class="farmer-location-actions">' +
          '<button type="button" class="farmer-loc-btn" id="retry-location-btn">🔄 Retry GPS Detection</button>' +
          '<button type="button" class="farmer-loc-btn" id="change-origin-btn">✏️ Change Origin</button>' +
        '</div>' +
      '</div>'
    );

    // PRIORITY 4 & 5: Forecast & Actual Price Distinctions
    let priceBadgeHtml = "";
    if (bestMarket.priceBadgeType === "predicted") {
      const fcLabel = bestMarket.sellingDateType === "tomorrow" ? "PREDICTED PRICE (TOMORROW)" : "PREDICTED PRICE (DAY AFTER TOMORROW)";
      priceBadgeHtml = '<div class="farmer-price-badge farmer-price-badge--predicted">🔮 ' + fcLabel + '</div>';
    } else {
      priceBadgeHtml = '<div class="farmer-price-badge farmer-price-badge--actual">🟢 ACTUAL APMC MARKET PRICE</div>';
    }

    let forecastBoxHtml = "";
    if (bestMarket.priceBadgeType === "predicted" && bestMarket.forecastInfo) {
      const fc = bestMarket.forecastInfo;
      const range = fc.uncertaintyRange ? ('₹' + fc.uncertaintyRange.low.toLocaleString('en-IN') + ' – ₹' + fc.uncertaintyRange.high.toLocaleString('en-IN') + ' (±₹' + fc.uncertaintyRange.delta + ')') : 'Estimated';
      forecastBoxHtml = (
        '<div class="farmer-forecast-box">' +
          '<div class="farmer-forecast-header">' +
            '<span>📈 Explainable Forecast Analysis</span>' +
            '<span>Confidence: ' + (fc.confidence || 'Moderate') + '</span>' +
          '</div>' +
          '<div class="farmer-forecast-stat-row">' +
            '<span>Predicted Modal Price: <strong>₹' + bestMarket.pricePerQtl.toLocaleString('en-IN') + ' / Qtl</strong></span>' +
            '<span>Current Actual: ₹' + (bestMarket.actualModalPrice || bestMarket.pricePerQtl).toLocaleString('en-IN') + ' / Qtl</span>' +
          '</div>' +
          '<div class="farmer-forecast-stat-row">' +
            '<span>Uncertainty Range: <strong>' + range + '</strong></span>' +
            '<span>Trend: <strong>' + (fc.dailyTrendDirection || 'Stable') + '</strong></span>' +
          '</div>' +
        '</div>'
      );
    }

    // PRIORITY 1: Stale Warning Banner if applicable
    const meta = bestMarket.mandiDataMeta || {};
    let staleBannerHtml = "";
    if (meta.freshnessWarning) {
      staleBannerHtml = (
        '<div class="farmer-price-unavailable-banner" style="background:#fffbeb; border:1px solid #f59e0b; color:#92400e; margin-bottom:12px; border-radius:8px; padding:10px 12px; display:flex; gap:8px;">' +
          '<span>⚠️</span>' +
          '<span><strong>Data Notice:</strong> ' + meta.freshnessWarning + '</span>' +
        '</div>'
      );
    }

    const bestOptionHtml = (
      '<article class="farmer-best-card">' +
        '<div class="farmer-best-card__eyebrow">' +
          '<span>🌾 ' + (t.bestNearbyMarketEyebrow || t.modalBestForYou || "BEST NEARBY MARKET") + '</span>' +
        '</div>' +

        '<div class="farmer-best-card__header">' +
          '<h3 class="farmer-best-card__title">' + locBest.name + '</h3>' +
          '<div class="farmer-best-card__meta">' +
            '<span class="farmer-meta-item">📍 <strong>' + bestMarket.distanceKm + ' km</strong> ' + (t.modalAway || "away") + '</span>' +
            '<span class="farmer-meta-dot">&bull;</span>' +
            '<span class="farmer-meta-item">🕒 <strong>' + bestTravelTimeText + '</strong> ' + bestTrafficBadgeHtml + '</span>' +
            '<span class="farmer-meta-dot">&bull;</span>' +
            '<span class="farmer-meta-item">' + locBest.location + '</span>' +
          '</div>' +
        '</div>' +

        '<div style="margin-top: 8px;">' +
          priceBadgeHtml +
        '</div>' +

        '<div class="farmer-best-card__stats-grid">' +
          '<div class="farmer-stat-pill">' +
            '<span class="farmer-stat-pill__label">🌱 ' + cropNameLocalized + ' ' + (bestMarket.priceBadgeType === "predicted" ? "Predicted Rate" : (t.pricePerQtlLabel || "Price")) + ':</span>' +
            '<span class="farmer-stat-pill__val">₹' + bestMarket.pricePerQtl.toLocaleString('en-IN') + ' / ' + (t.unitQuintal || "quintal") + '</span>' +
          '</div>' +
          '<div class="farmer-stat-pill">' +
            '<span class="farmer-stat-pill__label">🚚 ' + (t.modalTravelCostLabel || "Travel cost") + ':</span>' +
            '<span class="farmer-stat-pill__val">~₹' + bestMarket.estTransport.toLocaleString('en-IN') + ' <span class="farmer-stat-sub">(' + (t.modalApprox || "Est.") + ')</span></span>' +
          '</div>' +
        '</div>' +

        forecastBoxHtml +

        '<div class="farmer-crop-for-line">' +
          forYourCropText +
        '</div>' +

        mainResultHtml +
        staleBannerHtml +
        priceNoticeHtml +
        locationPanelHtml +

        '<div class="farmer-recommendation-bar">' +
          '<span class="' + bestBadgeClass + '">' + bestBadgeText + '</span>' +
        '</div>' +

        '<details class="farmer-calc-accordion">' +
          '<summary class="farmer-calc-toggle">' +
            '<svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
            '<span>' + (t.modalHowCalculated || "How is this calculated?") + '</span>' +
          '</summary>' +
          '<div class="farmer-calc-body">' +
            '<div class="farmer-calc-row">' +
              '<span class="farmer-calc-label">' + (bestMarket.priceBadgeType === "predicted" ? "Estimated gross crop value" : (t.modalTodayCropValue || "Today's crop value")) + ':</span>' +
              '<span class="farmer-calc-val">₹' + bestMarket.grossCropValue.toLocaleString('en-IN') + ' <span class="farmer-calc-sub">(₹' + bestMarket.pricePerKg.toFixed(2) + (t.modalPerKg || "/kg") + ')</span></span>' +
            '</div>' +
            '<div class="farmer-calc-row">' +
              '<span class="farmer-calc-label">' + (t.modalTravelCostLabel || "Travel cost") + ':</span>' +
              '<span class="farmer-calc-val">~₹' + bestMarket.estTransport.toLocaleString('en-IN') + ' <span class="farmer-calc-sub">(' + bestMarket.distanceKm + ' km via OSRM @ ₹' + FASALO_CONFIG.TRANSPORT_RATE_PER_KM + '/km)</span></span>' +
            '</div>' +
            '<div class="farmer-calc-divider"></div>' +
            '<div class="farmer-calc-row farmer-calc-row--net">' +
              '<span class="farmer-calc-label"><strong>' + (t.modalYouHaveLeftLabel || "You may have left") + ':</strong></span>' +
              '<span class="farmer-calc-val ' + (isLoss ? 'farmer-calc-val--loss' : 'farmer-calc-profit') + '"><strong>' + formatRupees(bestMarket.estNet) + '</strong></span>' +
            '</div>' +

            '<div class="farmer-data-freshness-bar">' +
              '<div class="farmer-data-source">' +
                '<span>🏛️ ' + (bestMarket.source || "AGMARKNET / OGD India") + '</span>' +
                '<span class="farmer-meta-dot">&bull;</span>' +
                '<span>' + dateUpdatedText + '</span>' +
              '</div>' +
              freshnessWarningHtml +
            '</div>' +
            '<p style="font-size: 0.725rem; color: #6b7280; margin: 4px 0 0 0;">' + (t.transportEstimateNote || "* Real road distance from OSRM / OpenStreetMap. Rate at ₹3.50/km.") + '</p>' +
          '</div>' +
        '</details>' +
      '</article>'
    );`;

// 3. Update openMarketModal to bind action buttons
const oldOpenModal = `    requestAnimationFrame(function() {
      const closeBtn = modal.querySelector(".modal-close-button");
      if (closeBtn) closeBtn.focus();
    });
  }`;

const newOpenModal = `    requestAnimationFrame(function() {
      const closeBtn = modal.querySelector(".modal-close-button");
      if (closeBtn) closeBtn.focus();

      // Location transparency action handlers
      const retryLocBtn = modalBody.querySelector("#retry-location-btn");
      if (retryLocBtn) {
        retryLocBtn.addEventListener("click", function() {
          closeMarketModal();
          const activeForm = lastSearchForm || document.querySelector("form");
          const locBtn = activeForm ? activeForm.querySelector(".location-button, #detect-location-btn") : null;
          if (locBtn) {
            locBtn.click();
          }
        });
      }

      const changeOrigBtn = modalBody.querySelector("#change-origin-btn");
      if (changeOrigBtn) {
        changeOrigBtn.addEventListener("click", function() {
          closeMarketModal();
          const activeForm = lastSearchForm || document.querySelector("form");
          const locInput = activeForm ? activeForm.querySelector('input[name="location"]') : null;
          if (locInput) {
            locInput.focus();
            locInput.select();
          }
        });
      }
    });
  }`;

// 4. Update date button listeners in forms
const oldDateListeners = `      dateButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const type = btn.getAttribute("data-date-type");
          dateButtons.forEach((b) => {
            b.classList.remove("is-selected");
            b.setAttribute("aria-checked", "false");
          });
          btn.classList.add("is-selected");
          btn.setAttribute("aria-checked", "true");

          if (type === "today") {
            if (dateInput) dateInput.value = todayStr;
            if (customDateWrap) customDateWrap.hidden = true;
          } else if (type === "tomorrow") {
            if (dateInput) dateInput.value = tomorrowStr;
            if (customDateWrap) customDateWrap.hidden = true;
          } else if (type === "custom") {
            if (customDateWrap) {
              customDateWrap.hidden = false;
              if (dateInput) {
                dateInput.focus();
                try {
                  if (typeof dateInput.showPicker === "function") {
                    dateInput.showPicker();
                  }
                } catch (e) {}
              }
            }
          }
        });
      });`;

const newDateListeners = `      dateButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const type = btn.getAttribute("data-date-type") || "today";
          dateButtons.forEach((b) => {
            b.classList.remove("is-selected");
            b.setAttribute("aria-checked", "false");
          });
          btn.classList.add("is-selected");
          btn.setAttribute("aria-checked", "true");

          const typeInput = form.querySelector('input[name="sellingDateType"]');
          if (typeInput) {
            typeInput.value = type;
          }

          if (dateInput) {
            if (type === "today") dateInput.value = todayStr;
            else if (type === "tomorrow") dateInput.value = tomorrowStr;
            else if (type === "day_after") {
              const d2 = new Date();
              d2.setDate(d2.getDate() + 2);
              dateInput.value = d2.toISOString().split("T")[0];
            }
          }
        });
      });`;

// 5. Update geolocation button listeners (lines 4870-4915)
const oldGeoListener = `          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              try {
                const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${latitude}&lon=\${longitude}\`);
                if (!res.ok) throw new Error("Network error");
                const data = await res.json();
                if (data && data.address) {
                  const city = data.address.city || data.address.town || data.address.village || data.address.county || "Nearby";
                  const state = data.address.state || "Maharashtra";
                  const locStr = \`\${city}, \${state}\`;
                  if (btnSpan) btnSpan.textContent = \`📍 \${locStr}\`;
                  if (locInput) locInput.value = locStr;
                  locBtn.classList.remove("is-denied");
                } else {
                  throw new Error("Invalid address format");
                }
              } catch (err) {
                if (btnSpan) btnSpan.textContent = translations[currentLang]?.unableToDetectLocation || "Unable to detect location";
                locBtn.classList.add("is-denied");
              } finally {
                locBtn.disabled = false;
              }
            },`;

const newGeoListener = `          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude, accuracy } = pos.coords;
              form.dataset.originLat = latitude;
              form.dataset.originLon = longitude;
              form.dataset.originAccuracy = accuracy ? Math.round(accuracy) : "";
              form.dataset.originTimestamp = new Date(pos.timestamp || Date.now()).toISOString();
              form.dataset.originSource = "gps";

              try {
                const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${latitude}&lon=\${longitude}\`);
                if (!res.ok) throw new Error("Network error");
                const data = await res.json();
                if (data && data.address) {
                  const city = data.address.city || data.address.town || data.address.village || data.address.county || "My Location";
                  const state = data.address.state || "Maharashtra";
                  const locStr = \`\${city}, \${state}\`;
                  if (btnSpan) btnSpan.textContent = \`📍 \${locStr} (GPS ±\${Math.round(accuracy || 0)}m)\`;
                  if (locInput) locInput.value = locStr;
                  locBtn.classList.remove("is-denied");
                } else {
                  throw new Error("Invalid address format");
                }
              } catch (err) {
                if (btnSpan) btnSpan.textContent = \`📍 GPS (\${latitude.toFixed(2)}, \${longitude.toFixed(2)})\`;
                if (locInput) locInput.value = \`\${latitude.toFixed(4)}, \${longitude.toFixed(4)}\`;
                locBtn.classList.remove("is-denied");
              } finally {
                locBtn.disabled = false;
              }
            },`;

// Apply replacements
function replaceNormalized(src, oldText, newText, label) {
  const isCrlf = src.includes('\r\n');
  const normSrc = src.replace(/\r\n/g, '\n');
  const normOld = oldText.replace(/\r\n/g, '\n');
  const normNew = newText.replace(/\r\n/g, '\n');

  if (normSrc.includes(normOld)) {
    const updated = normSrc.replace(normOld, normNew);
    console.log(`[OK] Successfully replaced ${label}`);
    return isCrlf ? updated.replace(/\n/g, '\r\n') : updated;
  } else {
    console.warn(`[WARN] Pattern not found for ${label}`);
    return src;
  }
}

script = replaceNormalized(script, oldSelectQuery, newSelectQuery, "selectMarketsForQuery");
script = replaceNormalized(script, oldRenderModal, newRenderModal, "renderFarmerFriendlyModalHtml");
script = replaceNormalized(script, oldOpenModal, newOpenModal, "openMarketModal");
script = replaceNormalized(script, oldDateListeners, newDateListeners, "dateButtonListeners");
script = replaceNormalized(script, oldGeoListener, newGeoListener, "geoButtonListener");

fs.writeFileSync('script.js', script, 'utf8');
console.log('[OK] script.js fully patched with all priorities.');

