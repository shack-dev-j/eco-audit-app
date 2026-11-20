// Scenarios dataset matching the official "The 60-Second Eco-Audit" guide
// Features all 10 official scenario scenes, images, and bilingual Uzbek/English issue sets

export const SCENARIOS = [
  {
    id: 'school',
    title: 'School Classroom & Hallway',
    title_uz: 'Maktab Sinfxonasi va Yo‘lak',
    subtitle: 'Everyday secondary school learning environment',
    subtitle_uz: 'Kundalik maktab o‘quv xonasi va ta’lim muhiti',
    badge: 'Campus Eco-Audit',
    badge_uz: 'Sinfxona Eko-Auditi',
    description: 'A bustling school room where small habits create massive collective energy, water, and material waste.',
    description_uz: 'Kichik e’tiborsizliklar natijasida katta elektr, suv va qog‘oz isrof bo‘layotgan odatiy maktab sinfxonasi.',
    difficulty: 'Standard (7 Eco-Issues)',
    difficulty_uz: 'Standart (7 ta Eko-Muammo)',
    accentColor: '#10b981',
    coverImage: '/scenarios/scenario_1_classroom.jpg',
    issues: [
      {
        id: 'tap-dripping',
        title: 'Dripping Sink Tap',
        title_uz: 'Tomchilayotgan Suv Krani',
        category: 'Water',
        category_uz: 'Suv',
        severity: 'High',
        description: 'The sink tap has been left dripping at 1 drop per second, wasting up to 15 litres of clean treated water daily.',
        description_uz: 'Sinfxona rakovinasi krani tomchilab oqmoqda, kuniga 15 litrgacha toza ichimlik suvi isrof bo‘lmoqda.',
        practicalAction: 'Turn off the tap fully; report the worn washer to building maintenance for immediate repair.',
        practicalAction_uz: 'Jo‘mrakni oxirigacha mahkam burab yopish; nosoz qistirmani almashtirish uchun navbatchiga xabar berish.',
        rationales: ['Immediate resource loss', 'Zero cost to fix right away', 'Prevents damp and water damage'],
        rationales_uz: ['Darhol resurs yo‘qotilishini to‘xtatadi', 'Xarajatsiz tezkor yechim', 'Namlik va zax hosil bo‘lishini oldini oladi']
      },
      {
        id: 'lights-on',
        title: 'Overhead Lights On In Bright Daylight',
        title_uz: 'Kunduzi Yoqiq Qolgan Chiroqlar',
        category: 'Energy',
        category_uz: 'Elektr energiyasi',
        severity: 'Medium',
        description: 'Ceiling lights are blazing despite sunny windows flooding the room with natural daylight.',
        description_uz: 'Derazalardan yorug‘ quyosh nuri tushib turgan bo‘lsa-da, shipdagi chiroqlar to‘liq yoqiq turibdi.',
        practicalAction: 'Switch off perimeter lights and leverage natural daylight; nominate a student light monitor.',
        practicalAction_uz: 'Ortiqcha chiroqlarni o‘chirish; sinfda kunlik "Yorug‘lik navbatchisi"ni tayinlash.',
        rationales: ['Saves electricity immediately', 'Reduces room heat & glare', 'Zero capital cost'],
        rationales_uz: ['Elektr energiyasini darhol tejaydi', 'Sinfdagi havoni qizib ketishdan saqlaydi', 'Tezkor odat o‘zgarishi']
      },
      {
        id: 'charger-vampire',
        title: 'Phantom Charger Plugged In Idle',
        title_uz: 'Rozetkada Bo‘sh Qolgan Zaryadlovchi',
        category: 'Energy',
        category_uz: 'Elektr energiyasi',
        severity: 'Low',
        description: 'Laptop and phone charging adapters remain plugged into sockets even though devices have been disconnected.',
        description_uz: 'Telefon va noutbuk ulanmagan bo‘lsa ham, zaryadlash bloklari rozetkaga tiqilgancha tok yeb yotibdi.',
        practicalAction: 'Switch off socket switches or unplug transformers when devices are disconnected.',
        practicalAction_uz: 'Qurilma quvvat olib bo‘lgach, zaryadlovchini rozetkadan sug‘urib qo‘yish.',
        rationales: ['Stops phantom standby power drain', 'Fire safety precaution', 'Extends adapter lifespan'],
        rationales_uz: ['Yashirin elektr isrofini to‘xtatadi', 'Yong‘in xavfsizligini ta’minlaydi', 'Adapter xizmat muddatini uzaytiradi']
      },
      {
        id: 'paper-waste',
        title: 'Single-Sided Paper Discard',
        title_uz: 'Bir Tomoni Toza Qog‘oz Isrofi',
        category: 'Materials',
        category_uz: 'Resurslar',
        severity: 'Medium',
        description: 'A stack of worksheets printed on only one side is being thrown away rather than using blank backs.',
        description_uz: 'Faqat bitta tomoni ishlatilgan qog‘ozlar ikkinchi tomoni bo‘sh bo‘lishiga qaramay axlatga tashlanmoqda.',
        practicalAction: 'Establish a designated "Draft & Scrap Paper" tray beside the printer; set printer default to duplex.',
        practicalAction_uz: 'Sinfda "Qoralama Qog‘ozlar" qutisini tashkil qilish; chop etishda ikki tomonlama rejimni yoqish.',
        rationales: ['Cuts school paper budget by 40%', 'Saves trees & forestry resources', 'Easy habit change'],
        rationales_uz: ['Maktab qog‘oz xarajatini 40% tejaydi', 'Daraxtlarni asraydi', 'Oson kundalik odat']
      },
      {
        id: 'window-heater-conflict',
        title: 'Window Cracked Open Above Radiator',
        title_uz: 'Isitgich Batareyasi Ustida Ochiq Deraza',
        category: 'Thermal',
        category_uz: 'Issiqlik',
        severity: 'High',
        description: 'The classroom window is propped wide open while the heating radiator beneath it is blasting hot air.',
        description_uz: 'Isitgich batareyasi ishlab turgan vaqtda deraza katta ochiq qolib, issiqlik ko‘chaga uchib ketmoqda.',
        practicalAction: 'Close the window and regulate thermostat valves; use short 2-minute ventilation breaks.',
        practicalAction_uz: 'Derazani yopish; xonani shamollatish uchun tanaffusda 2 daqiqaga ochib, so‘ng darhol yopish.',
        rationales: ['Massive thermal energy wastage', 'Lowers heating fuel emissions', 'Maintains comfortable climate'],
        rationales_uz: ['Ulkan issiqlik yo‘qotilishini to‘xtatadi', 'Yoqilg‘i sarfini kamaytiradi', 'Qulay xona haroratini saqlaydi']
      }
    ]
  },
  {
    id: 'office',
    title: 'Workplace & Staff Office',
    title_uz: 'Xodimlar va Ma’muriy Xona',
    subtitle: 'Corporate and educational staff administrative space',
    subtitle_uz: 'O‘qituvchilar va xodimlar ma’muriy ish maydoni',
    badge: 'Workplace Eco-Audit',
    badge_uz: 'Ofis Eko-Auditi',
    description: 'An administrative workspace with heavy computer usage, printing, coffee breaks, and climate control.',
    description_uz: 'Kompyuterlar, printerlar, qahva tanaffuslari va konditsionerlar doimiy ishlaydigan ma’muriy xona.',
    difficulty: 'Advanced (6 Eco-Issues)',
    difficulty_uz: 'Murakkab (6 ta Eko-Muammo)',
    accentColor: '#0ea5e9',
    coverImage: '/scenarios/scenario_2_office.jpg',
    issues: [
      {
        id: 'monitors-overnight',
        title: 'Monitors Left Glowing Overnight',
        title_uz: 'Kechasi O‘chirilmagan Monitorlar',
        category: 'Energy',
        category_uz: 'Elektr energiyasi',
        severity: 'Medium',
        description: 'Workstations left illuminated with active screensavers long after staff have departed.',
        description_uz: 'Xodimlar ketgandan keyin ham kompyuter monitorlari va ekran pardasi tun bo‘yi yonib turibdi.',
        practicalAction: 'Configure PC sleep policies (10 min idle) and encourage a "Last Out Shuts Down" culture.',
        practicalAction_uz: 'Kompyuterlarda 10 daqiqalik uyqu rejimini yoqish; "Oxirgi chiqqan o‘chirsin" qoidasini joriy qilish.',
        rationales: ['Saves office overnight electricity bill', 'Reduces hardware wear & tear', 'Simple procedural change'],
        rationales_uz: ['Kechki elektr isrofini to‘xtatadi', 'Texnika umrini uzaytiradi', 'Oddiy intizomiy odat']
      },
      {
        id: 'disposable-cups',
        title: 'Single-Use Cup Mountain at Coffee Station',
        title_uz: 'Qahva Burchagidagi Bir Martalik Stakanlar',
        category: 'Materials',
        category_uz: 'Chiqindi',
        severity: 'High',
        description: 'Scores of plastic-lined takeaway cups piling around the sink while ceramic mugs sit unused in cupboards.',
        description_uz: 'Javonda sopol finjonlar turgan holda, yuzlab bir martalik qog‘oz va plastik stakanlar tashlanmoqda.',
        practicalAction: 'Provide designated mug pegs, launch a "BYO Mug" incentive, and phase out disposable cups.',
        practicalAction_uz: 'Har bir xodimga o‘z shaxsiy finjonidan foydalanishni taklif qilish; bir martalik stakanlarni bekor qilish.',
        rationales: ['Eliminates non-recyclable cup waste', 'Saves recurring procurement costs', 'Visible culture change'],
        rationales_uz: ['Qayta ishlanmaydigan chiqindini yo‘qotadi', 'Sotib olish xarajatlarini tejaydi', 'Go‘zal ekologik madaniyat']
      },
      {
        id: 'space-heater',
        title: 'Personal Space Heater Fighting AC',
        title_uz: 'Konditsioner Bilan Ziddiyatdagi Isitgich',
        category: 'Thermal',
        category_uz: 'Issiqlik',
        severity: 'High',
        description: 'A 2000W electric ceramic fan heater running beneath a desk while central HVAC is blowing chilled air.',
        description_uz: 'Markaziy konditsioner sovuq havo puflayotgan bir paytda, stol tagida 2000W li elektr isitgich yoqib qo‘yilgan.',
        practicalAction: 'Conduct office thermal zoning check; adjust central thermostat; avoid competing devices.',
        practicalAction_uz: 'Konditsioner termostatini me’yorga keltirish (22-24°C); bir vaqtda qarama-qarshi asboblarni yoqmaslik.',
        rationales: ['High electrical load & fire hazard', 'Resolves root thermostat imbalance', 'Protects circuit breakers'],
        rationales_uz: ['Elektr tarmog‘iga ortiqcha yuklama va yong‘in xavfi', 'Isitish balansini to‘g‘rilaydi', 'Tejamkorlik']
      }
    ]
  },
  {
    id: 'cafeteria',
    title: 'School Cafeteria & Canteen',
    title_uz: 'Maktab Oshxonasi va Bufet',
    subtitle: 'High-volume dining and food preparation zone',
    subtitle_uz: 'Katta oqimli ovqatlanish va taom tayyorlash zali',
    badge: 'Canteen Eco-Audit',
    badge_uz: 'Oshxona Eko-Auditi',
    description: 'The heart of campus nutrition where packaging, food scraps, and high water use converge.',
    description_uz: 'Kun davomida yuzlab o‘quvchilar ovqatlanadigan, chiqindi va suv sarfi yuqori bo‘lgan oshxona.',
    difficulty: 'Action-Heavy (5 Eco-Issues)',
    difficulty_uz: 'Muhim (5 ta Eko-Muammo)',
    accentColor: '#f59e0b',
    coverImage: '/scenarios/scenario_3_cafeteria.jpg',
    issues: [
      {
        id: 'untouched-food-dump',
        title: 'Whole Edible Food Tossed into Landfill',
        title_uz: 'Tegilmagan Oziq-Ovqat Isrofi',
        category: 'Waste',
        category_uz: 'Oziq-ovqat',
        severity: 'High',
        description: 'Unopened yogurts, whole apples, and untouched bread rolls dumped into black landfill sacks at tray return.',
        description_uz: 'Toza tegilmagan non bo‘laklari, butun olmalar va qadoqlangan yeguliklar umumiy axlatga tashlanmoqda.',
        practicalAction: 'Establish a "Share Table" where students can leave untouched sealed snacks for others.',
        practicalAction_uz: '"Ulashish Stoli"ni tashkil qilish — tegilmagan yaxlit yeguliklarni boshqalar olishi uchun qoldirish.',
        rationales: ['Tackles food insecurity directly', 'Diverts highest GHG contributor', 'Respects food resources'],
        rationales_uz: ['Oziq-ovqat isrofini to‘xtatadi', 'Chiqindilarning metan gazi hosil qilishini kamaytiradi', 'Tejamkorlik']
      },
      {
        id: 'plastic-cutlery',
        title: 'Single-Use Plastic Cutlery Overuse',
        title_uz: 'Bir Martalik Plastik Qoshiq va Vilkalar',
        category: 'Materials',
        category_uz: 'Plastik',
        severity: 'Medium',
        description: 'Students grabbing handfuls of individually wrapped plastic spoons and forks for food that only requires a spoon.',
        description_uz: 'Bir martalik plastik qoshiq-vilkalar keragidan ortiq olinib, ishlatilmasdan polga va axlatga tashlanmoqda.',
        practicalAction: 'Switch to dish-machine sanitized stainless steel cutlery or dispense single cutlery on request.',
        practicalAction_uz: 'Ko‘p marta yuviladigan metall anjomlarga o‘tish yoki faqat talab qilinganda berish tartibini o‘rnatish.',
        rationales: ['Prevents plastic micro-pollution', 'Reduces litter in school grounds', 'One-time investment pays off'],
        rationales_uz: ['Plastik ifloslanishining oldini oladi', 'Maktab hovlisida chiqindini kamaytiradi', 'Xarajatlarni tejaydi']
      },
      {
        id: 'dish-tap-running',
        title: 'Pre-Rinse Dish Spray Running Unattended',
        title_uz: 'Idish Yuvish Krani Ochiq Qolgan',
        category: 'Water',
        category_uz: 'Suv',
        severity: 'High',
        description: 'The overhead dishwashing spray wand is locked in the on position, gushing water into an empty sink.',
        description_uz: 'Idishlarni chayish krani ochiq qolib, bo‘sh rakovinaga daqiqasiga 12 litr issiq suv oqib ketmoqda.',
        practicalAction: 'Install automatic shutoff lever trigger on rinse wand; instruct kitchen staff on burst rinsing.',
        practicalAction_uz: 'Kran uchiga avtomatik to‘xtatuvchi richag o‘rnatish; xodimlarga suvni faqat chayish paytida yoqishni eslatish.',
        rationales: ['Saves thousands of litres of hot water daily', 'Reduces water heater gas/power use', 'Immediate impact'],
        rationales_uz: ['Kuniga minglab litr issiq suvni tejaydi', 'Isitish energiyasini kamaytiradi', 'Katta amaliy foyda']
      }
    ]
  },
  {
    id: 'science-lab',
    title: 'Science Laboratory & Prep Room',
    title_uz: 'Kimyo va Biologiya Laboratoriyasi',
    subtitle: 'Practical science exploration and chemical storage',
    subtitle_uz: 'Amaliy laboratoriya tajribalari va kimyoviy preparatlar xonasi',
    badge: 'Lab Eco-Audit',
    badge_uz: 'Laboratoriya Eko-Auditi',
    description: 'Precision learning environment where high exhaust ventilation, water taps, and sensors run continuously.',
    description_uz: 'Katta ventilyatsiya tortmalari, suv rakovinalari va elektr o‘lchov asboblari joylashgan laboratoriya.',
    difficulty: 'Advanced (5 Eco-Issues)',
    difficulty_uz: 'Murakkab (5 ta Eko-Muammo)',
    accentColor: '#8b5cf6',
    coverImage: '/scenarios/scenario_4_sciencelab.jpg',
    issues: [
      {
        id: 'fume-hood-open',
        title: 'Fume Hood Sash Left Fully Open',
        title_uz: 'Ventilyatsiya Shkafi Qopqog‘i Ochiq Qolgan',
        category: 'Energy',
        category_uz: 'Elektr energiyasi',
        severity: 'High',
        description: 'Chemical fume hood sash left wide open with the massive exhaust motor continuously pulling conditioned air outside.',
        description_uz: 'Tajriba tugagandan keyin ham ventilyatsiya shkafi qopqog‘i yopilmagan, katta motor behuda ishlab turibdi.',
        practicalAction: 'Form a "Shut the Sash" lab routine; slide sash down when experiments pause to cut 60% motor power.',
        practicalAction_uz: '"Qopqoqni Tushir" qoidasiga amal qilish; tajriba bo‘lmaganda shkafni pastga tushirib qo‘yish.',
        rationales: ['Massive electrical draw on 3-phase motors', 'Stops loss of indoor conditioned heat', 'Chemical lab safety'],
        rationales_uz: ['Katta motorlar elektr sarfini 60% tejaydi', 'Sinfdagi toza iliq havoni asraydi', 'Xavfsizlik']
      },
      {
        id: 'lab-sink-leak',
        title: 'Acid-Resistant Sink Tap Steady Leak',
        title_uz: 'Laboratoriya Rakovinasidan Suv Sizishi',
        category: 'Water',
        category_uz: 'Suv',
        severity: 'Medium',
        description: 'Specialty laboratory tap dripping continuously, staining ceramic basin with mineral deposits.',
        description_uz: 'Maxsus laboratoriya jo‘mragidan uzluksiz suv sizib oqmoqda va sopol yuvgichni zanglatmoqda.',
        practicalAction: 'Tighten ceramic valve gland; alert maintenance technician for replacement valve insert.',
        practicalAction_uz: 'Ventilni to‘liq qisib qo‘yish; qistirmani almashtirish uchun laboratorantga murojaat qilish.',
        rationales: ['Prevents mineral corrosion', 'Saves distilled/potable supply', 'Eliminates background noise'],
        rationales_uz: ['Zanglash va tosh hosil bo‘lishini to‘xtatadi', 'Toza suvni asraydi', 'Jimjitlikni ta’minlaydi']
      }
    ]
  },
  {
    id: 'library',
    title: 'Library & Quiet Study Hall',
    title_uz: 'Kutubxona va O‘quv Zali',
    subtitle: 'Silent reading, research carrels, and document archiving',
    subtitle_uz: 'Sokin mutolaa, kitoblar arxivi va shaxsiy o‘quv stollari',
    badge: 'Library Eco-Audit',
    badge_uz: 'Kutubxona Eko-Auditi',
    description: 'Quiet sanctuary where individual desk lamps, copiers, and draft paper use require mindful stewardship.',
    description_uz: 'Har bir stolda shaxsiy lampalar, printerlar va kitob fondi joylashgan sokin o‘quv zali.',
    difficulty: 'Standard (5 Eco-Issues)',
    difficulty_uz: 'Standart (5 ta Eko-Muammo)',
    accentColor: '#14b8a6',
    coverImage: '/scenarios/scenario_5_library.jpg',
    issues: [
      {
        id: 'desk-lamps-empty',
        title: 'Desk Lamps Blazing at Empty Carrels',
        title_uz: 'Bo‘sh O‘quv Stollaridagi Yoniq Lampalar',
        category: 'Energy',
        category_uz: 'Elektr energiyasi',
        severity: 'Medium',
        description: 'Multiple 60W incandescent desk reading lamps left on across empty private study cubicles.',
        description_uz: 'O‘quvchilar chiqib ketgan bo‘lsa-da, bo‘sh stollardagi yoritgich lampalari yonib qolgan.',
        practicalAction: 'Affix friendly "Turn off when leaving" stickers on lamp bases; encourage student awareness.',
        practicalAction_uz: 'Lampa tagiga "Ketishda o‘chirishni unutmang!" stikerini yopishtirish.',
        rationales: ['Zero capital cost', 'Extends bulb lifetime', 'Fosters individual accountability'],
        rationales_uz: ['Hech qanday xarajatsiz odat', 'Lampa chiroqlarini asraydi', 'Shaxsiy mas’uliyatni oshiradi']
      },
      {
        id: 'recycling-contaminated-library',
        title: 'Food Packaging in Paper Recycling Bin',
        title_uz: 'Qog‘oz Qutisiga Tashlangan Qahva Stakani',
        category: 'Waste',
        category_uz: 'Saralash',
        severity: 'High',
        description: 'Greasy snack bags and coffee cups tossed in paper recycling box, ruining clean archival paper batches.',
        description_uz: 'Toza qog‘ozlar tashlanadigan ko‘k qutiga yog‘li pishiriq qog‘ozi va qahva qoldiqlari tashlangan.',
        practicalAction: 'Provide a clear pictorial separation lid: slot for paper only, separate bin for food waste.',
        practicalAction_uz: 'Quti ustiga faqat qog‘oz uchun tor tirqishli qopqoq o‘rnatish va axlat qutisini ajratish.',
        rationales: ['Preserves entire bin recyclability', 'Complies with recycling standards', 'Clean study environment'],
        rationales_uz: ['Qog‘ozlarning qayta ishlanishini saqlab qoladi', 'Sokin va toza zallarni ta’minlaydi']
      }
    ]
  },
  {
    id: 'restroom',
    title: 'Student Restrooms & Washrooms',
    title_uz: 'Hojatxona va Yuvinish Xonasi',
    subtitle: 'High-frequency hygienic facilities and water fixtures',
    subtitle_uz: 'Doimiy foydalaniladigan gigiyena va suv nuqtalari',
    badge: 'Water Eco-Audit',
    badge_uz: 'Suv Nuqtalari Eko-Auditi',
    description: 'High-traffic sanitary zone where tap aerators, cistern seals, and paper towel consumption dictate utility footprints.',
    description_uz: 'Kun davomida yuzlab o‘quvchilar kirib-chiqadigan, suv va qog‘oz sochiq eng ko‘p sarflanadigan joy.',
    difficulty: 'Action-Heavy (5 Eco-Issues)',
    difficulty_uz: 'Muhim (5 ta Eko-Muammo)',
    accentColor: '#06b6d4',
    coverImage: '/scenarios/scenario_6_restroom.jpg',
    issues: [
      {
        id: 'cistern-running-leak',
        title: 'Toilet Cistern Constantly Running',
        title_uz: 'Hojatxona Bochog‘idan To‘xtovsiz Oqayotgan Suv',
        category: 'Water',
        category_uz: 'Suv',
        severity: 'High',
        description: 'A faulty flapper valve in the second cubicle causes clean water to stream into the bowl 24/7 (up to 200L/day).',
        description_uz: 'Bochok klapani nosoz bo‘lib, toza suv tunu-kun kanalizatsiyaga oqib ketmoqda (kuniga 200 litrgacha).',
        practicalAction: 'Report flapper seal defect immediately to custodial staff; post an "Under Repair" notice.',
        practicalAction_uz: 'Ushbu nosozlik haqida darhol chilangarga xabar berish va klapanni yangisiga almashtirish.',
        rationales: ['Massive silent municipal water loss', 'Prevents sewer surcharge', 'Quick 10-minute fix'],
        rationales_uz: ['Katta hajmdagi ichimlik suvi isrofini to‘xtatadi', '10 daqiqalik oson ta’mirlash']
      },
      {
        id: 'paper-towel-overflow',
        title: 'Paper Towel Waste Overflowing Bins',
        title_uz: 'Qog‘oz Sochiqlar Isrofi va Qutilarning To‘lishi',
        category: 'Materials',
        category_uz: 'Chiqindi',
        severity: 'Medium',
        description: 'Students pulling 4–5 single-use paper towels per wash instead of shaking hands and using one sheet.',
        description_uz: 'Qo‘lni yuvgandan so‘ng 4-5 talab qog‘oz sochiq olinib, polga va to‘lib ketgan qutiga tashlanmoqda.',
        practicalAction: 'Post a "Shake 5 Times, Use 1 Sheet" sticker above dispensers; calibrate electric air dryer.',
        practicalAction_uz: '"Qo‘lni 5 marta silking, 1 dona sochiq oling" eslatmasini yopishtirish; elektr quritgichni sozlash.',
        rationales: ['Cuts restroom paper waste by 60%', 'Keeps washroom floors clean', 'Promotes mindfulness'],
        rationales_uz: ['Qog‘oz sochiq sarfini 60% qisqartiradi', 'Xona tozaligini saqlaydi', 'Eko-madaniyat']
      }
    ]
  },
  {
    id: 'gym',
    title: 'Gymnasium & Indoor Sports Arena',
    title_uz: 'Sport Zali va Kiyinish Xonasi',
    subtitle: 'High-wattage athletic courts, locker rooms, and spectator bleachers',
    subtitle_uz: 'Katta maydonli sport maydoni, projektorlar va dush xonalari',
    badge: 'Athletics Eco-Audit',
    badge_uz: 'Sport Zali Eko-Auditi',
    description: 'Vast ceiling heights requiring heavy floodlighting, ventilation, and athletic water consumption.',
    description_uz: 'Katta quvvatli projektorlar, shamollatgichlar va sport ichimliklari ko‘p ishlatiladigan sport majmuasi.',
    difficulty: 'Action-Heavy (5 Eco-Issues)',
    difficulty_uz: 'Muhim (5 ta Eko-Muammo)',
    accentColor: '#f97316',
    coverImage: '/scenarios/scenario_7_gym.jpg',
    issues: [
      {
        id: 'gym-floodlights-empty',
        title: 'High-Bay Stadium Lights in Empty Gym',
        title_uz: 'Bo‘sh Zalda Yonib Turgan Katta Projektorlar',
        category: 'Energy',
        category_uz: 'Elektr energiyasi',
        severity: 'High',
        description: '10,000 watts of high-intensity discharge metal halide lights burning brightly in an empty sports hall.',
        description_uz: 'Mashg‘ulotlar tugagan bo‘lsa-da, bo‘sh sport zalidagi minglab vattli projektorlar o‘chirilmagan.',
        practicalAction: 'Designate the sports team captain or coach to switch off courts immediately after practice.',
        practicalAction_uz: 'Jismoniy tarbiya o‘qituvchisi yoki sardorga darsdan so‘ng projektorlarni o‘chirish mas’uliyatini yuklash.',
        rationales: ['Cuts massive commercial utility spikes', 'Reduces hall cooling demands', 'Bulb longevity'],
        rationales_uz: ['Eng katta elektr xarajatini darhol qisqartiradi', 'Zalning qizib ketishini kamaytiradi']
      },
      {
        id: 'single-use-sports-bottles',
        title: 'Single-Use Plastic Water Bottles Under Bleachers',
        title_uz: 'O‘rindiqlar Tagidagi Plastik Suv Idishlari',
        category: 'Materials',
        category_uz: 'Plastik',
        severity: 'Medium',
        description: 'Dozens of discarded half-empty disposable plastic water bottles abandoned under spectator seating.',
        description_uz: 'Mashg‘ulotdan so‘ng o‘nlab bir martalik yarim ichilgan plastik butilkalar tribunalarda qolib ketgan.',
        practicalAction: 'Install a touchless bottle-filling station and mandate reusable sports flasks for team members.',
        practicalAction_uz: 'Sportchilarga shaxsiy ko‘p martalik sport idishlaridan foydalanishni qat’iy tavsiya qilish.',
        rationales: ['Eliminates recurring plastic bottle litter', 'Saves money for student families', 'Promotes hydration'],
        rationales_uz: ['Plastik chiqindini yo‘qotadi', 'O‘quvchilar cho‘ntagidagi pulni tejaydi']
      }
    ]
  },
  {
    id: 'computer-lab',
    title: 'Computer & IT Testing Suite',
    title_uz: 'Informatika Xonasi va Server',
    subtitle: 'Desktop workstations, networking racks, and air conditioning',
    subtitle_uz: '30 ta shaxsiy kompyuter, tarmoq serveri va sovutish tizimi',
    badge: 'IT Eco-Audit',
    badge_uz: 'IT Xonasi Eko-Auditi',
    description: 'High-density electronic classroom with dozens of idling desktop computers, power transformers, and climate control.',
    description_uz: 'O‘nlab kompyuterlar, monitorlar va elektr uzaytirgichlar tunu-kun elektr tarmog‘iga ulangan xona.',
    difficulty: 'Advanced (5 Eco-Issues)',
    difficulty_uz: 'Murakkab (5 ta Eko-Muammo)',
    accentColor: '#3b82f6',
    coverImage: '/scenarios/scenario_8_computerlab.jpg',
    issues: [
      {
        id: 'pcs-idling-desktop',
        title: '30 Desktops Idling with Monitors Glowing',
        title_uz: 'Bo‘sh Turgan 30 ta Kompyuterning Yoniq Qolishi',
        category: 'Energy',
        category_uz: 'Elektr energiyasi',
        severity: 'High',
        description: 'All 30 computer terminals left powered on at login screens overnight between classes.',
        description_uz: 'Dars tugagandan keyin ham barcha 30 ta kompyuter va monitorlar tun bo‘yi o‘chirilmasdan qolgan.',
        practicalAction: 'Configure group policy to schedule automatic PC sleep after 15 minutes of inactivity; teacher shutoff checklist.',
        practicalAction_uz: 'Kompyuterlarda 15 daqiqada avtomatik o‘chish rejimini yoqish; har dars so‘ngida umumiy o‘chirgichni bosish.',
        rationales: ['Saves up to 120 kWh per week', 'Protects processor thermal life', 'Reduces air conditioning load'],
        rationales_uz: ['Haftasiga 120 kVt/soatgacha elektrni tejaydi', 'Kompyuter qismlarini asraydi']
      },
      {
        id: 'ac-open-doors',
        title: 'AC Running at 16°C with Open Corridor Doors',
        title_uz: 'Konditsioner 16°C da Ishlayotganda Eshik Ochiq',
        category: 'Thermal',
        category_uz: 'Issiqlik',
        severity: 'High',
        description: 'Split-system air conditioner running at maximum chill while double hallway doors are wedged open.',
        description_uz: 'Konditsioner eng sovuq darajada ishlayotganda yo‘lak eshigi ochiq qolib, butun maktab yo‘lagini sovutmoqda.',
        practicalAction: 'Set thermostat to comfortable 24°C eco-setting and close corridor doors.',
        practicalAction_uz: 'Konditsioner haroratini qulay 24°C ga qo‘yish va xona eshigini yopib qo‘yish.',
        rationales: ['Cuts AC electrical draw by 40%', 'Prevents compressor burnout', 'Healthy room climate'],
        rationales_uz: ['Elektr sarfini 40% ga qisqartiradi', 'Konditsioner motorini kuyishdan saqlaydi']
      }
    ]
  },
  {
    id: 'garden',
    title: 'School Garden, Greenery & Greenhouse',
    title_uz: 'Maktab Bog‘i, Hovlisi va Issiqxona',
    subtitle: 'Outdoor learning garden, raised vegetable beds, and compost station',
    subtitle_uz: 'O‘quvchilar parvarishlaydigan poliz ekinlari, ko‘kalamzor va kompost',
    badge: 'Green Space Eco-Audit',
    badge_uz: 'Yashil Hudud Eko-Auditi',
    description: 'Living ecosystem where irrigation hose efficiency, plant health, and organic waste separation matter.',
    description_uz: 'O‘simliklar, sug‘orish tizimlari va organik chiqindilarni qayta ishlash hududi.',
    difficulty: 'Action-Heavy (5 Eco-Issues)',
    difficulty_uz: 'Muhim (5 ta Eko-Muammo)',
    accentColor: '#16a34a',
    coverImage: '/scenarios/scenario_9_garden.jpg',
    issues: [
      {
        id: 'leaking-garden-hose',
        title: 'Watering Hose Running into Mud Puddle',
        title_uz: 'Sug‘orish Shlangi Ochiq Qolib Loy Hosil Qilgan',
        category: 'Water',
        category_uz: 'Suv',
        severity: 'High',
        description: 'A green garden hose left lying on the soil with water gushing into a muddy puddle between planters.',
        description_uz: 'Shlang jo‘mragi ochiq qolib, suv ko‘lmak bo‘lib oqib yotibdi va tuproqni yuvib ketmoqda.',
        practicalAction: 'Fit an automatic trigger spray nozzle that shuts off flow when released; set a watering timer.',
        practicalAction_uz: 'Shlang uchiga to‘xtatuvchi pistolet o‘rnatish; sug‘orish uchun 15 daqiqalik taymer belgilash.',
        rationales: ['Saves hundreds of litres of irrigation water', 'Prevents root rot', 'Preserves topsoil nutrients'],
        rationales_uz: ['Yuzlab litr sug‘orish suvini tejaydi', 'Ildizlarning chirishini oldini oladi']
      },
      {
        id: 'wilted-plants-dry-soil',
        title: 'Wilted Vegetables in Cracked Dry Soil',
        title_uz: 'Qurib Qolgan O‘simliklar va Ekinlar',
        category: 'Biophilic',
        category_uz: 'O‘simliklar',
        severity: 'Medium',
        description: 'Classroom planter boxes with yellowing drooping tomato vines suffering from irregular watering.',
        description_uz: 'Muntazam parvarish qilinmagani sababli ekinlar so‘lib, tuproq yorilib ketgan.',
        practicalAction: 'Establish a student "Garden Guardian" schedule and apply woodchip mulch to retain soil moisture.',
        practicalAction_uz: 'O‘quvchilar orasida sug‘orish navbatchiligini tuzish va namlikni saqlash uchun organik mulch sepish.',
        rationales: ['Saves educational crops', 'Teaches consistent environmental stewardship', 'Conserves moisture'],
        rationales_uz: ['Ekinlarni asrab qoladi', 'O‘quvchilarda tabiatga g‘amxo‘rlik odatini shakllantiradi']
      }
    ]
  },
  {
    id: 'grounds',
    title: 'School Entrance & Exterior Grounds',
    title_uz: 'Maktab Kirish Qismi va Avtoturargoh',
    subtitle: 'Drop-off loop, perimeter gates, and main arrival entrance',
    subtitle_uz: 'Maktab darvozasi, kutish maydoni va ko‘cha yoritgichlari',
    badge: 'Grounds Eco-Audit',
    badge_uz: 'Maktab Hovlisi Eko-Auditi',
    description: 'First public impression of campus sustainability where vehicle idling, exterior lighting, and litter converge.',
    description_uz: 'Maktabning bosh darvozasi: transport vositalarining tutuni, tashqi yoritgichlar va ko‘cha chiqindilari.',
    difficulty: 'Action-Heavy (5 Eco-Issues)',
    difficulty_uz: 'Muhim (5 ta Eko-Muammo)',
    accentColor: '#e11d48',
    coverImage: '/scenarios/scenario_10_grounds.jpg',
    issues: [
      {
        id: 'idling-vehicles',
        title: 'Delivery Van Idling Engine Emitting Fumes',
        title_uz: 'Dvigateli O‘chirilmagan Avtomobil Tutuni',
        category: 'Air Quality',
        category_uz: 'Havo sifati',
        severity: 'High',
        description: 'Delivery vehicle parked with diesel engine running continuously for 20 minutes outside the school entrance doors.',
        description_uz: 'Yetkazib berish mashinasi maktab eshigi oldida 20 daqiqadan beri dvigatelini o‘chirmasdan zaharli tutun chiqarmoqda.',
        practicalAction: 'Erect an "Idle-Free School Zone — Please Turn Off Engine" sign at the drop-off curb.',
        practicalAction_uz: '"Dvigatelni o‘chiring — Bu yerda maktab bolalari nafas oladi!" eslatma belgisini o‘rnatish.',
        rationales: ['Protects children respiratory health', 'Stops unnecessary fuel combustion', 'Immediate community awareness'],
        rationales_uz: ['Bolalarning o‘pkasini zaharli tutundan asraydi', 'Yoqilg‘i isrofini to‘xtatadi', 'Toza havo']
      },
      {
        id: 'exterior-lights-daytime',
        title: 'Security Floodlights Burning at Midday',
        title_uz: 'Kunduzi Yonib Turgan Ko‘cha Chiroqlari',
        category: 'Energy',
        category_uz: 'Elektr energiyasi',
        severity: 'Medium',
        description: 'Bright perimeter wall spotlights burning under brilliant clear noon sunlight due to a broken photocell timer.',
        description_uz: 'Yorug‘ tush paytida ham maktab devoridagi kuchli ko‘cha projektorlari o‘chmasdan yonib turibdi.',
        practicalAction: 'Reset lighting timer clock or replace faulty daylight sensor photocell; manual switch override.',
        practicalAction_uz: 'Sensor taymerini to‘g‘rilash yoki kunduzi qo‘lda o‘chirib qo‘yish.',
        rationales: ['Cuts thousands of kilowatt-hours yearly', 'Zero impact on night safety', 'Professional facilities practice'],
        rationales_uz: ['Yiliga minglab kilovatt elektrni tejaydi', 'Tungi xavfsizlikka hech qanday zarari yo‘q']
      }
    ]
  }
];

/**
 * Returns a fully localized scenario object based on current language ('uz' or 'en')
 */
export const getLocalizedScenario = (scenario, lang = 'uz') => {
  if (!scenario) return SCENARIOS[0];
  const isUz = lang === 'uz';

  return {
    ...scenario,
    title: (isUz && scenario.title_uz) ? scenario.title_uz : scenario.title,
    subtitle: (isUz && scenario.subtitle_uz) ? scenario.subtitle_uz : scenario.subtitle,
    badge: (isUz && scenario.badge_uz) ? scenario.badge_uz : scenario.badge,
    description: (isUz && scenario.description_uz) ? scenario.description_uz : scenario.description,
    difficulty: (isUz && scenario.difficulty_uz) ? scenario.difficulty_uz : scenario.difficulty,
    issues: (scenario.issues || []).map(iss => ({
      ...iss,
      title: (isUz && iss.title_uz) ? iss.title_uz : iss.title,
      category: (isUz && iss.category_uz) ? iss.category_uz : iss.category,
      description: (isUz && iss.description_uz) ? iss.description_uz : iss.description,
      practicalAction: (isUz && iss.practicalAction_uz) ? iss.practicalAction_uz : iss.practicalAction,
      rationales: (isUz && iss.rationales_uz) ? iss.rationales_uz : iss.rationales
    }))
  };
};

// Debrief Questions from Facilitator Answer Key (Page 3 of the PDF)
export const DEBRIEF_QUESTIONS = [
  {
    question: "What did you notice first, and why?",
    question_uz: "Birinchi bo‘lib nimani payqadingiz va nima uchun?",
    guidance: "Often people notice visible light or sound (like dripping water) before silent waste like chargers or food packaging.",
    guidance_uz: "Odamlar odatda ko‘rinadigan yorug‘lik yoki ovozni (chiroq yoki tomayotgan suv) zaryadlovchilar yoki qadoqlash chiqindilaridan oldinroq payqashadi."
  },
  {
    question: "Which issue could be fixed immediately with zero budget?",
    question_uz: "Qaysi muammoni hech qanday xarajatsiz darhol hal qilish mumkin?",
    guidance: "Turning off lights, unplugging phantom chargers, turning off taps, and separating clean cardboard.",
    guidance_uz: "Chiroqlarni o‘chirish, bo‘sh zaryadlovchilarni sug‘urish, kranni mahkam yopish va toza qog‘ozni ajratish."
  },
  {
    question: "Which issue might need a longer-term structural solution?",
    question_uz: "Qaysi muammo uzoq muddatli tizimli yechimni talab qilishi mumkin?",
    guidance: "Plumbing repair for worn seals, double-sided printer defaults, setting up food rescue programs, or daylight sensor installation.",
    guidance_uz: "Nosoz santexnika klapanlarini yangilash, printerlarni ikki tomonlama rejimga sozlash yoki oziq-ovqat isrofini kamaytirish dasturlari."
  },
  {
    question: "How could our school or workplace check whether our solution worked?",
    question_uz: "Maktabimiz yoki jamoamiz taklif qilingan yechim natija berganini qanday tekshirishi mumkin?",
    guidance: "Conduct a re-audit in 14 days, check the electricity/water utility meter, or weigh the recycling bins before and after.",
    guidance_uz: "14 kundan keyin qayta audit o‘tkazish, hisoblagich ko‘rsatkichlarini solishtirish yoki saralangan chiqindi og‘irligini o‘lchash."
  }
];

export const FACILITATOR_CLOSING_LINE = {
  en: "An environmental audit starts with observation. The next step is to choose a realistic action, assign responsibility, and check whether it makes a difference.",
  uz: "Ekologik audit sinchiklab kuzatishdan boshlanadi. Keyingi qadam — aniq va erishsa bo‘ladigan vazifani tanlash, mas’ulni belgilash va natijani tekshirishdir."
};
