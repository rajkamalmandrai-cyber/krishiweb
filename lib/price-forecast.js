/**
 * KRISHIWEB EXPLAINABLE PRICE FORECASTING ENGINE
 * 
 * Provides an explainable, testable baseline price forecast for:
 * - Horizon 0 (Today): Actual reported market price
 * - Horizon 1 (Tomorrow): Predicted next-day modal price with uncertainty range
 * - Horizon 2 (Day After Tomorrow): Predicted day-after modal price with uncertainty range
 * 
 * Methodology:
 * - Moving Average + Short-term Momentum (EWMA/SMA hybrid)
 * - Uncertainty range derived from historical variance of day-to-day fluctuations
 * - Time-series holdout backtesting (strictly chronological, NO shuffling)
 * - Evaluation metrics: MAE, RMSE, MAPE
 */

/**
 * Predict future price for horizon 1 (Tomorrow) and horizon 2 (Day After Tomorrow)
 * @param {Array} history - Array of historical price records [{ date: 'YYYY-MM-DD', modalPrice: number, minPrice: number, maxPrice: number }] in chronological order
 * @param {number} horizonDays - 1 (Tomorrow) or 2 (Day After Tomorrow)
 * @param {number} currentPrice - Current actual modal price
 */
function predictMandiPrice(history, horizonDays = 1, currentPrice = null) {
  const basePrice = (typeof currentPrice === 'number' && currentPrice > 0) ? currentPrice : null;

  // If no history and no base price
  if ((!history || history.length === 0) && !basePrice) {
    return {
      status: "unavailable",
      predictedPrice: null,
      horizonDays: horizonDays,
      confidence: "Unavailable",
      uncertaintyRange: null,
      method: "None",
      message: "No historical or current price data available for forecasting."
    };
  }

  // If we only have current price but no time-series history
  if (!history || history.length < 3) {
    const fallbackPrice = basePrice || (history && history.length > 0 ? history[history.length - 1].modalPrice : 0);
    const uncertaintyDelta = Math.round(fallbackPrice * 0.06 * Math.sqrt(horizonDays));
    return {
      status: "low_confidence",
      predictedPrice: fallbackPrice,
      horizonDays: horizonDays,
      confidence: "Low",
      uncertaintyRange: {
        low: Math.max(100, fallbackPrice - uncertaintyDelta),
        high: fallbackPrice + uncertaintyDelta,
        delta: uncertaintyDelta
      },
      method: "Static Baseline (Insufficient historical records for trend modeling)",
      message: "Forecast confidence is low due to limited historical observations (< 3 days). Estimate equals latest modal price with wider uncertainty."
    };
  }

  // Extract prices in chronological order
  const validPrices = history
    .filter(h => typeof h.modalPrice === 'number' && h.modalPrice > 0)
    .map(h => h.modalPrice);

  if (validPrices.length < 3) {
    const lastPrice = validPrices[validPrices.length - 1] || basePrice || 1000;
    return {
      status: "low_confidence",
      predictedPrice: lastPrice,
      horizonDays: horizonDays,
      confidence: "Low",
      uncertaintyRange: {
        low: Math.max(100, Math.round(lastPrice * 0.94)),
        high: Math.round(lastPrice * 1.06),
        delta: Math.round(lastPrice * 0.06)
      },
      method: "Latest Available Observation",
      message: "Limited valid records available."
    };
  }

  const n = validPrices.length;
  const latestPrice = basePrice || validPrices[n - 1];

  // 1. Calculate Exponentially Weighted Moving Average (EWMA) with alpha = 0.4
  let ewma = validPrices[0];
  const alpha = 0.4;
  for (let i = 1; i < n; i++) {
    ewma = alpha * validPrices[i] + (1 - alpha) * ewma;
  }

  // 2. Short-term Trend Momentum Slope (over last min(5, n) observations)
  const windowSize = Math.min(5, n);
  const recentSlice = validPrices.slice(-windowSize);
  const slope = (recentSlice[recentSlice.length - 1] - recentSlice[0]) / Math.max(1, recentSlice.length - 1);

  // Bound daily slope to maximum +/- 4% of current price to prevent wild extrapolation in volatile markets
  const maxDailyShift = latestPrice * 0.04;
  const boundedDailySlope = Math.max(-maxDailyShift, Math.min(maxDailyShift, slope));

  // 3. Predicted Price for Horizon h
  // Blend latest price trend projection with mean reversion towards EWMA
  const trendComponent = latestPrice + (boundedDailySlope * horizonDays);
  const meanReversionWeight = 0.25 * horizonDays; // Mean-reversion increases slightly over further horizons
  const rawPredicted = (1 - meanReversionWeight) * trendComponent + meanReversionWeight * ewma;
  const predictedPrice = Math.round(rawPredicted);

  // 4. Calculate Empirical Day-to-Day Residual Volatility (Sigma)
  const dayChanges = [];
  for (let i = 1; i < n; i++) {
    dayChanges.push(Math.abs(validPrices[i] - validPrices[i - 1]));
  }
  const meanChange = dayChanges.reduce((a, b) => a + b, 0) / Math.max(1, dayChanges.length);
  const variance = dayChanges.reduce((a, b) => a + Math.pow(b - meanChange, 2), 0) / Math.max(1, dayChanges.length);
  const stdDev = Math.sqrt(variance);

  // 95% Confidence Interval scaling for horizon h: 1.96 * stdDev * sqrt(h)
  const uncertaintyDelta = Math.max(40, Math.round(1.96 * stdDev * Math.sqrt(horizonDays)));

  // Confidence Rating based on sample size and relative volatility
  const relativeVol = meanChange / Math.max(1, latestPrice);
  let confidence = "Moderate";
  if (n >= 10 && relativeVol < 0.035) {
    confidence = "High";
  } else if (n < 5 || relativeVol > 0.08) {
    confidence = "Low";
  }

  return {
    status: "success",
    predictedPrice: predictedPrice,
    horizonDays: horizonDays,
    confidence: confidence,
    uncertaintyRange: {
      low: Math.max(50, predictedPrice - uncertaintyDelta),
      high: predictedPrice + uncertaintyDelta,
      delta: uncertaintyDelta
    },
    method: "Explainable EWMA-Trend Baseline (Short-term momentum with mean-reversion)",
    latestPrice: latestPrice,
    dailyTrendDirection: boundedDailySlope > 10 ? "Rising" : boundedDailySlope < -10 ? "Falling" : "Stable",
    sampleSize: n
  };
}

/**
 * Time-based Walk-Forward Holdout Backtesting (Strictly chronological, NO random shuffling)
 * Splits time series into train and holdout to compute MAE, RMSE, MAPE metrics
 * @param {Array} history - Array of historical price records [{ date, modalPrice }]
 * @param {number} holdoutCount - Number of recent observations to hold out for evaluation (default: 3)
 */
function evaluateForecastModel(history, holdoutCount = 3) {
  if (!history || history.length < holdoutCount + 3) {
    return {
      status: "insufficient_data",
      message: `Need at least ${holdoutCount + 3} chronological observations to run time-based holdout validation.`
    };
  }

  const valid = history
    .filter(h => typeof h.modalPrice === 'number' && h.modalPrice > 0)
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  const n = valid.length;
  const trainEnd = n - holdoutCount;

  const actuals = [];
  const predictions = [];
  const absErrors = [];
  const sqErrors = [];
  const pctErrors = [];

  // Walk-forward validation across the holdout window
  for (let t = trainEnd; t < n; t++) {
    const trainData = valid.slice(0, t);
    const actual = valid[t].modalPrice;
    const predResult = predictMandiPrice(trainData, 1, trainData[trainData.length - 1].modalPrice);

    if (predResult.predictedPrice !== null) {
      const pred = predResult.predictedPrice;
      const error = actual - pred;
      const absErr = Math.abs(error);

      actuals.push(actual);
      predictions.push(pred);
      absErrors.push(absErr);
      sqErrors.push(Math.pow(error, 2));

      // Valid MAPE calculation: actual price > 0
      if (actual > 0) {
        pctErrors.push((absErr / actual) * 100);
      }
    }
  }

  if (actuals.length === 0) {
    return { status: "error", message: "Failed to generate predictions for holdout points." };
  }

  const count = actuals.length;
  const mae = Math.round((absErrors.reduce((a, b) => a + b, 0) / count) * 10) / 10;
  const rmse = Math.round(Math.sqrt(sqErrors.reduce((a, b) => a + b, 0) / count) * 10) / 10;
  const mape = Math.round((pctErrors.reduce((a, b) => a + b, 0) / count) * 100) / 100;

  return {
    status: "validated",
    metrics: {
      mae: mae,         // Mean Absolute Error in ₹/Quintal
      rmse: rmse,       // Root Mean Squared Error in ₹/Quintal
      mape: mape,       // Mean Absolute Percentage Error in %
      sampleCount: count,
      totalHistoryLength: n
    },
    method: "Chronological Walk-Forward Holdout (No Random Shuffling)",
    details: actuals.map((act, i) => ({
      actual: act,
      predicted: predictions[i],
      absoluteError: absErrors[i]
    }))
  };
}

module.exports = {
  predictMandiPrice,
  evaluateForecastModel
};

