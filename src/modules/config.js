export const NUM_ROWS = 5;
export const NUM_COLS = 5;

export const store = [
    { name: 'wheat_seed', price: 10, type: 'seed' },
    { name: 'carrot_seed', price: 15, type: 'seed' },
    { name: 'tomato_seed', price: 20, type: 'seed' },
    { name: 'potato_seed', price: 25, type: 'seed' }
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
        salesVolumeForPriceDrop: 10 // amount of sales to drop price by 1
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
        salesVolumeForPriceDrop: 8
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
        salesVolumeForPriceDrop: 5
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
        salesVolumeForPriceDrop: 3
    }
};

export const upgrades = {
    'fertilizer1': { cost: 200, name: 'Better Fertilizer', description: 'Crops grow 10% faster.', effect: { type: 'growthMultiplier', value: 0.9 }, purchased: false },
    'fertilizer2': { cost: 500, name: 'Super Fertilizer', description: 'Crops grow 25% faster in total.', effect: { type: 'growthMultiplier', value: 0.75 }, purchased: false },
    'compost1': { cost: 300, name: 'Compost Bin', description: 'Increases all crop yields by 1.', effect: { type: 'yieldBonus', value: 1 }, purchased: false },
    'negotiation1': { cost: 400, name: 'Negotiation Skills', description: 'Get a 10% discount on all seeds.', effect: { type: 'seedDiscount', value: 0.1 }, purchased: false },
    'charm1': { cost: 600, name: 'Friendly Charm', description: 'Increase all market sale prices by $2.', effect: { type: 'marketBonus', value: 2 }, purchased: false },
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
