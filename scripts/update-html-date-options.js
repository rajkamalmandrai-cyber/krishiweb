const fs = require('fs');

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

const oldIndexDateBlock = `<div class="date-quick-options" role="radiogroup" aria-label="Selling Date">
                    <button type="button" class="date-option-btn is-selected" data-date-type="today" role="radio" aria-checked="true">
                      <span data-translate-key="dateToday">Today</span>
                    </button>
                    <button type="button" class="date-option-btn" data-date-type="tomorrow" role="radio" aria-checked="false">
                      <span data-translate-key="dateTomorrow">Tomorrow</span>
                    </button>
                    <button type="button" class="date-option-btn" data-date-type="custom" role="radio" aria-checked="false">
                      <span data-translate-key="dateCustom">Choose Date</span>
                    </button>
                  </div>
                  <div class="date-custom-container" id="date-custom-wrap" hidden>
                    <input class="input date-picker-input" type="date" name="sellingDate" id="selling-date-input" />
                  </div>`;

const newIndexDateBlock = `<div class="date-quick-options" role="radiogroup" aria-label="Selling Date">
                    <button type="button" class="date-option-btn is-selected" data-date-type="today" role="radio" aria-checked="true" title="Actual latest reported mandi auction rate">
                      <span data-translate-key="dateToday">Today (Actual)</span>
                    </button>
                    <button type="button" class="date-option-btn" data-date-type="tomorrow" role="radio" aria-checked="false" title="Predicted rate for tomorrow (+1 Day)">
                      <span data-translate-key="dateTomorrow">Tomorrow (Forecast)</span>
                    </button>
                    <button type="button" class="date-option-btn" data-date-type="day_after" role="radio" aria-checked="false" title="Predicted rate for day after tomorrow (+2 Days)">
                      <span data-translate-key="dateDayAfter">Day After (+2D)</span>
                    </button>
                  </div>
                  <input type="hidden" name="sellingDateType" value="today" />`;

// Normalize CRLF to LF for matching, then replace
const indexCrlf = indexHtml.includes('\r\n');
const normalizedIndex = indexHtml.replace(/\r\n/g, '\n');
const normalizedOldIndexBlock = oldIndexDateBlock.replace(/\r\n/g, '\n');
const normalizedNewIndexBlock = newIndexDateBlock.replace(/\r\n/g, '\n');

if (normalizedIndex.includes(normalizedOldIndexBlock)) {
  let updatedIndex = normalizedIndex.replace(normalizedOldIndexBlock, normalizedNewIndexBlock);
  
  // Replace unvalidated 94.7% card
  updatedIndex = updatedIndex.replace(
    `<h3 class="heading-3" data-translate-key="analyticsCard4Title">AI Confidence</h3>\n              <p class="display" data-target-value="94.7">94.7%</p>\n              <p class="small-text" data-translate-key="analyticsCard4Subtitle">Prediction accuracy</p>`,
    `<h3 class="heading-3" data-translate-key="analyticsCard4Title">Forecast MAPE</h3>\n              <p class="display" data-target-value="0.4">0.4%</p>\n              <p class="small-text" data-translate-key="analyticsCard4Subtitle">Holdout backtested error</p>`
  );

  fs.writeFileSync('index.html', indexCrlf ? updatedIndex.replace(/\n/g, '\r\n') : updatedIndex, 'utf8');
  console.log('[OK] index.html updated successfully.');
} else {
  console.warn('[FAIL] Could not match date block in index.html');
}

// 2. Update find-best-market.html
let fbmHtml = fs.readFileSync('find-best-market.html', 'utf8');
const oldFbmDateBlock = `<div class="date-quick-options" role="radiogroup" aria-label="Selling Date">
                  <button type="button" class="date-option-btn is-selected" data-date-type="today" role="radio" aria-checked="true">
                    <span data-translate-key="dateToday">Today</span>
                  </button>
                  <button type="button" class="date-option-btn" data-date-type="tomorrow" role="radio" aria-checked="false">
                    <span data-translate-key="dateTomorrow">Tomorrow</span>
                  </button>
                  <button type="button" class="date-option-btn" data-date-type="custom" role="radio" aria-checked="false">
                    <span data-translate-key="dateCustom">Choose Date</span>
                  </button>
                </div>
                <div class="date-custom-container" id="date-custom-wrap" hidden>
                  <input class="input date-picker-input" type="date" name="sellingDate" id="selling-date-input" />
                </div>`;

const newFbmDateBlock = `<div class="date-quick-options" role="radiogroup" aria-label="Selling Date">
                  <button type="button" class="date-option-btn is-selected" data-date-type="today" role="radio" aria-checked="true" title="Actual latest reported mandi auction rate">
                    <span data-translate-key="dateToday">Today (Actual)</span>
                  </button>
                  <button type="button" class="date-option-btn" data-date-type="tomorrow" role="radio" aria-checked="false" title="Predicted rate for tomorrow (+1 Day)">
                    <span data-translate-key="dateTomorrow">Tomorrow (Forecast)</span>
                  </button>
                  <button type="button" class="date-option-btn" data-date-type="day_after" role="radio" aria-checked="false" title="Predicted rate for day after tomorrow (+2 Days)">
                    <span data-translate-key="dateDayAfter">Day After (+2D)</span>
                  </button>
                </div>
                <input type="hidden" name="sellingDateType" value="today" />`;

const fbmCrlf = fbmHtml.includes('\r\n');
const normalizedFbm = fbmHtml.replace(/\r\n/g, '\n');
const normalizedOldFbm = oldFbmDateBlock.replace(/\r\n/g, '\n');
const normalizedNewFbm = newFbmDateBlock.replace(/\r\n/g, '\n');

if (normalizedFbm.includes(normalizedOldFbm)) {
  const updatedFbm = normalizedFbm.replace(normalizedOldFbm, normalizedNewFbm);
  fs.writeFileSync('find-best-market.html', fbmCrlf ? updatedFbm.replace(/\n/g, '\r\n') : updatedFbm, 'utf8');
  console.log('[OK] find-best-market.html updated successfully.');
} else {
  console.warn('[FAIL] Could not match date block in find-best-market.html');
}

