export let NUM_ROWS = 3;
export let NUM_COLS = 5;

export const leveling = [
    { level: 1, xpRequired: 200 },
    { level: 2, xpRequired: 350 },
    { level: 3, xpRequired: 650 },
    { level: 4, xpRequired: 1200 },
    { level: 5, xpRequired: 2200 },
    { level: 6, xpRequired: 4000 },
    { level: 7, xpRequired: 7200 },
    { level: 8, xpRequired: 13000 },
    { level: 9, xpRequired: 23500 },
    { level: 10, xpRequired: 42500 },
    { level: 11, xpRequired: 77000 },
    { level: 12, xpRequired: 140000 },
    { level: 13, xpRequired: 250000 },
    { level: 14, xpRequired: 450000 },
    { level: 15, xpRequired: 800000 },
];

export const store = [
    { name: 'wheat_seed', price: 10, type: 'seed', requiredLevel: 1 },
    { name: 'carrot_seed', price: 15, type: 'seed', requiredLevel: 1 },
    { name: 'tomato_seed', price: 20, type: 'seed', requiredLevel: 1 },
    { name: 'potato_seed', price: 25, type: 'seed', requiredLevel: 1 },
    { name: 'strawberry_seed', price: 50, type: 'seed', requiredLevel: 5 },
    { name: 'blueberry_seed', price: 60, type: 'seed', requiredLevel: 7 },
    { name: 'corn_seed', price: 75, type: 'seed', requiredLevel: 11 },
    { name: 'bell_pepper_seed', price: 90, type: 'seed', requiredLevel: 13 }
];

export const cropTypes = {
    'wheat': {
        icon: '🌾',
        seed_icon: '🌱',
        growthTime: 2000, // ms per stage
        visuals: ['🌱', '🌿', '🌾'],
        yieldRange: [1, 3],
        maxPrice: 8,  // REBALANCED: was 12 (-33%)
        minPrice: 3,  // REBALANCED: was 5
        priceRecoveryRate: 20000, // ms to recover 1 price point
        salesVolumeForPriceDrop: 10, // amount of sales to drop price by 1
        xpValue: 1,
        requiredLevel: 1
    },
    'carrot': {
        icon: '🥕',
        seed_icon: '🌱',
        growthTime: 2667,
        visuals: ['🌱', '🌿', '🥕'],
        yieldRange: [1, 2],
        maxPrice: 14,  // REBALANCED: was 20 (-30%)
        minPrice: 7,   // REBALANCED: was 10
        priceRecoveryRate: 24000,
        salesVolumeForPriceDrop: 8,
        xpValue: 2,
        requiredLevel: 1
    },
    'tomato': {
        icon: '🍅',
        seed_icon: '🌱',
        growthTime: 3333,
        visuals: ['🌱', '🌿', '🍅'],
        yieldRange: [2, 4],
        maxPrice: 28,  // REBALANCED: was 40 (-30%)
        minPrice: 14,  // REBALANCED: was 20
        priceRecoveryRate: 30000,
        salesVolumeForPriceDrop: 5,
        xpValue: 4,
        requiredLevel: 1
    },
    'potato': {
        icon: '🥔',
        seed_icon: '🌱',
        growthTime: 4000,
        visuals: ['🌱', '🌿', '🥔'],
        yieldRange: [3, 6],
        maxPrice: 42,  // REBALANCED: was 60 (-30%)
        minPrice: 21,  // REBALANCED: was 30
        priceRecoveryRate: 40000,
        salesVolumeForPriceDrop: 3,
        xpValue: 6,
        requiredLevel: 1
    },
    'bread': {
        icon: '🍞',
        maxPrice: 28,  // REBALANCED: was 40 (-30%)
        minPrice: 14,  // REBALANCED: was 20
        priceRecoveryRate: 20000,
        salesVolumeForPriceDrop: 5,
        xpValue: 8,
        requiredLevel: 1
    },
    'milk': {
        icon: '🥛',
        maxPrice: 35,  // REBALANCED: was 50 (-30%)
        minPrice: 18,  // REBALANCED: was 25
        priceRecoveryRate: 48000,
        salesVolumeForPriceDrop: 4,
        xpValue: 10,
        requiredLevel: 3
    },
    'bacon': {
        icon: '🥓',
        maxPrice: 49,  // REBALANCED: was 70 (-30%)
        minPrice: 25,  // REBALANCED: was 35
        priceRecoveryRate: 60000,
        salesVolumeForPriceDrop: 3,
        xpValue: 12,
        requiredLevel: 5
    },
    'sandwich': {
        icon: '🥪',
        maxPrice: 126,  // REBALANCED: was 180 (-30%)
        minPrice: 70,   // REBALANCED: was 100
        priceRecoveryRate: 80000,
        salesVolumeForPriceDrop: 2,
        xpValue: 25,
        requiredLevel: 7
    },
    'cereal': {
        icon: '🥣',
        maxPrice: 154,  // REBALANCED: was 220 (-30%)
        minPrice: 84,   // REBALANCED: was 120
        priceRecoveryRate: 100000,
        salesVolumeForPriceDrop: 1,
        xpValue: 35,
        requiredLevel: 8
    },
    'tomato_juice': {
        icon: '🥤',
        maxPrice: 56,  // REBALANCED: was 80 (-30%)
        minPrice: 28,  // REBALANCED: was 40
        priceRecoveryRate: 60000,
        salesVolumeForPriceDrop: 4,
        xpValue: 15,
        requiredLevel: 4
    },
    'carrot_juice': {
        icon: '🧃',
        maxPrice: 49,  // REBALANCED: was 70 (-30%)
        minPrice: 21,  // REBALANCED: was 30
        priceRecoveryRate: 48000,
        salesVolumeForPriceDrop: 5,
        xpValue: 12,
        requiredLevel: 4
    },
    'strawberry': {
        icon: '🍓',
        seed_icon: '🌱',
        growthTime: 9333,
        visuals: ['🌱', '🌿', '🍓'],
        yieldRange: [2, 5],
        maxPrice: 70,  // REBALANCED: was 100 (-30%)
        minPrice: 35,  // REBALANCED: was 50
        priceRecoveryRate: 72000,
        salesVolumeForPriceDrop: 3,
        xpValue: 15,
        requiredLevel: 5
    },
    'blueberry': {
        icon: '🔵',
        seed_icon: '🌱',
        growthTime: 16000,
        visuals: ['🌱', '🌿', '🔵'],
        yieldRange: [3, 6],
        maxPrice: 91,  // REBALANCED: was 130 (-30%)
        minPrice: 42,  // REBALANCED: was 60
        priceRecoveryRate: 88000,
        salesVolumeForPriceDrop: 2,
        xpValue: 20,
        requiredLevel: 7
    },
    'strawberry_jam': {
        icon: '🍓🍯',
        maxPrice: 175,  // REBALANCED: was 250 (-30%)
        minPrice: 105,  // REBALANCED: was 150
        priceRecoveryRate: 100000,
        salesVolumeForPriceDrop: 2,
        xpValue: 40,
        requiredLevel: 8
    },
    'blueberry_jam': {
        icon: '🔵🍯',
        maxPrice: 210,  // REBALANCED: was 300 (-30%)
        minPrice: 126,  // REBALANCED: was 180
        priceRecoveryRate: 120000,
        salesVolumeForPriceDrop: 1,
        xpValue: 50,
        requiredLevel: 8
    },
    'corn': {
        icon: '🌽',
        seed_icon: '🌱',
        growthTime: 18000,
        visuals: ['🌱', '🌿', '🌽'],
        yieldRange: [4, 8],
        maxPrice: 112,  // REBALANCED: was 160 (-30%)
        minPrice: 56,   // REBALANCED: was 80
        priceRecoveryRate: 100000,
        salesVolumeForPriceDrop: 2,
        xpValue: 25,
        requiredLevel: 11
    },
    'bell_pepper': {
        icon: '🌶️',
        seed_icon: '🌱',
        growthTime: 20000,
        visuals: ['🌱', '🌿', '🌶️'],
        yieldRange: [5, 10],
        maxPrice: 140,  // REBALANCED: was 200 (-30%)
        minPrice: 70,   // REBALANCED: was 100
        priceRecoveryRate: 120000,
        salesVolumeForPriceDrop: 1,
        xpValue: 30,
        requiredLevel: 13
    },
    'taco': {
        icon: '🌮',
        maxPrice: 280,  // REBALANCED: was 400 (-30%)
        minPrice: 175,  // REBALANCED: was 250
        priceRecoveryRate: 140000,
        salesVolumeForPriceDrop: 1,
        xpValue: 60,
        requiredLevel: 12
    },
    'salad': {
        icon: '🥗',
        maxPrice: 350,  // REBALANCED: was 500 (-30%)
        minPrice: 210,  // REBALANCED: was 300
        priceRecoveryRate: 160000,
        salesVolumeForPriceDrop: 1,
        xpValue: 75,
        requiredLevel: 14
    },
    'cheese': {
        icon: '🧀',
        maxPrice: 84,  // REBALANCED: was 120 (-30%)
        minPrice: 42,  // REBALANCED: was 60
        priceRecoveryRate: 60000,
        salesVolumeForPriceDrop: 3,
        xpValue: 18,
        requiredLevel: 4
    },
    'pizza': {
        icon: '🍕',
        maxPrice: 420,  // REBALANCED: was 600 (-30%)
        minPrice: 245,  // REBALANCED: was 350
        priceRecoveryRate: 180000,
        salesVolumeForPriceDrop: 1,
        xpValue: 100,
        requiredLevel: 6
    },
    'fruit_tart': {
        icon: '🍰',
        maxPrice: 490,  // REBALANCED: was 700 (-30%)
        minPrice: 280,  // REBALANCED: was 400
        priceRecoveryRate: 200000,
        salesVolumeForPriceDrop: 1,
        xpValue: 120,
        requiredLevel: 9
    },
    'research_points': {
        icon: '💡',
        xpValue: 0
    }
};

export const upgrades = {
    // --- General Upgrades ---
    'fertilizer1': { cost: 500, name: 'upgrade_fertilizer1_name', description: 'upgrade_fertilizer1_desc', effect: { type: 'growthMultiplier', value: 0.95 }, purchased: false, requiredLevel: 2 },
    'fertilizer2': { cost: 2500, name: 'upgrade_fertilizer2_name', description: 'upgrade_fertilizer2_desc', effect: { type: 'growthMultiplier', value: 0.925 }, purchased: false, requiredLevel: 6 },
    'compost1': { cost: 800, name: 'upgrade_compost1_name', description: 'upgrade_compost1_desc', effect: { type: 'yieldBonus', value: 1 }, purchased: false, requiredLevel: 2 },
    'compost2': { cost: 3000, name: 'upgrade_compost2_name', description: 'upgrade_compost2_desc', effect: { type: 'yieldBonus', value: 1 }, purchased: false, requiredLevel: 7 },
    'negotiation1': { cost: 1000, name: 'upgrade_negotiation1_name', description: 'upgrade_negotiation1_desc', effect: { type: 'seedDiscount', value: 0.1 }, purchased: false, requiredLevel: 3 },
    'negotiation2': { cost: 5000, name: 'upgrade_negotiation2_name', description: 'upgrade_negotiation2_desc', effect: { type: 'seedDiscount', value: 0.05 }, purchased: false, requiredLevel: 6 },
    'charm1': { cost: 3000, name: 'upgrade_charm1_name', description: 'upgrade_charm1_desc', effect: { type: 'marketBonus', value: 2 }, purchased: false, requiredLevel: 5 },
    'charm2': { cost: 8000, name: 'upgrade_charm2_name', description: 'upgrade_charm2_desc', effect: { type: 'marketBonus', value: 3 }, purchased: false, requiredLevel: 9 },
    'negotiation3': { cost: 15000, name: 'upgrade_negotiation3_name', description: 'upgrade_negotiation3_desc', effect: { type: 'seedDiscount', value: 0.1 }, purchased: false, requiredLevel: 8 },
    'charm3': { cost: 20000, name: 'upgrade_charm3_name', description: 'upgrade_charm3_desc', effect: { type: 'marketBonus', value: 5 }, purchased: false, requiredLevel: 10 },
    'fertilizer3': { cost: 10000, name: 'upgrade_fertilizer3_name', description: 'upgrade_fertilizer3_desc', effect: { type: 'growthMultiplier', value: 0.9 }, purchased: false, requiredLevel: 8 },

    // --- Automation Upgrades ---
    'building_automation': { cost: 10000, name: 'upgrade_building_automation_name', description: 'upgrade_building_automation_desc', effect: { type: 'buildingAutomation', value: true }, purchased: false, requiredLevel: 8 },

    // --- Field Automation Upgrades ---
    'auto_wheat': { cost: 3000, name: 'upgrade_auto_wheat_name', description: 'upgrade_auto_wheat_desc', effect: { type: 'autoPlot', crop: 'wheat' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 3 },
    'auto_carrot': { cost: 4000, name: 'upgrade_auto_carrot_name', description: 'upgrade_auto_carrot_desc', effect: { type: 'autoPlot', crop: 'carrot' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 4 },
    'auto_tomato': { cost: 5000, name: 'upgrade_auto_tomato_name', description: 'upgrade_auto_tomato_desc', effect: { type: 'autoPlot', crop: 'tomato' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 6 },
    'auto_potato': { cost: 6000, name: 'upgrade_auto_potato_name', description: 'upgrade_auto_potato_desc', effect: { type: 'autoPlot', crop: 'potato' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 7 },
    'auto_strawberry': { cost: 7000, name: 'upgrade_auto_strawberry_name', description: 'upgrade_auto_strawberry_desc', effect: { type: 'autoPlot', crop: 'strawberry' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 8 },
    'auto_blueberry': { cost: 8000, name: 'upgrade_auto_blueberry_name', description: 'upgrade_auto_blueberry_desc', effect: { type: 'autoPlot', crop: 'blueberry' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 9 },
    'auto_corn': { cost: 9000, name: 'upgrade_auto_corn_name', description: 'upgrade_auto_corn_desc', effect: { type: 'autoPlot', crop: 'corn' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 12 },
    'auto_bell_pepper': { cost: 10000, name: 'upgrade_auto_bell_pepper_name', description: 'upgrade_auto_bell_pepper_desc', effect: { type: 'autoPlot', crop: 'bell_pepper' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 14 },

    // --- Research Upgrades (unlocked by Research Lab) ---
    'research_yield': { cost: 100, costCurrency: 'research_points', name: 'upgrade_research_yield_name', description: 'upgrade_research_yield_desc', effect: { type: 'yieldBonus', value: 1 }, repeatable: true, purchasedCount: 0, requiredLevel: 10, requiresBuilding: 'research_lab' },
    'research_market': { cost: 100, costCurrency: 'research_points', name: 'upgrade_research_market_name', description: 'upgrade_research_market_desc', effect: { type: 'marketBonus', value: 1 }, repeatable: true, purchasedCount: 0, requiredLevel: 10, requiresBuilding: 'research_lab' },

    // --- Building Upgrades ---
    'prod_speed1': { cost: 2000, name: 'upgrade_prod_speed1_name', description: 'upgrade_prod_speed1_desc', effect: { type: 'productionSpeed', value: 0.05 }, purchased: false, requiredLevel: 3 },
    'prod_speed2': { cost: 8000, name: 'upgrade_prod_speed2_name', description: 'upgrade_prod_speed2_desc', effect: { type: 'productionSpeed', value: 0.05 }, purchased: false, requiredLevel: 6 },
    'prod_speed3': { cost: 20000, name: 'upgrade_prod_speed3_name', description: 'upgrade_prod_speed3_desc', effect: { type: 'productionSpeed', value: 0.075 }, purchased: false, requiredLevel: 9 },

    'prod_eff1': { cost: 2500, name: 'upgrade_prod_eff1_name', description: 'upgrade_prod_eff1_desc', effect: { type: 'productionEfficiency', value: 0.1 }, purchased: false, requiredLevel: 4 },
    'prod_eff2': { cost: 10000, name: 'upgrade_prod_eff2_name', description: 'upgrade_prod_eff2_desc', effect: { type: 'productionEfficiency', value: 0.1 }, purchased: false, requiredLevel: 7 },
    'prod_eff3': { cost: 25000, name: 'upgrade_prod_eff3_name', description: 'upgrade_prod_eff3_desc', effect: { type: 'productionEfficiency', value: 0.15 }, purchased: false, requiredLevel: 10 },

    'prod_luck1': { cost: 5000, name: 'upgrade_prod_luck1_name', description: 'upgrade_prod_luck1_desc', effect: { type: 'productionLuck', value: 0.05 }, purchased: false, requiredLevel: 5 },
    'prod_luck2': { cost: 15000, name: 'upgrade_prod_luck2_name', description: 'upgrade_prod_luck2_desc', effect: { type: 'productionLuck', value: 0.05 }, purchased: false, requiredLevel: 8 },
    'prod_luck3': { cost: 30000, name: 'upgrade_prod_luck3_name', description: 'upgrade_prod_luck3_desc', effect: { type: 'productionLuck', value: 0.05 }, purchased: false, requiredLevel: 10 },

    'prod_vol1': { cost: 10000, name: 'upgrade_prod_vol1_name', description: 'upgrade_prod_vol1_desc', effect: { type: 'productionVolume', value: 1 }, purchased: false, requiredLevel: 6 },
    'prod_vol2': { cost: 25000, name: 'upgrade_prod_vol2_name', description: 'upgrade_prod_vol2_desc', effect: { type: 'productionVolume', value: 1 }, purchased: false, requiredLevel: 8 },
    'prod_vol3': { cost: 50000, name: 'upgrade_prod_vol3_name', description: 'upgrade_prod_vol3_desc', effect: { type: 'productionVolume', value: 1 }, purchased: false, requiredLevel: 10 },

    'prod_speed4': { cost: 50000, name: 'upgrade_prod_speed4_name', description: 'upgrade_prod_speed4_desc', effect: { type: 'productionSpeed', value: 0.075 }, purchased: false, requiredLevel: 10 },
    'prod_eff4': { cost: 60000, name: 'upgrade_prod_eff4_name', description: 'upgrade_prod_eff4_desc', effect: { type: 'productionEfficiency', value: 0.15 }, purchased: false, requiredLevel: 10 },
    'prod_luck4': { cost: 75000, name: 'upgrade_prod_luck4_name', description: 'upgrade_prod_luck4_desc', effect: { type: 'productionLuck', value: 0.1 }, purchased: false, requiredLevel: 10 },
    'prod_vol4': { cost: 100000, name: 'upgrade_prod_vol4_name', description: 'upgrade_prod_vol4_desc', effect: { type: 'productionVolume', value: 1 }, purchased: false, requiredLevel: 10 },

    'fertilizer4': { cost: 25000, name: 'upgrade_fertilizer4_name', description: 'upgrade_fertilizer4_desc', effect: { type: 'growthMultiplier', value: 0.875 }, purchased: false, requiredLevel: 11 },
    'compost3': { cost: 10000, name: 'upgrade_compost3_name', description: 'upgrade_compost3_desc', effect: { type: 'yieldBonus', value: 1 }, purchased: false, requiredLevel: 11 },
    'negotiation4': { cost: 40000, name: 'upgrade_negotiation4_name', description: 'upgrade_negotiation4_desc', effect: { type: 'seedDiscount', value: 0.1 }, purchased: false, requiredLevel: 12 },
    'charm4': { cost: 50000, name: 'upgrade_charm4_name', description: 'upgrade_charm4_desc', effect: { type: 'marketBonus', value: 7 }, purchased: false, requiredLevel: 13 },

    'prod_speed5': { cost: 120000, name: 'upgrade_prod_speed5_name', description: 'upgrade_prod_speed5_desc', effect: { type: 'productionSpeed', value: 0.1 }, purchased: false, requiredLevel: 13 },
    'prod_eff5': { cost: 150000, name: 'upgrade_prod_eff5_name', description: 'upgrade_prod_eff5_desc', effect: { type: 'productionEfficiency', value: 0.2 }, purchased: false, requiredLevel: 14 },
    'prod_luck5': { cost: 180000, name: 'upgrade_prod_luck5_name', description: 'upgrade_prod_luck5_desc', effect: { type: 'productionLuck', value: 0.1 }, purchased: false, requiredLevel: 14 },
    'prod_vol5': { cost: 250000, name: 'upgrade_prod_vol5_name', description: 'upgrade_prod_vol5_desc', effect: { type: 'productionVolume', value: 1 }, purchased: false, requiredLevel: 15 },
};

export const buildings = {
    'bakery': {
        name: 'Bakery',
        icon: '🏠',
        cost: 1500,
        description: 'Bakes bread from grain.',
        recipes: [
            {
                input: { 'wheat': 2 },
                output: { 'bread': 1 },
                productionTime: 8000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 1
    },
    'dairy': {
        name: 'Dairy',
        icon: '🐮',
        cost: 2500,
        description: 'Produces milk from wheat and cheese from milk.',
        recipes: [
            {
                input: { 'wheat': 3 },
                output: { 'milk': 1 },
                productionTime: 25000
            },
            {
                input: { 'milk': 2 },
                output: { 'cheese': 1 },
                productionTime: 30000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 3
    },
    'pig_pen': {
        name: 'Pig Pen',
        icon: '🐷',
        cost: 5000,
        description: 'Produces bacon from potatoes.',
        recipes: [
            {
                input: { 'potato': 5 },
                output: { 'bacon': 1 },
                productionTime: 35000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 5
    },
    'sandwich_shop': {
        name: 'Sandwich Shop',
        icon: '🏪',
        cost: 10000,
        description: 'Makes delicious sandwiches.',
        recipes: [
            {
                input: { 'bread': 2, 'bacon': 1 },
                output: { 'sandwich': 1 },
                productionTime: 50000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 7
    },
    'breakfast_bar': {
        name: 'Breakfast Bar',
        icon: '🥣',
        cost: 12000,
        description: 'Makes healthy cereal.',
        recipes: [
            {
                input: { 'milk': 1, 'wheat': 2 },
                output: { 'cereal': 1 },
                productionTime: 60000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 8
    },
    'juicer': {
        name: 'Juicer',
        icon: '🍹',
        cost: 4000,
        description: 'Extracts juice from fruits and vegetables.',
        recipes: [
            {
                input: { 'tomato': 3 },
                output: { 'tomato_juice': 1 },
                productionTime: 20000
            },
            {
                input: { 'carrot': 4 },
                output: { 'carrot_juice': 1 },
                productionTime: 15000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 4
    },
    'jam_factory': {
        name: 'Jam Factory',
        icon: '🏭',
        cost: 15000,
        description: 'Makes delicious jams from berries.',
        recipes: [
            {
                input: { 'strawberry': 5 },
                output: { 'strawberry_jam': 1 },
                productionTime: 30000
            },
            {
                input: { 'blueberry': 5 },
                output: { 'blueberry_jam': 1 },
                productionTime: 40000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 8
    },
    'research_lab': {
        name: 'Research Lab',
        icon: '🔬',
        cost: 50000,
        description: 'Produces Research Points to unlock powerful, repeatable upgrades.',
        recipes: [
            {
                input: { 'money': 1000 },
                output: { 'research_points': 1 },
                productionTime: 1000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 10
    },
    'taco_stand': {
        name: 'taco_stand_name',
        icon: '🌮',
        cost: 20000,
        description: 'taco_stand_desc',
        recipes: [
            {
                input: { 'corn': 5, 'tomato': 2 },
                output: { 'taco': 1 },
                productionTime: 50000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 12
    },
    'salad_bar': {
        name: 'salad_bar_name',
        icon: '🥗',
        cost: 30000,
        description: 'salad_bar_desc',
        recipes: [
            {
                input: { 'bell_pepper': 3, 'tomato': 2, 'carrot': 3 },
                output: { 'salad': 1 },
                productionTime: 60000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 14
    },
    'pizzeria': {
        name: 'pizzeria_name',
        icon: '🍕',
        cost: 40000,
        description: 'pizzeria_desc',
        recipes: [
            {
                input: { 'bread': 2, 'tomato': 5, 'cheese': 1 },
                output: { 'pizza': 1 },
                productionTime: 75000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 6
    },
    'dessert_shop': {
        name: 'dessert_shop_name',
        icon: '🍰',
        cost: 60000,
        description: 'dessert_shop_desc',
        recipes: [
            {
                input: { 'strawberry_jam': 1, 'bread': 1, 'milk': 1 },
                output: { 'fruit_tart': 1 },
                productionTime: 100000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 9
    }
};

export const customerConfig = {
    orderLifetime: 480000, // ms
    trustLevels: [
        // REBALANCED: reward multipliers increased significantly
        // xpBonus and tokenReward added as new rewards
        { level: 1, trust: 0, size: [3, 5], reward: 1.8, xpBonus: 50, tokenReward: 1, trustReward: 40, trustPenalty: 15 },
        { level: 2, trust: 100, size: [5, 10], reward: 2.0, xpBonus: 75, tokenReward: 2, trustReward: 50, trustPenalty: 20 },
        { level: 3, trust: 200, size: [10, 15], reward: 2.2, xpBonus: 100, tokenReward: 3, trustReward: 60, trustPenalty: 25 },
        { level: 4, trust: 300, size: [15, 20], reward: 2.5, xpBonus: 150, tokenReward: 5, trustReward: 80, trustPenalty: 35 },
        { level: 5, trust: 400, size: [20, 30], reward: 3.0, xpBonus: 200, tokenReward: 10, trustReward: 100, trustPenalty: 50 },
    ],
    customers: {
        'npc1': {
            name: 'Farmer Joe',
            bonus: { description: 'customer_bonus_yield', type: 'yieldBonus', value_l4: 1, value_l5: 2 }
        },
        'npc2': {
            name: 'Granny Smith',
            bonus: { description: 'customer_bonus_growth', type: 'growthMultiplier', value_l4: 0.975, value_l5: 0.95 }
        },
        'npc3': {
            name: 'Chef Pierre',
            bonus: { description: 'customer_bonus_market', type: 'marketBonus', value_l4: 2, value_l5: 5 }
        },
        'npc4': {
            name: 'Rancher Rick',
            bonus: { description: 'customer_bonus_seeds', type: 'seedDiscount', value_l4: 0.05, value_l5: 0.1 }
        },
        'npc5': {
            name: 'Baker Betty',
            bonus: { description: 'customer_bonus_wheat', type: 'priceBonus', crop: 'wheat', value_l4: 5, value_l5: 10 }
        }
    }
};
