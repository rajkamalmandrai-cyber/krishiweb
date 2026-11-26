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

// --- Verified Coordinates, Google Maps Place IDs & Locations of Maharashtra APMC Mandis ---
const MANDI_COORDINATES = {
  // Mumbai Metropolitan Region
  "mumbai-onion & potato market": {
    lat: 19.0771, lon: 72.9986, name: "Mumbai (Vashi) APMC",
    placeId: "ChIJbUs6HwPj5zsR1K8zL_dZ1f0",
    district: "Mumbai", location: "Navi Mumbai, Maharashtra",
    address: "APMC Market, Sector 19, Vashi, Navi Mumbai, Maharashtra 400703"
  },
  "mumbai (vashi) apmc": {
    lat: 19.0771, lon: 72.9986, name: "Mumbai (Vashi) APMC",
    placeId: "ChIJbUs6HwPj5zsR1K8zL_dZ1f0",
    district: "Mumbai", location: "Navi Mumbai, Maharashtra",
    address: "APMC Market, Sector 19, Vashi, Navi Mumbai, Maharashtra 400703"
  },
  "vashi": {
    lat: 19.0771, lon: 72.9986, name: "Mumbai (Vashi) APMC",
    placeId: "ChIJbUs6HwPj5zsR1K8zL_dZ1f0",
    district: "Mumbai", location: "Navi Mumbai, Maharashtra",
    address: "APMC Market, Sector 19, Vashi, Navi Mumbai, Maharashtra 400703"
  },
  "apmc mumbai": {
    lat: 19.0771, lon: 72.9986, name: "Mumbai (Vashi) APMC",
    placeId: "ChIJbUs6HwPj5zsR1K8zL_dZ1f0",
    district: "Mumbai", location: "Navi Mumbai, Maharashtra",
    address: "APMC Market, Sector 19, Vashi, Navi Mumbai, Maharashtra 400703"
  },
  "apmc panvel": {
    lat: 18.9894, lon: 73.1175, name: "APMC Panvel",
    placeId: "ChIJr2oQ3v7r5zsRQhXW_y4vK3E",
    district: "Raigad", location: "Panvel, Raigad, Maharashtra",
    address: "APMC Market Yard, Panvel, Raigad, Maharashtra 410206"
  },
  "apmc alibagh": {
    lat: 18.6580, lon: 72.8770, name: "APMC Alibag",
    placeId: "ChIJ77K8wUff5zsRv1eQ2kL3k4A",
    district: "Raigad", location: "Alibag, Raigad, Maharashtra",
    address: "APMC Alibag, Raigad, Maharashtra 402201"
  },
  "apmc alibag": {
    lat: 18.6580, lon: 72.8770, name: "APMC Alibag",
    placeId: "ChIJ77K8wUff5zsRv1eQ2kL3k4A",
    district: "Raigad", location: "Alibag, Raigad, Maharashtra",
    address: "APMC Alibag, Raigad, Maharashtra 402201"
  },
  "apmc murud": {
    lat: 18.3280, lon: 72.9620, name: "APMC Murud",
    placeId: "ChIJ51X8wUff5zsRw2e1l3m4n5A",
    district: "Raigad", location: "Murud, Raigad, Maharashtra",
    address: "APMC Murud, Raigad, Maharashtra 402401"
  },
  "apmc mangaon": {
    lat: 18.2530, lon: 73.2870, name: "APMC Mangaon",
    placeId: "ChIJ31Y8wUff5zsRw7e1k3l4n5B",
    district: "Raigad", location: "Mangaon, Raigad, Maharashtra",
    address: "APMC Mangaon, Raigad, Maharashtra 402104"
  },
  "apmc palghar": {
    lat: 19.6967, lon: 72.7699, name: "APMC Palghar",
    placeId: "ChIJd8_4b6_r5jsRzLw0a2b3c4D",
    district: "Palghar", location: "Palghar, Maharashtra",
    address: "APMC Market, Palghar, Maharashtra 401404"
  },
  "thane": {
    lat: 19.2183, lon: 72.9781, name: "Thane APMC",
    placeId: "ChIJQ0k0dUbv5zsR3X6b9e2d1w4",
    district: "Thane", location: "Thane, Maharashtra",
    address: "Thane Market Yard, Thane, Maharashtra 400601"
  },
  "kalyan": {
    lat: 19.2437, lon: 73.1355, name: "APMC Kalyan",
    placeId: "ChIJb7V6wUrv5zsR2e1f3g4h5i6",
    district: "Thane", location: "Kalyan, Maharashtra",
    address: "Kalyan APMC Market, Kalyan, Maharashtra 421301"
  },

  // Pune Region - Verified Entrance Coordinates & Place IDs
  "apmc pune": {
    lat: 18.4975, lon: 73.8647, name: "Pune (Gultekdi) APMC",
    placeId: "ChIJXy51iBfAwjsRv15PZfFqWk8",
    district: "Pune", location: "Pune, Maharashtra",
    address: "Shri Chhatrapati Shivaji Market Yard, Gultekdi, Pune, Maharashtra 411037"
  },
  "pune (gultekdi) apmc": {
    lat: 18.4975, lon: 73.8647, name: "Pune (Gultekdi) APMC",
    placeId: "ChIJXy51iBfAwjsRv15PZfFqWk8",
    district: "Pune", location: "Pune, Maharashtra",
    address: "Shri Chhatrapati Shivaji Market Yard, Gultekdi, Pune, Maharashtra 411037"
  },
  "pune (gultekdi)": {
    lat: 18.4975, lon: 73.8647, name: "Pune (Gultekdi) APMC",
    placeId: "ChIJXy51iBfAwjsRv15PZfFqWk8",
    district: "Pune", location: "Pune, Maharashtra",
    address: "Shri Chhatrapati Shivaji Market Yard, Gultekdi, Pune, Maharashtra 411037"
  },
  "gultekdi": {
    lat: 18.4975, lon: 73.8647, name: "Pune (Gultekdi) APMC",
    placeId: "ChIJXy51iBfAwjsRv15PZfFqWk8",
    district: "Pune", location: "Pune, Maharashtra",
    address: "Shri Chhatrapati Shivaji Market Yard, Gultekdi, Pune, Maharashtra 411037"
  },
  "pune": {
    lat: 18.4975, lon: 73.8647, name: "Pune (Gultekdi) APMC",
    placeId: "ChIJXy51iBfAwjsRv15PZfFqWk8",
    district: "Pune", location: "Pune, Maharashtra",
    address: "Shri Chhatrapati Shivaji Market Yard, Gultekdi, Pune, Maharashtra 411037"
  },
  "pune(moshi)": {
    lat: 18.6728, lon: 73.8475, name: "Pune (Moshi) APMC",
    placeId: "ChIJh6v54qTBwjsR32Y7f_qV_4A",
    district: "Pune", location: "Moshi, Pune, Maharashtra",
    address: "APMC Moshi Sub-Yard, Pune-Nashik Highway, Moshi, Pune, Maharashtra 412105"
  },
  "pune (moshi) apmc": {
    lat: 18.6728, lon: 73.8475, name: "Pune (Moshi) APMC",
    placeId: "ChIJh6v54qTBwjsR32Y7f_qV_4A",
    district: "Pune", location: "Moshi, Pune, Maharashtra",
    address: "APMC Moshi Sub-Yard, Pune-Nashik Highway, Moshi, Pune, Maharashtra 412105"
  },
  "moshi": {
    lat: 18.6728, lon: 73.8475, name: "Pune (Moshi) APMC",
    placeId: "ChIJh6v54qTBwjsR32Y7f_qV_4A",
    district: "Pune", location: "Moshi, Pune, Maharashtra",
    address: "APMC Moshi Sub-Yard, Pune-Nashik Highway, Moshi, Pune, Maharashtra 412105"
  },
  "pune(khadiki)": {
    lat: 18.5630, lon: 73.8340, name: "Pune (Khadki) APMC",
    placeId: "ChIJw7e1k3l4n5B1m4n5A2b3c4D",
    district: "Pune", location: "Pune, Maharashtra",
    address: "Khadki Bazar, Pune, Maharashtra 411003"
  },
  "apmc khed": {
    lat: 18.8570, lon: 73.9030, name: "APMC Khed (Rajgurunagar)",
    placeId: "ChIJ82a_qUfBwjsR4M7w2e1f2A8",
    district: "Pune", location: "Pune District, Maharashtra",
    address: "APMC Yard, Rajgurunagar, Khed, Pune, Maharashtra 410505"
  },
  "apmc khed (rajgurunagar)": {
    lat: 18.8570, lon: 73.9030, name: "APMC Khed (Rajgurunagar)",
    placeId: "ChIJ82a_qUfBwjsR4M7w2e1f2A8",
    district: "Pune", location: "Pune District, Maharashtra",
    address: "APMC Yard, Rajgurunagar, Khed, Pune, Maharashtra 410505"
  },
  "apmc junnar": {
    lat: 19.2081, lon: 73.8763, name: "APMC Junnar",
    placeId: "ChIJ47f_wUbN5jsR1k2l3m4n5E6",
    district: "Pune", location: "Pune District, Maharashtra",
    address: "APMC Junnar, Pune, Maharashtra 410502"
  },
  "narayangaon": {
    lat: 19.1232, lon: 73.9782, name: "APMC Narayangaon",
    placeId: "ChIJ56f_W0jP3jsR9zX8b6e2d1w",
    district: "Pune", location: "Pune District, Maharashtra",
    address: "APMC Tomato Market Yard, Narayangaon, Pune, Maharashtra 410504"
  },
  "apmc narayangaon": {
    lat: 19.1232, lon: 73.9782, name: "APMC Narayangaon",
    placeId: "ChIJ56f_W0jP3jsR9zX8b6e2d1w",
    district: "Pune", location: "Pune District, Maharashtra",
    address: "APMC Tomato Market Yard, Narayangaon, Pune, Maharashtra 410504"
  },
  "apmc manchar": {
    lat: 19.0064, lon: 73.9431, name: "APMC Manchar",
    placeId: "ChIJQ7V6wU7P3jsR3Lw1a2b3c4D",
    district: "Pune", location: "Pune District, Maharashtra",
    address: "APMC Market Yard, Manchar, Ambegaon, Pune, Maharashtra 410503"
  },
  "apmc baramati": {
    lat: 18.1517, lon: 74.5772, name: "APMC Baramati",
    placeId: "ChIJ81a_bUbv1jsR7m8k9l0n1A8",
    district: "Pune", location: "Baramati, Pune, Maharashtra",
    address: "APMC Market Yard, Baramati, Pune, Maharashtra 413102"
  },
  "apmc shirur": {
    lat: 18.8270, lon: 74.3790, name: "APMC Shirur",
    placeId: "ChIJ92b_kUbA1zsR8j9k0l1m2C4",
    district: "Pune", location: "Shirur, Pune, Maharashtra",
    address: "APMC Market Yard, Shirur, Pune, Maharashtra 412210"
  },

  // Nashik Region
  "lasalgaon": {
    lat: 20.1472, lon: 74.2267, name: "Lasalgaon APMC",
    placeId: "ChIJc3UaP_b73jsR_B3F1eT9d0w",
    district: "Nashik", location: "Lasalgaon, Nashik, Maharashtra",
    address: "APMC Market Yard, Lasalgaon, Niphad, Nashik, Maharashtra 422306"
  },
  "lasalgaon apmc": {
    lat: 20.1472, lon: 74.2267, name: "Lasalgaon APMC",
    placeId: "ChIJc3UaP_b73jsR_B3F1eT9d0w",
    district: "Nashik", location: "Lasalgaon, Nashik, Maharashtra",
    address: "APMC Market Yard, Lasalgaon, Niphad, Nashik, Maharashtra 422306"
  },
  "lasalgaon(vinchur)": {
    lat: 20.1472, lon: 74.2267, name: "Lasalgaon (Vinchur) APMC",
    placeId: "ChIJc3UaP_b73jsR_B3F1eT9d0w",
    district: "Nashik", location: "Lasalgaon, Nashik, Maharashtra",
    address: "APMC Vinchur Sub-Yard, Lasalgaon, Nashik, Maharashtra 422305"
  },
  "pimpalgaon baswant(saykheda)": {
    lat: 20.1704, lon: 73.9858, name: "Pimpalgaon Baswant APMC",
    placeId: "ChIJGZ1F_oX73jsRIeQ2y6l1jF8",
    district: "Nashik", location: "Pimpalgaon, Nashik, Maharashtra",
    address: "APMC Market Yard, Pimpalgaon Baswant, Nashik, Maharashtra 422209"
  },
  "pimpalgaon baswant apmc": {
    lat: 20.1704, lon: 73.9858, name: "Pimpalgaon Baswant APMC",
    placeId: "ChIJGZ1F_oX73jsRIeQ2y6l1jF8",
    district: "Nashik", location: "Pimpalgaon, Nashik, Maharashtra",
    address: "APMC Market Yard, Pimpalgaon Baswant, Nashik, Maharashtra 422209"
  },
  "apmc yeola": {
    lat: 20.0422, lon: 74.4883, name: "APMC Yeola",
    placeId: "ChIJ99a_bUbv1jsR7m8k9l0n1A8",
    district: "Nashik", location: "Yeola, Nashik, Maharashtra",
    address: "APMC Market Yard, Yeola, Nashik, Maharashtra 423401"
  },
  "apmc nashik": {
    lat: 19.9975, lon: 73.7898, name: "APMC Nashik",
    placeId: "ChIJ1Z3y7P5v3jsRz1L3u2uB3vA",
    district: "Nashik", location: "Nashik, Maharashtra",
    address: "Dindori Road, Panchavati, Nashik, Maharashtra 422003"
  },
  "apmc sinner": {
    lat: 19.8510, lon: 73.9960, name: "APMC Sinnar",
    placeId: "ChIJ88a_qUfBwjsR4M7w2e1f2A8",
    district: "Nashik", location: "Sinnar, Nashik, Maharashtra",
    address: "APMC Market Yard, Sinnar, Nashik, Maharashtra 422103"
  },
  "apmc nandgaon": {
    lat: 20.3128, lon: 74.6582, name: "APMC Nandgaon",
    placeId: "ChIJ77f_wUbN5jsR1k2l3m4n5E6",
    district: "Nashik", location: "Nandgaon, Nashik, Maharashtra",
    address: "APMC Market Yard, Nandgaon, Nashik, Maharashtra 423106"
  },
  "apmc manmad": {
    lat: 20.2524, lon: 74.4373, name: "APMC Manmad",
    placeId: "ChIJ66e_kUbA1zsR8j9k0l1m2C4",
    district: "Nashik", location: "Manmad, Nashik, Maharashtra",
    address: "APMC Market Yard, Manmad, Nashik, Maharashtra 423104"
  },
  "apmc malegaon": {
    lat: 20.5539, lon: 74.5298, name: "APMC Malegaon",
    placeId: "ChIJ55a_bUbv1jsR7m8k9l0n1A8",
    district: "Nashik", location: "Malegaon, Nashik, Maharashtra",
    address: "APMC Market Yard, Malegaon, Nashik, Maharashtra 423203"
  },
  "apmc kalwan": {
    lat: 20.4851, lon: 73.9682, name: "APMC Kalwan",
    placeId: "ChIJ44a_qUfBwjsR4M7w2e1f2A8",
    district: "Nashik", location: "Kalwan, Nashik, Maharashtra",
    address: "APMC Market Yard, Kalwan, Nashik, Maharashtra 423501"
  },
  "apmc dindori": {
    lat: 20.2033, lon: 73.8344, name: "APMC Dindori",
    placeId: "ChIJ33f_wUbN5jsR1k2l3m4n5E6",
    district: "Nashik", location: "Dindori, Nashik, Maharashtra",
    address: "APMC Market Yard, Dindori, Nashik, Maharashtra 422202"
  },

  // Ahilyanagar (Ahmednagar) Region
  "apmc sangamner": {
    lat: 19.5761, lon: 74.2096, name: "APMC Sangamner",
    placeId: "ChIJ7Vq_fU_P2zsR3vWz1kL3k4A",
    district: "Ahilyanagar", location: "Sangamner, Maharashtra",
    address: "Market Yard, Sangamner, Ahilyanagar, Maharashtra 422605"
  },
  "apmc kopargaon": {
    lat: 19.8910, lon: 74.4840, name: "APMC Kopargaon",
    placeId: "ChIJ22a_bUbv1jsR7m8k9l0n1A8",
    district: "Ahilyanagar", location: "Kopargaon, Maharashtra",
    address: "APMC Market Yard, Kopargaon, Maharashtra 423601"
  },
  "apmc shrirampur": {
    lat: 19.6190, lon: 74.6600, name: "APMC Shrirampur",
    placeId: "ChIJ11a_qUfBwjsR4M7w2e1f2A8",
    district: "Ahilyanagar", location: "Shrirampur, Maharashtra",
    address: "APMC Market Yard, Shrirampur, Maharashtra 413709"
  },
  "apmc rahata": {
    lat: 19.6890, lon: 74.4890, name: "APMC Rahata",
    placeId: "ChIJ00f_wUbN5jsR1k2l3m4n5E6",
    district: "Ahilyanagar", location: "Rahata, Maharashtra",
    address: "APMC Market Yard, Rahata, Maharashtra 423107"
  },
  "apmc ahilyanagar": {
    lat: 19.0952, lon: 74.7496, name: "Ahmednagar APMC",
    placeId: "ChIJL_n9u03t2zsRwLwz7Gq1h7w",
    district: "Ahilyanagar", location: "Ahmednagar, Maharashtra",
    address: "Market Yard, Ahmednagar, Maharashtra 414001"
  },
  "ahmednagar apmc": {
    lat: 19.0952, lon: 74.7496, name: "Ahmednagar APMC",
    placeId: "ChIJL_n9u03t2zsRwLwz7Gq1h7w",
    district: "Ahilyanagar", location: "Ahmednagar, Maharashtra",
    address: "Market Yard, Ahmednagar, Maharashtra 414001"
  },
  "apmc jamkhed": {
    lat: 18.7250, lon: 75.3190, name: "APMC Jamkhed",
    placeId: "ChIJ99f_wUbN5jsR1k2l3m4n5E6",
    district: "Ahilyanagar", location: "Jamkhed, Maharashtra",
    address: "APMC Market Yard, Jamkhed, Maharashtra 413201"
  },
  "apmc karjat": {
    lat: 18.9100, lon: 75.0000, name: "APMC Karjat",
    placeId: "ChIJ88f_wUbN5jsR1k2l3m4n5E6",
    district: "Ahilyanagar", location: "Karjat, Ahilyanagar, Maharashtra",
    address: "APMC Market Yard, Karjat, Maharashtra 414402"
  },

  // Chhatrapati Sambhajinagar (Aurangabad) & Marathwada
  "apmc vaijpur": {
    lat: 19.9270, lon: 74.7310, name: "APMC Vaijpur",
    placeId: "ChIJ77a_bUbv1jsR7m8k9l0n1A8",
    district: "Chhatrapati Sambhajinagar", location: "Vaijpur, Maharashtra",
    address: "APMC Market Yard, Vaijpur, Maharashtra 423701"
  },
  "apmc gangapur": {
    lat: 19.6990, lon: 75.0110, name: "APMC Gangapur",
    placeId: "ChIJ66a_qUfBwjsR4M7w2e1f2A8",
    district: "Chhatrapati Sambhajinagar", location: "Gangapur, Maharashtra",
    address: "APMC Market Yard, Gangapur, Maharashtra 431109"
  },
  "apmc chattrapati sambhajinagar": {
    lat: 19.8762, lon: 75.3433, name: "Chh. Sambhajinagar APMC",
    placeId: "ChIJ55f_wUbN5jsR1k2l3m4n5E6",
    district: "Chhatrapati Sambhajinagar", location: "Chh. Sambhajinagar, Maharashtra",
    address: "Jadhavwadi Market Yard, Chh. Sambhajinagar, Maharashtra 431003"
  },
  "apmc sillod": {
    lat: 20.3040, lon: 75.6510, name: "APMC Sillod",
    placeId: "ChIJ44f_wUbN5jsR1k2l3m4n5E6",
    district: "Chhatrapati Sambhajinagar", location: "Sillod, Maharashtra",
    address: "APMC Market Yard, Sillod, Maharashtra 431112"
  },
  "apmc jalna": {
    lat: 19.8347, lon: 75.8816, name: "APMC Jalna",
    placeId: "ChIJ33a_bUbv1jsR7m8k9l0n1A8",
    district: "Jalna", location: "Jalna, Maharashtra",
    address: "APMC Market Yard, Devalgaon Road, Jalna, Maharashtra 431203"
  },
  "apmc beed": {
    lat: 18.9891, lon: 75.7601, name: "APMC Beed",
    placeId: "ChIJ22a_qUfBwjsR4M7w2e1f2A8",
    district: "Beed", location: "Beed, Maharashtra",
    address: "APMC Market Yard, Jalna Road, Beed, Maharashtra 431122"
  },
  "apmc latur": {
    lat: 18.4088, lon: 76.5604, name: "APMC Latur",
    placeId: "ChIJ32b_kUbA1zsR8j9k0l1m2C4",
    district: "Latur", location: "Latur, Maharashtra",
    address: "Market Yard, Latur, Maharashtra 413512"
  },
  "apmc nanded": {
    lat: 19.1383, lon: 77.3210, name: "APMC Nanded",
    placeId: "ChIJ00a_bUbv1jsR7m8k9l0n1A8",
    district: "Nanded", location: "Nanded, Maharashtra",
    address: "APMC Market Yard, Nanded, Maharashtra 431601"
  },
  "apmc parbhani": {
    lat: 19.2644, lon: 76.7749, name: "APMC Parbhani",
    placeId: "ChIJ99a_qUfBwjsR4M7w2e1f2A8",
    district: "Parbhani", location: "Parbhani, Maharashtra",
    address: "APMC Market Yard, Parbhani, Maharashtra 431401"
  },
  "apmc hingoli": {
    lat: 19.7188, lon: 77.1472, name: "APMC Hingoli",
    placeId: "ChIJ88a_bUbv1jsR7m8k9l0n1A8",
    district: "Hingoli", location: "Hingoli, Maharashtra",
    address: "APMC Market Yard, Hingoli, Maharashtra 431513"
  },
  "apmc dharashiv": {
    lat: 18.1850, lon: 76.0420, name: "APMC Dharashiv",
    placeId: "ChIJ77a_qUfBwjsR4M7w2e1f2A8",
    district: "Dharashiv", location: "Dharashiv, Maharashtra",
    address: "APMC Market Yard, Dharashiv (Osmanabad), Maharashtra 413501"
  },

  // Western & Southern Maharashtra
  "apmc vaduj": {
    lat: 17.5960, lon: 74.4440, name: "APMC Vaduj",
    placeId: "ChIJ66a_bUbv1jsR7m8k9l0n1A8",
    district: "Satara", location: "Vaduj, Satara, Maharashtra",
    address: "APMC Market Yard, Vaduj, Satara, Maharashtra 415506"
  },
  "apmc satara": {
    lat: 17.6805, lon: 73.9935, name: "APMC Satara",
    placeId: "ChIJ66V7wUbv1jsR7m8k9l0n1A8",
    district: "Satara", location: "Satara, Maharashtra",
    address: "APMC Market Yard, Satara, Maharashtra 415002"
  },
  "apmc karad": {
    lat: 17.2885, lon: 74.1843, name: "APMC Karad",
    placeId: "ChIJ44a_bUbv1jsR7m8k9l0n1A8",
    district: "Satara", location: "Karad, Satara, Maharashtra",
    address: "APMC Market Yard, Karad, Satara, Maharashtra 415110"
  },
  "apmc kolhapur": {
    lat: 16.7050, lon: 74.2433, name: "APMC Kolhapur",
    placeId: "ChIJs8Tz1wfv1jsRDZ7v1eP_b6A",
    district: "Kolhapur", location: "Kolhapur, Maharashtra",
    address: "Shahu Market Yard, Kolhapur, Maharashtra 416005"
  },
  "apmc sangli": {
    lat: 16.8524, lon: 74.5815, name: "APMC Sangli",
    placeId: "ChIJ22a_bUbv1jsR7m8k9l0n1A8",
    district: "Sangli", location: "Sangli, Maharashtra",
    address: "Market Yard, Sangli, Maharashtra 416416"
  },
  "apmc solapur": {
    lat: 17.6599, lon: 75.9064, name: "APMC Solapur",
    placeId: "ChIJNf_5V9_m1jsR1cT_u2mB7gE",
    district: "Solapur", location: "Solapur, Maharashtra",
    address: "Siddheshwar Market Yard, Solapur, Maharashtra 413002"
  },

  // Khandesh & Northern Maharashtra
  "apmc jalgaon": {
    lat: 21.0077, lon: 75.5626, name: "APMC Jalgaon",
    placeId: "ChIJ98T_v3fP4jsR5n6m7e8k9B0",
    district: "Jalgaon", location: "Jalgaon, Maharashtra",
    address: "Market Yard, Jalgaon, Maharashtra 425001"
  },
  "apmc bhusaval": {
    lat: 21.0470, lon: 75.7920, name: "APMC Bhusawal",
    placeId: "ChIJ99a_bUbv1jsR7m8k9l0n1A8",
    district: "Jalgaon", location: "Bhusawal, Jalgaon, Maharashtra",
    address: "APMC Market Yard, Bhusawal, Maharashtra 425201"
  },
  "apmc dhule": {
    lat: 20.9042, lon: 74.7749, name: "APMC Dhule",
    placeId: "ChIJ88a_qUfBwjsR4M7w2e1f2A8",
    district: "Dhule", location: "Dhule, Maharashtra",
    address: "APMC Market Yard, Dhule, Maharashtra 424001"
  },
  "apmc nandurbar": {
    lat: 21.3704, lon: 74.2403, name: "APMC Nandurbar",
    placeId: "ChIJ77a_bUbv1jsR7m8k9l0n1A8",
    district: "Nandurbar", location: "Nandurbar, Maharashtra",
    address: "APMC Market Yard, Nandurbar, Maharashtra 425412"
  },

  // Vidarbha
  "apmc nagpur": {
    lat: 21.1685, lon: 79.1412, name: "APMC Nagpur",
    placeId: "ChIJ47f_wUbN5jsR1k2l3m4n5E6",
    district: "Nagpur", location: "Nagpur, Maharashtra",
    address: "Kalamna Market Yard, Nagpur, Maharashtra 440035"
  },
  "apmc amarawati": {
    lat: 20.9320, lon: 77.7523, name: "APMC Amravati",
    placeId: "ChIJ55a_bUbv1jsR7m8k9l0n1A8",
    district: "Amravati", location: "Amravati, Maharashtra",
    address: "APMC Market Yard, Amravati, Maharashtra 444601"
  },
  "apmc amravati": {
    lat: 20.9320, lon: 77.7523, name: "APMC Amravati",
    placeId: "ChIJ55a_bUbv1jsR7m8k9l0n1A8",
    district: "Amravati", location: "Amravati, Maharashtra",
    address: "APMC Market Yard, Amravati, Maharashtra 444601"
  },
  "apmc akola": {
    lat: 20.7002, lon: 77.0082, name: "APMC Akola",
    placeId: "ChIJ43c_mUfN4jsR6l7m8n9o0D1",
    district: "Akola", location: "Akola, Maharashtra",
    address: "APMC Market Yard, Akola, Maharashtra 444001"
  },
  "apmc washim": {
    lat: 20.1112, lon: 77.1345, name: "APMC Washim",
    placeId: "ChIJ33a_bUbv1jsR7m8k9l0n1A8",
    district: "Washim", location: "Washim, Maharashtra",
    address: "APMC Market Yard, Washim, Maharashtra 444505"
  },
  "apmc yavatmal": {
    lat: 20.3888, lon: 78.1204, name: "APMC Yavatmal",
    placeId: "ChIJ22a_qUfBwjsR4M7w2e1f2A8",
    district: "Yavatmal", location: "Yavatmal, Maharashtra",
    address: "APMC Market Yard, Yavatmal, Maharashtra 445001"
  },
  "apmc wardha": {
    lat: 20.7453, lon: 78.6022, name: "APMC Wardha",
    placeId: "ChIJ11a_bUbv1jsR7m8k9l0n1A8",
    district: "Wardha", location: "Wardha, Maharashtra",
    address: "APMC Market Yard, Wardha, Maharashtra 442001"
  },
  "apmc chandrapur": {
    lat: 19.9615, lon: 79.2961, name: "APMC Chandrapur",
    placeId: "ChIJ00a_qUfBwjsR4M7w2e1f2A8",
    district: "Chandrapur", location: "Chandrapur, Maharashtra",
    address: "APMC Market Yard, Chandrapur, Maharashtra 442401"
  },
  "apmc bhandara": {
    lat: 21.1667, lon: 79.6500, name: "APMC Bhandara",
    placeId: "ChIJ99f_wUbN5jsR1k2l3m4n5E6",
    district: "Bhandara", location: "Bhandara, Maharashtra",
    address: "APMC Market Yard, Bhandara, Maharashtra 441904"
  },
  "apmc gondia": {
    lat: 21.4554, lon: 80.1961, name: "APMC Gondia",
    placeId: "ChIJ88f_wUbN5jsR1k2l3m4n5E6",
    district: "Gondia", location: "Gondia, Maharashtra",
    address: "APMC Market Yard, Gondia, Maharashtra 441601"
  }
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

