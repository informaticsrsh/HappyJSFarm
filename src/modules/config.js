export let NUM_ROWS = 3;
export let NUM_COLS = 5;

export const leveling = [
    { level: 1, xpRequired: 100 },
    { level: 2, xpRequired: 150 },
    { level: 3, xpRequired: 220 },
    { level: 4, xpRequired: 300 },
    { level: 5, xpRequired: 450 },
    { level: 6, xpRequired: 600 },
    { level: 7, xpRequired: 800 },
    { level: 8, xpRequired: 1000 },
    { level: 9, xpRequired: 1250 },
    { level: 10, xpRequired: 1500 },
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
        growthTime: 3000, // ms per stage
        visuals: ['🌱', '🌿', '🌾'],
        yieldRange: [1, 3],
        maxPrice: 15,
        minPrice: 5,
        priceRecoveryRate: 10000, // ms to recover 1 price point
        salesVolumeForPriceDrop: 10, // amount of sales to drop price by 1
        xpValue: 2,
        requiredLevel: 1
    },
    'carrot': {
        icon: '🥕',
        seed_icon: '🌱',
        growthTime: 4000,
        visuals: ['🌱', '🌿', '🥕'],
        yieldRange: [1, 2],
        maxPrice: 25,
        minPrice: 10,
        priceRecoveryRate: 12000,
        salesVolumeForPriceDrop: 8,
        xpValue: 3,
        requiredLevel: 1
    },
    'tomato': {
        icon: '🍅',
        seed_icon: '🌱',
        growthTime: 5000,
        visuals: ['🌱', '🌿', '🍅'],
        yieldRange: [2, 4],
        maxPrice: 50,
        minPrice: 20,
        priceRecoveryRate: 15000,
        salesVolumeForPriceDrop: 5,
        xpValue: 5,
        requiredLevel: 1
    },
    'potato': {
        icon: '🥔',
        seed_icon: '🌱',
        growthTime: 6000,
        visuals: ['🌱', '🌿', '🥔'],
        yieldRange: [3, 6],
        maxPrice: 80,
        minPrice: 30,
        priceRecoveryRate: 20000,
        salesVolumeForPriceDrop: 3,
        xpValue: 8,
        requiredLevel: 1
    },
    'bread': {
        icon: '🍞',
        maxPrice: 50,
        minPrice: 20,
        priceRecoveryRate: 10000,
        salesVolumeForPriceDrop: 5,
        xpValue: 10,
        requiredLevel: 1
    },
    'milk': {
        icon: '🥛',
        maxPrice: 60,
        minPrice: 25,
        priceRecoveryRate: 12000,
        salesVolumeForPriceDrop: 4,
        xpValue: 12,
        requiredLevel: 3
    },
    'bacon': {
        icon: '🥓',
        maxPrice: 80,
        minPrice: 35,
        priceRecoveryRate: 15000,
        salesVolumeForPriceDrop: 3,
        xpValue: 15,
        requiredLevel: 5
    },
    'sandwich': {
        icon: '🥪',
        maxPrice: 200,
        minPrice: 100,
        priceRecoveryRate: 20000,
        salesVolumeForPriceDrop: 2,
        xpValue: 30,
        requiredLevel: 7
    },
    'cereal': {
        icon: '🥣',
        maxPrice: 250,
        minPrice: 120,
        priceRecoveryRate: 25000,
        salesVolumeForPriceDrop: 1,
        xpValue: 40,
        requiredLevel: 8
    },
    'tomato_juice': {
        icon: '🥤',
        maxPrice: 100,
        minPrice: 40,
        priceRecoveryRate: 15000,
        salesVolumeForPriceDrop: 4,
        xpValue: 20,
        requiredLevel: 4
    },
    'carrot_juice': {
        icon: '🧃',
        maxPrice: 80,
        minPrice: 30,
        priceRecoveryRate: 12000,
        salesVolumeForPriceDrop: 5,
        xpValue: 15,
        requiredLevel: 4
    },
    'strawberry': {
        icon: '🍓',
        seed_icon: '🌱',
        growthTime: 7000,
        visuals: ['🌱', '🌿', '🍓'],
        yieldRange: [2, 5],
        maxPrice: 120,
        minPrice: 50,
        priceRecoveryRate: 18000,
        salesVolumeForPriceDrop: 3,
        xpValue: 18,
        requiredLevel: 5
    },
    'blueberry': {
        icon: '🔵',
        seed_icon: '🌱',
        growthTime: 8000,
        visuals: ['🌱', '🌿', '🔵'],
        yieldRange: [3, 6],
        maxPrice: 150,
        minPrice: 60,
        priceRecoveryRate: 22000,
        salesVolumeForPriceDrop: 2,
        xpValue: 22,
        requiredLevel: 7
    },
    'strawberry_jam': {
        icon: '🍓🍯',
        maxPrice: 300,
        minPrice: 150,
        priceRecoveryRate: 25000,
        salesVolumeForPriceDrop: 2,
        xpValue: 50,
        requiredLevel: 8
    },
    'blueberry_jam': {
        icon: '🔵🍯',
        maxPrice: 350,
        minPrice: 180,
        priceRecoveryRate: 30000,
        salesVolumeForPriceDrop: 1,
        xpValue: 60,
        requiredLevel: 8
    }
};

export const upgrades = {
    // --- General Upgrades ---
    'fertilizer1': { cost: 200, name: 'upgrade_fertilizer1_name', description: 'upgrade_fertilizer1_desc', effect: { type: 'growthMultiplier', value: 0.9 }, purchased: false, requiredLevel: 1 },
    'fertilizer2': { cost: 500, name: 'upgrade_fertilizer2_name', description: 'upgrade_fertilizer2_desc', effect: { type: 'growthMultiplier', value: 0.75 }, purchased: false, requiredLevel: 5 },
    'compost1': { cost: 300, name: 'upgrade_compost1_name', description: 'upgrade_compost1_desc', effect: { type: 'yieldBonus', value: 1 }, purchased: false, requiredLevel: 1 },
    'compost2': { cost: 600, name: 'upgrade_compost2_name', description: 'upgrade_compost2_desc', effect: { type: 'yieldBonus', value: 1 }, purchased: false, requiredLevel: 6 },
    'negotiation1': { cost: 400, name: 'upgrade_negotiation1_name', description: 'upgrade_negotiation1_desc', effect: { type: 'seedDiscount', value: 0.1 }, purchased: false, requiredLevel: 4 },
    'negotiation2': { cost: 800, name: 'upgrade_negotiation2_name', description: 'upgrade_negotiation2_desc', effect: { type: 'seedDiscount', value: 0.1 }, purchased: false, requiredLevel: 7 },
    'charm1': { cost: 600, name: 'upgrade_charm1_name', description: 'upgrade_charm1_desc', effect: { type: 'marketBonus', value: 2 }, purchased: false, requiredLevel: 6 },
    'charm2': { cost: 1200, name: 'upgrade_charm2_name', description: 'upgrade_charm2_desc', effect: { type: 'marketBonus', value: 3 }, purchased: false, requiredLevel: 9 },

    // --- Automation Upgrades ---
    'building_automation': { cost: 5000, name: 'upgrade_building_automation_name', description: 'upgrade_building_automation_desc', effect: { type: 'buildingAutomation', value: true }, purchased: false, requiredLevel: 5 },

    // --- Field Automation Upgrades ---
    'auto_wheat': { cost: 2500, name: 'upgrade_auto_wheat_name', description: 'upgrade_auto_wheat_desc', effect: { type: 'autoPlot', crop: 'wheat' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 3 },
    'auto_carrot': { cost: 3000, name: 'upgrade_auto_carrot_name', description: 'upgrade_auto_carrot_desc', effect: { type: 'autoPlot', crop: 'carrot' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 4 },
    'auto_tomato': { cost: 3500, name: 'upgrade_auto_tomato_name', description: 'upgrade_auto_tomato_desc', effect: { type: 'autoPlot', crop: 'tomato' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 6 },
    'auto_potato': { cost: 4000, name: 'upgrade_auto_potato_name', description: 'upgrade_auto_potato_desc', effect: { type: 'autoPlot', crop: 'potato' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 7 },
    'auto_strawberry': { cost: 4500, name: 'upgrade_auto_strawberry_name', description: 'upgrade_auto_strawberry_desc', effect: { type: 'autoPlot', crop: 'strawberry' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 8 },
    'auto_blueberry': { cost: 5000, name: 'upgrade_auto_blueberry_name', description: 'upgrade_auto_blueberry_desc', effect: { type: 'autoPlot', crop: 'blueberry' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 9 },
};

export const buildings = {
    'bakery': {
        name: 'Bakery',
        icon: '🏠',
        cost: 1000,
        description: 'Bakes bread from grain.',
        recipes: [
            {
                input: { 'wheat': 2 },
                output: { 'bread': 1 },
                productionTime: 20000 // 20 seconds
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 1
    },
    'dairy': {
        name: 'Dairy',
        icon: '🐮',
        cost: 1200,
        description: 'Produces milk from wheat.',
        recipes: [
            {
                input: { 'wheat': 3 },
                output: { 'milk': 1 },
                productionTime: 30000 // 30 seconds
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 3
    },
    'pig_pen': {
        name: 'Pig Pen',
        icon: '🐷',
        cost: 1500,
        description: 'Produces bacon from potatoes.',
        recipes: [
            {
                input: { 'potato': 5 },
                output: { 'bacon': 1 },
                productionTime: 45000 // 45 seconds
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 5
    },
    'sandwich_shop': {
        name: 'Sandwich Shop',
        icon: '🏪',
        cost: 5000,
        description: 'Makes delicious sandwiches.',
        recipes: [
            {
                input: { 'bread': 2, 'bacon': 1 },
                output: { 'sandwich': 1 },
                productionTime: 60000 // 1 minute
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 7
    },
    'breakfast_bar': {
        name: 'Breakfast Bar',
        icon: '🥣',
        cost: 6000,
        description: 'Makes healthy cereal.',
        recipes: [
            {
                input: { 'milk': 1, 'wheat': 2 },
                output: { 'cereal': 1 },
                productionTime: 75000 // 1.25 minutes
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 8
    },
    'juicer': {
        name: 'Juicer',
        icon: '🍹',
        cost: 2000,
        description: 'Extracts juice from fruits and vegetables.',
        recipes: [
            {
                input: { 'tomato': 3 },
                output: { 'tomato_juice': 1 },
                productionTime: 25000 // 25 seconds
            },
            {
                input: { 'carrot': 4 },
                output: { 'carrot_juice': 1 },
                productionTime: 20000 // 20 seconds
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 4
    },
    'jam_factory': {
        name: 'Jam Factory',
        icon: '🏭',
        cost: 5000,
        description: 'Makes delicious jams from berries.',
        recipes: [
            {
                input: { 'strawberry': 5 },
                output: { 'strawberry_jam': 1 },
                productionTime: 40000 // 40 seconds
            },
            {
                input: { 'blueberry': 5 },
                output: { 'blueberry_jam': 1 },
                productionTime: 50000 // 50 seconds
            }
        ],
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 8
    }
};

export const customerConfig = {
    orderLifetime: 120000, // ms
    trustLevels: [
        { level: 1, trust: 0, size: [5, 10], reward: 1.2 },
        { level: 2, trust: 100, size: [10, 20], reward: 1.3 },
        { level: 3, trust: 200, size: [20, 40], reward: 1.5 },
        { level: 4, trust: 300, size: [30, 50], reward: 1.7 },
        { level: 5, trust: 400, size: [40, 60], reward: 2.0 },
    ],
    customers: {
        'npc1': {
            name: 'Farmer Joe',
            bonus: { description: "Increases all crop yields.", type: 'yieldBonus', value_l4: 1, value_l5: 2 }
        },
        'npc2': {
            name: 'Granny Smith',
            bonus: { description: "All crops grow faster.", type: 'growthMultiplier', value_l4: 0.95, value_l5: 0.9 }
        },
        'npc3': {
            name: 'Chef Pierre',
            bonus: { description: "Increases all market sale prices.", type: 'marketBonus', value_l4: 2, value_l5: 5 }
        },
        'npc4': {
            name: 'Rancher Rick',
            bonus: { description: "Get a discount on all seeds.", type: 'seedDiscount', value_l4: 0.05, value_l5: 0.1 }
        },
        'npc5': {
            name: 'Baker Betty',
            bonus: { description: "Increases sale price of wheat.", type: 'priceBonus', crop: 'wheat', value_l4: 5, value_l5: 10 }
        }
    }
};
