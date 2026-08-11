/* ==========================================================================
   CropShield AI — script.js
   Sections:
   1. Multi-Language Translations (en, hi, te, es, fr, sw)
   2. State & DOM references
   3. i18n Engine & Language Switcher
   4. Image input
   5. Location input
   6. Weather API (live + mock fallback)
   7. Crop analysis (mock CV, swappable)
   8. Advisory + decision engine
   9. Orchestration (runAnalysis)
   10. Rendering & Results
   11. History
   12. Init
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. MULTI-LANGUAGE TRANSLATIONS
   -------------------------------------------------------------------------- */
const TRANSLATIONS = {
  en: {
    ui: {
      brandSub: "Crop & Climate Advisory",
      statusAwaiting: "Field status: awaiting input",
      statusAnalyzing: "Field status: analyzing…",
      statusRainAlert: "Field status: rain expected soon",
      statusTracked: "Field status: conditions tracked",
      statusError: "Field status: analysis error — showing demo data",
      heroEyebrow: "Field-to-advisory in three steps",
      heroTitle: "Turn field conditions into smarter farm decisions.",
      heroSub: "Upload a crop image, share your location, and get an AI-read diagnosis paired with a weather-safe window to act — before the next rain undoes the work.",
      heroCta: "Analyze my crop",
      step1Title: "Upload crop image",
      step1Sub: "A clear photo of the affected leaf works best.",
      dropPhotoStrong: "Drop a leaf photo here",
      dropPhotoOr: "or choose an option below",
      uploadPhotoBtn: "Upload photo",
      useCameraBtn: "Use camera",
      useSampleBtn: "Use sample photo",
      changePhotoBtn: "Change photo",
      step2Title: "Share your location",
      step2Sub: "Used to pull live, local weather.",
      locationPlaceholder: "Enter village / city",
      useLocationBtn: "Use my location",
      noLocationSet: "No location selected yet.",
      step3Title: "Get your advisory",
      step3Sub: "Combines crop diagnosis with the weather forecast.",
      analyzeBtn: "Analyze crop",
      needInputs: "Add a photo and a location to continue.",
      readyToAnalyze: "Ready. Tap “Analyze crop” to get your advisory.",
      locationDenied: "Location access was denied. Type your village or city instead.",
      locationUnavailable: "Could not detect location. Try entering it manually.",
      noHistory: "No analyses yet this session.",
      bestTimeToAct: "Best time to act",
      legendSafe: "Safe to act",
      legendCaution: "Caution",
      legendAvoid: "Avoid",
      cardCropHealth: "Crop health",
      labelCrop: "Crop",
      labelLikelyIssue: "Likely issue",
      labelConfidence: "Confidence",
      cardDiagnosis: "AI diagnosis",
      labelSymptomsDetected: "Symptoms detected",
      cardTreatmentPlan: "Treatment plan",
      labelImmediateAction: "Immediate action",
      labelRecommendedTreatment: "Recommended treatment",
      labelPreventiveMeasures: "Preventive measures",
      labelAvoid: "Avoid",
      cardWeatherIntel: "Weather intelligence",
      labelTemperature: "Temperature",
      labelHumidity: "Humidity",
      labelRainProb: "Rain probability",
      labelWind: "Wind",
      labelCondition: "Condition",
      labelSource: "Source",
      historyTitle: "Advisory history",
      footerText: "CropShield AI — prototype dashboard. Diagnoses and weather in demo mode are simulated for judging when live data is unavailable.",
      alertRainTitle: "Rain alert",
      alertRainBody: "Heavy rainfall expected soon. Hold off on spraying until conditions clear."
    },
    loadingSteps: [
      "Analyzing crop image…",
      "Checking crop health…",
      "Analyzing weather…",
      "Calculating safe action window…",
      "Preparing farmer advisory…"
    ],
    crops: { Tomato: "Tomato", Rice: "Rice", Chilli: "Chilli", Cotton: "Cotton", Maize: "Maize" },
    severities: { Low: "LOW", Medium: "MEDIUM", High: "HIGH" },
    diseases: {
      "Early Blight": "Early Blight",
      "Leaf Blast": "Leaf Blast",
      "Bacterial Leaf Spot": "Bacterial Leaf Spot",
      "Powdery Mildew": "Powdery Mildew",
      "Northern Leaf Blight": "Northern Leaf Blight"
    },
    symptoms: {
      "Brown circular lesions with concentric rings": "Brown circular lesions with concentric rings",
      "Yellowing around affected areas": "Yellowing around affected areas",
      "Progressive lower-leaf damage": "Progressive lower-leaf damage",
      "Diamond-shaped grey lesions": "Diamond-shaped grey lesions",
      "Lesion borders turning brown": "Lesion borders turning brown",
      "Wilting leaf tips": "Wilting leaf tips",
      "Small water-soaked spots": "Small water-soaked spots",
      "Spots merging into larger patches": "Spots merging into larger patches",
      "Leaf drop in severe cases": "Leaf drop in severe cases",
      "White powdery coating on leaf surface": "White powdery coating on leaf surface",
      "Slight leaf curling": "Slight leaf curling",
      "Stunted new growth": "Stunted new growth",
      "Long grey-green cigar-shaped lesions": "Long grey-green cigar-shaped lesions",
      "Lesions spreading along leaf veins": "Lesions spreading along leaf veins",
      "Lower leaves affected first": "Lower leaves affected first"
    },
    treatments: {
      "Early Blight": {
        immediate: "Remove and destroy the worst-affected lower leaves to slow spread.",
        recommendation: "Apply a copper-based or recommended fungicide labelled for early blight, following the label's rate.",
        prevention: ["Rotate crops away from tomato/potato family next season", "Improve airflow with wider spacing", "Water at the base, not on foliage"],
        avoid: ["Overhead irrigation late in the day", "Working the field while leaves are wet"]
      },
      "Leaf Blast": {
        immediate: "Drain standing water in the field where possible to reduce humidity around the crop.",
        recommendation: "Apply a fungicide recommended for rice blast at the first sign of lesions.",
        prevention: ["Avoid excess nitrogen fertilizer", "Use blast-resistant seed varieties next season", "Maintain balanced field spacing"],
        avoid: ["Excess nitrogen top-dressing", "Dense sowing in known blast-prone plots"]
      },
      "Bacterial Leaf Spot": {
        immediate: "Remove severely spotted leaves and avoid working the field when foliage is wet.",
        recommendation: "Apply a copper-based bactericide labelled for the crop.",
        prevention: ["Use certified disease-free seed", "Avoid overhead watering", "Rotate with non-host crops"],
        avoid: ["Handling wet plants", "Reusing tools without cleaning"]
      },
      "Powdery Mildew": {
        immediate: "Prune affected shoots to improve airflow around the canopy.",
        recommendation: "Apply a sulfur-based or recommended fungicide at the first sign of white coating.",
        prevention: ["Avoid excess nitrogen", "Increase plant spacing", "Choose resistant varieties where available"],
        avoid: ["Dense, shaded plantings", "Spraying during peak heat"]
      },
      "Northern Leaf Blight": {
        immediate: "Remove heavily infected lower leaves where practical.",
        recommendation: "Apply a fungicide labelled for northern leaf blight if lesions are spreading upward.",
        prevention: ["Rotate with a non-host crop", "Use resistant hybrids next season", "Manage crop residue after harvest"],
        avoid: ["Continuous maize monocropping", "Leaving infected residue in the field"]
      }
    },
    weatherConditions: {
      "Clear sky": "Clear sky",
      "Partly cloudy": "Partly cloudy",
      "Fog": "Fog",
      "Rain": "Rain",
      "Rain showers": "Rain showers",
      "Thunderstorm": "Thunderstorm",
      "Mixed conditions": "Mixed conditions"
    },
    weatherSources: {
      live: "Live forecast",
      demo: "Demo mode"
    },
    actionWindow: {
      noSafeWindow: "No clear safe window in the next 24 hours",
      noSafeReason: "Conditions stay wet or windy through the forecast period. Recheck tomorrow before treating.",
      today: "Today",
      tomorrow: "Tomorrow",
      rainSoonReason: "Rain is expected soon, so avoid spraying now — this window has low rain probability, manageable wind, and workable humidity.",
      safeReason: "This window has low rain probability, manageable wind, and workable humidity for treatment to take effect."
    },
    history: {
      today: "Analyzed: Today",
      yesterday: "Analyzed: Yesterday",
      daysAgo: "Analyzed: {x} days ago"
    },
    diagnosisTemplate: (crop, disease) => `The uploaded leaf image shows patterns consistent with ${disease.toLowerCase()} in ${crop.toLowerCase()}, based on lesion shape, color, and distribution.`
  },

  hi: {
    ui: {
      brandSub: "फसल एवं मौसम सलाह",
      statusAwaiting: "खेत की स्थिति: जानकारी की प्रतीक्षा",
      statusAnalyzing: "खेत की स्थिति: विश्लेषण जारी…",
      statusRainAlert: "खेत की स्थिति: शीघ्र बारिश की संभावना",
      statusTracked: "खेत की स्थिति: मौसम ट्रैक किया गया",
      statusError: "खेत की स्थिति: त्रुटि — डेमो डेटा प्रदर्शित",
      heroEyebrow: "तीन चरणों में खेत से सटीक सलाह",
      heroTitle: "खेत की स्थितियों को समझकर बेहतर फैसले लें।",
      heroSub: "फसल की पत्ती की फोटो अपलोड करें, अपना स्थान बताएं और मौसम के अनुसार सुरक्षित छिड़काव का सही समय जानें — बारिश आने से पहले।",
      heroCta: "फसल की जांच करें",
      step1Title: "फसल की फोटो अपलोड करें",
      step1Sub: "प्रभावित पत्ती की स्पष्ट फोटो सबसे अच्छा काम करती है।",
      dropPhotoStrong: "पत्ती की फोटो यहां खींचकर लाएं",
      dropPhotoOr: "या नीचे दिए गए विकल्पों में से चुनें",
      uploadPhotoBtn: "फोटो अपलोड करें",
      useCameraBtn: "कैमरा इस्तेमाल करें",
      useSampleBtn: "सैंपल फोटो देखें",
      changePhotoBtn: "फोटो बदलें",
      step2Title: "अपना स्थान शेयर करें",
      step2Sub: "स्थानीय मौसम की सटीक जानकारी पाने के लिए।",
      locationPlaceholder: "गांव या शहर का नाम दर्ज करें",
      useLocationBtn: "मेरा स्थान चुनें",
      noLocationSet: "अभी कोई स्थान नहीं चुना गया।",
      step3Title: "अपनी सलाह प्राप्त करें",
      step3Sub: "फसल रोग निदान और मौसम पूर्वानुमान का संयोजन।",
      analyzeBtn: "जांच शुरू करें",
      needInputs: "आगे बढ़ने के लिए फोटो और स्थान जोड़ें।",
      readyToAnalyze: "तैयार हैं। सलाह पाने के लिए 'जांच शुरू करें' पर टैप करें।",
      locationDenied: "स्थान अनुमति अस्वीकृत। कृपया अपना गांव या शहर लिखें।",
      locationUnavailable: "स्थान नहीं मिल सका। कृपया मैन्युअल दर्ज करें।",
      noHistory: "इस सत्र में अभी तक कोई इतिहास नहीं है।",
      bestTimeToAct: "उपचार का सबसे सुरक्षित समय",
      legendSafe: "सुरक्षित समय",
      legendCaution: "सावधानी बरतें",
      legendAvoid: "छिड़काव न करें",
      cardCropHealth: "फसल का स्वास्थ्य",
      labelCrop: "फसल",
      labelLikelyIssue: "संभावित बीमारी",
      labelConfidence: "सटीकता",
      cardDiagnosis: "AI जांच रिपोर्ट",
      labelSymptomsDetected: "देखे गए लक्षण",
      cardTreatmentPlan: "उपचार योजना",
      labelImmediateAction: "तत्काल कार्रवाई",
      labelRecommendedTreatment: "अनुशंसित दवा / उपचार",
      labelPreventiveMeasures: "रोकथाम के उपाय",
      labelAvoid: "परहेज करें",
      cardWeatherIntel: "मौसम संबंधी जानकारी",
      labelTemperature: "तापमान",
      labelHumidity: "नमी (आर्द्रता)",
      labelRainProb: "बारिश की संभावना",
      labelWind: "हवा की गति",
      labelCondition: "मौसम की स्थिति",
      labelSource: "स्रोत",
      historyTitle: "सलाह इतिहास",
      footerText: "CropShield AI — प्रोटोटाइप डैशबोर्ड। जब लाइव डेटा उपलब्ध नहीं होता, तो सिमुलेटेड डेटा का उपयोग किया जाता है।",
      alertRainTitle: "बारिश की चेतावनी",
      alertRainBody: "शीघ्र ही भारी बारिश की संभावना है। मौसम साफ होने तक छिड़काव रोक दें।"
    },
    loadingSteps: [
      "फसल की फोटो का विश्लेषण हो रहा है…",
      "फसल स्वास्थ्य की जांच जारी है…",
      "मौसम के आंकड़ों की जांच हो रही है…",
      "सुरक्षित छिड़काव समय की गणना जारी है…",
      "किसान सलाह तैयार की जा रही है…"
    ],
    crops: { Tomato: "टमाटर", Rice: "धान (चावल)", Chilli: "मिर्च", Cotton: "कपास", Maize: "मक्का" },
    severities: { Low: "कम जोखिम", Medium: "मध्यम जोखिम", High: "उच्च जोखिम" },
    diseases: {
      "Early Blight": "अगेती झुलसा (Early Blight)",
      "Leaf Blast": "लीफ ब्लास्ट (Leaf Blast)",
      "Bacterial Leaf Spot": "जीवाणु युक्त पत्ती धब्बा",
      "Powdery Mildew": "सफेद चूर्णी रोग (Powdery Mildew)",
      "Northern Leaf Blight": "उत्तरी पत्ती झुलसा रोग"
    },
    symptoms: {
      "Brown circular lesions with concentric rings": "गोल भूरे धब्बे जिन पर छल्ले बने हैं",
      "Yellowing around affected areas": "प्रभावित स्थानों के चारों ओर पीलापन",
      "Progressive lower-leaf damage": "निचली पत्तियों का लगातार खराब होना",
      "Diamond-shaped grey lesions": "हीरे के आकार के स्लेटी धब्बे",
      "Lesion borders turning brown": "धब्बों के किनारे भूरे होना",
      "Wilting leaf tips": "पत्तियों के अग्र भाग का मुरझाना",
      "Small water-soaked spots": "छोटे जलीय धब्बे",
      "Spots merging into larger patches": "धब्बों का आपस में मिलकर बड़ा होना",
      "Leaf drop in severe cases": "गंभीर स्थिति में पत्तियों का झड़ना",
      "White powdery coating on leaf surface": "पत्ती की सतह पर सफेद पाउडर जैसी परत",
      "Slight leaf curling": "पत्तियों का हल्का मुड़ना",
      "Stunted new growth": "नयी वृद्धि का रुकना",
      "Long grey-green cigar-shaped lesions": "लंबे स्लेटी-हरे सिगार के आकार के धब्बे",
      "Lesions spreading along leaf veins": "शिराओं के साथ धब्बों का फैलना",
      "Lower leaves affected first": "निचली पत्तियों पर पहले असर दिखना"
    },
    treatments: {
      "Early Blight": {
        immediate: "बीमारी को फैलने से रोकने के लिए अत्यधिक प्रभावित निचली पत्तियों को तोड़कर नष्ट कर दें।",
        recommendation: "अगेती झुलसा के लिए तांबा (कॉपर) आधारित या अनुशंसित फफूंदनाशी का छिड़काव करें।",
        prevention: ["अगले सीजन में टमाटर/आलू कुल की फसलें बदलकर बोएं", "पौधों के बीच उचित दूरी बनाकर हवा का प्रवाह सुधारें", "जड़ों के पास पानी दें, पत्तियों पर नहीं"],
        avoid: ["शाम के समय ऊपर से सिंचाई करना", "पत्तियां गीली होने पर खेत में काम करना"]
      },
      "Leaf Blast": {
        immediate: "फसल के आसपास नमी कम करने के लिए खेत से अतिरिक्त पानी निकाल दें।",
        recommendation: "ब्लास्ट के लक्षण दिखते ही धान के लिए अनुशंसित फफूंदनाशी का छिड़काव करें।",
        prevention: ["अत्यधिक नाइट्रोजन खाद के प्रयोग से बचें", "अगले सीजन में रोगरोधी किस्मों के बीज इस्तेमाल करें", "संतुलित पौध दूरी बनाए रखें"],
        avoid: ["आवश्यकता से अधिक नाइट्रोजन डालना", "रोगग्रस्त क्षेत्रों में बहुत घनी बुआई करना"]
      },
      "Bacterial Leaf Spot": {
        immediate: "अधिक प्रभावित पत्तियों को हटा दें और पत्तियां गीली होने पर खेत में जाने से बचें।",
        recommendation: "कॉपर युक्त जीवाणुनाशक दवा का अनुशंसित मात्रा में प्रयोग करें।",
        prevention: ["प्रमाणित रोगमुक्त बीजों का उपयोग करें", "ऊपर से पानी देने से बचें", "फसल चक्र अपनाएं"],
        avoid: ["गीले पौधों को छूना", "बिना साफ किए उपकरणों का पुनः उपयोग करना"]
      },
      "Powdery Mildew": {
        immediate: "हवा का प्रवाह बढ़ाने के लिए घनी शाखाओं की छंटाई करें।",
        recommendation: "सफेद पाउडर दिखते ही सल्फर आधारित या उपयुक्त फफूंदनाशी का छिड़काव करें।",
        prevention: ["अत्यधिक नाइट्रोजन का प्रयोग न करें", "पौधों के बीच की दूरी बढ़ाएं", "प्रतिरोधी किस्मों का चयन करें"],
        avoid: ["अत्यधिक छायादार और घनी रोपाई", "कड़क धूप में छिड़काव करना"]
      },
      "Northern Leaf Blight": {
        immediate: "ज्यादा संक्रमित निचली पत्तियों को संभव हो तो हटा दें।",
        recommendation: "यदि धब्बे ऊपर की ओर बढ़ रहे हों तो अनुशंसित फफूंदनाशी लगाएं।",
        prevention: ["अन्य फसलों के साथ फसल चक्र अपनाएं", "रोगरोधी हाइब्रिड बीजों का उपयोग करें", "कटाई के बाद अवशेषों का सही प्रबंधन करें"],
        avoid: ["लगातार मक्के की ही खेती करना", "संक्रमित अवशेष खेत में छोड़ना"]
      }
    },
    weatherConditions: {
      "Clear sky": "साफ आसमान",
      "Partly cloudy": "आंशिक बादल",
      "Fog": "कोहरा",
      "Rain": "बारिश",
      "Rain showers": "बारिश की बौछारें",
      "Thunderstorm": "गरज के साथ तूफान",
      "Mixed conditions": "मिश्रित मौसम"
    },
    weatherSources: {
      live: "लाइव मौसम पूर्वानुमान",
      demo: "डेमो मोड"
    },
    actionWindow: {
      noSafeWindow: "अगले 24 घंटों में कोई सुरक्षित समय उपलब्ध नहीं है",
      noSafeReason: "पूरे पूर्वानुमान के दौरान बारिश या तेज हवा की संभावना है। कल दोबारा जांच करें।",
      today: "आज",
      tomorrow: "कल",
      rainSoonReason: "शीघ्र बारिश होने की संभावना है, इसलिए अभी छिड़काव न करें — यह समय कम बारिश और अनुकूल हवा वाला है।",
      safeReason: "इस समय बारिश की संभावना नगण्य है और हवा की गति छिड़काव के अनुकूल है।"
    },
    history: {
      today: "जांच की तारीख: आज",
      yesterday: "जांच की तारीख: कल",
      daysAgo: "जांच की तारीख: {x} दिन पहले"
    },
    diagnosisTemplate: (crop, disease) => `अपलोड की गई पत्ती की फोटो में धब्बों के आकार और रंग के आधार पर ${crop} में ${disease} के लक्षण पाए गए हैं।`
  },

  te: {
    ui: {
      brandSub: "పంట & వాతావరణ సలహా",
      statusAwaiting: "స్థితి: సమాచారం కోసం వేచి ఉంది",
      statusAnalyzing: "స్థితి: విశ్లేషిస్తోంది…",
      statusRainAlert: "స్థితి: త్వరలో వర్షం సూచన",
      statusTracked: "స్థితి: వాతావరణం నమోదు చేయబడింది",
      statusError: "స్థితి: పొరపాటు — డెమో డేటా చూపబడుతోంది",
      heroEyebrow: "మూడు దశల్లో పొలం నుండి ప్రత్యక్ష సలహా",
      heroTitle: "పొలం పరిస్థితులను సరైన నిర్ణయాలుగా మార్చుకోండి.",
      heroSub: "పంట ఆకు ఫోటోను అప్‌లోడ్ చేయండి, మీ ఊరి పేరు పంచుకోండి మరియు వర్షం పడేలోపు పిచికారీ చేయడానికి సురక్షితమైన సమయాన్ని తెలుసుకోండి.",
      heroCta: "నా పంటను విశ్లేషించండి",
      step1Title: "పంట ఆకు ఫోటో అప్‌లోడ్ చేయండి",
      step1Sub: "వ్యాధి సోకిన ఆకు స్పష్టమైన ఫోటో బాగా పనిచేస్తుంది.",
      dropPhotoStrong: "ఇక్కడ ఆకు ఫోటోను డ్రాప్ చేయండి",
      dropPhotoOr: "లేదా కింద ఉన్న ఆప్షన్ ఎంచుకోండి",
      uploadPhotoBtn: "ఫోటో అప్‌లోడ్ చేయండి",
      useCameraBtn: "కెమెరా ఉపయోగించండి",
      useSampleBtn: "సాంపిల్ ఫోటో చూడండి",
      changePhotoBtn: "ఫోటో మార్చండి",
      step2Title: "మీ ప్రాంతాన్ని నమోదు చేయండి",
      step2Sub: "మీ ప్రాంత వాతావరణ వివరాల కోసం.",
      locationPlaceholder: "గ్రామం లేదా నగరం పేరు",
      useLocationBtn: "నా స్థానాన్ని ఎంచుకో",
      noLocationSet: "ఇంకా స్థానం ఎంచుకోలేదు.",
      step3Title: "సలహా పొందండి",
      step3Sub: "పంట వ్యాధి నిర్ధారణ మరియు వాతావరణ వివరాల మేళవింపు.",
      analyzeBtn: "విశ్లేషణ ప్రారంభించు",
      needInputs: "కొనసాగడానికి ఫోటో మరియు స్థానాన్ని జోడించండి.",
      readyToAnalyze: "సిద్ధంగా ఉంది. సలహా పొందడానికి 'విశ్లేషణ ప్రారంభించు' నొక్కండి.",
      locationDenied: "స్థాన అనుమతి నిరాకరించబడింది. ఊరి పేరు నమోదు చేయండి.",
      locationUnavailable: "స్థానాన్ని గుర్తించలేకపోయాము.",
      noHistory: "ఈ సెషన్‌లో ఇంకా విశ్లేషణలు లేవు.",
      bestTimeToAct: "మందు పిచికారీకి అత్యుత్తమ సమయం",
      legendSafe: "సురక్షిత సమయం",
      legendCaution: "జాగ్రత్త వహించండి",
      legendAvoid: "పిచికారీ చేయవద్దు",
      cardCropHealth: "పంట ఆరోగ్యం",
      labelCrop: "పంట రకం",
      labelLikelyIssue: "సాధ్యమయ్యే వ్యాధి",
      labelConfidence: "సమీక్ష ఖచ్చితత్వం",
      cardDiagnosis: "AI వ్యాధి నిర్ధారణ",
      labelSymptomsDetected: "గుర్తించిన లక్షణాలు",
      cardTreatmentPlan: "నివారణ & చికిత్స ప్రణాళిక",
      labelImmediateAction: "తక్షణ చర్య",
      labelRecommendedTreatment: "సిఫార్సు చేసిన మందులు",
      labelPreventiveMeasures: "ముందస్తు జాగ్రత్తలు",
      labelAvoid: "నివారించవలసినవి",
      cardWeatherIntel: "వాతావరణ సమాచారం",
      labelTemperature: "ఉష్ణోగ్రత",
      labelHumidity: "గాలిలో తేమ",
      labelRainProb: "వర్షం పడే అవకాశం",
      labelWind: "గాలి వేగం",
      labelCondition: "వాతావరణ పరిస్థితి",
      labelSource: "సమాచార మూలం",
      historyTitle: "సలహా చరిత్ర",
      footerText: "CropShield AI — డెమో డాష్‌బోర్డ్.",
      alertRainTitle: "వర్షపు హెచ్చరిక",
      alertRainBody: "త్వరలో భారీ వర్షం కురిసే అవకాశం ఉంది. వాతావరణం అనుకూలించే వరకు పిచికారీ నిలిపివేయండి."
    },
    loadingSteps: [
      "పంట ఫోటోను విశ్లేషిస్తోంది…",
      "పంట ఆరోగ్యాన్ని తనిఖీ చేస్తోంది…",
      "వాతావరణ వివరాలను పరిశీలిస్తోంది…",
      "సురక్షిత పిచికారీ సమయాన్ని లెక్కిస్తోంది…",
      "రైతు సలహాను సిద్ధం చేస్తోంది…"
    ],
    crops: { Tomato: "టమోటా", Rice: "వరి (బియ్యం)", Chilli: "మిరప", Cotton: "ప్రత్తి", Maize: "జొన్న/మొక్కజొన్న" },
    severities: { Low: "తక్కువ తీవ్రత", Medium: "మధ్యస్థ తీవ్రత", High: "ఎక్కువ తీవ్రత" },
    diseases: {
      "Early Blight": "ఎర్లీ బ్లైట్ (మచ్చల తెగులు)",
      "Leaf Blast": "ఆకు అగ్గి తెగులు (Leaf Blast)",
      "Bacterial Leaf Spot": "బ్యాక్టీరియా ఆకు మచ్చ తెగులు",
      "Powdery Mildew": "బూడిద తెగులు (Powdery Mildew)",
      "Northern Leaf Blight": "మొక్కజొన్న ఆకు ఎండు తెగులు"
    },
    symptoms: {
      "Brown circular lesions with concentric rings": "గుండ్రటి గోధుమ రంగు మచ్చలు",
      "Yellowing around affected areas": "మచ్చల చుట్టూ పసుపు రంగులోకి మారడం",
      "Progressive lower-leaf damage": "క్రింది ఆకులు ఎక్కువగా దెబ్బతినడం",
      "Diamond-shaped grey lesions": "వజ్రం ఆకారంలో బూడిద రంగు మచ్చలు",
      "Lesion borders turning brown": "మచ్చల అంచులు గోధుమ రంగులోకి మారడం",
      "Wilting leaf tips": "ఆకుల చివర్లు ఎండిపోవడం",
      "Small water-soaked spots": "చిన్న నీటి మచ్చలు",
      "Spots merging into larger patches": "మచ్చలు పెద్దవిగా కలవడం",
      "Leaf drop in severe cases": "ఆకులు రాలిపోవడం",
      "White powdery coating on leaf surface": "ఆకు పైన తెల్లటి బూడిద పొర",
      "Slight leaf curling": "ఆకులు ముడుచుకోవడం",
      "Stunted new growth": "కొత్త ఎదుగుదల ఆగిపోవడం",
      "Long grey-green cigar-shaped lesions": "పొడవైన బూడిద రంగు మచ్చలు",
      "Lesions spreading along leaf veins": "ఈనెల వెంట తెగులు వ్యాపించడం",
      "Lower leaves affected first": "ముందుగా క్రింది ఆకులకు సోకడం"
    },
    treatments: {
      "Early Blight": {
        immediate: "తెగులు సోకిన క్రింది ఆకులను తుంచి నాశనం చేయండి.",
        recommendation: "కాపర్ ఆధారిత లేదా సిఫార్సు చేసిన సిలింధ్ర నాశిని పిచికారీ చేయండి.",
        prevention: ["పంట మార్పిడి పద్ధతి పాటించండి", "మొక్కల మధ్య తగిన దూరం ఉంచండి", "ఆకులపై కాకుండా మొదళ్ల వద్ద నీరు ఇవ్వండి"],
        avoid: ["సాయంత్రం వేళల్లో పైనుండి నీరు పెట్టడం", "ఆకులు తడిగా ఉన్నప్పుడు తోటలోకి వెళ్లడం"]
      },
      "Leaf Blast": {
        immediate: "చేనులో నిలిచిన నీటిని తీసివేసి తేమను తగ్గించండి.",
        recommendation: "అగ్గి తెగులు నివారణకు సిఫార్సు చేసిన మందులను పిచికారీ చేయండి.",
        prevention: ["నత్రజని ఎరువులు పరిమితి దాటి వాడకండి", "తెగులును తట్టుకునే రకాలను వాడండి"],
        avoid: ["అధిక నత్రజని వాడకం", "చాలా దట్టంగా నాట్లు వేయడం"]
      },
      "Bacterial Leaf Spot": {
        immediate: "తీవ్రంగా దెబ్బతిన్న ఆకులను తీసివేయండి.",
        recommendation: "కాపర్ ఆధారిత బ్యాక్టీరియా నాశిని వాడండి.",
        prevention: ["తెగులు లేని విత్తనాలను వాడండి", "మొక్కల పైన నీరు చల్లవద్దు"],
        avoid: ["తడి ఉన్నప్పుడు మొక్కలను తాకడం", "మురికి పనిముట్లు వాడటం"]
      },
      "Powdery Mildew": {
        immediate: "గాలి వెలుతురు తగిలేలా అనవసర కొమ్మలను తీసివేయండి.",
        recommendation: "సల్ఫర్ ఆధారిత మందులను పిచికారీ చేయండి.",
        prevention: ["అధిక నత్రజని ఎరువులు మానండి", "మొక్కల మధ్య దూరం పెంచండి"],
        avoid: ["దట్టమైన నీడ ఉండేలా నాటడం", "ఎండ తీవ్రత ఉన్నప్పుడు చల్లడం"]
      },
      "Northern Leaf Blight": {
        immediate: "బాధిత క్రింది ఆకులను తుంచివేయండి.",
        recommendation: "మచ్చలు పైకి వ్యాపిస్తుంటే సిఫార్సు చేసిన మందు చల్లండి.",
        prevention: ["వేరే పంటలతో పంట మార్పిడి చేయండి", "నాణ్యమైన విత్తనాలు వాడండి"],
        avoid: ["ఏకధాటిగా మొక్కజొన్నే వేయడం", "పాత వ్యర్థాలను పొలంలో ఉంచడం"]
      }
    },
    weatherConditions: {
      "Clear sky": "నిర్మలమైన ఆకాశం",
      "Partly cloudy": "పాక్షికంగా మబ్బులు",
      "Fog": " పొగమంచు",
      "Rain": "వర్షం",
      "Rain showers": "జల్లులు",
      "Thunderstorm": "రుతుపవనాల ఉరుములు",
      "Mixed conditions": "సాధారణ వాతావరణం"
    },
    weatherSources: {
      live: "లైవ్ వాతావరణ సమాచారం",
      demo: "డెమో మోడ్"
    },
    actionWindow: {
      noSafeWindow: "తరువాత 24 గంటల్లో పిచికారీకి అనుకూల సమయం లేదు",
      noSafeReason: "వర్షం లేదా ఈదురుగాలులు ఉండే అవకాశం ఉంది. రేపు మళ్లీ పరిశీలించండి.",
      today: "ఈ రోజు",
      tomorrow: "రేపు",
      rainSoonReason: "త్వరలో వర్షం పడే అవకాశం ఉన్నందున ఇప్పుడు పిచికారీ చేయవద్దు — ఈ సమయంలో గాలి వేగం తక్కువగా ఉంటుంది.",
      safeReason: "ఈ సమయంలో వర్షం పడే అవకాశం లేదు మరియు గాలి వేగం పిచికారీకి అనుకూలంగా ఉంది."
    },
    history: {
      today: "తేదీ: ఈ రోజు",
      yesterday: "తేదీ: నిన్న",
      daysAgo: "తేదీ: {x} రోజుల క్రితం"
    },
    diagnosisTemplate: (crop, disease) => `అప్‌లోడ్ చేసిన ఆకు ఆధారంగా ${crop} పంటలో ${disease} వ్యాధి లక్షణాలు గుర్తించబడ్డాయి.`
  },

  es: {
    ui: {
      brandSub: "Asesoramiento Agrícola y Climático",
      statusAwaiting: "Estado del campo: esperando datos",
      statusAnalyzing: "Estado del campo: analizando…",
      statusRainAlert: "Estado del campo: lluvia inminente",
      statusTracked: "Estado del campo: clima monitoreado",
      statusError: "Estado del campo: error — datos de muestra",
      heroEyebrow: "Del campo a la decisión en tres pasos",
      heroTitle: "Transforme las condiciones del campo en mejores decisiones.",
      heroSub: "Suba una foto de la hoja, comparta su ubicación y obtenga un diagnóstico con ventana meteorológica segura antes de la próxima lluvia.",
      heroCta: "Analizar mi cultivo",
      step1Title: "Subir imagen del cultivo",
      step1Sub: "Una foto clara de la hoja afectada funciona mejor.",
      dropPhotoStrong: "Arrastre la foto de la hoja aquí",
      dropPhotoOr: "o elija una opción abajo",
      uploadPhotoBtn: "Subir foto",
      useCameraBtn: "Usar cámara",
      useSampleBtn: "Usar foto de muestra",
      changePhotoBtn: "Cambiar foto",
      step2Title: "Compartir ubicación",
      step2Sub: "Utilizado para obtener el clima local en tiempo real.",
      locationPlaceholder: "Ingrese su municipio o ciudad",
      useLocationBtn: "Usar mi ubicación",
      noLocationSet: "Ninguna ubicación seleccionada.",
      step3Title: "Obtener recomendación",
      step3Sub: "Combina el diagnóstico del cultivo con el pronóstico meteorológico.",
      analyzeBtn: "Analizar cultivo",
      needInputs: "Agregue una foto y una ubicación para continuar.",
      readyToAnalyze: "Listo. Presione \"Analizar cultivo\" para obtener su asesoramiento.",
      locationDenied: "Acceso a la ubicación denegado. Ingrese su ciudad manualmente.",
      locationUnavailable: "No se pudo detectar la ubicación.",
      noHistory: "Sin análisis anteriores en esta sesión.",
      bestTimeToAct: "Mejor momento para aplicar",
      legendSafe: "Seguro para aplicar",
      legendCaution: "Precaución",
      legendAvoid: "Evitar aplicación",
      cardCropHealth: "Salud del cultivo",
      labelCrop: "Cultivo",
      labelLikelyIssue: "Problema probable",
      labelConfidence: "Precisión",
      cardDiagnosis: "Diagnóstico de IA",
      labelSymptomsDetected: "Síntomas detectados",
      cardTreatmentPlan: "Plan de tratamiento",
      labelImmediateAction: "Acción inmediata",
      labelRecommendedTreatment: "Tratamiento recomendado",
      labelPreventiveMeasures: "Medidas preventivas",
      labelAvoid: "A evitar",
      cardWeatherIntel: "Información meteorológica",
      labelTemperature: "Temperatura",
      labelHumidity: "Humedad",
      labelRainProb: "Probabilidad de lluvia",
      labelWind: "Viento",
      labelCondition: "Condición",
      labelSource: "Fuente",
      historyTitle: "Historial de análisis",
      footerText: "CropShield AI — prototipo de panel agrícola.",
      alertRainTitle: "Alerta de lluvia",
      alertRainBody: "Se esperan lluvias intensas pronto. Suspenda la fumigación hasta que mejore el tiempo."
    },
    loadingSteps: [
      "Analizando imagen del cultivo…",
      "Evaluando salud de la planta…",
      "Consultando pronóstico del clima…",
      "Calculando ventana de aplicación segura…",
      "Generando recomendación agrícola…"
    ],
    crops: { Tomato: "Tomate", Rice: "Arroz", Chilli: "Chile / Pimiento", Cotton: "Algodón", Maize: "Maíz" },
    severities: { Low: "RIESGO BAJO", Medium: "RIESGO MEDIO", High: "RIESGO ALTO" },
    diseases: {
      "Early Blight": "Tizón Temprano (Early Blight)",
      "Leaf Blast": "Añublo del Arroz (Leaf Blast)",
      "Bacterial Leaf Spot": "Mancha Bacteriana",
      "Powdery Mildew": "Oídio / Cenicilla",
      "Northern Leaf Blight": "Tizón Foliar del Maíz"
    },
    symptoms: {
      "Brown circular lesions with concentric rings": "Lesiones marrones circulares con anillos concéntricos",
      "Yellowing around affected areas": "Amarillamiento alrededor de las zonas afectadas",
      "Progressive lower-leaf damage": "Daño progresivo en hojas inferiores",
      "Diamond-shaped grey lesions": "Lesiones grises en forma de diamante",
      "Lesion borders turning brown": "Bordes de las lesiones tornándose marrones",
      "Wilting leaf tips": "Marchitamiento en las puntas de las hojas",
      "Small water-soaked spots": "Pequeñas manchas de aspecto acuoso",
      "Spots merging into larger patches": "Manchas que se unen formando parches más grandes",
      "Leaf drop in severe cases": "Caída de hojas en casos graves",
      "White powdery coating on leaf surface": "Capa de polvo blanco sobre la superficie de la hoja",
      "Slight leaf curling": "Enrollamiento ligero de las hojas",
      "Stunted new growth": "Crecimiento nuevo retardado",
      "Long grey-green cigar-shaped lesions": "Lesiones alargadas gris-verdosas en forma de puro",
      "Lesions spreading along leaf veins": "Lesiones extendiéndose a lo largo de las nervaduras",
      "Lower leaves affected first": "Las hojas inferiores se ven afectadas primero"
    },
    treatments: {
      "Early Blight": {
        immediate: "Retire y destruya las hojas inferiores más afectadas para frenar la propagación.",
        recommendation: "Aplique un fungicida a base de cobre o recomendado para tizón temprano.",
        prevention: ["Rotar cultivos la próxima temporada", "Mejorar la aireación con mayor distanciamiento", "Regar en la base y no sobre el follaje"],
        avoid: ["Riego por aspersión a última hora del día", "Trabajar en el campo con follaje húmedo"]
      },
      "Leaf Blast": {
        immediate: "Drene el agua estancada en el lote para reducir la humedad.",
        recommendation: "Aplique un fungicida recomendado para añublo al primer signo de lesiones.",
        prevention: ["Evitar exceso de fertilización nitrogenada", "Usar variedades de semilla resistentes"],
        avoid: ["Aplicación excesiva de nitrógeno", "Siembra demasiado densa"]
      },
      "Bacterial Leaf Spot": {
        immediate: "Elimine las hojas muy manchadas y evite manipular plantas húmedas.",
        recommendation: "Aplique un bactericida cúprico registrado para el cultivo.",
        prevention: ["Usar semilla certificada", "Evitar el riego aéreo"],
        avoid: ["Manipular plantas mojadas", "Reutilizar herramientas sin desinfectar"]
      },
      "Powdery Mildew": {
        immediate: "Pode brotes muy tupidos para mejorar la circulación del aire.",
        recommendation: "Aplique un fungicida a base de azufre o recomendado al notar la capa blanca.",
        prevention: ["Evitar exceso de nitrógeno", "Aumentar espacio entre plantas"],
        avoid: ["Siembras densas en sombra", "Fumigar durante las horas de más calor"]
      },
      "Northern Leaf Blight": {
        immediate: "Retire las hojas inferiores muy infectadas cuando sea práctico.",
        recommendation: "Aplique fungicida si las lesiones avanzan hacia la parte superior.",
        prevention: ["Rotar con cultivos no hospedantes", "Usar híbridos resistentes"],
        avoid: ["Monocultivo continuo de maíz", "Dejar rastrojo infectado en el lote"]
      }
    },
    weatherConditions: {
      "Clear sky": "Cielo despejado",
      "Partly cloudy": "Parcialmente nublado",
      "Fog": "Niebla",
      "Rain": "Lluvia",
      "Rain showers": "Chubascos",
      "Thunderstorm": "Tormenta eléctrica",
      "Mixed conditions": "Condiciones variables"
    },
    weatherSources: {
      live: "Pronóstico en vivo",
      demo: "Modo demostración"
    },
    actionWindow: {
      noSafeWindow: "Sin ventana segura en las próximas 24 horas",
      noSafeReason: "Condiciones de lluvia o viento persistente. Verifique nuevamente mañana.",
      today: "Hoy",
      tomorrow: "Mañana",
      rainSoonReason: "Se prevé lluvia pronto, evite fumigar ahora. Esta ventana presenta bajo riesgo de lluvia y viento moderado.",
      safeReason: "Esta ventana cuenta con baja probabilidad de lluvia y viento apto para la efectividad del producto."
    },
    history: {
      today: "Analizado: Hoy",
      yesterday: "Analizado: Ayer",
      daysAgo: "Analizado: Hace {x} días"
    },
    diagnosisTemplate: (crop, disease) => `La imagen cargada muestra patrones consistentes con ${disease} en el cultivo de ${crop}.`
  },

  fr: {
    ui: {
      brandSub: "Conseil Agricole & Climatique",
      statusAwaiting: "Statut du champ : en attente de données",
      statusAnalyzing: "Statut du champ : analyse en cours…",
      statusRainAlert: "Statut du champ : pluie imminente",
      statusTracked: "Statut du champ : météo suivie",
      statusError: "Statut du champ : erreur — mode démo",
      heroEyebrow: "Du champ à la décision en trois étapes",
      heroTitle: "Transformez les conditions du champ en décisions plus intelligentes.",
      heroSub: "Téléchargez une photo de feuille, partagez votre position et obtenez un diagnostic IA avec un créneau météo sécurisé avant la prochaine pluie.",
      heroCta: "Analyser ma culture",
      step1Title: "Télécharger une image",
      step1Sub: "Une photo claire de la feuille atteinte fonctionne le mieux.",
      dropPhotoStrong: "Déposez une photo de feuille ici",
      dropPhotoOr: "ou choisissez une option ci-dessous",
      uploadPhotoBtn: "Télécharger photo",
      useCameraBtn: "Prendre une photo",
      useSampleBtn: "Photo d'exemple",
      changePhotoBtn: "Changer de photo",
      step2Title: "Partager votre position",
      step2Sub: "Utilisé pour obtenir la météo locale en direct.",
      locationPlaceholder: "Entrez votre village ou ville",
      useLocationBtn: "Ma position",
      noLocationSet: "Aucune position sélectionnée.",
      step3Title: "Obtenir votre conseil",
      step3Sub: "Associe le diagnostic des cultures aux prévisions météo.",
      analyzeBtn: "Analyser la culture",
      needInputs: "Ajoutez une photo et une position pour continuer.",
      readyToAnalyze: "Prêt. Appuyez sur « Analyser la culture » pour obtenir votre conseil.",
      locationDenied: "Accès à la position refusé. Saisissez votre ville manuellement.",
      locationUnavailable: "Impossible de détecter la position.",
      noHistory: "Aucune analyse enregistrée durant cette session.",
      bestTimeToAct: "Meilleur moment pour traiter",
      legendSafe: "Traitement sûr",
      legendCaution: "Prudence",
      legendAvoid: "Ne pas traiter",
      cardCropHealth: "Santé de la culture",
      labelCrop: "Culture",
      labelLikelyIssue: "Problème probable",
      labelConfidence: "Fiabilité",
      cardDiagnosis: "Diagnostic IA",
      labelSymptomsDetected: "Symptômes détectés",
      cardTreatmentPlan: "Plan de traitement",
      labelImmediateAction: "Action immédiate",
      labelRecommendedTreatment: "Traitement recommandé",
      labelPreventiveMeasures: "Mesures préventives",
      labelAvoid: "À éviter",
      cardWeatherIntel: "Intelligence météo",
      labelTemperature: "Température",
      labelHumidity: "Humidité",
      labelRainProb: "Risque de pluie",
      labelWind: "Vent",
      labelCondition: "Conditions",
      labelSource: "Source",
      historyTitle: "Historique des conseils",
      footerText: "CropShield AI — tableau de bord prototype.",
      alertRainTitle: "Alerte pluie",
      alertRainBody: "De fortes pluies sont attendues bientôt. Reportez le traitement jusqu'à l'éclaircie."
    },
    loadingSteps: [
      "Analyse de l'image de la feuille…",
      "Évaluation de la santé de la culture…",
      "Vérification des données météo…",
      "Calcul de la fenêtre d'intervention sécurisée…",
      "Préparation de la recommandation…"
    ],
    crops: { Tomato: "Tomate", Rice: "Riz", Chilli: "Piment / Poivron", Cotton: "Coton", Maize: "Maïs" },
    severities: { Low: "RISQUE FAIBLE", Medium: "RISQUE MOYEN", High: "RISQUE ÉLEVÉ" },
    diseases: {
      "Early Blight": "Alternariose (Early Blight)",
      "Leaf Blast": "Pyriculariose du riz",
      "Bacterial Leaf Spot": "Taches bactériennes",
      "Powdery Mildew": "Oïdium",
      "Northern Leaf Blight": "Helminthosporiose du maïs"
    },
    symptoms: {
      "Brown circular lesions with concentric rings": "Lésions brunes circulaires avec anneaux concentriques",
      "Yellowing around affected areas": "Jaunissement autour des zones atteintes",
      "Progressive lower-leaf damage": "Dégâts progressifs sur les feuilles basses",
      "Diamond-shaped grey lesions": "Lésions grises en forme de losange",
      "Lesion borders turning brown": "Bords des lésions devenant bruns",
      "Wilting leaf tips": "Flétrissement de la pointe des feuilles",
      "Small water-soaked spots": "Petites taches d'aspect imbibé d'eau",
      "Spots merging into larger patches": "Taches fusionnant en plaques plus larges",
      "Leaf drop in severe cases": "Chute des feuilles dans les cas graves",
      "White powdery coating on leaf surface": "Feutrage blanc poudreux sur la feuille",
      "Slight leaf curling": "Léger enroulement des feuilles",
      "Stunted new growth": "Croissance des nouvelles pousses ralentie",
      "Long grey-green cigar-shaped lesions": "Longues lésions en forme de cigare",
      "Lesions spreading along leaf veins": "Lésions se propageant le long des nervures",
      "Lower leaves affected first": "Feuilles inférieures touchées en premier"
    },
    treatments: {
      "Early Blight": {
        immediate: "Retirez et détruisez les feuilles basses les plus touchées.",
        recommendation: "Appliquez un fongicide au cuivre ou homologué contre l'alternariose.",
        prevention: ["Pratiquer la rotation des cultures", "Augmenter l'espacement pour l'aération"],
        avoid: ["Arrosage par aspersion en fin de journée", "Manipuler les plantes mouillées"]
      },
      "Leaf Blast": {
        immediate: "Drainez l'eau stagnante pour réduire l'humidité ambiante.",
        recommendation: "Appliquez un fongicide recommandé dès l'apparition des lésions.",
        prevention: ["Éviter les excès d'engrais azotés", "Utiliser des variétés résistantes"],
        avoid: ["Sur-fertilisation azotée", "Semis trop dense"]
      },
      "Bacterial Leaf Spot": {
        immediate: "Retirez les feuilles très atteintes et ne travaillez pas sur feuillage humide.",
        recommendation: "Appliquez un bactéricide cuivré homologué.",
        prevention: ["Utiliser des semences saines certifiées", "Éviter l'arrosage foliaire"],
        avoid: ["Toucher les plantes mouillées", "Reutiliser des outils non désinfectés"]
      },
      "Powdery Mildew": {
        immediate: "Taillez les rameaux denses pour améliorer l'aération.",
        recommendation: "Appliquez un traitement au soufre dès l'apparition du feutrage blanc.",
        prevention: ["Limiter l'azote", "Espacer les plants"],
        avoid: ["Plantations trop ombragées", "Traiter en plein soleil"]
      },
      "Northern Leaf Blight": {
        immediate: "Enlevez les feuilles basses fortement atteintes.",
        recommendation: "Appliquez un fongicide si les taches gagnent le haut du plant.",
        prevention: ["Effectuer des rotations de cultures", "Utiliser des hybrides résistants"],
        avoid: ["Monoculture continue de maïs", "Laisser les résidus infectés sur le sol"]
      }
    },
    weatherConditions: {
      "Clear sky": "Ciel dégagé",
      "Partly cloudy": "Partiellement nuageux",
      "Fog": "Brouillard",
      "Rain": "Pluie",
      "Rain showers": "Averses",
      "Thunderstorm": "Orage",
      "Mixed conditions": "Conditions variables"
    },
    weatherSources: {
      live: "Prévisions en direct",
      demo: "Mode démo"
    },
    actionWindow: {
      noSafeWindow: "Aucun créneau sûr dans les prochaines 24h",
      noSafeReason: "Météo pluvieuse ou ventée. Réessayez demain.",
      today: "Aujourd'hui",
      tomorrow: "Demain",
      rainSoonReason: "Pluie prévue sous peu : évitez de traiter maintenant.",
      safeReason: "Faible risque de pluie et vent modéré idéal pour l'application."
    },
    history: {
      today: "Analysé : Aujourd'hui",
      yesterday: "Analysé : Hier",
      daysAgo: "Analysé : Il y a {x} jours"
    },
    diagnosisTemplate: (crop, disease) => `L'image montre des symptômes compatibles avec ${disease} sur la culture de ${crop}.`
  },

  sw: {
    ui: {
      brandSub: "Ushauri wa Mazao na Hali ya Hewa",
      statusAwaiting: "Hali ya shamba: inasubiri picha/eneo",
      statusAnalyzing: "Hali ya shamba: inachambua…",
      statusRainAlert: "Hali ya shamba: mvua inatarajiwa karibuni",
      statusTracked: "Hali ya shamba: hali ya hewa inapimwa",
      statusError: "Hali ya shamba: hitilafu — data ya mfano",
      heroEyebrow: "Hatua tatu kutoka shambani hadi ushauri",
      heroTitle: "Badili hali ya shamba kuwa maamuzi bora ya kilimo.",
      heroSub: "Weka picha ya jani, shiriki eneo lako, na upate utambuzi wa AI na muda salama wa kunyunyizia dawa kabla ya mvua.",
      heroCta: "Kagua zao langu",
      step1Title: "Weka picha ya zao",
      step1Sub: "Picha iliyonyooka ya jani lililoathirika inafanya kazi vyema.",
      dropPhotoStrong: "Weka picha ya jani hapa",
      dropPhotoOr: "au chagua chaguo hapa chini",
      uploadPhotoBtn: "Pakia picha",
      useCameraBtn: "Tumia kamera",
      useSampleBtn: "Picha ya mfano",
      changePhotoBtn: "Badilisha picha",
      step2Title: "Shiriki eneo lako",
      step2Sub: "Inatumika kupata hali ya hewa ya eneo lako.",
      locationPlaceholder: "Ingiza kijiji au mji",
      useLocationBtn: "Tumia eneo langu",
      noLocationSet: "Bado hujachagua eneo.",
      step3Title: "Pata ushauri wako",
      step3Sub: "Inachanganya utambuzi wa zao na utabiri wa hali ya hewa.",
      analyzeBtn: "Kagua zao",
      needInputs: "Weka picha na eneo ili kuendelea.",
      readyToAnalyze: "Tayari. Gusa \"Kagua zao\" ili kupata ushauri.",
      locationDenied: "Upatikanaji wa eneo umekataliwa. Andika mji wako.",
      locationUnavailable: "Haikuweza kutambua eneo.",
      noHistory: "Bado hakuna uchambuzi uliopita.",
      bestTimeToAct: "Wakati bora wa kunyunyizia dawa",
      legendSafe: "Ni salama kunyunyizia",
      legendCaution: "Chukua tahadhari",
      legendAvoid: "Epuka kunyunyizia",
      cardCropHealth: "Afya ya Zao",
      labelCrop: "Zao",
      labelLikelyIssue: "Tatizo linalowezekana",
      labelConfidence: "Uhakika",
      cardDiagnosis: "Utambuzi wa AI",
      labelSymptomsDetected: "Dalili zilizobainika",
      cardTreatmentPlan: "Mpango wa Tiba",
      labelImmediateAction: "Hatua ya haraka",
      labelRecommendedTreatment: "Tiba inayopendekezwa",
      labelPreventiveMeasures: "Hatua za kujikinga",
      labelAvoid: "Vitu vya kuepuka",
      cardWeatherIntel: "Taarifa za Hali ya Hewa",
      labelTemperature: "Joto",
      labelHumidity: "Unyevu wa hewa",
      labelRainProb: "Uwezekano wa mvua",
      labelWind: "Kasi ya upepo",
      labelCondition: "Hali ya hewa",
      labelSource: "Chanzo",
      historyTitle: "Kumbukumbu za ushauri",
      footerText: "CropShield AI — MFANO WA DASHIBODI.",
      alertRainTitle: "Tahadhari ya Mvua",
      alertRainBody: "Mvua kubwa inatarajiwa hivi karibuni. Sitisha unyunyizaji wa dawa mpaka hali itakapokuwa nzuri."
    },
    loadingSteps: [
      "Inachambua picha ya jani…",
      "Inakagua afya ya zao…",
      "Inapima hali ya hewa…",
      "Inakokotoa muda salama wa kunyunyizia…",
      "Inaandaa ushauri wa mkulima…"
    ],
    crops: { Tomato: "Nyanya", Rice: "Mchele / Mpunga", Chilli: "Pilipili", Cotton: "Pamba", Maize: "Mahindi" },
    severities: { Low: "HATARI NDOGO", Medium: "HATARI YA KATI", High: "HATARI KUBWA" },
    diseases: {
      "Early Blight": "Kimeta cha Nyanya (Early Blight)",
      "Leaf Blast": "Kinyao cha Mpunga (Leaf Blast)",
      "Bacterial Leaf Spot": "Madoa ya Bakteria kwenye Majani",
      "Powdery Mildew": "Ugonjwa wa Unga Unga (Powdery Mildew)",
      "Northern Leaf Blight": "Madoa ya Majani ya Mahindi"
    },
    symptoms: {
      "Brown circular lesions with concentric rings": "Madoa ya duara ya kahawia yenye mistari ya duara",
      "Yellowing around affected areas": "Majani kuwa ya manjano pembezoni",
      "Progressive lower-leaf damage": "Majani ya chini kuharibika kwa kasi",
      "Diamond-shaped grey lesions": "Madoa ya kijivu yenye umbo la almasi",
      "Lesion borders turning brown": "Pembezoni mwa madoa kuwa ya kahawia",
      "Wilting leaf tips": "Ncha za majani kukauka",
      "Small water-soaked spots": "Madoa madogo kama yenye maji",
      "Spots merging into larger patches": "Madoa kuungana na kuwa makubwa",
      "Leaf drop in severe cases": "Majani kudondoka katika hali mbaya",
      "White powdery coating on leaf surface": "Unga mweupe juu ya uso wa jani",
      "Slight leaf curling": "Majani kujikunja kidogo",
      "Stunted new growth": "Chipukizi mpya kudorora",
      "Long grey-green cigar-shaped lesions": "Madoa marefu ya kijivu na kijani",
      "Lesions spreading along leaf veins": "Madoa kuenea kufuata mishipa ya jani",
      "Lower leaves affected first": "Majani ya chini kuathirika kwanza"
    },
    treatments: {
      "Early Blight": {
        immediate: "Odoa na uangamize majani ya chini yaliyoathirika sana.",
        recommendation: "Piga dawa ya shaba (copper-based fungicide) inayopendekezwa.",
        prevention: ["Badilisha mazao msimu ujao", "Acha nafasi ya kutosha hewa ipite"],
        avoid: ["Kutilia maji juu ya maji jioni", "Kufanya kazi majani yakiwa mabichi"]
      },
      "Leaf Blast": {
        immediate: "Punguza maji yaliyotuama shambani ili kupunguza unyevu.",
        recommendation: "Piga dawa ya fangasi inayoshauriwa pindi tu madoa yanapoonekana.",
        prevention: ["Epuka mbolea ya nitrojeni iliyozidi", "Tumia mbegu zinazostahimili"],
        avoid: ["Ziada ya mbolea ya nitrojeni", "Kupanda kwa msongamano mkubwa"]
      },
      "Bacterial Leaf Spot": {
        immediate: "Ondoa majani yaliyo na madoa mengi.",
        recommendation: "Tumia dawa ya bakteria inayopendekezwa.",
        prevention: ["Tumia mbegu zilizothibitishwa", "Usinyunyizie maji juu ya majani"],
        avoid: ["Kugusa mimea ikiwa mbichi", "Kutumia vifaa bila kuvisafisha"]
      },
      "Powdery Mildew": {
        immediate: "Pogoa matawi yaliyosongamana ili kuongeza mzunguko wa hewa.",
        recommendation: "Piga dawa ya sulfuri inapoanza kuonekana.",
        prevention: ["Punguza nitrojeni", "Ongeza nafasi kati ya mimea"],
        avoid: ["Kupanda kivulini", "Kunyunyizia dawa wakati wa jua kali"]
      },
      "Northern Leaf Blight": {
        immediate: "Ondoa majani ya chini yaliyoathirika.",
        recommendation: "Piga dawa ikionekana inaenea kwenda juu.",
        prevention: ["Badilisha mazao na yasiyo ya familia hii", "Tumia mbegu chotara zinazohimili"],
        avoid: ["Kupanda mahindi mfululizo", "Kuaacha mabaki ya mimea yenye magonjwa"]
      }
    },
    weatherConditions: {
      "Clear sky": "Anga safi",
      "Partly cloudy": "Mawingu kiasi",
      "Fog": "Ukungu",
      "Rain": "Mvua",
      "Rain showers": "Mvua za rasharasha",
      "Thunderstorm": "Mvua ya radi",
      "Mixed conditions": "Hali ya mchanganyiko"
    },
    weatherSources: {
      live: "Utabiri wa moja kwa moja",
      demo: "Njia ya mfano (Demo)"
    },
    actionWindow: {
      noSafeWindow: "Hakuna muda salama katika masaa 24 yajayo",
      noSafeReason: "Hali ya mvua au upepo inaendelea. Angalia tena kesho.",
      today: "Leo",
      tomorrow: "Kesho",
      rainSoonReason: "Mvua inatarajiwa karibuni, epuka kunyunyizia sasa. Muda huu una upepo na unyevu unaofaa.",
      safeReason: "Muda huu una uwezekano mdogo wa mvua na upepo mzuri kwa dawa kufanya kazi."
    },
    history: {
      today: "Ilichanganuliwa: Leo",
      yesterday: "Ilichanganuliwa: Kesho yake / Jana",
      daysAgo: "Ilichanganuliwa: Siku {x} zilizopita"
    },
    diagnosisTemplate: (crop, disease) => `Picha iliyowekwa inaonyesha dalili za ${disease} kwenye zao la ${crop}.`
  }
};

/* --------------------------------------------------------------------------
   2. STATE & DOM REFERENCES
   -------------------------------------------------------------------------- */
const state = {
  currentLang: "en",
  imageDataUrl: null,
  imageMeta: null,
  location: { label: null, lat: null, lon: null, source: null },
  weather: null,
  diagnosis: null,
  advisory: null,
  actionWindow: null,
  history: []
};

const el = {};
function cacheDom() {
  [
    "langSelect",
    "uploadZone","fileInput","cameraInput","uploadEmpty","uploadPreview","previewImg",
    "chooseFileBtn","useCameraBtn","useSampleBtn","changeImageBtn",
    "locationInput","useLocationBtn","locationResult",
    "runAnalysisBtn","analyzeHint",
    "loadingPanel","loadingMessage","loadingProgressBar",
    "resultsSection","weatherAlertBanner","alertTitle","alertBody",
    "actionWindowTitle","actionWindowReason","ribbon",
    "cropName","diseaseName","confidenceValue","riskBadge","riskLabel",
    "diagnosisExplain","symptomList",
    "treatmentImmediate","treatmentRecommendation","treatmentPrevention","treatmentAvoid",
    "wxTemp","wxHumidity","wxRain","wxWind","wxCondition","wxSource",
    "historyList","historyEmpty",
    "headerStatus","statusDot","headerStatusText",
    "heroScanLine"
  ].forEach(id => { el[id] = document.getElementById(id); });
}

/* --------------------------------------------------------------------------
   3. i18n ENGINE & LANGUAGE SWITCHER
   -------------------------------------------------------------------------- */
function getLangDict(lang = state.currentLang) {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = "en";
  state.currentLang = lang;

  try {
    localStorage.setItem("cropshield_lang", lang);
  } catch (e) {
    /* ignore storage exceptions */
  }

  if (el.langSelect && el.langSelect.value !== lang) {
    el.langSelect.value = lang;
  }

  updateDomLanguage();
  updateAnalyzeReadiness();

  // If results are currently active, re-render them in the new language immediately
  if (state.diagnosis && !el.resultsSection.hidden) {
    renderResults();
  }

  renderHistory();
}

function updateDomLanguage() {
  const dict = getLangDict().ui;

  // Translate all elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.getAttribute("data-i18n");
    if (dict[key]) {
      node.textContent = dict[key];
    }
  });

  // Translate elements with data-i18n-ph (placeholders)
  document.querySelectorAll("[data-i18n-ph]").forEach(node => {
    const key = node.getAttribute("data-i18n-ph");
    if (dict[key]) {
      node.placeholder = dict[key];
    }
  });

  // Update HTML lang attribute for accessibility
  document.documentElement.lang = state.currentLang;
}

/* --------------------------------------------------------------------------
   4. IMAGE INPUT
   -------------------------------------------------------------------------- */
function setupImageInput() {
  el.chooseFileBtn.addEventListener("click", () => el.fileInput.click());
  el.useCameraBtn.addEventListener("click", () => el.cameraInput.click());
  el.changeImageBtn.addEventListener("click", () => {
    el.uploadPreview.hidden = true;
    el.uploadEmpty.hidden = false;
    state.imageDataUrl = null;
    state.imageMeta = null;
    updateAnalyzeReadiness();
  });
  el.useSampleBtn.addEventListener("click", useSampleImage);

  el.fileInput.addEventListener("change", e => handleImageUpload(e.target.files[0]));
  el.cameraInput.addEventListener("change", e => handleImageUpload(e.target.files[0]));

  // Drag & drop
  ["dragover", "dragenter"].forEach(evt =>
    el.uploadZone.addEventListener(evt, e => { e.preventDefault(); el.uploadZone.classList.add("dragover"); })
  );
  ["dragleave", "drop"].forEach(evt =>
    el.uploadZone.addEventListener(evt, e => { e.preventDefault(); el.uploadZone.classList.remove("dragover"); })
  );
  el.uploadZone.addEventListener("drop", e => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  });
  el.uploadZone.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.fileInput.click(); }
  });
}

function handleImageUpload(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.imageDataUrl = reader.result;
    state.imageMeta = { name: file.name, size: file.size, sampled: false };
    showImagePreview(reader.result);
    updateAnalyzeReadiness();
  };
  reader.readAsDataURL(file);
}

function useSampleImage() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
      <rect width="300" height="220" fill="#EAF1E3"/>
      <path d="M150 20 C90 40 70 100 85 165 C95 195 125 208 150 214 C175 208 205 195 215 165 C230 100 210 40 150 20 Z"
            fill="#7FAE55" stroke="#1F4D2C" stroke-width="3"/>
      <path d="M150 34 L150 205" stroke="#1F4D2C" stroke-width="2"/>
      <ellipse cx="120" cy="95" rx="16" ry="10" fill="#B5651D" opacity="0.75"/>
      <ellipse cx="105" cy="130" rx="10" ry="7" fill="#B5651D" opacity="0.6"/>
      <ellipse cx="175" cy="150" rx="13" ry="8" fill="#B5651D" opacity="0.55"/>
    </svg>`;
  const dataUrl = "data:image/svg+xml;base64," + btoa(svg);
  state.imageDataUrl = dataUrl;
  state.imageMeta = { name: "sample-leaf.svg", size: 0, sampled: true };
  showImagePreview(dataUrl);
  updateAnalyzeReadiness();
}

function showImagePreview(src) {
  el.previewImg.src = src;
  el.uploadEmpty.hidden = true;
  el.uploadPreview.hidden = false;
}

/* --------------------------------------------------------------------------
   5. LOCATION INPUT
   -------------------------------------------------------------------------- */
function setupLocationInput() {
  el.useLocationBtn.addEventListener("click", getUserLocation);
  el.locationInput.addEventListener("input", () => {
    if (state.location.source === "geolocation") {
      state.location = { label: null, lat: null, lon: null, source: null };
    }
    updateAnalyzeReadiness();
  });
}

function getUserLocation() {
  const dict = getLangDict().ui;
  if (!navigator.geolocation) {
    setLocationResult(dict.locationUnavailable, false);
    return;
  }
  el.useLocationBtn.disabled = true;
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      state.location = {
        label: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
        lat: latitude, lon: longitude, source: "geolocation"
      };
      el.locationInput.value = state.location.label;
      setLocationResult(`📍 ${state.location.label}`, true);
      el.useLocationBtn.disabled = false;
      updateAnalyzeReadiness();
    },
    err => {
      const msg = err.code === err.PERMISSION_DENIED ? dict.locationDenied : dict.locationUnavailable;
      setLocationResult(msg, false);
      el.useLocationBtn.disabled = false;
    },
    { timeout: 8000 }
  );
}

function setLocationResult(text, isSet) {
  el.locationResult.textContent = text;
  el.locationResult.classList.toggle("set", isSet);
}

async function resolveLocation() {
  if (state.location.lat != null) return state.location;

  const query = el.locationInput.value.trim();
  if (!query) return null;

  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`);
    if (!res.ok) throw new Error("geocode failed");
    const data = await res.json();
    if (data.results && data.results.length) {
      const r = data.results[0];
      state.location = {
        label: `${r.name}${r.admin1 ? ", " + r.admin1 : ""}`,
        lat: r.latitude, lon: r.longitude, source: "geocoded"
      };
      setLocationResult(`📍 ${state.location.label}`, true);
      return state.location;
    }
  } catch (e) {
    console.warn("Geocoding unavailable, using approximate fallback:", e);
  }

  state.location = { label: query, lat: 16.5, lon: 80.6, source: "fallback" };
  setLocationResult(`📍 ${state.location.label} (approximate)`, true);
  return state.location;
}

function updateAnalyzeReadiness() {
  const dict = getLangDict().ui;
  const hasImage = !!state.imageDataUrl;
  const hasLocation = !!(el.locationInput.value.trim() || state.location.lat != null);
  el.runAnalysisBtn.disabled = !(hasImage && hasLocation);
  el.analyzeHint.textContent = el.runAnalysisBtn.disabled ? dict.needInputs : dict.readyToAnalyze;
}

/* --------------------------------------------------------------------------
   6. WEATHER API
   -------------------------------------------------------------------------- */
async function fetchWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,windspeed_10m,weathercode` +
      `&current_weather=true&forecast_days=2&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("weather fetch failed: " + res.status);
    const data = await res.json();
    return normalizeLiveWeather(data);
  } catch (e) {
    console.warn("Live weather unavailable, using demo weather:", e);
    return getMockWeather();
  }
}

function normalizeLiveWeather(data) {
  const now = new Date();
  const hourly = data.hourly;
  const startIdx = hourly.time.findIndex(t => new Date(t) >= now);
  const from = Math.max(startIdx, 0);

  const hourlySlice = hourly.time.slice(from, from + 24).map((t, i) => ({
    time: new Date(t),
    temp: hourly.temperature_2m[from + i],
    humidity: hourly.relative_humidity_2m[from + i],
    rainProb: hourly.precipitation_probability[from + i],
    wind: hourly.windspeed_10m[from + i],
    code: hourly.weathercode[from + i]
  }));

  return {
    source: "live",
    current: {
      temp: data.current_weather.temperature,
      wind: data.current_weather.windspeed,
      code: data.current_weather.weathercode,
      conditionKey: getConditionKey(data.current_weather.weathercode),
      humidity: hourlySlice[0] ? hourlySlice[0].humidity : null,
      rainProb: hourlySlice[0] ? hourlySlice[0].rainProb : null
    },
    hourly: hourlySlice
  };
}

function getConditionKey(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 61, 63, 65].includes(code)) return "Rain";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Mixed conditions";
}

function getMockWeather() {
  const now = new Date();
  const hourly = [];
  for (let i = 0; i < 24; i++) {
    const t = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = t.getHours();
    const rainProb = hour >= 13 && hour <= 18 ? 55 + Math.round(Math.sin(i) * 15) : 10 + Math.round(Math.abs(Math.sin(i)) * 10);
    hourly.push({
      time: t,
      temp: 24 + Math.round(Math.sin(i / 4) * 5),
      humidity: 55 + Math.round(Math.cos(i / 5) * 15),
      rainProb: Math.max(5, Math.min(90, rainProb)),
      wind: 8 + Math.round(Math.abs(Math.sin(i / 3)) * 10),
      code: rainProb > 50 ? 61 : 2
    });
  }
  return {
    source: "demo",
    current: {
      temp: hourly[0].temp, wind: hourly[0].wind,
      code: hourly[0].code,
      conditionKey: hourly[0].rainProb > 50 ? "Rain" : "Partly cloudy",
      humidity: hourly[0].humidity, rainProb: hourly[0].rainProb
    },
    hourly
  };
}

/* --------------------------------------------------------------------------
   7. CROP ANALYSIS ENGINE
   -------------------------------------------------------------------------- */
const DIAGNOSIS_DB = [
  { cropKey: "Tomato", diseaseKey: "Early Blight", severity: "Medium",
    symptomKeys: ["Brown circular lesions with concentric rings", "Yellowing around affected areas", "Progressive lower-leaf damage"] },
  { cropKey: "Rice", diseaseKey: "Leaf Blast", severity: "High",
    symptomKeys: ["Diamond-shaped grey lesions", "Lesion borders turning brown", "Wilting leaf tips"] },
  { cropKey: "Chilli", diseaseKey: "Bacterial Leaf Spot", severity: "Medium",
    symptomKeys: ["Small water-soaked spots", "Spots merging into larger patches", "Leaf drop in severe cases"] },
  { cropKey: "Cotton", diseaseKey: "Powdery Mildew", severity: "Low",
    symptomKeys: ["White powdery coating on leaf surface", "Slight leaf curling", "Stunted new growth"] },
  { cropKey: "Maize", diseaseKey: "Northern Leaf Blight", severity: "Medium",
    symptomKeys: ["Long grey-green cigar-shaped lesions", "Lesions spreading along leaf veins", "Lower leaves affected first"] }
];

async function analyzeCrop(imageMeta) {
  await wait(400);
  return getMockDiagnosis(imageMeta);
}

function getMockDiagnosis(imageMeta) {
  const pick = DIAGNOSIS_DB[Math.floor(Math.random() * DIAGNOSIS_DB.length)];
  const confidence = 80 + Math.floor(Math.random() * 16);
  return {
    cropKey: pick.cropKey,
    diseaseKey: pick.diseaseKey,
    severity: pick.severity,
    confidence,
    symptomKeys: pick.symptomKeys,
    source: imageMeta && imageMeta.sampled ? "sample" : "upload"
  };
}

/* --------------------------------------------------------------------------
   8. ADVISORY + DECISION ENGINE
   -------------------------------------------------------------------------- */
function generateAdvisory(diagnosis) {
  return {
    diseaseKey: diagnosis.diseaseKey
  };
}

function calculateActionWindow(weather) {
  const RAIN_MAX = 30;
  const WIND_MAX = 18;
  const HUMIDITY_MAX = 85;

  const hourly = weather.hourly;
  const segments = [];
  for (let i = 0; i < hourly.length; i += 2) {
    const a = hourly[i], b = hourly[i + 1] || hourly[i];
    const rainProb = Math.max(a.rainProb, b.rainProb);
    const wind = Math.max(a.wind, b.wind);
    const humidity = Math.max(a.humidity, b.humidity);
    const safe = rainProb <= RAIN_MAX && wind <= WIND_MAX && humidity <= HUMIDITY_MAX;
    const caution = !safe && rainProb <= RAIN_MAX + 20 && wind <= WIND_MAX + 8;
    segments.push({
      start: a.time, end: b.time,
      rainProb, wind, humidity,
      status: safe ? "safe" : caution ? "caution" : "avoid"
    });
  }

  const recommendedIndex = segments.findIndex(s => s.status === "safe");
  const rainSoon = weather.hourly.slice(0, 3).some(h => h.rainProb >= RAIN_MAX + 20);

  return {
    segments,
    recommendedIndex,
    rainSoon
  };
}

/* --------------------------------------------------------------------------
   9. ORCHESTRATION
   -------------------------------------------------------------------------- */
async function runAnalysis() {
  const langPack = getLangDict();
  el.runAnalysisBtn.disabled = true;
  el.resultsSection.hidden = true;
  el.loadingPanel.hidden = false;
  setHeaderStatus("busy", langPack.ui.statusAnalyzing);

  try {
    await stepThroughLoadingMessages();

    const location = await resolveLocation();
    const [diagnosis, weather] = await Promise.all([
      analyzeCrop(state.imageMeta),
      fetchWeather(location.lat, location.lon)
    ]);

    const advisory = generateAdvisory(diagnosis);
    const actionWindow = calculateActionWindow(weather);

    state.diagnosis = diagnosis;
    state.weather = weather;
    state.advisory = advisory;
    state.actionWindow = actionWindow;

    renderResults();
    addToHistory(diagnosis);

    const updatedDict = getLangDict();
    setHeaderStatus(actionWindow.rainSoon ? "alert" : "ok",
      actionWindow.rainSoon ? updatedDict.ui.statusRainAlert : updatedDict.ui.statusTracked);
  } catch (err) {
    console.error("Analysis failed:", err);
    const updatedDict = getLangDict();
    setHeaderStatus("alert", updatedDict.ui.statusError);
  } finally {
    el.loadingPanel.hidden = true;
    el.runAnalysisBtn.disabled = false;
  }
}

function stepThroughLoadingMessages() {
  return new Promise(resolve => {
    let i = 0;
    const tick = () => {
      const steps = getLangDict().loadingSteps;
      el.loadingMessage.textContent = steps[i] || steps[0];
      el.loadingProgressBar.style.width = `${Math.round(((i + 1) / steps.length) * 100)}%`;
      i++;
      if (i < steps.length) setTimeout(tick, 480);
      else setTimeout(resolve, 380);
    };
    el.loadingProgressBar.style.width = "0%";
    tick();
  });
}

/* --------------------------------------------------------------------------
   10. RENDERING
   -------------------------------------------------------------------------- */
function renderResults() {
  const { diagnosis, weather, advisory, actionWindow } = state;
  const langPack = getLangDict();

  // Translated names
  const translatedCrop = langPack.crops[diagnosis.cropKey] || diagnosis.cropKey;
  const translatedDisease = langPack.diseases[diagnosis.diseaseKey] || diagnosis.diseaseKey;
  const translatedSeverity = langPack.severities[diagnosis.severity] || diagnosis.severity;

  // Crop health card
  el.cropName.textContent = translatedCrop;
  el.diseaseName.textContent = translatedDisease;
  el.confidenceValue.textContent = `${diagnosis.confidence}%`;
  el.riskLabel.textContent = `RISK: ${translatedSeverity}`;
  el.riskBadge.className = "risk-badge " + diagnosis.severity.toLowerCase();

  // Diagnosis card
  el.diagnosisExplain.textContent = langPack.diagnosisTemplate(translatedCrop, translatedDisease);
  el.symptomList.innerHTML = diagnosis.symptomKeys.map(key => {
    const symptomText = langPack.symptoms[key] || key;
    return `<li>${symptomText}</li>`;
  }).join("");

  // Treatment card
  const treatmentObj = langPack.treatments[advisory.diseaseKey] || TRANSLATIONS.en.treatments["Early Blight"];
  el.treatmentImmediate.textContent = treatmentObj.immediate;
  el.treatmentRecommendation.textContent = treatmentObj.recommendation;
  el.treatmentPrevention.innerHTML = treatmentObj.prevention.map(s => `<li>${s}</li>`).join("");
  el.treatmentAvoid.innerHTML = treatmentObj.avoid.map(s => `<li>${s}</li>`).join("");

  // Weather card
  el.wxTemp.textContent = `${Math.round(weather.current.temp)}°C`;
  el.wxHumidity.textContent = `${Math.round(weather.current.humidity)}%`;
  el.wxRain.textContent = `${Math.round(weather.current.rainProb)}%`;
  el.wxWind.textContent = `${Math.round(weather.current.wind)} km/h`;
  el.wxCondition.textContent = langPack.weatherConditions[weather.current.conditionKey] || weather.current.conditionKey;
  el.wxSource.textContent = weather.source === "live" ? langPack.weatherSources.live : langPack.weatherSources.demo;

  // Weather alert banner
  if (actionWindow.rainSoon) {
    el.weatherAlertBanner.hidden = false;
  } else {
    el.weatherAlertBanner.hidden = true;
  }

  // Action window title & reason
  const awPack = langPack.actionWindow;
  if (actionWindow.recommendedIndex === -1) {
    el.actionWindowTitle.textContent = awPack.noSafeWindow;
    el.actionWindowReason.textContent = awPack.noSafeReason;
  } else {
    const seg = actionWindow.segments[actionWindow.recommendedIndex];
    const sameDay = seg.start.toDateString() === new Date().toDateString();
    const dayLabel = sameDay ? awPack.today : awPack.tomorrow;
    el.actionWindowTitle.textContent = `${dayLabel} · ${formatTime(seg.start)} – ${formatTime(seg.end)}`;
    el.actionWindowReason.textContent = actionWindow.rainSoon ? awPack.rainSoonReason : awPack.safeReason;
  }

  renderRibbon(actionWindow);

  el.resultsSection.hidden = false;
}

function renderRibbon(actionWindow) {
  el.ribbon.innerHTML = "";
  actionWindow.segments.forEach((seg, i) => {
    const div = document.createElement("div");
    div.className = "ribbon-seg " + seg.status + (i === actionWindow.recommendedIndex ? " recommended" : "");
    div.title = `${formatTime(seg.start)}–${formatTime(seg.end)}: ${seg.status}`;
    if (i === 0 || i === actionWindow.segments.length - 1 || i === actionWindow.recommendedIndex) {
      const label = document.createElement("span");
      label.className = "seg-label";
      label.textContent = formatTime(seg.start);
      div.appendChild(label);
    }
    el.ribbon.appendChild(div);
  });
}

function setHeaderStatus(kind, text) {
  el.statusDot.className = "status-dot " + (kind === "ok" ? "ok" : kind === "alert" ? "alert" : "");
  el.headerStatusText.textContent = text;
}

/* --------------------------------------------------------------------------
   11. HISTORY
   -------------------------------------------------------------------------- */
function addToHistory(diagnosis) {
  state.history.unshift({
    cropKey: diagnosis.cropKey,
    diseaseKey: diagnosis.diseaseKey,
    when: new Date()
  });
  renderHistory();
}

function renderHistory() {
  const langPack = getLangDict();

  if (!state.history.length) {
    el.historyList.innerHTML = `<p class="history-empty">${langPack.ui.noHistory}</p>`;
    return;
  }

  el.historyList.innerHTML = state.history.map(item => {
    const translatedCrop = langPack.crops[item.cropKey] || item.cropKey;
    const translatedDisease = langPack.diseases[item.diseaseKey] || item.diseaseKey;
    return `
      <div class="history-item">
        <div class="crop">${translatedCrop}</div>
        <div class="disease">${translatedDisease}</div>
        <div class="when">${relativeDay(item.when, langPack)}</div>
      </div>
    `;
  }).join("");
}

/* --------------------------------------------------------------------------
   UTILITIES
   -------------------------------------------------------------------------- */
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function relativeDay(date, langPack) {
  const now = new Date();
  const diffDays = Math.floor((now - date) / 86400000);
  const hp = langPack.history;
  if (diffDays <= 0) return hp.today;
  if (diffDays === 1) return hp.yesterday;
  return hp.daysAgo.replace("{x}", diffDays);
}

/* --------------------------------------------------------------------------
   12. INIT
   -------------------------------------------------------------------------- */
function init() {
  cacheDom();
  setupImageInput();
  setupLocationInput();

  // Language selector listener
  if (el.langSelect) {
    el.langSelect.addEventListener("change", e => setLanguage(e.target.value));
  }

  el.runAnalysisBtn.addEventListener("click", runAnalysis);

  // Restore saved language preference or default to 'en'
  let savedLang = "en";
  try {
    savedLang = localStorage.getItem("cropshield_lang") || "en";
  } catch (e) {
    /* ignore storage exceptions */
  }

  setLanguage(savedLang);
}

document.addEventListener("DOMContentLoaded", init);
