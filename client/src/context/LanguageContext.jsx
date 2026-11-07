import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, fallback) => fallback || key,
});

export const translations = {
  en: {
    // Top Micro-bar & Navbar
    nav: {
      channelsActive: 'Direct Import Channels Active',
      nextBatch: 'Next Batch Dispatch: Weekly Air & Sea Freight',
      catalog: 'Catalog',
      electronics: 'Electronics',
      materials: 'Clothing & Materials',
      track: 'Track Order',
      customRequest: 'Request Custom Import',
      admin: 'Admin Portal',
      whatsapp: 'WhatsApp:',
      telegram: 'Telegram',
      lightMode: 'Switch to Light Mode',
      darkMode: 'Switch to Dark Mode',
    },

    // Hero Section
    hero: {
      tag: 'DIRECT SOURCING',
      hubs: 'DUBAI · SHENZHEN · ISTANBUL · US',
      titleLine1: 'Direct Import',
      titleLine2: 'on Demand',
      subtitle:
        'Eliminate retail markups. Direct international procurement for MacBooks, mobile workstations, flagship phones, and wholesale Turkish textiles with instant Telegram & WhatsApp batch confirmation.',
      ctaCatalog: 'Browse Pre-Order Catalog',
      ctaCustom: 'Request Custom Import (REQ-XXXX)',
      metric1Value: '100%',
      metric1Label: 'Direct Procurement',
      metric2Value: '7-14',
      metric2Label: 'Air Freight Lead Days',
      metric3Value: '0%',
      metric3Label: 'Middleman Markups',
      metric4Value: '24h',
      metric4Label: 'Batch Rate Quoting',
    },

    // How it Works 3 Steps
    protocol: {
      tag: 'DIRECT SOURCING PROTOCOL',
      title: 'How Import-on-Demand Operates',
      subtitle:
        'Because international forex and supplier lots fluctuate, our hybrid protocol locks in genuine wholesale pricing before dispatch.',
      step1Num: 'STEP 01',
      step1Title: 'Select Product or Custom Spec',
      step1Desc:
        'Browse our curated electronics and raw fabric batches, or submit exact model specifications using our custom sourcing desk.',
      step2Num: 'STEP 02',
      step2Title: 'Confirm Deposit on WhatsApp / TG',
      step2Desc:
        'Your submission generates an instant reference code. Chat with our dispatch desk to lock in current exchange rates and delivery dates.',
      step3Num: 'STEP 03',
      step3Title: 'Track 5-Stage Flight Dispatch',
      step3Desc:
        'Your item is procured from international distributors, freight-dispatched, and cleared through customs. Track live checkpoint progress on our tracker.',
    },

    // Landing Page Categories Strip
    categoriesSection: {
      tag: 'BROWSE PROCUREMENT SECTORS',
      title: 'Explore Sourcing Categories',
      subtitle: 'Select a vertical to instantly filter active batches and landed inventory.',
      laptops: 'Laptops & Workstations',
      laptopsDesc: 'MacBook Pro, ThinkPad, Dell XPS with international warranty',
      smartphones: 'Flagship Smartphones',
      smartphonesDesc: 'Brand new & open box iPhones, Samsung Galaxy & Google Pixel',
      hardware: 'PC Hardware & Peripherals',
      hardwareDesc: 'GPUs, high-speed RAM, SSD storage, and studio monitors',
      cotton: 'Turkish Cotton & Textiles',
      cottonDesc: 'High thread count premium rolls, jersey knits & woven fabrics',
      denim: 'Selvedge Raw Denim',
      denimDesc: 'Heavyweight shuttle loom denim rolls from Istanbul mills',
      blanks: 'Wholesale Heavyweight Blanks',
      blanksDesc: '400+ GSM heavyweight fleece hoodies, joggers & oversized tees',
      viewAll: 'View Category →',
    },

    // Catalog Section
    catalog: {
      tag: 'ACTIVE BATCHES',
      title: 'Pre-Order Catalog & In-Stock Inventory',
      subtitle: 'All prices include consolidated import freight. Reserve your quota before weekly international batch lock-in.',
      allCategories: 'All Categories',
      electronicsTab: 'Electronics & Laptops',
      materialsTab: 'Clothing & Raw Materials',
      searchPlaceholder: 'Search MacBook, iPhone, RTX, Turkish cotton, denim...',
      stockLabel: 'Stock:',
      stockAll: 'All Items',
      stockInStock: 'In Stock Locally',
      stockPreorder: 'Pre-Order Import',
      sortLabel: 'Sort:',
      sortFeatured: 'Featured First',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      sortNewest: 'Newest Additions',
      noItemsTitle: 'No Catalog Items Found',
      noItemsDesc: "We couldn't find any items matching your selected criteria. Looking for a specific model or fabric roll not in our catalog?",
      clearFilters: 'Clear Filters',
      requestCustom: 'Request Custom Import',
      retry: 'Retry',
      errorTitle: 'Failed to load catalog products.',
      errorCheck: 'Please check server connection.',
    },

    // Product Card
    card: {
      inStock: 'In Stock Locally',
      preorder: 'Pre-Order: 7-14 Days',
      outOfStock: 'Sold Out',
      startingAt: 'Starting from',
      inquirePrice: 'Ask for Batch Price',
      perUnit: 'Per',
      moq: 'MOQ:',
      details: 'Details',
      preorderBtn: 'Pre-Order',
      orderNowBtn: 'Order Now',
    },

    // Bottom Sourcing Desk Banner
    sourcingBanner: {
      badge: 'Sourcing Desk for Unlisted Items',
      title: 'Looking for a Specific Model or Textile Not in the Catalog?',
      desc: 'Submit the model number, target budget, and required specifications. Our procurement team in Dubai and Guangzhou will quote you the current batch rate within 24 hours.',
      cta: 'Request Custom Import (REQ-XXXX) →',
    },

    // Pre-Order Modal
    modal: {
      title: 'Reserve Pre-Order Quota',
      subtitle: 'Locks in your batch pricing with our verified international suppliers.',
      leadTime: 'Estimated lead time:',
      specsSelection: 'Specification / Hardware Configuration',
      selectSpecPlaceholder: 'Select specs...',
      quantity: 'Order Quantity',
      moqWarning: 'Minimum order quantity for this item is',
      nameLabel: 'Your Full Name *',
      namePlaceholder: 'e.g., Abebe Bikila',
      phoneLabel: 'Phone Number (Calling / SMS) *',
      phonePlaceholder: '+251 9... or 09...',
      messagingLabel: 'WhatsApp or Telegram Username (Optional)',
      messagingPlaceholder: '+251... or @username',
      addressLabel: 'Delivery City & Area / Sub-city *',
      addressPlaceholder: 'e.g., Addis Ababa, Bole Medhanialem',
      notesLabel: 'Special Requests / Configuration Notes (Optional)',
      notesPlaceholder: 'e.g., Space Gray preferred, English keyboard layout',
      cancel: 'Cancel',
      submitting: 'Submitting Pre-Order...',
      submitPreorder: 'Submit Pre-Order & Get Code',
      submitOrder: 'Confirm Order & Get Code',
    },

    // Instant Messaging Handoff
    handoff: {
      preorderLogged: 'Pre-Order Logged',
      requestLogged: 'Custom Request Logged',
      nextStepTitle: 'Next Step: Instant Messaging Handoff',
      nextStepDesc:
        'Your request is saved in our system. Because import batch prices and currency rates fluctuate, tap below to confirm with the importer desk on WhatsApp or Telegram.',
      refCodeLabel: 'Reference Tracking Code',
      copyCode: 'Copy Code',
      copied: 'Copied!',
      confirmWhatsApp: 'Confirm on WhatsApp',
      confirmTelegram: 'Confirm on Telegram',
      previewTitle: 'Pre-filled Chat Message:',
      copyMessage: 'Copy Message',
      openTracker: 'Open Live Shipment Tracker →',
      continueBrowsing: 'Continue Browsing',
    },

    // Tracker Page
    tracker: {
      title: 'Shipment & Import Milestone Tracker',
      subtitle: 'Enter your Reference Code (IMP-XXXX or REQ-XXXX) to track supplier procurement, flight dispatch, and local arrival.',
      placeholder: 'Enter Reference Code (e.g. IMP-1024 or REQ-5012)...',
      trackBtn: 'Track Shipment',
      tracking: 'Looking up...',
      trySample: 'Try sample codes:',
      statusTitle: 'Current Milestone Status',
      estimatedDelivery: 'Estimated Delivery Window:',
      orderSummary: 'Order Snapshot',
      customerDetails: 'Customer Details',
      notFoundTitle: 'Code Not Found',
      notFoundDesc: 'Please verify the code provided in your WhatsApp or Telegram confirmation.',
    },

    // Custom Sourcing Request Page
    customRequest: {
      title: 'Request Custom Sourcing & Import',
      subtitle: 'Need a specific laptop configuration, gaming handheld, bulk fabric, or industrial component not listed in our catalog? Our procurement team in Dubai, Shenzhen, and Istanbul will locate it.',
      categoryLabel: 'Product Vertical *',
      itemNameLabel: 'Exact Item Name, Model Number, or Fabric Type *',
      itemNamePlaceholder: 'e.g., Framework Laptop 16 (Ryzen 7 7840HS) or 100% Bamboo Lyocell 300 GSM',
      specsLabel: 'Desired Specifications, Configuration & Quantity *',
      specsPlaceholder: 'Detail the RAM, storage, GPU, color, or exact roll yardage/weight needed...',
      budgetLabel: 'Target Budget / Ceiling (Optional)',
      budgetPlaceholder: 'e.g., ~120,000 ETB or $850 USD',
      linkImageLabel: 'Reference Link or Spec Sheet URL (Optional)',
      linkImagePlaceholder: 'https://...',
      submitBtn: 'Submit Sourcing Request & Get REQ-XXXX Code',
    },

    // Footer
    footer: {
      verified: 'Verified Suppliers Only',
      verifiedDesc: 'Direct procurement from certified primary distributors in Dubai, Shenzhen, US & Istanbul.',
      freight: 'Weekly Fast Air Freight',
      freightDesc: 'Consolidated air express (7-14 days) with real-time customs & milestone tracking.',
      escrow: 'Transparent Escrow Deposits',
      escrowDesc: 'Clear deposit structure. Full refund if item cannot be secured at agreed specifications.',
      about: 'Direct import-on-demand for consumer electronics, computing hardware, and bulk textile materials without intermediary markups.',
      directSourcing: 'Direct Sourcing',
      requestCustomLink: 'Request Custom Import Form →',
      trackLink: 'Track Pre-Order by Code',
      forexLink: 'Current Forex & Batch Inquiries',
      hubLocation: 'Addis Ababa, Bole Sub-City Hub',
      ownerDesk: 'Owner Desk',
      ownerDeskDesc: 'Direct batch confirmation & wire verification:',
      adminPortal: 'Admin Portal',
      rights: 'All rights reserved.',
      protocolLabel: 'Direct Sourcing Protocol',
      currencyLabel: 'Currency:',
    },
  },

  am: {
    // Top Micro-bar & Navbar
    nav: {
      channelsActive: 'ቀጥታ የማስመጣት መስመሮች ክፍት ናቸው',
      nextBatch: 'ቀጣይ ጭነት: ሳምንታዊ ፈጣን የአየር እና የባህር ጭነት',
      catalog: 'ካታሎግ',
      electronics: 'ኤሌክትሮኒክስ',
      materials: 'አልባሳት እና ጥሬ ዕቃዎች',
      track: 'ትዕዛዝ መከታተያ',
      customRequest: 'ልዩ ዕቃ ይጠይቁ',
      admin: 'አስተዳዳሪ',
      whatsapp: 'ዋትስአፕ:',
      telegram: 'ቴሌግራም',
      lightMode: 'ወደ ብሩህ ገጽታ ቀይር',
      darkMode: 'ወደ ጥቁር ገጽታ ቀይር',
    },

    // Hero Section
    hero: {
      tag: 'ቀጥታ ዓለም አቀፍ ግዥ',
      hubs: 'ዱባይ · ሼንዘን · ኢስታንቡል · አሜሪካ',
      titleLine1: 'ቀጥታ ወደ ሀገር',
      titleLine2: 'የማስመጣት አገልግሎት',
      subtitle:
        'የደላላ እና የችርቻሮ ትርፍ ጭማሪዎችን ያስቀሩ። ማክቡኮች፣ ላፕቶፖች፣ ዘመናዊ ስልኮች እና የጅምላ ቱርክ ጨርቆችን በቀጥታ በዋትስአፕ እና ቴሌግራም ፈጣን ማረጋገጫ ያስመጡ።',
      ctaCatalog: 'ካታሎጉን ይመልከቱ',
      ctaCustom: 'ልዩ ዕቃ ለማስመጣት ይጠይቁ (REQ-XXXX)',
      metric1Value: '100%',
      metric1Label: 'ቀጥታ ግዥ',
      metric2Value: '7-14',
      metric2Label: 'የአየር ጭነት ቀናት',
      metric3Value: '0%',
      metric3Label: 'የደላላ ጭማሪ',
      metric4Value: '24 ሰዓት',
      metric4Label: 'የዋጋ ማረጋገጫ',
    },

    // How it Works 3 Steps
    protocol: {
      tag: 'የአሰራር ስርዓት',
      title: 'የማስመጣት ሂደቱ እንዴት ይሰራል?',
      subtitle:
        'የዓለም አቀፍ የውጭ ምንዛሬ እና የአቅራቢዎች ዋጋ ተለዋዋጭ ስለሆነ፣ የእኛ የተቀናጀ አሰራር ትክክለኛውን የጅምላ ዋጋ አስቀድሞ ያስተካክላል።',
      step1Num: 'ደረጃ 01',
      step1Title: 'ዕቃውን ወይም የፈለጉትን ዓይነት ይምረጡ',
      step1Desc:
        'ከተዘጋጁት ኤሌክትሮኒክስ እና የጨርቅ ካታሎጎች ይምረጡ፣ ወይም በካታሎግ ውስጥ የሌለን ማንኛውንም ዕቃ ሞዴል እና ዝርዝር ይላኩልን።',
      step2Num: 'ደረጃ 02',
      step2Title: 'ዋጋውን እና ቅድመ-ክፍያውን በዋትስአፕ / ቴሌግራም ያረጋግጡ',
      step2Desc:
        'ጥያቄዎ ሲመዘገብ ወዲያውኑ ልዩ የትዕዛዝ ኮድ ይሰጥዎታል። ወቅታዊውን የዶላር ተመን እና የመድረሻ ቀን ከአስመጪው ጋር በቻት ያረጋግጣሉ።',
      step3Num: 'ደረጃ 03',
      step3Title: 'የ5-ደረጃ የበረራ ጉዞውን በቀጥታ ይከታተሉ',
      step3Desc:
        'ዕቃዎ ከዓለም አቀፍ አከፋፋዮች ተገዝቶ በበረራ ይላካል፣ ጉምሩክም ይጸዳልዎታል። በድረ-ገጻችን መከታተያ እያንዳንዱን እርምጃ በቀጥታ ይመልከቱ።',
    },

    // Landing Page Categories Strip
    categoriesSection: {
      tag: 'የዕቃዎች ዘርፎች',
      title: 'የግዥ ዘርፎችን ያስሱ',
      subtitle: 'በክምችት ያሉትንና ወደ ሀገር የሚገቡ ዕቃዎችን ለማጣራት አንዱን ዘርፍ ይምረጡ።',
      laptops: 'ላፕቶፖች እና ወርክስቴሽኖች',
      laptopsDesc: 'ማክቡክ ፕሮ፣ ቲንክፓድ፣ ዴል ኤክስፒኤስ ከዓለም አቀፍ ዋስትና ጋር',
      smartphones: 'ዘመናዊ ስልኮች',
      smartphonesDesc: 'አዳዲስ እና ክፍት ሳጥን አይፎኖች፣ ሳምሰንግ ጋላክሲ እና ፒክሰል',
      hardware: 'የፒሲ ዕቃዎች እና መለዋወጫዎች',
      hardwareDesc: 'ግራፊክስ ካርዶች (GPU)፣ ራም፣ ኤስኤስዲ እና ፕሮፌሽናል ሞኒተሮች',
      cotton: 'የቱርክ ጥጥ እና ጨርቃጨርቅ',
      cottonDesc: 'ጥራት ያላቸው የጥጥ ጥቅሎች፣ ጀርሲ እና የሽመና ጨርቆች',
      denim: 'ጥሬ የሰልቪጅ ጂንስ ጨርቆች',
      denimDesc: 'ከኢስታንቡል ፋብሪካዎች በቀጥታ የሚመጡ ጥቅል የጂንስ ጨርቆች',
      blanks: 'የጅምላ ሁዲዎች እና አልባሳት',
      blanksDesc: 'ከባድ 400+ ጂኤስኤም ጥራት ያላቸው ሁዲዎች፣ ሱሪዎች እና ቲሸርቶች',
      viewAll: 'ምድቡን ይመልከቱ →',
    },

    // Catalog Section
    catalog: {
      tag: 'የሚገኙ ዕቃዎች',
      title: 'የቅድመ-ትዕዛዝ ካታሎግ እና በክምችት ያሉ ዕቃዎች',
      subtitle: 'ሁሉም ዋጋዎች የአየር ጭነት እና የጉምሩክ ክፍያን ያካተቱ ናቸው። የሳምንቱ ጭነት ከመዘጋቱ በፊት ቦታዎን ያስይዙ።',
      allCategories: 'ሁሉም ዘርፎች',
      electronicsTab: 'ኤሌክትሮኒክስ እና ላፕቶፖች',
      materialsTab: 'አልባሳት እና ጥሬ ዕቃዎች',
      searchPlaceholder: 'ማክቡክ፣ አይፎን፣ RTX፣ የቱርክ ጥጥ፣ ጂንስ ይፈልጉ...',
      stockLabel: 'ሁኔታ:',
      stockAll: 'ሁሉም',
      stockInStock: 'በክምችት ላይ ያለ',
      stockPreorder: 'የቅድመ-ትዕዛዝ ማስመጣት',
      sortLabel: 'አቀማመጥ:',
      sortFeatured: 'ተመራጭ',
      sortPriceAsc: 'ዋጋ: ከዝቅተኛ ወደ ከፍተኛ',
      sortPriceDesc: 'ዋጋ: ከከፍተኛ ወደ ዝቅተኛ',
      sortNewest: 'አዳዲሶች',
      noItemsTitle: 'ምንም ዕቃ አልተገኘም',
      noItemsDesc: 'በመረጡት መመዘኛ የተገኘ ዕቃ የለም። በካታሎግ ውስጥ የሌለ የተለየ ሞዴል ወይም ጨርቅ ይፈልጋሉ?',
      clearFilters: 'ሁሉንም አጽዳ',
      requestCustom: 'ልዩ ዕቃ ይጠይቁ',
      retry: 'እንደገና ይሞክሩ',
      errorTitle: 'ካታሎጉን መጫን አልተቻለም።',
      errorCheck: 'እባክዎ የሰርቨር ግንኙነትዎን ያረጋግጡ።',
    },

    // Product Card
    card: {
      inStock: 'በክምችት ላይ ያለ',
      preorder: 'ቅድመ-ትዕዛዝ: 7-14 ቀናት',
      outOfStock: 'አልቋል',
      startingAt: 'የመነሻ ዋጋ',
      inquirePrice: 'የወቅቱን ዋጋ ይጠይቁ',
      perUnit: 'በ',
      moq: 'ዝቅተኛ ትዕዛዝ:',
      details: 'ዝርዝር',
      preorderBtn: 'ቅድመ-ትዕዛዝ',
      orderNowBtn: 'አሁን እዘዝ',
    },

    // Bottom Sourcing Desk Banner
    sourcingBanner: {
      badge: 'ላልተዘረዘሩ ዕቃዎች የማስመጣት አገልግሎት',
      title: 'በካታሎግ ውስጥ የሌለ የተለየ ሞዴል ወይም ጨርቅ ይፈልጋሉ?',
      desc: 'የሞዴሉን ቁጥር፣ ያሰቡትን በጀት እና የሚፈልጉትን ዝርዝር ይላኩልን። በዱባይ እና ጓንግዡ ያሉ የግዥ ቡድኖቻችን በ24 ሰዓት ውስጥ ወቅታዊውን ዋጋ ይነግሩዎታል።',
      cta: 'ልዩ ዕቃ ለማስመጣት ይጠይቁ (REQ-XXXX) →',
    },

    // Pre-Order Modal
    modal: {
      title: 'የቅድመ-ትዕዛዝ ቦታዎን ያስይዙ',
      subtitle: 'ከዓለም አቀፍ አቅራቢዎቻችን ጋር የጅምላ ዋጋዎን ያረጋግጣል።',
      leadTime: 'የመድረሻ ጊዜ:',
      specsSelection: 'የኮምፒውተር / የእቃው ዝርዝር ምርጫ',
      selectSpecPlaceholder: 'ዝርዝር ይምረጡ...',
      quantity: 'የትዕዛዝ ብዛት',
      moqWarning: 'የዚህ እቃ ዝቅተኛ የትዕዛዝ መጠን',
      nameLabel: 'ሙሉ ስምዎ *',
      namePlaceholder: 'ለምሳሌ: አበበ ቢቂላ',
      phoneLabel: 'ስልክ ቁጥር (ለመደወል/ኤስኤምኤስ) *',
      phonePlaceholder: '09... ወይም +251 9...',
      messagingLabel: 'የዋትስአፕ ወይም የቴሌግራም መለያ (አስፈላጊ ከሆነ)',
      messagingPlaceholder: '+251... ወይም @username',
      addressLabel: 'የመላኪያ ከተማ እና ክፍለ ከተማ / አካባቢ *',
      addressPlaceholder: 'ለምሳሌ: አዲስ አበባ፣ ቦሌ መድኃኔዓለም',
      notesLabel: 'ልዩ ጥያቄዎች / ማስታወሻዎች (አስፈላጊ ከሆነ)',
      notesPlaceholder: 'ለምሳሌ: የጠፈር ግራጫ ቀለም ይመረጣል...',
      cancel: 'ይቅር',
      submitting: 'ትዕዛዙ እየተመዘገበ ነው...',
      submitPreorder: 'ቅድመ-ትዕዛዝ መዝግብ እና ኮድ ተቀበል',
      submitOrder: 'ትዕዛዝ አረጋግጥ እና ኮድ ተቀበል',
    },

    // Instant Messaging Handoff
    handoff: {
      preorderLogged: 'ቅድመ-ትዕዛዝ ተመዝግቧል',
      requestLogged: 'የልዩ ዕቃ ጥያቄ ተመዝግቧል',
      nextStepTitle: 'ቀጣይ ደረጃ: ፈጣን የመልዕክት ማረጋገጫ',
      nextStepDesc:
        'ጥያቄዎ በሲስተማችን ተመዝግቧል። የውጭ ምንዛሬ እና የገበያ ዋጋ ስለሚለዋወጥ፣ ከአስመጪው ዴስክ ጋር በዋትስአፕ ወይም ቴሌግራም ያረጋግጡ።',
      refCodeLabel: 'ልዩ የትዕዛዝ መከታተያ ኮድ',
      copyCode: 'ኮዱን ገልብጥ',
      copied: 'ተገልብጧል!',
      confirmWhatsApp: 'በዋትስአፕ አረጋግጥ',
      confirmTelegram: 'በቴሌግራም አረጋግጥ',
      previewTitle: 'የተዘጋጀ የቻት መልዕክት:',
      copyMessage: 'መልዕክቱን ገልብጥ',
      openTracker: 'የቀጥታ ጭነት መከታተያ ክፈት →',
      continueBrowsing: 'መመልከት ቀጥል',
    },

    // Tracker Page
    tracker: {
      title: 'የዕቃ ጉዞ እና የበረራ መከታተያ',
      subtitle: 'የተሰጠዎትን የትዕዛዝ ኮድ (IMP-XXXX ወይም REQ-XXXX) በማስገባት ግዥውን፣ የአየር በረራውን እና አዲስ አበባ መድረሱን ይከታተሉ።',
      placeholder: 'የትዕዛዝ ኮድ ያስገቡ (ለምሳሌ IMP-1024 ወይም REQ-5012)...',
      trackBtn: 'ጭነቱን ተከታተል',
      tracking: 'በመፈለግ ላይ...',
      trySample: 'የናሙና ኮዶች:',
      statusTitle: 'የአሁኑ የዕቃው ደረጃ',
      estimatedDelivery: 'የሚደርስበት ጊዜ:',
      orderSummary: 'የትዕዛዝ ማጠቃለያ',
      customerDetails: 'የደንበኛ መረጃ',
      notFoundTitle: 'ኮዱ አልተገኘም',
      notFoundDesc: 'እባክዎ በዋትስአፕ ወይም ቴሌግራም የተሰጠዎትን ኮድ በትክክል መጻፉን ያረጋግጡ።',
    },

    // Custom Sourcing Request Page
    customRequest: {
      title: 'ልዩ ዕቃ የማስመጣት ጥያቄ ማቅረቢያ',
      subtitle: 'በካታሎጋችን ውስጥ የሌለ የተለየ ላፕቶፕ፣ የጨዋታ መሣሪያ፣ የጨርቅ ጥቅል ወይም የኢንዱስትሪ ዕቃ ይፈልጋሉ? በዱባይ፣ ሼንዘን እና ኢስታንቡል ያሉ የግዥ ቡድኖቻችን ፈልገው ያቀርቡልዎታል።',
      categoryLabel: 'የዕቃው ዘርፍ *',
      itemNameLabel: 'ትክክለኛ የእቃው ስም፣ የሞዴል ቁጥር ወይም የጨርቁ ዓይነት *',
      itemNamePlaceholder: 'ለምሳሌ: Framework Laptop 16 (Ryzen 7 7840HS) ወይም 100% Bamboo Lyocell 300 GSM',
      specsLabel: 'የሚፈለገው ዝርዝር፣ ራም/ማከማቻ እና ብዛት *',
      specsPlaceholder: 'የራም፣ ስቶሬጅ፣ ጂፒዩ፣ ቀለም ወይም የጨርቁን ጥቅል ርዝመት በዝርዝር ይጻፉ...',
      budgetLabel: 'ያሰቡት በጀት / ገደብ (አስፈላጊ ከሆነ)',
      budgetPlaceholder: 'ለምሳሌ: ~120,000 ብር ወይም $850 USD',
      linkImageLabel: 'የእቃው ሊንክ ወይም የምስል አድራሻ (አስፈላጊ ከሆነ)',
      linkImagePlaceholder: 'https://...',
      submitBtn: 'የማስመጣት ጥያቄ አስገባ እና REQ-XXXX ኮድ ተቀበል',
    },

    // Footer
    footer: {
      verified: 'የተረጋገጡ አቅራቢዎች ብቻ',
      verifiedDesc: 'ከዱባይ፣ ሼንዘን፣ አሜሪካ እና ኢስታንቡል ዋና አከፋፋዮች ጋር ቀጥታ ግንኙነት።',
      freight: 'ሳምንታዊ ፈጣን የአየር ጭነት',
      freightDesc: 'ፈጣን የአየር ጭነት (7-14 ቀናት) ከቀጥታ የጉምሩክ እና የበረራ ክትትል ጋር።',
      escrow: 'ግልጽ የቅድመ ክፍያ ዋስትና',
      escrowDesc: 'ዕቃው በተስማማነው ዝርዝር መሰረት ካልተገኘ ሙሉ ገንዘብዎ ወዲያውኑ ይመለሳል።',
      about: 'ለኤሌክትሮኒክስ፣ ላፕቶፖች እና የጅምላ ጨርቃጨርቅ ግዥ ያለምንም ደላላ እና የዋጋ ጭማሪ ቀጥታ የማስመጣት አገልግሎት።',
      directSourcing: 'ቀጥታ ግዥ',
      requestCustomLink: 'የልዩ ዕቃ ማስመጣት ፎርም →',
      trackLink: 'ትዕዛዝ በኮድ ተከታተል',
      forexLink: 'የምንዛሬ እና የባች ዋጋ ጥያቄ',
      hubLocation: 'አዲስ አበባ፣ ቦሌ ክፍለ ከተማ',
      ownerDesk: 'የአስመጪው ዴስክ',
      ownerDeskDesc: 'ቀጥታ የባች ማረጋገጫ እና ክፍያ:',
      adminPortal: 'የአስተዳዳሪ ክፍል',
      rights: 'መብቱ በህግ የተጠበቀ ነው።',
      protocolLabel: 'የቀጥታ ግዥ አሰራር',
      currencyLabel: 'የገንዘብ ዓይነት:',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('app_language');
    if (saved === 'en' || saved === 'am') {
      return saved;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    if (language === 'am') {
      document.documentElement.lang = 'am';
    } else {
      document.documentElement.lang = 'en';
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'am' : 'en'));
  };

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'am') {
      setLanguageState(lang);
    }
  };

  // Helper lookup with dot notation support: t('nav.catalog') or t('hero.titleLine1')
  const t = (path, fallback) => {
    if (!path) return fallback || '';
    const keys = path.split('.');
    let current = translations[language];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English if missing in target language
        let fallbackVal = translations['en'];
        for (const fbKey of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fbKey in fallbackVal) {
            fallbackVal = fallbackVal[fbKey];
          } else {
            return fallback || path;
          }
        }
        return fallbackVal || fallback || path;
      }
    }
    return current || fallback || path;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isAmharic: language === 'am',
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

