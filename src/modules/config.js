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
];

export const store = [
    { name: 'wheat_seed', price: 10, type: 'seed', requiredLevel: 1 },
    { name: 'carrot_seed', price: 15, type: 'seed', requiredLevel: 1 },
    { name: 'tomato_seed', price: 20, type: 'seed', requiredLevel: 1 },
    { name: 'potato_seed', price: 25, type: 'seed', requiredLevel: 1 },
    { name: 'strawberry_seed', price: 50, type: 'seed', requiredLevel: 5 },
    { name: 'blueberry_seed', price: 60, type: 'seed', requiredLevel: 7 }
];

export const cropTypes = {
    'wheat': {
        icon: '🌾',
        seed_icon: '🌱',
        growthTime: 6000, // ms per stage
        visuals: ['🌱', '🌿', '🌾'],
        yieldRange: [1, 3],
        maxPrice: 12,
        minPrice: 5,
        priceRecoveryRate: 20000, // ms to recover 1 price point
        salesVolumeForPriceDrop: 10, // amount of sales to drop price by 1
        xpValue: 1,
        requiredLevel: 1
    },
    'carrot': {
        icon: '🥕',
        seed_icon: '🌱',
        growthTime: 8000,
        visuals: ['🌱', '🌿', '🥕'],
        yieldRange: [1, 2],
        maxPrice: 20,
        minPrice: 10,
        priceRecoveryRate: 24000,
        salesVolumeForPriceDrop: 8,
        xpValue: 2,
        requiredLevel: 1
    },
    'tomato': {
        icon: '🍅',
        seed_icon: '🌱',
        growthTime: 10000,
        visuals: ['🌱', '🌿', '🍅'],
        yieldRange: [2, 4],
        maxPrice: 40,
        minPrice: 20,
        priceRecoveryRate: 30000,
        salesVolumeForPriceDrop: 5,
        xpValue: 4,
        requiredLevel: 1
    },
    'potato': {
        icon: '🥔',
        seed_icon: '🌱',
        growthTime: 12000,
        visuals: ['🌱', '🌿', '🥔'],
        yieldRange: [3, 6],
        maxPrice: 60,
        minPrice: 30,
        priceRecoveryRate: 40000,
        salesVolumeForPriceDrop: 3,
        xpValue: 6,
        requiredLevel: 1
    },
    'bread': {
        icon: '🍞',
        maxPrice: 40,
        minPrice: 20,
        priceRecoveryRate: 20000,
        salesVolumeForPriceDrop: 5,
        xpValue: 8,
        requiredLevel: 1
    },
    'milk': {
        icon: '🥛',
        maxPrice: 50,
        minPrice: 25,
        priceRecoveryRate: 24000,
        salesVolumeForPriceDrop: 4,
        xpValue: 10,
        requiredLevel: 3
    },
    'bacon': {
        icon: '🥓',
        maxPrice: 70,
        minPrice: 35,
        priceRecoveryRate: 30000,
        salesVolumeForPriceDrop: 3,
        xpValue: 12,
        requiredLevel: 5
    },
    'sandwich': {
        icon: '🥪',
        maxPrice: 180,
        minPrice: 100,
        priceRecoveryRate: 40000,
        salesVolumeForPriceDrop: 2,
        xpValue: 25,
        requiredLevel: 7
    },
    'cereal': {
        icon: '🥣',
        maxPrice: 220,
        minPrice: 120,
        priceRecoveryRate: 50000,
        salesVolumeForPriceDrop: 1,
        xpValue: 35,
        requiredLevel: 8
    },
    'tomato_juice': {
        icon: '🥤',
        maxPrice: 80,
        minPrice: 40,
        priceRecoveryRate: 30000,
        salesVolumeForPriceDrop: 4,
        xpValue: 15,
        requiredLevel: 4
    },
    'carrot_juice': {
        icon: '🧃',
        maxPrice: 70,
        minPrice: 30,
        priceRecoveryRate: 24000,
        salesVolumeForPriceDrop: 5,
        xpValue: 12,
        requiredLevel: 4
    },
    'strawberry': {
        icon: '🍓',
        seed_icon: '🌱',
        growthTime: 14000,
        visuals: ['🌱', '🌿', '🍓'],
        yieldRange: [2, 5],
        maxPrice: 100,
        minPrice: 50,
        priceRecoveryRate: 36000,
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
        maxPrice: 130,
        minPrice: 60,
        priceRecoveryRate: 44000,
        salesVolumeForPriceDrop: 2,
        xpValue: 20,
        requiredLevel: 7
    },
    'strawberry_jam': {
        icon: '🍓🍯',
        maxPrice: 250,
        minPrice: 150,
        priceRecoveryRate: 50000,
        salesVolumeForPriceDrop: 2,
        xpValue: 40,
        requiredLevel: 8
    },
    'blueberry_jam': {
        icon: '🔵🍯',
        maxPrice: 300,
        minPrice: 180,
        priceRecoveryRate: 60000,
        salesVolumeForPriceDrop: 1,
        xpValue: 50,
        requiredLevel: 8
    },
    'research_points': {
        icon: '💡',
        xpValue: 0
    }
};

export const upgrades = {
    // --- General Upgrades ---
    'fertilizer1': { cost: 500, name: 'upgrade_fertilizer1_name', description: 'upgrade_fertilizer1_desc', effect: { type: 'growthMultiplier', value: 0.9 }, purchased: false, requiredLevel: 2 },
    'fertilizer2': { cost: 2500, name: 'upgrade_fertilizer2_name', description: 'upgrade_fertilizer2_desc', effect: { type: 'growthMultiplier', value: 0.8 }, purchased: false, requiredLevel: 6 },
    'compost1': { cost: 800, name: 'upgrade_compost1_name', description: 'upgrade_compost1_desc', effect: { type: 'yieldBonus', value: 1 }, purchased: false, requiredLevel: 2 },
    'compost2': { cost: 3000, name: 'upgrade_compost2_name', description: 'upgrade_compost2_desc', effect: { type: 'yieldBonus', value: 1 }, purchased: false, requiredLevel: 7 },
    'negotiation1': { cost: 1000, name: 'upgrade_negotiation1_name', description: 'upgrade_negotiation1_desc', effect: { type: 'seedDiscount', value: 0.1 }, purchased: false, requiredLevel: 3 },
    'negotiation2': { cost: 5000, name: 'upgrade_negotiation2_name', description: 'upgrade_negotiation2_desc', effect: { type: 'seedDiscount', value: 0.1 }, purchased: false, requiredLevel: 6 },
    'charm1': { cost: 3000, name: 'upgrade_charm1_name', description: 'upgrade_charm1_desc', effect: { type: 'marketBonus', value: 2 }, purchased: false, requiredLevel: 5 },
    'charm2': { cost: 8000, name: 'upgrade_charm2_name', description: 'upgrade_charm2_desc', effect: { type: 'marketBonus', value: 3 }, purchased: false, requiredLevel: 9 },
    'negotiation3': { cost: 15000, name: 'upgrade_negotiation3_name', description: 'upgrade_negotiation3_desc', effect: { type: 'seedDiscount', value: 0.15 }, purchased: false, requiredLevel: 8 },
    'charm3': { cost: 20000, name: 'upgrade_charm3_name', description: 'upgrade_charm3_desc', effect: { type: 'marketBonus', value: 5 }, purchased: false, requiredLevel: 10 },
    'fertilizer3': { cost: 10000, name: 'upgrade_fertilizer3_name', description: 'upgrade_fertilizer3_desc', effect: { type: 'growthMultiplier', value: 0.7 }, purchased: false, requiredLevel: 8 },

    // --- Automation Upgrades ---
    'building_automation': { cost: 10000, name: 'upgrade_building_automation_name', description: 'upgrade_building_automation_desc', effect: { type: 'buildingAutomation', value: true }, purchased: false, requiredLevel: 8 },

    // --- Field Automation Upgrades ---
    'auto_wheat': { cost: 3000, name: 'upgrade_auto_wheat_name', description: 'upgrade_auto_wheat_desc', effect: { type: 'autoPlot', crop: 'wheat' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 3 },
    'auto_carrot': { cost: 4000, name: 'upgrade_auto_carrot_name', description: 'upgrade_auto_carrot_desc', effect: { type: 'autoPlot', crop: 'carrot' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 4 },
    'auto_tomato': { cost: 5000, name: 'upgrade_auto_tomato_name', description: 'upgrade_auto_tomato_desc', effect: { type: 'autoPlot', crop: 'tomato' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 6 },
    'auto_potato': { cost: 6000, name: 'upgrade_auto_potato_name', description: 'upgrade_auto_potato_desc', effect: { type: 'autoPlot', crop: 'potato' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 7 },
    'auto_strawberry': { cost: 7000, name: 'upgrade_auto_strawberry_name', description: 'upgrade_auto_strawberry_desc', effect: { type: 'autoPlot', crop: 'strawberry' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 8 },
    'auto_blueberry': { cost: 8000, name: 'upgrade_auto_blueberry_name', description: 'upgrade_auto_blueberry_desc', effect: { type: 'autoPlot', crop: 'blueberry' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 9 },

    // --- Research Upgrades (unlocked by Research Lab) ---
    'research_yield': { cost: 100, costCurrency: 'research_points', name: 'upgrade_research_yield_name', description: 'upgrade_research_yield_desc', effect: { type: 'yieldBonus', value: 1 }, repeatable: true, purchasedCount: 0, requiredLevel: 10, requiresBuilding: 'research_lab' },
    'research_growth': { cost: 100, costCurrency: 'research_points', name: 'upgrade_research_growth_name', description: 'upgrade_research_growth_desc', effect: { type: 'growthMultiplier', value: 0.95 }, repeatable: true, purchasedCount: 0, requiredLevel: 10, requiresBuilding: 'research_lab' },
    'research_market': { cost: 100, costCurrency: 'research_points', name: 'upgrade_research_market_name', description: 'upgrade_research_market_desc', effect: { type: 'marketBonus', value: 1 }, repeatable: true, purchasedCount: 0, requiredLevel: 10, requiresBuilding: 'research_lab' },

    // --- Building Upgrades ---
    'prod_speed1': { cost: 2000, name: 'upgrade_prod_speed1_name', description: 'upgrade_prod_speed1_desc', effect: { type: 'productionSpeed', value: 0.1 }, purchased: false, requiredLevel: 3 },
    'prod_speed2': { cost: 8000, name: 'upgrade_prod_speed2_name', description: 'upgrade_prod_speed2_desc', effect: { type: 'productionSpeed', value: 0.15 }, purchased: false, requiredLevel: 6 },
    'prod_speed3': { cost: 20000, name: 'upgrade_prod_speed3_name', description: 'upgrade_prod_speed3_desc', effect: { type: 'productionSpeed', value: 0.2 }, purchased: false, requiredLevel: 9 },

    'prod_eff1': { cost: 2500, name: 'upgrade_prod_eff1_name', description: 'upgrade_prod_eff1_desc', effect: { type: 'productionEfficiency', value: 0.1 }, purchased: false, requiredLevel: 4 },
    'prod_eff2': { cost: 10000, name: 'upgrade_prod_eff2_name', description: 'upgrade_prod_eff2_desc', effect: { type: 'productionEfficiency', value: 0.15 }, purchased: false, requiredLevel: 7 },
    'prod_eff3': { cost: 25000, name: 'upgrade_prod_eff3_name', description: 'upgrade_prod_eff3_desc', effect: { type: 'productionEfficiency', value: 0.2 }, purchased: false, requiredLevel: 10 },

    'prod_luck1': { cost: 5000, name: 'upgrade_prod_luck1_name', description: 'upgrade_prod_luck1_desc', effect: { type: 'productionLuck', value: 0.05 }, purchased: false, requiredLevel: 5 },
    'prod_luck2': { cost: 15000, name: 'upgrade_prod_luck2_name', description: 'upgrade_prod_luck2_desc', effect: { type: 'productionLuck', value: 0.1 }, purchased: false, requiredLevel: 8 },
    'prod_luck3': { cost: 30000, name: 'upgrade_prod_luck3_name', description: 'upgrade_prod_luck3_desc', effect: { type: 'productionLuck', value: 0.15 }, purchased: false, requiredLevel: 10 },

    'prod_vol1': { cost: 10000, name: 'upgrade_prod_vol1_name', description: 'upgrade_prod_vol1_desc', effect: { type: 'productionVolume', value: 1 }, purchased: false, requiredLevel: 6 },
    'prod_vol2': { cost: 25000, name: 'upgrade_prod_vol2_name', description: 'upgrade_prod_vol2_desc', effect: { type: 'productionVolume', value: 1 }, purchased: false, requiredLevel: 8 },
    'prod_vol3': { cost: 50000, name: 'upgrade_prod_vol3_name', description: 'upgrade_prod_vol3_desc', effect: { type: 'productionVolume', value: 1 }, purchased: false, requiredLevel: 10 },

    'prod_speed4': { cost: 50000, name: 'upgrade_prod_speed4_name', description: 'upgrade_prod_speed4_desc', effect: { type: 'productionSpeed', value: 0.25 }, purchased: false, requiredLevel: 10 },
    'prod_eff4': { cost: 60000, name: 'upgrade_prod_eff4_name', description: 'upgrade_prod_eff4_desc', effect: { type: 'productionEfficiency', value: 0.25 }, purchased: false, requiredLevel: 10 },
    'prod_luck4': { cost: 75000, name: 'upgrade_prod_luck4_name', description: 'upgrade_prod_luck4_desc', effect: { type: 'productionLuck', value: 0.2 }, purchased: false, requiredLevel: 10 },
    'prod_vol4': { cost: 100000, name: 'upgrade_prod_vol4_name', description: 'upgrade_prod_vol4_desc', effect: { type: 'productionVolume', value: 1 }, purchased: false, requiredLevel: 10 },
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
                productionTime: 40000 // 20 seconds
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
        description: 'Produces milk from wheat.',
        recipes: [
            {
                input: { 'wheat': 3 },
                output: { 'milk': 1 },
                productionTime: 60000 // 30 seconds
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
                productionTime: 90000 // 45 seconds
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
                productionTime: 120000 // 1 minute
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
                productionTime: 150000 // 1.25 minutes
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
                productionTime: 50000 // 25 seconds
            },
            {
                input: { 'carrot': 4 },
                output: { 'carrot_juice': 1 },
                productionTime: 40000 // 20 seconds
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
                productionTime: 80000 // 40 seconds
            },
            {
                input: { 'blueberry': 5 },
                output: { 'blueberry_jam': 1 },
                productionTime: 100000 // 50 seconds
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
                output: { 'research_points': 10 },
                productionTime: 300000
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 10
    }
};

export const customerConfig = {
    orderLifetime: 240000, // ms
    trustLevels: [
        { level: 1, trust: 0, size: [5, 10], reward: 1.1 },
        { level: 2, trust: 100, size: [10, 20], reward: 1.15 },
        { level: 3, trust: 200, size: [20, 40], reward: 1.2 },
        { level: 4, trust: 300, size: [30, 50], reward: 1.25 },
        { level: 5, trust: 400, size: [40, 60], reward: 1.3 },
    ],
    customers: {
        'npc1': {
            name: 'Farmer Joe',
            bonus: { description: 'customer_bonus_yield', type: 'yieldBonus', value_l4: 1, value_l5: 2 }
        },
        'npc2': {
            name: 'Granny Smith',
            bonus: { description: 'customer_bonus_growth', type: 'growthMultiplier', value_l4: 0.95, value_l5: 0.9 }
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
