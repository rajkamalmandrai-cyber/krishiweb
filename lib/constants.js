/**
 * KRISHIWEB GEOGRAPHIC & COMMODITY CONSTANTS
 * Verified APMC Mandi coordinates and crop commodity mappings across Maharashtra
 */

const ROAD_WINDING_FACTOR = 1.28;
const GOODS_VEHICLE_SPEED_KMH = 42; // Commercial goods / tempo / tractor transport in India
const TRANSPORT_RATE_PER_KM = 3.5; // Default Rs 3.50 per km

// --- Crop to AGMARKNET / OGD Commodity Mapping ---
const CROP_COMMODITY_MAP = {
  tomato: ["Tomato"],
  onion: ["Onion"],
  potato: ["Potato"],
  cotton: ["Cotton"],
  soybean: ["Soyabean"],
  soyabean: ["Soyabean"],
  rice: ["Rice", "Paddy(Dhan)(Common)"],
  wheat: ["Wheat"],
  sugarcane: ["Sugarcane"],
  maize: ["Maize"],
  groundnut: ["Groundnut"],
  gram: ["Bengal Gram(Gram)(Whole)"],
  bengalgram: ["Bengal Gram(Gram)(Whole)"],
  tur: ["Arhar (Tur/Red Gram)(Whole)"],
  arhar: ["Arhar (Tur/Red Gram)(Whole)"],
  chilli: ["Green Chilli"],
  cabbage: ["Cabbage"],
  cauliflower: ["Cauliflower"],
  okra: ["Bhindi(Ladies Finger)"],
  bhindi: ["Bhindi(Ladies Finger)"]
};

// --- Verified Coordinates of Maharashtra APMC Mandis & Regional Centers ---
const MANDI_COORDINATES = {
  // Mumbai Metropolitan Region
  "mumbai-onion & potato market": { lat: 19.0771, lon: 72.9986, name: "Mumbai (Vashi) APMC", district: "Mumbai/Thane", location: "Navi Mumbai, Maharashtra" },
  "mumbai (vashi) apmc": { lat: 19.0771, lon: 72.9986, name: "Mumbai (Vashi) APMC", district: "Mumbai", location: "Navi Mumbai, Maharashtra" },
  "vashi": { lat: 19.0771, lon: 72.9986, name: "Mumbai (Vashi) APMC", district: "Mumbai/Thane", location: "Navi Mumbai, Maharashtra" },
  "apmc mumbai": { lat: 19.0771, lon: 72.9986, name: "Mumbai (Vashi) APMC", district: "Mumbai", location: "Navi Mumbai, Maharashtra" },
  "apmc panvel": { lat: 18.9894, lon: 73.1175, name: "APMC Panvel", district: "Raigad", location: "Panvel, Raigad, Maharashtra" },
  "apmc alibagh": { lat: 18.6580, lon: 72.8770, name: "APMC Alibag", district: "Raigad", location: "Alibag, Raigad, Maharashtra" },
  "apmc alibag": { lat: 18.6580, lon: 72.8770, name: "APMC Alibag", district: "Raigad", location: "Alibag, Raigad, Maharashtra" },
  "apmc murud": { lat: 18.3280, lon: 72.9620, name: "APMC Murud", district: "Raigad", location: "Murud, Raigad, Maharashtra" },
  "apmc mangaon": { lat: 18.2530, lon: 73.2870, name: "APMC Mangaon", district: "Raigad", location: "Mangaon, Raigad, Maharashtra" },
  "apmc palghar": { lat: 19.6967, lon: 72.7699, name: "APMC Palghar", district: "Palghar", location: "Palghar, Maharashtra" },
  "thane": { lat: 19.2183, lon: 72.9781, name: "Thane APMC", district: "Thane", location: "Thane, Maharashtra" },

  // Pune Region
  "apmc pune": { lat: 18.4975, lon: 73.8647, name: "Pune (Gultekdi) APMC", district: "Pune", location: "Pune, Maharashtra" },
  "pune (gultekdi) apmc": { lat: 18.4975, lon: 73.8647, name: "Pune (Gultekdi) APMC", district: "Pune", location: "Pune, Maharashtra" },
  "pune(moshi)": { lat: 18.6728, lon: 73.8475, name: "Pune (Moshi) APMC", district: "Pune", location: "Moshi, Pune, Maharashtra" },
  "pune (moshi) apmc": { lat: 18.6728, lon: 73.8475, name: "Pune (Moshi) APMC", district: "Pune", location: "Moshi, Pune, Maharashtra" },
  "pune(khadiki)": { lat: 18.5630, lon: 73.8340, name: "Pune (Khadki) APMC", district: "Pune", location: "Pune, Maharashtra" },
  "apmc khed": { lat: 18.8570, lon: 73.9030, name: "APMC Khed (Rajgurunagar)", district: "Pune", location: "Pune District, Maharashtra" },
  "apmc khed (rajgurunagar)": { lat: 18.8570, lon: 73.9030, name: "APMC Khed (Rajgurunagar)", district: "Pune", location: "Pune District, Maharashtra" },
  "apmc junnar": { lat: 19.2081, lon: 73.8763, name: "APMC Junnar", district: "Pune", location: "Pune District, Maharashtra" },
  "narayangaon": { lat: 19.1232, lon: 73.9782, name: "APMC Narayangaon", district: "Pune", location: "Pune District, Maharashtra" },
  "apmc narayangaon": { lat: 19.1232, lon: 73.9782, name: "APMC Narayangaon", district: "Pune", location: "Pune District, Maharashtra" },
  "apmc manchar": { lat: 19.0064, lon: 73.9431, name: "APMC Manchar", district: "Pune", location: "Pune District, Maharashtra" },
  "apmc baramati": { lat: 18.1517, lon: 74.5772, name: "APMC Baramati", district: "Pune", location: "Baramati, Pune, Maharashtra" },
  "apmc shirur": { lat: 18.8270, lon: 74.3790, name: "APMC Shirur", district: "Pune", location: "Shirur, Pune, Maharashtra" },

  // Nashik Region
  "lasalgaon": { lat: 20.1472, lon: 74.2267, name: "Lasalgaon APMC", district: "Nashik", location: "Lasalgaon, Nashik, Maharashtra" },
  "lasalgaon apmc": { lat: 20.1472, lon: 74.2267, name: "Lasalgaon APMC", district: "Nashik", location: "Lasalgaon, Nashik, Maharashtra" },
  "lasalgaon(vinchur)": { lat: 20.1472, lon: 74.2267, name: "Lasalgaon (Vinchur) APMC", district: "Nashik", location: "Lasalgaon, Nashik, Maharashtra" },
  "pimpalgaon baswant(saykheda)": { lat: 20.1704, lon: 73.9858, name: "Pimpalgaon Baswant APMC", district: "Nashik", location: "Pimpalgaon, Nashik, Maharashtra" },
  "pimpalgaon baswant apmc": { lat: 20.1704, lon: 73.9858, name: "Pimpalgaon Baswant APMC", district: "Nashik", location: "Pimpalgaon, Nashik, Maharashtra" },
  "apmc yeola": { lat: 20.0422, lon: 74.4883, name: "APMC Yeola", district: "Nashik", location: "Yeola, Nashik, Maharashtra" },
  "apmc nashik": { lat: 19.9975, lon: 73.7898, name: "APMC Nashik", district: "Nashik", location: "Nashik, Maharashtra" },
  "apmc sinner": { lat: 19.8510, lon: 73.9960, name: "APMC Sinnar", district: "Nashik", location: "Sinnar, Nashik, Maharashtra" },
  "apmc nandgaon": { lat: 20.3128, lon: 74.6582, name: "APMC Nandgaon", district: "Nashik", location: "Nandgaon, Nashik, Maharashtra" },
  "apmc manmad": { lat: 20.2524, lon: 74.4373, name: "APMC Manmad", district: "Nashik", location: "Manmad, Nashik, Maharashtra" },
  "apmc malegaon": { lat: 20.5539, lon: 74.5298, name: "APMC Malegaon", district: "Nashik", location: "Malegaon, Nashik, Maharashtra" },
  "apmc kalwan": { lat: 20.4851, lon: 73.9682, name: "APMC Kalwan", district: "Nashik", location: "Kalwan, Nashik, Maharashtra" },
  "apmc dindori": { lat: 20.2033, lon: 73.8344, name: "APMC Dindori", district: "Nashik", location: "Dindori, Nashik, Maharashtra" },

  // Ahilyanagar (Ahmednagar) Region
  "apmc sangamner": { lat: 19.5761, lon: 74.2096, name: "APMC Sangamner", district: "Ahilyanagar", location: "Sangamner, Maharashtra" },
  "apmc kopargaon": { lat: 19.8910, lon: 74.4840, name: "APMC Kopargaon", district: "Ahilyanagar", location: "Kopargaon, Maharashtra" },
  "apmc shrirampur": { lat: 19.6190, lon: 74.6600, name: "APMC Shrirampur", district: "Ahilyanagar", location: "Shrirampur, Maharashtra" },
  "apmc rahata": { lat: 19.6890, lon: 74.4890, name: "APMC Rahata", district: "Ahilyanagar", location: "Rahata, Maharashtra" },
  "apmc ahilyanagar": { lat: 19.0952, lon: 74.7496, name: "Ahmednagar APMC", district: "Ahilyanagar", location: "Ahmednagar, Maharashtra" },
  "ahmednagar apmc": { lat: 19.0952, lon: 74.7496, name: "Ahmednagar APMC", district: "Ahilyanagar", location: "Ahmednagar, Maharashtra" },
  "apmc jamkhed": { lat: 18.7250, lon: 75.3190, name: "APMC Jamkhed", district: "Ahilyanagar", location: "Jamkhed, Maharashtra" },
  "apmc karjat": { lat: 18.9100, lon: 75.0000, name: "APMC Karjat", district: "Ahilyanagar", location: "Karjat, Ahilyanagar, Maharashtra" },

  // Chhatrapati Sambhajinagar (Aurangabad) & Marathwada
  "apmc vaijpur": { lat: 19.9270, lon: 74.7310, name: "APMC Vaijpur", district: "Chhatrapati Sambhajinagar", location: "Vaijpur, Maharashtra" },
  "apmc gangapur": { lat: 19.6990, lon: 75.0110, name: "APMC Gangapur", district: "Chhatrapati Sambhajinagar", location: "Gangapur, Maharashtra" },
  "apmc chattrapati sambhajinagar": { lat: 19.8762, lon: 75.3433, name: "Chh. Sambhajinagar APMC", district: "Chhatrapati Sambhajinagar", location: "Chh. Sambhajinagar, Maharashtra" },
  "apmc sillod": { lat: 20.3040, lon: 75.6510, name: "APMC Sillod", district: "Chhatrapati Sambhajinagar", location: "Sillod, Maharashtra" },
  "apmc jalna": { lat: 19.8347, lon: 75.8816, name: "APMC Jalna", district: "Jalna", location: "Jalna, Maharashtra" },
  "apmc beed": { lat: 18.9891, lon: 75.7601, name: "APMC Beed", district: "Beed", location: "Beed, Maharashtra" },
  "apmc latur": { lat: 18.4088, lon: 76.5604, name: "APMC Latur", district: "Latur", location: "Latur, Maharashtra" },
  "apmc nanded": { lat: 19.1383, lon: 77.3210, name: "APMC Nanded", district: "Nanded", location: "Nanded, Maharashtra" },
  "apmc parbhani": { lat: 19.2644, lon: 76.7749, name: "APMC Parbhani", district: "Parbhani", location: "Parbhani, Maharashtra" },
  "apmc hingoli": { lat: 19.7188, lon: 77.1472, name: "APMC Hingoli", district: "Hingoli", location: "Hingoli, Maharashtra" },
  "apmc dharashiv": { lat: 18.1850, lon: 76.0420, name: "APMC Dharashiv", district: "Dharashiv", location: "Dharashiv, Maharashtra" },

  // Western & Southern Maharashtra
  "apmc vaduj": { lat: 17.5960, lon: 74.4440, name: "APMC Vaduj", district: "Satara", location: "Vaduj, Satara, Maharashtra" },
  "apmc satara": { lat: 17.6805, lon: 73.9935, name: "APMC Satara", district: "Satara", location: "Satara, Maharashtra" },
  "apmc karad": { lat: 17.2885, lon: 74.1843, name: "APMC Karad", district: "Satara", location: "Karad, Satara, Maharashtra" },
  "apmc kolhapur": { lat: 16.7050, lon: 74.2433, name: "APMC Kolhapur", district: "Kolhapur", location: "Kolhapur, Maharashtra" },
  "apmc sangli": { lat: 16.8524, lon: 74.5815, name: "APMC Sangli", district: "Sangli", location: "Sangli, Maharashtra" },
  "apmc solapur": { lat: 17.6599, lon: 75.9064, name: "APMC Solapur", district: "Solapur", location: "Solapur, Maharashtra" },

  // Khandesh & Northern Maharashtra
  "apmc jalgaon": { lat: 21.0077, lon: 75.5626, name: "APMC Jalgaon", district: "Jalgaon", location: "Jalgaon, Maharashtra" },
  "apmc bhusaval": { lat: 21.0470, lon: 75.7920, name: "APMC Bhusawal", district: "Jalgaon", location: "Bhusawal, Jalgaon, Maharashtra" },
  "apmc dhule": { lat: 20.9042, lon: 74.7749, name: "APMC Dhule", district: "Dhule", location: "Dhule, Maharashtra" },
  "apmc nandurbar": { lat: 21.3704, lon: 74.2403, name: "APMC Nandurbar", district: "Nandurbar", location: "Nandurbar, Maharashtra" },

  // Vidarbha
  "apmc nagpur": { lat: 21.1458, lon: 79.0882, name: "APMC Nagpur", district: "Nagpur", location: "Nagpur, Maharashtra" },
  "apmc amarawati": { lat: 20.9320, lon: 77.7523, name: "APMC Amravati", district: "Amravati", location: "Amravati, Maharashtra" },
  "apmc amravati": { lat: 20.9320, lon: 77.7523, name: "APMC Amravati", district: "Amravati", location: "Amravati, Maharashtra" },
  "apmc akola": { lat: 20.7002, lon: 77.0082, name: "APMC Akola", district: "Akola", location: "Akola, Maharashtra" },
  "apmc washim": { lat: 20.1112, lon: 77.1345, name: "APMC Washim", district: "Washim", location: "Washim, Maharashtra" },
  "apmc yavatmal": { lat: 20.3888, lon: 78.1204, name: "APMC Yavatmal", district: "Yavatmal", location: "Yavatmal, Maharashtra" },
  "apmc wardha": { lat: 20.7453, lon: 78.6022, name: "APMC Wardha", district: "Wardha", location: "Wardha, Maharashtra" },
  "apmc chandrapur": { lat: 19.9615, lon: 79.2961, name: "APMC Chandrapur", district: "Chandrapur", location: "Chandrapur, Maharashtra" },
  "apmc bhandara": { lat: 21.1667, lon: 79.6500, name: "APMC Bhandara", district: "Bhandara", location: "Bhandara, Maharashtra" },
  "apmc gondia": { lat: 21.4554, lon: 80.1961, name: "APMC Gondia", district: "Gondia", location: "Gondia, Maharashtra" }
};

// District level coordinates fallback
const DISTRICT_COORDINATES = {
  mumbai: { lat: 19.0760, lon: 72.8777 },
  thane: { lat: 19.2183, lon: 72.9781 },
  raigad: { lat: 18.5158, lon: 73.1822 },
  palghar: { lat: 19.6967, lon: 72.7699 },
  pune: { lat: 18.5204, lon: 73.8567 },
  nashik: { lat: 19.9975, lon: 73.7898 },
  ahilyanagar: { lat: 19.0952, lon: 74.7496 },
  ahmednagar: { lat: 19.0952, lon: 74.7496 },
  satara: { lat: 17.6805, lon: 73.9935 },
  solapur: { lat: 17.6599, lon: 75.9064 },
  kolhapur: { lat: 16.7050, lon: 74.2433 },
  sangli: { lat: 16.8524, lon: 74.5815 },
  "chhatrapati sambhajinagar": { lat: 19.8762, lon: 75.3433 },
  "chattrapati sambhajinagar": { lat: 19.8762, lon: 75.3433 },
  aurangabad: { lat: 19.8762, lon: 75.3433 },
  jalna: { lat: 19.8347, lon: 75.8816 },
  beed: { lat: 18.9891, lon: 75.7601 },
  latur: { lat: 18.4088, lon: 76.5604 },
  dharashiv: { lat: 18.1850, lon: 76.0420 },
  nanded: { lat: 19.1383, lon: 77.3210 },
  parbhani: { lat: 19.2644, lon: 76.7749 },
  hingoli: { lat: 19.7188, lon: 77.1472 },
  jalgaon: { lat: 21.0077, lon: 75.5626 },
  dhule: { lat: 20.9042, lon: 74.7749 },
  nandurbar: { lat: 21.3704, lon: 74.2403 },
  akola: { lat: 20.7002, lon: 77.0082 },
  washim: { lat: 20.1112, lon: 77.1345 },
  amravati: { lat: 20.9320, lon: 77.7523 },
  yavatmal: { lat: 20.3888, lon: 78.1204 },
  wardha: { lat: 20.7453, lon: 78.6022 },
  nagpur: { lat: 21.1458, lon: 79.0882 },
  bhandara: { lat: 21.1667, lon: 79.6500 },
  gondia: { lat: 21.4554, lon: 80.1961 },
  chandrapur: { lat: 19.9615, lon: 79.2961 }
};

module.exports = {
  ROAD_WINDING_FACTOR,
  GOODS_VEHICLE_SPEED_KMH,
  TRANSPORT_RATE_PER_KM,
  CROP_COMMODITY_MAP,
  MANDI_COORDINATES,
  DISTRICT_COORDINATES
};

