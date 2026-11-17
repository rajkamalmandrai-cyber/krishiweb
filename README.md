# KrishiWeb — Agricultural Market Intelligence

KrishiWeb is a web application helping Indian farmers make data-driven, profitable crop-selling decisions. By combining official AGMARKNET mandi price data from `data.gov.in`, road distance calculations, and transport cost estimations, KrishiWeb identifies the optimal nearby APMC market for a farmer's specific crop, quantity, and location.

---

## Key Features

- **Optimal Market Recommendation**: Automatically compares nearby APMC mandis within customizable radii (100 km default, expandable to 200 km and 350 km) to find the market yielding the highest net profit after transport costs.
- **Transparent Mathematical Ranking**:
  $$\text{Gross Crop Value} = \text{Modal Price Per Quintal} \times \frac{\text{Quantity (kg)}}{100}$$
  $$\text{Estimated Transport Cost} = \text{Road Distance (km)} \times ₹3.50/\text{km}$$
  $$\text{Estimated Net Amount} = \text{Gross Crop Value} - \text{Estimated Transport Cost}$$
- **Travel Time & Road Distance**: Real-time traffic-aware road duration (via Google Maps Routes API when configured) or deterministic commercial rural goods transport model (1.28x winding factor, 42 km/h commercial transit speed).
- **Official Government Data**: Direct integration with AGMARKNET daily mandi price data via `data.gov.in` (Resource ID `9ef84268-d588-465a-a308-a864a43d0070`).
- **Data Freshness Safeguards**: Displays source arrival date with automatic warnings if market data is older than 3 days. Never fabricates prices or labels historical prices as today's.
- **Multilingual UI**: Full interface and natural voice parser support in English, Hindi (हिन्दी), and Marathi (मराठी).
- **Vercel Serverless & Local Dual-Mode**: Serverless functions in `api/` for zero-maintenance cloud deployments on Vercel, paired with a local `server.js` runner for development and offline testing.

---

## Architecture & Project Structure

```text
KRISHI MITRA V2/
├── api/
│   ├── mandi-prices.js     # Serverless endpoint for verified AGMARKNET prices
│   ├── routes.js           # Serverless endpoint for road transit distance & duration
│   └── health.js           # System health & configuration status
├── lib/
│   └── mandi-core.js       # Shared domain logic, caching (1h TTL), & APMC coordinates
├── index.html              # Homepage with visual crop selector & modal results
├── find-best-market.html   # Dedicated market comparison tool
├── crop-prices.html        # Overview of crop prices across Maharashtra
├── mandi-prices.html       # APMC mandi directory
├── script.js               # Frontend controller, multilingual parser, & UI components
├── style.css               # Harvest Premium Design System
├── server.js               # Local development server (npm start / npm test)
├── vercel.json             # Vercel deployment configuration
└── test-suite.js           # 10-point production verification test suite
```

---

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation & Local Run

1. Clone or navigate to the repository directory:
   ```bash
   cd "KRISHI MITRA V2"
   ```

2. Run the application locally:
   ```bash
   npm start
   ```
   Open your browser at `http://localhost:3000`.

3. Run the automated test suite:
   ```bash
   npm test
   ```

---

## Environment Configuration

Configure `.env` in the project root:

```ini
# Server Port
PORT=3000

# Open Government Data (data.gov.in) API Key for AGMARKNET Mandi Price Data
DATA_GOV_API_KEY=your_api_key_here

# Optional: Google Maps Routes API Key for Live Traffic
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

---

## License

ISC License. Developed as part of the Avishkar Student Innovation Project.
