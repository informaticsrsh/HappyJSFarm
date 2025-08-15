export let NUM_ROWS = 3;
export let NUM_COLS = 5;

export const leveling = [
    { level: 1, xpRequired: 100 },
    { level: 2, xpRequired: 150 },
    { level: 3, xpRequired: 220 },
    { level: 4, xpRequired: 300 },
    { level: 5, xpRequired: 450 },
];

export const store = [
    { name: 'wheat_seed', price: 10, type: 'seed', requiredLevel: 1 },
    { name: 'carrot_seed', price: 15, type: 'seed', requiredLevel: 2 },
    { name: 'tomato_seed', price: 20, type: 'seed', requiredLevel: 4 },
    { name: 'potato_seed', price: 25, type: 'seed', requiredLevel: 6 }
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
        requiredLevel: 2
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
        requiredLevel: 4
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
        requiredLevel: 6
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
    }
};

export const upgrades = {
    // --- General Upgrades ---
    'fertilizer1': { cost: 200, name: 'upgrade_fertilizer1_name', description: 'upgrade_fertilizer1_desc', effect: { type: 'growthMultiplier', value: 0.9 }, purchased: false, requiredLevel: 2 },
    'fertilizer2': { cost: 500, name: 'upgrade_fertilizer2_name', description: 'upgrade_fertilizer2_desc', effect: { type: 'growthMultiplier', value: 0.75 }, purchased: false, requiredLevel: 5 },
    'compost1': { cost: 300, name: 'upgrade_compost1_name', description: 'upgrade_compost1_desc', effect: { type: 'yieldBonus', value: 1 }, purchased: false, requiredLevel: 3 },
    'negotiation1': { cost: 400, name: 'upgrade_negotiation1_name', description: 'upgrade_negotiation1_desc', effect: { type: 'seedDiscount', value: 0.1 }, purchased: false, requiredLevel: 4 },
    'charm1': { cost: 600, name: 'upgrade_charm1_name', description: 'upgrade_charm1_desc', effect: { type: 'marketBonus', value: 2 }, purchased: false, requiredLevel: 6 },

    // --- Automation Upgrades ---
    'building_automation': { cost: 5000, name: 'upgrade_building_automation_name', description: 'upgrade_building_automation_desc', effect: { type: 'buildingAutomation', value: true }, purchased: false, requiredLevel: 10 },

    // --- Field Automation Upgrades ---
    'auto_wheat': { cost: 2500, name: 'upgrade_auto_wheat_name', description: 'upgrade_auto_wheat_desc', effect: { type: 'autoPlot', crop: 'wheat' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 8 },
    'auto_carrot': { cost: 3000, name: 'upgrade_auto_carrot_name', description: 'upgrade_auto_carrot_desc', effect: { type: 'autoPlot', crop: 'carrot' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 8 },
    'auto_tomato': { cost: 3500, name: 'upgrade_auto_tomato_name', description: 'upgrade_auto_tomato_desc', effect: { type: 'autoPlot', crop: 'tomato' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 9 },
    'auto_potato': { cost: 4000, name: 'upgrade_auto_potato_name', description: 'upgrade_auto_potato_desc', effect: { type: 'autoPlot', crop: 'potato' }, repeatable: true, maxPurchases: 2, purchasedCount: 0, requiredLevel: 9 },
};

export const buildings = {
    'bakery': {
        name: 'Bakery',
        icon: '🏠',
        cost: 1000,
        description: 'Bakes bread from grain.',
        input: { 'wheat': 2 },
        output: { 'bread': 1 },
        productionTime: 20000, // 20 seconds
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 1
    },
    'dairy': {
        name: 'Dairy',
        icon: '🐮',
        cost: 1200,
        description: 'Produces milk from wheat.',
        input: { 'wheat': 3 },
        output: { 'milk': 1 },
        productionTime: 30000, // 30 seconds
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 3
    },
    'pig_pen': {
        name: 'Pig Pen',
        icon: '🐷',
        cost: 1500,
        description: 'Produces bacon from potatoes.',
        input: { 'potato': 5 },
        output: { 'bacon': 1 },
        productionTime: 45000, // 45 seconds
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 5
    },
    'sandwich_shop': {
        name: 'Sandwich Shop',
        icon: '🏪',
        cost: 5000,
        description: 'Makes delicious sandwiches.',
        input: { 'bread': 2, 'bacon': 1 },
        output: { 'sandwich': 1 },
        productionTime: 60000, // 1 minute
        purchased: false,
        productionStartTime: 0,
        requiredLevel: 7
    },
    'breakfast_bar': {
        name: 'Breakfast Bar',
        icon: '🥣',
        cost: 6000,
        description: 'Makes healthy cereal.',
        input: { 'milk': 1, 'wheat': 2 },
        output: { 'cereal': 1 },
        productionTime: 75000, // 1.25 minutes
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
