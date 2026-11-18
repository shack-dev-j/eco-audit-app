// Scenarios dataset matching the official "The 60-Second Eco-Audit" guide

export const SCENARIOS = [
  {
    id: 'school',
    title: 'School Classroom & Hallway',
    subtitle: 'Everyday secondary school learning environment',
    badge: 'Campus Eco-Audit',
    description: 'A bustling school room where small habits create massive collective energy, water, and material waste.',
    difficulty: 'Standard (7 Eco-Issues)',
    accentColor: '#10b981',
    coverImage: '/scenarios/school-preview.svg',
    issues: [
      {
        id: 'tap-dripping',
        title: 'Dripping Sink Tap',
        category: 'Water',
        x: 18, // percentage X in scene
        y: 68, // percentage Y in scene
        icon: 'Droplets',
        severity: 'High',
        description: 'The science prep sink tap has been left dripping at 1 drop per second, wasting up to 15 litres of clean treated water daily.',
        practicalAction: 'Turn off the tap fully; report the worn washer to building maintenance for immediate repair.',
        rationales: ['Immediate resource loss', 'Zero cost to fix right away', 'Prevents damp and water damage']
      },
      {
        id: 'lights-on',
        title: 'Overhead Lights On In Bright Daylight',
        category: 'Energy',
        x: 48,
        y: 16,
        icon: 'SunMedium',
        severity: 'Medium',
        description: 'Fluorescent ceiling light banks are blazing despite floor-to-ceiling sunny windows flooding the room with 800+ lux natural daylight.',
        practicalAction: 'Switch off perimeter lights and leverage natural daylight; nominate a student light monitor.',
        rationales: ['Saves electricity immediately', 'Reduces room heat & glare', 'Zero capital cost']
      },
      {
        id: 'charger-vampire',
        title: 'Phantom Charger Plugged In Idle',
        category: 'Energy',
        x: 82,
        y: 72,
        icon: 'Zap',
        severity: 'Low',
        description: 'High-wattage laptop and tablet charging transformers remain plugged into wall sockets even though devices have been unplugged.',
        practicalAction: 'Switch off socket switches or unplug transformers when devices are disconnected.',
        rationales: ['Stops phantom standby power drain', 'Fire safety precaution', 'Extends adapter lifespan']
      },
      {
        id: 'paper-waste',
        title: 'Single-Sided Paper Discard',
        category: 'Materials',
        x: 74,
        y: 54,
        icon: 'FileText',
        severity: 'Medium',
        description: 'A stack of worksheets printed on only one side is being thrown away rather than using the blank backs for scrap math calculations.',
        practicalAction: 'Establish a designated "Draft & Scrap Paper" tray beside the printer; set printer default to double-sided duplex.',
        rationales: ['Cuts school paper budget by 40%', 'Saves trees & forestry resources', 'Easy habit change']
      },
      {
        id: 'recycling-contaminated',
        title: 'Contaminated Recycling Bin',
        category: 'Waste',
        x: 32,
        y: 82,
        icon: 'Trash2',
        severity: 'High',
        description: 'The blue paper recycling bin contains half-full soft drink cups, greasy pizza boxes, and food wrappers, sending the entire batch to landfill.',
        practicalAction: 'Clean out contamination; affix clear pictorial sorting labels directly on bin lids; separate organics.',
        rationales: ['Prevents entire recycling batch rejection', 'Complies with municipal waste regulations', 'Educates students visually']
      },
      {
        id: 'window-heater-conflict',
        title: 'Window Cracked Open Above Radiator',
        category: 'Thermal',
        x: 86,
        y: 35,
        icon: 'Flame',
        severity: 'High',
        description: 'The classroom window is propped wide open while the cast-iron steam radiator beneath it is blasting at full throttle.',
        practicalAction: 'Close the window and regulate thermostat valves; use short 2-minute ventilation breaks instead of continuous drafts.',
        rationales: ['Massive thermal energy wastage', 'Lowers heating fuel emissions', 'Maintains comfortable learning environment']
      },
      {
        id: 'neglected-plant',
        title: 'Neglected Classroom Plants',
        category: 'Biophilic',
        x: 12,
        y: 42,
        icon: 'Sprout',
        severity: 'Low',
        description: 'Classroom indoor oxygen plants are parched with dried curling leaves and cracked soil.',
        practicalAction: 'Establish a student plant care roster using leftover drinking water bottles to water plants efficiently.',
        rationales: ['Improves classroom air quality & focus', 'Teaches stewardship', 'Prevents plant loss']
      }
    ]
  },
  {
    id: 'office',
    title: 'Workplace & Staff Office',
    subtitle: 'Corporate and educational staff administrative space',
    badge: 'Workplace Eco-Audit',
    description: 'An administrative workspace with heavy computer usage, printing, coffee breaks, and climate control.',
    difficulty: 'Advanced (6 Eco-Issues)',
    accentColor: '#0ea5e9',
    coverImage: '/scenarios/office-preview.svg',
    issues: [
      {
        id: 'monitors-overnight',
        title: 'Monitors Left Glowing Overnight',
        category: 'Energy',
        x: 38,
        y: 44,
        icon: 'Monitor',
        severity: 'Medium',
        description: 'Four dual-monitor workstations left illuminated with active screensavers long after staff have departed.',
        practicalAction: 'Configure corporate sleep policies (10 min idle) and encourage a "Last Out Shuts Down" culture.',
        rationales: ['Saves office overnight electricity bill', 'Reduces hardware wear & tear', 'Simple procedural change']
      },
      {
        id: 'disposable-cups',
        title: 'Single-Use Cup Mountain at Coffee Station',
        category: 'Materials',
        x: 65,
        y: 48,
        icon: 'Coffee',
        severity: 'High',
        description: 'Scores of plastic-lined takeaway cups piling around the sink while company-branded ceramic mugs sit unused in the cupboard.',
        practicalAction: 'Provide designated mug pegs, launch a "BYO Mug" incentive, and phase out disposable cups from the breakroom.',
        rationales: ['Eliminates non-recyclable plastic-lined cup waste', 'Saves recurring procurement costs', 'Visible culture change']
      },
      {
        id: 'space-heater',
        title: 'Personal Space Heater Fighting AC',
        category: 'Thermal',
        x: 24,
        y: 74,
        icon: 'Zap',
        severity: 'High',
        description: 'A 2000W electric ceramic fan heater running beneath a desk while the central ceiling HVAC is actively blowing chilled air.',
        practicalAction: 'Conduct office thermal zoning check; adjust central thermostat; provide fleece lap blankets.',
        rationales: ['High electrical load & fire hazard', 'Resolves root thermostat imbalance', 'Protects circuit breakers']
      },
      {
        id: 'food-waste-trash',
        title: 'Organic Food Waste in General Trash',
        category: 'Waste',
        x: 78,
        y: 78,
        icon: 'Apple',
        severity: 'Medium',
        description: 'Fruit peels, sandwich crusts, and coffee grounds dumped in landfill bin creating anaerobic methane gas.',
        practicalAction: 'Introduce a sealed countertop compost / bokashi caddy for coffee grounds and fruit scraps.',
        rationales: ['Diverts organic matter from methane emission in landfills', 'Nutrient cycling for office courtyard plants', 'Odour reduction']
      },
      {
        id: 'fridge-seal',
        title: 'Breakroom Refrigerator Door Ajar',
        category: 'Energy',
        x: 88,
        y: 36,
        icon: 'Refrigerator',
        severity: 'Medium',
        description: 'The staff fridge door has a worn magnetic gasket and does not seal shut, causing the compressor to run constantly.',
        practicalAction: 'Clean door gasket folds and report seal replacement to facilities team.',
        rationales: ['Prevents food spoilage', 'Reduces continuous compressor wear', 'Halves refrigeration energy']
      },
      {
        id: 'print-overflow',
        title: 'Unclaimed Printout Pile',
        category: 'Materials',
        x: 14,
        y: 52,
        icon: 'Printer',
        severity: 'Medium',
        description: 'A 200-page color report printed hours ago and abandoned on the shared multifunction printer tray.',
        practicalAction: 'Enable badge-release / PIN-release printing on all network copiers to prevent abandoned prints.',
        rationales: ['Immediate 20-30% reduction in paper & toner', 'Guarantees document privacy', 'Standard enterprise best practice']
      }
    ]
  },
  {
    id: 'cafeteria',
    title: 'School Cafeteria & Canteen',
    subtitle: 'High-volume dining and food preparation zone',
    badge: 'Canteen Eco-Audit',
    description: 'The heart of campus nutrition where packaging, food scraps, and high water use converge.',
    difficulty: 'Action-Heavy (5 Eco-Issues)',
    accentColor: '#f59e0b',
    coverImage: '/scenarios/cafeteria-preview.svg',
    issues: [
      {
        id: 'untouched-food-dump',
        title: 'Whole Edible Food Tossed into Landfill',
        category: 'Waste',
        x: 52,
        y: 65,
        icon: 'UtensilsCrossed',
        severity: 'High',
        description: 'Unopened yogurts, whole apples, and untouched bread rolls dumped into black landfill sacks at tray return.',
        practicalAction: 'Establish a "Share Table" where students can leave untouched sealed snacks for others; partner with local food rescue.',
        rationales: ['Tackles food insecurity directly', 'Diverts highest GHG contributor', 'Respects farming and water resources']
      },
      {
        id: 'plastic-cutlery',
        title: 'Single-Use Plastic Cutlery Overuse',
        category: 'Materials',
        x: 28,
        y: 58,
        icon: 'Boxes',
        severity: 'Medium',
        description: 'Students grabbing handfuls of individually wrapped plastic spoons and forks for food that only requires a spoon.',
        practicalAction: 'Switch to dish-machine sanitized stainless steel cutlery or dispense single cutlery items on request only.',
        rationales: ['Prevents plastic micro-pollution', 'Reduces litter in school grounds', 'One-time investment pays off in 3 months']
      },
      {
        id: 'dish-tap-running',
        title: 'Pre-Rinse Dish Spray Running Unattended',
        category: 'Water',
        x: 75,
        y: 42,
        icon: 'Droplet',
        severity: 'High',
        description: 'The industrial overhead dishwashing spray wand is locked in the on position, gushing 12 litres/min into an empty sink.',
        practicalAction: 'Install automatic shutoff lever trigger on rinse wand; instruct kitchen staff on burst-rinsing technique.',
        rationales: ['Saves thousands of litres of hot water daily', 'Reduces gas/electric water heater consumption', 'Immediate impact']
      },
      {
        id: 'condiment-packets',
        title: 'Excess Single-Use Condiment Sachets',
        category: 'Materials',
        x: 20,
        y: 48,
        icon: 'Package',
        severity: 'Low',
        description: 'Dozens of discarded ketchup and mayonnaise plastic squeeze sachets lying unopened on cafeteria tables.',
        practicalAction: 'Replace plastic sachets with bulk refillable pump dispensers and reusable dip ramekins.',
        rationales: ['Cuts plastic wrapper waste by 90%', 'Reduces food spill mess', 'More cost-effective wholesale condiment buying']
      },
      {
        id: 'dining-lights-sunlight',
        title: 'Full Lighting Array in Empty Skylit Hall',
        category: 'Energy',
        x: 48,
        y: 12,
        icon: 'Lightbulb',
        severity: 'Medium',
        description: 'High-bay sodium fixtures burning brightly between meal shifts under giant sunlit atrium glass panels.',
        practicalAction: 'Install daylight sensors or switch off high bays during the 10:00 - 11:30 AM inter-shift lull.',
        rationales: ['Huge wattage savings in commercial space', 'Cooler hall temperatures', 'Extends bulb lifespan']
      }
    ]
  }
];

// Debrief Questions from Facilitator Answer Key (Page 3 of the PDF)
export const DEBRIEF_QUESTIONS = [
  {
    question: "What did you notice first, and why?",
    guidance: "Often people notice visible light or sound (like dripping water) before silent waste like chargers or food packaging."
  },
  {
    question: "Which issue could be fixed immediately with zero budget?",
    guidance: "Turning off lights, unplugging phantom chargers, turning off taps, and separating clean cardboard."
  },
  {
    question: "Which issue might need a longer-term structural solution?",
    guidance: "Plumbing repair for worn seals, double-sided printer defaults, setting up food rescue programs, or daylight sensor installation."
  },
  {
    question: "How could our school or workplace check whether our solution worked?",
    guidance: "Conduct a re-audit in 14 days, check the electricity/water utility meter, or weigh the recycling bins before and after."
  }
];

export const FACILITATOR_CLOSING_LINE = 
  "An environmental audit starts with observation. The next step is to choose a realistic action, assign responsibility, and check whether it makes a difference.";
