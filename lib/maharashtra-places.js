/**
 * KRISHIWEB COMPREHENSIVE MAHARASHTRA SETTLEMENTS & ADMINISTRATIVE PLACES DATABASE
 * Verified coordinates, talukas, districts, and multilingual names across Maharashtra.
 * Used for fast, zero-external-dependency location search & typeahead autocomplete,
 * ensuring farmers in small villages can search without relying on public Nominatim.
 */

const MAHARASHTRA_PLACES = [
  // --- THANE & MUMBAI METROPOLITAN REGION ---
  {
    id: "maha-thane",
    name: "Thane",
    nameMr: "ठाणे",
    nameHi: "ठाणे",
    taluka: "Thane",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.2183,
    lon: 72.9781,
    type: "city"
  },
  {
    id: "maha-kalyan",
    name: "Kalyan",
    nameMr: "कल्याण",
    nameHi: "कल्याण",
    taluka: "Kalyan",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.2437,
    lon: 73.1355,
    type: "city"
  },
  {
    id: "maha-dombivli",
    name: "Dombivli",
    nameMr: "डोंबिवली",
    nameHi: "डोंबिवली",
    taluka: "Kalyan",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.2184,
    lon: 73.0867,
    type: "city"
  },
  {
    id: "maha-shahapur",
    name: "Shahapur",
    nameMr: "शहापूर",
    nameHi: "शहापुर",
    taluka: "Shahapur",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.4542,
    lon: 73.3308,
    type: "town"
  },
  {
    id: "maha-murbad",
    name: "Murbad",
    nameMr: "मुरबाड",
    nameHi: "मुरबाड",
    taluka: "Murbad",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.2530,
    lon: 73.3980,
    type: "town"
  },
  {
    id: "maha-bhiwandi",
    name: "Bhiwandi",
    nameMr: "भिवंडी",
    nameHi: "भिवंडी",
    taluka: "Bhiwandi",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.2967,
    lon: 73.0631,
    type: "city"
  },
  {
    id: "maha-ambernath",
    name: "Ambernath",
    nameMr: "अंबरनाथ",
    nameHi: "अंबरनाथ",
    taluka: "Ambernath",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.1970,
    lon: 73.1930,
    type: "city"
  },
  {
    id: "maha-ulhasnagar",
    name: "Ulhasnagar",
    nameMr: "उल्हासनगर",
    nameHi: "उल्हासनगर",
    taluka: "Ulhasnagar",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.2215,
    lon: 73.1645,
    type: "city"
  },
  {
    id: "maha-badlapur",
    name: "Badlapur",
    nameMr: "बदलापूर",
    nameHi: "बदलापुर",
    taluka: "Ambernath",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.1670,
    lon: 73.2670,
    type: "town"
  },
  {
    id: "maha-mumbai-vashi",
    name: "Navi Mumbai (Vashi)",
    nameMr: "नवी मुंबई (वाशी)",
    nameHi: "नवी मुंबई (वाशी)",
    taluka: "Thane",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.0771,
    lon: 72.9986,
    type: "city"
  },
  {
    id: "maha-mumbai",
    name: "Mumbai",
    nameMr: "मुंबई",
    nameHi: "मुंबई",
    taluka: "Mumbai",
    district: "Mumbai",
    state: "Maharashtra",
    lat: 19.0760,
    lon: 72.8777,
    type: "city"
  },

  // --- RAIGAD DISTRICT ---
  {
    id: "maha-panvel",
    name: "Panvel",
    nameMr: "पनवेल",
    nameHi: "पनवेल",
    taluka: "Panvel",
    district: "Raigad",
    state: "Maharashtra",
    lat: 18.9894,
    lon: 73.1175,
    type: "city"
  },
  {
    id: "maha-alibag",
    name: "Alibag",
    nameMr: "अलिबाग",
    nameHi: "अलीबाग",
    taluka: "Alibag",
    district: "Raigad",
    state: "Maharashtra",
    lat: 18.6580,
    lon: 72.8770,
    type: "town"
  },
  {
    // Disambiguated Karjat 1
    id: "maha-karjat-raigad",
    name: "Karjat",
    nameMr: "कर्जत (रायगड)",
    nameHi: "कर्जत (रायगढ़)",
    taluka: "Karjat",
    district: "Raigad",
    state: "Maharashtra",
    lat: 18.9100,
    lon: 73.3280,
    type: "town",
    disambiguation: "Raigad District (Near Mumbai/Pune expressway)"
  },
  {
    id: "maha-pen",
    name: "Pen",
    nameMr: "पेण",
    nameHi: "पेण",
    taluka: "Pen",
    district: "Raigad",
    state: "Maharashtra",
    lat: 18.7360,
    lon: 73.0970,
    type: "town"
  },
  {
    id: "maha-roha",
    name: "Roha",
    nameMr: "रोहा",
    nameHi: "रोहा",
    taluka: "Roha",
    district: "Raigad",
    state: "Maharashtra",
    lat: 18.4360,
    lon: 73.1190,
    type: "town"
  },
  {
    id: "maha-mangaon",
    name: "Mangaon",
    nameMr: "माणगाव",
    nameHi: "माणगांव",
    taluka: "Mangaon",
    district: "Raigad",
    state: "Maharashtra",
    lat: 18.2530,
    lon: 73.2870,
    type: "town"
  },
  {
    id: "maha-mahad",
    name: "Mahad",
    nameMr: "महाड",
    nameHi: "महाड",
    taluka: "Mahad",
    district: "Raigad",
    state: "Maharashtra",
    lat: 18.0830,
    lon: 73.4170,
    type: "town"
  },
  {
    id: "maha-murud",
    name: "Murud",
    nameMr: "मुरुड",
    nameHi: "मुरुड",
    taluka: "Murud",
    district: "Raigad",
    state: "Maharashtra",
    lat: 18.3280,
    lon: 72.9620,
    type: "town"
  },

  // --- PALGHAR DISTRICT ---
  {
    id: "maha-palghar",
    name: "Palghar",
    nameMr: "पालघर",
    nameHi: "पालघर",
    taluka: "Palghar",
    district: "Palghar",
    state: "Maharashtra",
    lat: 19.6967,
    lon: 72.7699,
    type: "city"
  },
  {
    id: "maha-vasai",
    name: "Vasai",
    nameMr: "वसई",
    nameHi: "वसई",
    taluka: "Vasai",
    district: "Palghar",
    state: "Maharashtra",
    lat: 19.3919,
    lon: 72.8397,
    type: "city"
  },
  {
    id: "maha-virar",
    name: "Virar",
    nameMr: "विरार",
    nameHi: "विरार",
    taluka: "Vasai",
    district: "Palghar",
    state: "Maharashtra",
    lat: 19.4564,
    lon: 72.8081,
    type: "city"
  },
  {
    id: "maha-dahanu",
    name: "Dahanu",
    nameMr: "डहाणू",
    nameHi: "डहाणू",
    taluka: "Dahanu",
    district: "Palghar",
    state: "Maharashtra",
    lat: 19.9700,
    lon: 72.7300,
    type: "town"
  },
  {
    id: "maha-wada",
    name: "Wada",
    nameMr: "वाडा",
    nameHi: "वाडा",
    taluka: "Wada",
    district: "Palghar",
    state: "Maharashtra",
    lat: 19.6540,
    lon: 73.1380,
    type: "town"
  },
  {
    id: "maha-jawhar",
    name: "Jawhar",
    nameMr: "जव्हार",
    nameHi: "जव्हार",
    taluka: "Jawhar",
    district: "Palghar",
    state: "Maharashtra",
    lat: 19.9160,
    lon: 73.2320,
    type: "town"
  },

  // --- PUNE DISTRICT ---
  {
    id: "maha-pune",
    name: "Pune",
    nameMr: "पुणे",
    nameHi: "पुणे",
    taluka: "Haveli",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.5204,
    lon: 73.8567,
    type: "city"
  },
  {
    id: "maha-baramati",
    name: "Baramati",
    nameMr: "बारामती",
    nameHi: "बारामती",
    taluka: "Baramati",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.1517,
    lon: 74.5772,
    type: "city"
  },
  {
    // Disambiguated Shirur 1
    id: "maha-shirur-pune",
    name: "Shirur",
    nameMr: "शिरूर (पुणे)",
    nameHi: "शिरूर (पुणे)",
    taluka: "Shirur",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.8270,
    lon: 74.3790,
    type: "town",
    disambiguation: "Pune District (Near Ghod River)"
  },
  {
    id: "maha-junnar",
    name: "Junnar",
    nameMr: "जुन्नर",
    nameHi: "जुन्नर",
    taluka: "Junnar",
    district: "Pune",
    state: "Maharashtra",
    lat: 19.2081,
    lon: 73.8763,
    type: "town"
  },
  {
    id: "maha-narayangaon",
    name: "Narayangaon",
    nameMr: "नारायणगाव",
    nameHi: "नारायणगांव",
    taluka: "Junnar",
    district: "Pune",
    state: "Maharashtra",
    lat: 19.1232,
    lon: 73.9782,
    type: "town"
  },
  {
    id: "maha-manchar",
    name: "Manchar",
    nameMr: "मंचर",
    nameHi: "मंचर",
    taluka: "Ambegaon",
    district: "Pune",
    state: "Maharashtra",
    lat: 19.0064,
    lon: 73.9431,
    type: "town"
  },
  {
    // Disambiguated Khed 1
    id: "maha-khed-pune",
    name: "Khed (Rajgurunagar)",
    nameMr: "खेड / राजगुरूनगर (पुणे)",
    nameHi: "खेड / राजगुरुनगर (पुणे)",
    taluka: "Khed",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.8570,
    lon: 73.9030,
    type: "town",
    disambiguation: "Pune District (Rajgurunagar)"
  },
  {
    id: "maha-otur",
    name: "Otur",
    nameMr: "ओतूर",
    nameHi: "ओतूर",
    taluka: "Junnar",
    district: "Pune",
    state: "Maharashtra",
    lat: 19.2610,
    lon: 73.9850,
    type: "village"
  },
  {
    id: "maha-alephata",
    name: "Alephata",
    nameMr: "आळेफाटा",
    nameHi: "आलेफाटा",
    taluka: "Junnar",
    district: "Pune",
    state: "Maharashtra",
    lat: 19.1830,
    lon: 74.1170,
    type: "village"
  },
  {
    id: "maha-daund",
    name: "Daund",
    nameMr: "दौंड",
    nameHi: "दौंड",
    taluka: "Daund",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.4630,
    lon: 74.5820,
    type: "town"
  },
  {
    id: "maha-indapur",
    name: "Indapur",
    nameMr: "इंदापूर",
    nameHi: "इंदापुर",
    taluka: "Indapur",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.1180,
    lon: 75.0320,
    type: "town"
  },
  {
    id: "maha-saswad",
    name: "Saswad",
    nameMr: "सासवड",
    nameHi: "सासवड",
    taluka: "Purandar",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.3430,
    lon: 74.0290,
    type: "town"
  },
  {
    id: "maha-bhor",
    name: "Bhor",
    nameMr: "भोर",
    nameHi: "भोर",
    taluka: "Bhor",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.1480,
    lon: 73.8440,
    type: "town"
  },

  // --- NASHIK DISTRICT ---
  {
    id: "maha-nashik",
    name: "Nashik",
    nameMr: "नाशिक",
    nameHi: "नासिक",
    taluka: "Nashik",
    district: "Nashik",
    state: "Maharashtra",
    lat: 19.9975,
    lon: 73.7898,
    type: "city"
  },
  {
    id: "maha-igatpuri",
    name: "Igatpuri",
    nameMr: "इगतपुरी",
    nameHi: "इगतपुरी",
    taluka: "Igatpuri",
    district: "Nashik",
    state: "Maharashtra",
    lat: 19.6970,
    lon: 73.5630,
    type: "town"
  },
  {
    id: "maha-sinnar",
    name: "Sinnar",
    nameMr: "सिन्नर",
    nameHi: "सिन्नर",
    taluka: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    lat: 19.8510,
    lon: 73.9960,
    type: "town"
  },
  {
    id: "maha-lasalgaon",
    name: "Lasalgaon",
    nameMr: "लासलगाव",
    nameHi: "लासलगांव",
    taluka: "Niphad",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.1472,
    lon: 74.2267,
    type: "town"
  },
  {
    id: "maha-pimpalgaon-baswant",
    name: "Pimpalgaon Baswant",
    nameMr: "पिंपळगाव बसवंत",
    nameHi: "पिंपलगांव बसवंत",
    taluka: "Niphad",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.1704,
    lon: 73.9858,
    type: "town"
  },
  {
    id: "maha-ozar",
    name: "Ozar",
    nameMr: "ओझर",
    nameHi: "ओझर",
    taluka: "Niphad",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.0960,
    lon: 73.9310,
    type: "town"
  },
  {
    id: "maha-yeola",
    name: "Yeola",
    nameMr: "येवला",
    nameHi: "येवला",
    taluka: "Yeola",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.0422,
    lon: 74.4883,
    type: "town"
  },
  {
    // Disambiguated Malegaon 1
    id: "maha-malegaon-nashik",
    name: "Malegaon",
    nameMr: "मालेगाव (नाशिक)",
    nameHi: "मालेगांव (नासिक)",
    taluka: "Malegaon",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.5539,
    lon: 74.5298,
    type: "city",
    disambiguation: "Nashik District (Textile & Onion Hub)"
  },
  {
    id: "maha-manmad",
    name: "Manmad",
    nameMr: "मनमाड",
    nameHi: "मनमाड",
    taluka: "Nandgaon",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.2524,
    lon: 74.4373,
    type: "town"
  },
  {
    id: "maha-nandgaon",
    name: "Nandgaon",
    nameMr: "नांदगाव",
    nameHi: "नांदगांव",
    taluka: "Nandgaon",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.3128,
    lon: 74.6582,
    type: "town"
  },
  {
    id: "maha-kalwan",
    name: "Kalwan",
    nameMr: "कळवण",
    nameHi: "कलवण",
    taluka: "Kalwan",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.4851,
    lon: 73.9682,
    type: "town"
  },
  {
    id: "maha-dindori",
    name: "Dindori",
    nameMr: "दिंडोरी",
    nameHi: "दिंडोरी",
    taluka: "Dindori",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.2033,
    lon: 73.8344,
    type: "town"
  },
  {
    id: "maha-satana",
    name: "Satana (Baglan)",
    nameMr: "सटाणा (बागलाण)",
    nameHi: "सटाणा (बागलाण)",
    taluka: "Baglan",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.5900,
    lon: 74.2000,
    type: "town"
  },

  // --- AHILYANAGAR (AHMEDNAGAR) DISTRICT ---
  {
    id: "maha-ahilyanagar",
    name: "Ahilyanagar (Ahmednagar)",
    nameMr: "अहिल्यानगर (अहमदनगर)",
    nameHi: "अहिल्यानगर (अहमदनगर)",
    taluka: "Nagar",
    district: "Ahilyanagar",
    state: "Maharashtra",
    lat: 19.0952,
    lon: 74.7496,
    type: "city"
  },
  {
    id: "maha-sangamner",
    name: "Sangamner",
    nameMr: "संगमनेर",
    nameHi: "संगमनेर",
    taluka: "Sangamner",
    district: "Ahilyanagar",
    state: "Maharashtra",
    lat: 19.5761,
    lon: 74.2096,
    type: "city"
  },
  {
    id: "maha-kopargaon",
    name: "Kopargaon",
    nameMr: "कोपरगाव",
    nameHi: "कोपरगांव",
    taluka: "Kopargaon",
    district: "Ahilyanagar",
    state: "Maharashtra",
    lat: 19.8910,
    lon: 74.4840,
    type: "town"
  },
  {
    id: "maha-shrirampur",
    name: "Shrirampur",
    nameMr: "श्रीरामपूर",
    nameHi: "श्रीरामपुर",
    taluka: "Shrirampur",
    district: "Ahilyanagar",
    state: "Maharashtra",
    lat: 19.6190,
    lon: 74.6600,
    type: "city"
  },
  {
    id: "maha-rahata",
    name: "Rahata",
    nameMr: "राहाता",
    nameHi: "राहाता",
    taluka: "Rahata",
    district: "Ahilyanagar",
    state: "Maharashtra",
    lat: 19.6890,
    lon: 74.4890,
    type: "town"
  },
  {
    id: "maha-shirdi",
    name: "Shirdi",
    nameMr: "शिर्डी",
    nameHi: "शिर्डी",
    taluka: "Rahata",
    district: "Ahilyanagar",
    state: "Maharashtra",
    lat: 19.7645,
    lon: 74.4762,
    type: "town"
  },
  {
    id: "maha-jamkhed",
    name: "Jamkhed",
    nameMr: "जामखेड",
    nameHi: "जामखेड",
    taluka: "Jamkhed",
    district: "Ahilyanagar",
    state: "Maharashtra",
    lat: 18.7250,
    lon: 75.3190,
    type: "town"
  },
  {
    // Disambiguated Karjat 2
    id: "maha-karjat-ahilyanagar",
    name: "Karjat",
    nameMr: "कर्जत (अहिल्यानगर)",
    nameHi: "कर्जत (अहिल्यानगर)",
    taluka: "Karjat",
    district: "Ahilyanagar",
    state: "Maharashtra",
    lat: 18.9100,
    lon: 75.0000,
    type: "town",
    disambiguation: "Ahilyanagar District (Ahmednagar region)"
  },
  {
    id: "maha-rahuri",
    name: "Rahuri",
    nameMr: "राहुरी",
    nameHi: "राहुरी",
    taluka: "Rahuri",
    district: "Ahilyanagar",
    state: "Maharashtra",
    lat: 19.3900,
    lon: 74.6500,
    type: "town"
  },
  {
    id: "maha-newasa",
    name: "Newasa",
    nameMr: "नेवासा",
    nameHi: "नेवासा",
    taluka: "Newasa",
    district: "Ahilyanagar",
    state: "Maharashtra",
    lat: 19.5500,
    lon: 74.9200,
    type: "town"
  },

  // --- NANDURBAR DISTRICT ---
  {
    id: "maha-nandurbar",
    name: "Nandurbar",
    nameMr: "नंदुरबार",
    nameHi: "नंदुरबार",
    taluka: "Nandurbar",
    district: "Nandurbar",
    state: "Maharashtra",
    lat: 21.3704,
    lon: 74.2403,
    type: "city"
  },
  {
    id: "maha-shahada",
    name: "Shahada",
    nameMr: "शहादा",
    nameHi: "शहादा",
    taluka: "Shahada",
    district: "Nandurbar",
    state: "Maharashtra",
    lat: 21.5430,
    lon: 74.4750,
    type: "town"
  },
  {
    id: "maha-navapur",
    name: "Navapur",
    nameMr: "नवापूर",
    nameHi: "नवापुर",
    taluka: "Navapur",
    district: "Nandurbar",
    state: "Maharashtra",
    lat: 21.1670,
    lon: 73.8000,
    type: "town"
  },

  // --- DHULE DISTRICT ---
  {
    id: "maha-dhule",
    name: "Dhule",
    nameMr: "धुळे",
    nameHi: "धुले",
    taluka: "Dhule",
    district: "Dhule",
    state: "Maharashtra",
    lat: 20.9042,
    lon: 74.7749,
    type: "city"
  },
  {
    id: "maha-shirpur",
    name: "Shirpur",
    nameMr: "शिरपूर",
    nameHi: "शिरपुर",
    taluka: "Shirpur",
    district: "Dhule",
    state: "Maharashtra",
    lat: 21.3500,
    lon: 74.8800,
    type: "town"
  },
  {
    id: "maha-sakri",
    name: "Sakri",
    nameMr: "साक्री",
    nameHi: "साक्री",
    taluka: "Sakri",
    district: "Dhule",
    state: "Maharashtra",
    lat: 20.9300,
    lon: 74.3100,
    type: "town"
  },

  // --- JALGAON DISTRICT ---
  {
    id: "maha-jalgaon",
    name: "Jalgaon",
    nameMr: "जळगाव",
    nameHi: "जलगांव",
    taluka: "Jalgaon",
    district: "Jalgaon",
    state: "Maharashtra",
    lat: 21.0077,
    lon: 75.5626,
    type: "city"
  },
  {
    id: "maha-bhusawal",
    name: "Bhusawal",
    nameMr: "भुसावळ",
    nameHi: "भुसावल",
    taluka: "Bhusawal",
    district: "Jalgaon",
    state: "Maharashtra",
    lat: 21.0470,
    lon: 75.7920,
    type: "city"
  },
  {
    id: "maha-chalisgaon",
    name: "Chalisgaon",
    nameMr: "चाळीसगाव",
    nameHi: "चालीसगांव",
    taluka: "Chalisgaon",
    district: "Jalgaon",
    state: "Maharashtra",
    lat: 20.4600,
    lon: 75.0100,
    type: "city"
  },

  // --- SOLAPUR DISTRICT ---
  {
    id: "maha-solapur",
    name: "Solapur",
    nameMr: "सोलापूर",
    nameHi: "सोलापुर",
    taluka: "Solapur North",
    district: "Solapur",
    state: "Maharashtra",
    lat: 17.6599,
    lon: 75.9064,
    type: "city"
  },
  {
    id: "maha-pandharpur",
    name: "Pandharpur",
    nameMr: "पंढरपूर",
    nameHi: "पंढरपुर",
    taluka: "Pandharpur",
    district: "Solapur",
    state: "Maharashtra",
    lat: 17.6775,
    lon: 75.3275,
    type: "city"
  },
  {
    id: "maha-akluj",
    name: "Akluj",
    nameMr: "अकलूज",
    nameHi: "अकलूज",
    taluka: "Malshiras",
    district: "Solapur",
    state: "Maharashtra",
    lat: 17.8920,
    lon: 75.0210,
    type: "town"
  },

  // --- SATARA DISTRICT ---
  {
    id: "maha-satara",
    name: "Satara",
    nameMr: "सातारा",
    nameHi: "सतारा",
    taluka: "Satara",
    district: "Satara",
    state: "Maharashtra",
    lat: 17.6805,
    lon: 73.9935,
    type: "city"
  },
  {
    id: "maha-karad",
    name: "Karad",
    nameMr: "कराड",
    nameHi: "कराड",
    taluka: "Karad",
    district: "Satara",
    state: "Maharashtra",
    lat: 17.2885,
    lon: 74.1843,
    type: "city"
  },
  {
    id: "maha-wai",
    name: "Wai",
    nameMr: "वाई",
    nameHi: "वाई",
    taluka: "Wai",
    district: "Satara",
    state: "Maharashtra",
    lat: 17.9480,
    lon: 73.8920,
    type: "town"
  },
  {
    id: "maha-vaduj",
    name: "Vaduj",
    nameMr: "वडूज",
    nameHi: "वडूज",
    taluka: "Khatav",
    district: "Satara",
    state: "Maharashtra",
    lat: 17.5960,
    lon: 74.4440,
    type: "town"
  },

  // --- SANGLI DISTRICT ---
  {
    id: "maha-sangli",
    name: "Sangli",
    nameMr: "सांगली",
    nameHi: "सांगली",
    taluka: "Miraj",
    district: "Sangli",
    state: "Maharashtra",
    lat: 16.8524,
    lon: 74.5815,
    type: "city"
  },
  {
    id: "maha-miraj",
    name: "Miraj",
    nameMr: "मिरज",
    nameHi: "मिरज",
    taluka: "Miraj",
    district: "Sangli",
    state: "Maharashtra",
    lat: 16.8300,
    lon: 74.6400,
    type: "city"
  },
  {
    id: "maha-vita",
    name: "Vita",
    nameMr: "विटा",
    nameHi: "विटा",
    taluka: "Khanapur",
    district: "Sangli",
    state: "Maharashtra",
    lat: 17.2760,
    lon: 74.5380,
    type: "town"
  },

  // --- KOLHAPUR DISTRICT ---
  {
    id: "maha-kolhapur",
    name: "Kolhapur",
    nameMr: "कोल्हापूर",
    nameHi: "कोल्हापुर",
    taluka: "Karveer",
    district: "Kolhapur",
    state: "Maharashtra",
    lat: 16.7050,
    lon: 74.2433,
    type: "city"
  },
  {
    id: "maha-ichalkaranji",
    name: "Ichalkaranji",
    nameMr: "इचलकरंजी",
    nameHi: "इचलकरंजी",
    taluka: "Hatkanangle",
    district: "Kolhapur",
    state: "Maharashtra",
    lat: 16.7000,
    lon: 74.4600,
    type: "city"
  },

  // --- CHHATRAPATI SAMBHAJINAGAR (AURANGABAD) & MARATHWADA ---
  {
    id: "maha-sambhajinagar",
    name: "Chhatrapati Sambhajinagar (Aurangabad)",
    nameMr: "छत्रपती संभाजीनगर (औरंगाबाद)",
    nameHi: "छत्रपति संभाजीनगर (औरंगाबाद)",
    taluka: "Chhatrapati Sambhajinagar",
    district: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    lat: 19.8762,
    lon: 75.3433,
    type: "city"
  },
  {
    id: "maha-vaijpur",
    name: "Vaijpur",
    nameMr: "वैजापूर",
    nameHi: "वैजापुर",
    taluka: "Vaijpur",
    district: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    lat: 19.9270,
    lon: 74.7310,
    type: "town"
  },
  {
    id: "maha-gangapur",
    name: "Gangapur",
    nameMr: "गंगापूर",
    nameHi: "गंगापुर",
    taluka: "Gangapur",
    district: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    lat: 19.6990,
    lon: 75.0110,
    type: "town"
  },
  {
    id: "maha-jalna",
    name: "Jalna",
    nameMr: "जालना",
    nameHi: "जालना",
    taluka: "Jalna",
    district: "Jalna",
    state: "Maharashtra",
    lat: 19.8347,
    lon: 75.8816,
    type: "city"
  },
  {
    id: "maha-beed",
    name: "Beed",
    nameMr: "बीड",
    nameHi: "बीड",
    taluka: "Beed",
    district: "Beed",
    state: "Maharashtra",
    lat: 18.9891,
    lon: 75.7601,
    type: "city"
  },
  {
    id: "maha-georai",
    name: "Georai",
    nameMr: "गेवराई",
    nameHi: "गेवराई",
    taluka: "Georai",
    district: "Beed",
    state: "Maharashtra",
    lat: 19.2620,
    lon: 75.7530,
    type: "town"
  },
  {
    // Disambiguated Shirur 2
    id: "maha-shirur-beed",
    name: "Shirur Kasar",
    nameMr: "शिरूर कासार (बीड)",
    nameHi: "शिरूर कासार (बीड)",
    taluka: "Shirur Kasar",
    district: "Beed",
    state: "Maharashtra",
    lat: 19.0430,
    lon: 75.3120,
    type: "town",
    disambiguation: "Beed District (Marathwada region)"
  },
  {
    // Disambiguated Ashti 1
    id: "maha-ashti-beed",
    name: "Ashti",
    nameMr: "आष्टी (बीड)",
    nameHi: "आष्टी (बीड)",
    taluka: "Ashti",
    district: "Beed",
    state: "Maharashtra",
    lat: 18.8050,
    lon: 75.1750,
    type: "town",
    disambiguation: "Beed District"
  },
  {
    id: "maha-latur",
    name: "Latur",
    nameMr: "लातूर",
    nameHi: "लातूर",
    taluka: "Latur",
    district: "Latur",
    state: "Maharashtra",
    lat: 18.4088,
    lon: 76.5604,
    type: "city"
  },
  {
    // Disambiguated Shirur 3
    id: "maha-shirur-latur",
    name: "Shirur Anantpal",
    nameMr: "शिरूर अनंतपाळ (लातूर)",
    nameHi: "शिरूर अनंतपाल (लातूर)",
    taluka: "Shirur Anantpal",
    district: "Latur",
    state: "Maharashtra",
    lat: 18.3150,
    lon: 76.8820,
    type: "town",
    disambiguation: "Latur District"
  },
  {
    id: "maha-dharashiv",
    name: "Dharashiv (Osmanabad)",
    nameMr: "धाराशिव (उस्मानाबाद)",
    nameHi: "धाराशिव (उस्मानाबाद)",
    taluka: "Dharashiv",
    district: "Dharashiv",
    state: "Maharashtra",
    lat: 18.1850,
    lon: 76.0420,
    type: "city"
  },
  {
    id: "maha-nanded",
    name: "Nanded",
    nameMr: "नांदेड",
    nameHi: "नांदेड़",
    taluka: "Nanded",
    district: "Nanded",
    state: "Maharashtra",
    lat: 19.1383,
    lon: 77.3210,
    type: "city"
  },
  {
    id: "maha-parbhani",
    name: "Parbhani",
    nameMr: "परभणी",
    nameHi: "परभणी",
    taluka: "Parbhani",
    district: "Parbhani",
    state: "Maharashtra",
    lat: 19.2644,
    lon: 76.7749,
    type: "city"
  },
  {
    // Disambiguated Selu 1
    id: "maha-selu-parbhani",
    name: "Selu",
    nameMr: "सेलू (परभणी)",
    nameHi: "सेलू (परभणी)",
    taluka: "Selu",
    district: "Parbhani",
    state: "Maharashtra",
    lat: 19.5100,
    lon: 76.4500,
    type: "town",
    disambiguation: "Parbhani District"
  },
  {
    id: "maha-hingoli",
    name: "Hingoli",
    nameMr: "हिंगोली",
    nameHi: "हिंगोली",
    taluka: "Hingoli",
    district: "Hingoli",
    state: "Maharashtra",
    lat: 19.7188,
    lon: 77.1472,
    type: "city"
  },

  // --- VIDARBHA REGION ---
  {
    id: "maha-nagpur",
    name: "Nagpur",
    nameMr: "नागपूर",
    nameHi: "नागपुर",
    taluka: "Nagpur Urban",
    district: "Nagpur",
    state: "Maharashtra",
    lat: 21.1458,
    lon: 79.0882,
    type: "city"
  },
  {
    id: "maha-katol",
    name: "Katol",
    nameMr: "काटोल",
    nameHi: "काटोल",
    taluka: "Katol",
    district: "Nagpur",
    state: "Maharashtra",
    lat: 21.2720,
    lon: 78.5870,
    type: "town"
  },
  {
    id: "maha-amravati",
    name: "Amravati",
    nameMr: "अमरावती",
    nameHi: "अमरावती",
    taluka: "Amravati",
    district: "Amravati",
    state: "Maharashtra",
    lat: 20.9320,
    lon: 77.7523,
    type: "city"
  },
  {
    id: "maha-morshi",
    name: "Morshi",
    nameMr: "मोर्शी",
    nameHi: "मोर्शी",
    taluka: "Morshi",
    district: "Amravati",
    state: "Maharashtra",
    lat: 21.3210,
    lon: 78.0120,
    type: "town"
  },
  {
    id: "maha-akola",
    name: "Akola",
    nameMr: "अकोला",
    nameHi: "अकोला",
    taluka: "Akola",
    district: "Akola",
    state: "Maharashtra",
    lat: 20.7002,
    lon: 77.0082,
    type: "city"
  },
  {
    id: "maha-washim",
    name: "Washim",
    nameMr: "वाशीम",
    nameHi: "वाशिम",
    taluka: "Washim",
    district: "Washim",
    state: "Maharashtra",
    lat: 20.1112,
    lon: 77.1345,
    type: "city"
  },
  {
    // Disambiguated Karanja 1
    id: "maha-karanja-washim",
    name: "Karanja (Lad)",
    nameMr: "कारंजा लाड (वाशीम)",
    nameHi: "कारंजा लाड (वाशिम)",
    taluka: "Karanja",
    district: "Washim",
    state: "Maharashtra",
    lat: 20.4830,
    lon: 77.4870,
    type: "town",
    disambiguation: "Washim District (Karanja Lad)"
  },
  {
    id: "maha-yavatmal",
    name: "Yavatmal",
    nameMr: "यवतमाळ",
    nameHi: "यवतमाल",
    taluka: "Yavatmal",
    district: "Yavatmal",
    state: "Maharashtra",
    lat: 20.3888,
    lon: 78.1204,
    type: "city"
  },
  {
    id: "maha-pusad",
    name: "Pusad",
    nameMr: "पुसद",
    nameHi: "पुसद",
    taluka: "Pusad",
    district: "Yavatmal",
    state: "Maharashtra",
    lat: 19.9070,
    lon: 77.5750,
    type: "town"
  },
  {
    id: "maha-wardha",
    name: "Wardha",
    nameMr: "वर्धा",
    nameHi: "वर्धा",
    taluka: "Wardha",
    district: "Wardha",
    state: "Maharashtra",
    lat: 20.7453,
    lon: 78.6022,
    type: "city"
  },
  {
    id: "maha-hinganghat",
    name: "Hinganghat",
    nameMr: "हिंगणघाट",
    nameHi: "हिंगणघाट",
    taluka: "Hinganghat",
    district: "Wardha",
    state: "Maharashtra",
    lat: 20.5500,
    lon: 78.8333,
    type: "town"
  },
  {
    id: "maha-arvi",
    name: "Arvi",
    nameMr: "आर्वी",
    nameHi: "आर्वी",
    taluka: "Arvi",
    district: "Wardha",
    state: "Maharashtra",
    lat: 20.9850,
    lon: 78.2320,
    type: "town"
  },
  {
    // Disambiguated Selu 2
    id: "maha-seloo-wardha",
    name: "Seloo",
    nameMr: "सेलू (वर्धा)",
    nameHi: "सेलू (वर्धा)",
    taluka: "Seloo",
    district: "Wardha",
    state: "Maharashtra",
    lat: 20.8350,
    lon: 78.7050,
    type: "town",
    disambiguation: "Wardha District"
  },
  {
    // Disambiguated Karanja 2
    id: "maha-karanja-wardha",
    name: "Karanja (Ghadge)",
    nameMr: "कारंजा घाडगे (वर्धा)",
    nameHi: "कारंजा घाडगे (वर्धा)",
    taluka: "Karanja",
    district: "Wardha",
    state: "Maharashtra",
    lat: 21.1830,
    lon: 78.4170,
    type: "town",
    disambiguation: "Wardha District (Karanja Ghadge)"
  },
  {
    id: "maha-chandrapur",
    name: "Chandrapur",
    nameMr: "चंद्रपूर",
    nameHi: "चंद्रपुर",
    taluka: "Chandrapur",
    district: "Chandrapur",
    state: "Maharashtra",
    lat: 19.9615,
    lon: 79.2961,
    type: "city"
  },
  {
    id: "maha-bhandara",
    name: "Bhandara",
    nameMr: "भंडारा",
    nameHi: "भंडारा",
    taluka: "Bhandara",
    district: "Bhandara",
    state: "Maharashtra",
    lat: 21.1667,
    lon: 79.6500,
    type: "city"
  },
  {
    id: "maha-gondia",
    name: "Gondia",
    nameMr: "गोंदिया",
    nameHi: "गोंदिया",
    taluka: "Gondia",
    district: "Gondia",
    state: "Maharashtra",
    lat: 21.4554,
    lon: 80.1961,
    type: "city"
  },
  {
    id: "maha-gadchiroli",
    name: "Gadchiroli",
    nameMr: "गडचिरोली",
    nameHi: "गडचिरोली",
    taluka: "Gadchiroli",
    district: "Gadchiroli",
    state: "Maharashtra",
    lat: 20.1849,
    lon: 79.9948,
    type: "city"
  },
  {
    id: "maha-buldhana",
    name: "Buldhana",
    nameMr: "बुलढाणा",
    nameHi: "बुलढाणा",
    taluka: "Buldhana",
    district: "Buldhana",
    state: "Maharashtra",
    lat: 20.5300,
    lon: 76.1800,
    type: "city"
  },
  {
    id: "maha-lonar",
    name: "Lonar",
    nameMr: "लोणार",
    nameHi: "लोणार",
    taluka: "Lonar",
    district: "Buldhana",
    state: "Maharashtra",
    lat: 19.9850,
    lon: 76.5200,
    type: "town"
  }
];

/**
 * Normalizes query string for robust fuzzy matching
 */
function normalizeQuery(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]/g, "").trim();
}

/**
 * Searches Maharashtra verified places with ranking
 * Supports English, Marathi, Hindi and disambiguates duplicate village names
 */
function searchMaharashtraPlaces(query, limit = 5) {
  if (!query || typeof query !== "string") return [];
  const cleanQ = query.trim().toLowerCase();
  const normQ = normalizeQuery(query);
  if (normQ.length < 2) return [];

  const matches = [];

  for (const place of MAHARASHTRA_PLACES) {
    const enName = place.name.toLowerCase();
    const mrName = (place.nameMr || "").toLowerCase();
    const hiName = (place.nameHi || "").toLowerCase();
    const taluka = place.taluka.toLowerCase();
    const dist = place.district.toLowerCase();

    let score = 0;

    // Exact matches
    if (enName === cleanQ || mrName === cleanQ || hiName === cleanQ) {
      score += 100;
    }
    // Prefix matches
    else if (enName.startsWith(cleanQ) || mrName.startsWith(cleanQ) || hiName.startsWith(cleanQ)) {
      score += 70;
    }
    // Normalized prefix
    else if (normalizeQuery(place.name).startsWith(normQ) || normalizeQuery(place.nameMr).startsWith(normQ)) {
      score += 60;
    }
    // Substring match
    else if (enName.includes(cleanQ) || mrName.includes(cleanQ) || hiName.includes(cleanQ)) {
      score += 40;
    }
    // Taluka / District match
    else if (taluka.includes(cleanQ) || dist.includes(cleanQ)) {
      score += 20;
    }

    if (score > 0) {
      // Small bonus for larger administrative centers if query is broad
      if (place.type === "city") score += 3;
      if (place.type === "town") score += 1;

      matches.push({ place, score });
    }
  }

  // Sort descending by score
  matches.sort((a, b) => b.score - a.score);

  return matches.slice(0, limit).map(m => {
    const p = m.place;
    const secondary = p.disambiguation 
      ? `${p.disambiguation}, Taluka ${p.taluka}, Maharashtra`
      : `Taluka ${p.taluka}, District ${p.district}, Maharashtra`;

    return {
      placeId: p.id,
      description: `${p.name}, ${p.district}, Maharashtra`,
      mainText: p.name,
      mainTextMr: p.nameMr,
      mainTextHi: p.nameHi,
      secondaryText: secondary,
      taluka: p.taluka,
      district: p.district,
      state: p.state,
      lat: p.lat,
      lon: p.lon,
      source: "verified_local"
    };
  });
}

/**
 * Resolves a place by ID or name
 */
function resolveMaharashtraPlace(idOrName) {
  if (!idOrName) return null;
  const clean = idOrName.toLowerCase().trim();

  // Try direct ID
  const byId = MAHARASHTRA_PLACES.find(p => p.id === clean || p.id === idOrName);
  if (byId) return byId;

  // Try exact name match
  const byName = MAHARASHTRA_PLACES.find(p => 
    p.name.toLowerCase() === clean || 
    (p.nameMr && p.nameMr.toLowerCase() === clean) ||
    (p.nameHi && p.nameHi.toLowerCase() === clean)
  );
  if (byName) return byName;

  // Try fuzzy prefix
  const searchResults = searchMaharashtraPlaces(idOrName, 1);
  return searchResults.length > 0 ? searchResults[0] : null;
}

module.exports = {
  MAHARASHTRA_PLACES,
  searchMaharashtraPlaces,
  resolveMaharashtraPlace
};
