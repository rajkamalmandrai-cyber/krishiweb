const fs = require('fs');

const cropFiles = [
  'cotton.html',
  'onion.html',
  'potato.html',
  'rice-paddy.html',
  'soybean.html',
  'tomato.html',
  'wheat.html'
];

const targetPattern = /<label class="field">\s*<span class="field__label">Selling Date<\/span>\s*<input class="date-input" type="date" \/>\s*<\/label>/;

const replacement = `<label class="field">
                <span class="field__label">Selling Date</span>
                <select class="input date-select" name="sellingDateType">
                  <option value="today" selected>Today (Actual Market Rate)</option>
                  <option value="tomorrow">Tomorrow (+1 Day Forecast)</option>
                  <option value="day_after">Day After (+2 Days Forecast)</option>
                </select>
              </label>`;

for (const file of cropFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (targetPattern.test(content)) {
      content = content.replace(targetPattern, replacement);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`[OK] Updated date selector in ${file}`);
    } else {
      console.warn(`[WARN] Pattern not found in ${file}`);
    }
  }
}

