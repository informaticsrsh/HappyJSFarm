import { NUM_ROWS, NUM_COLS, cropTypes } from './config.js';

export let player = {
    money: 100,
    selectedSeed: null,
    upgrades: {
        growthMultiplier: 1.0, // e.g., 0.9 would be 10% faster
        yieldBonus: 0,
        seedDiscount: 0, // as a percentage, e.g., 0.1 for 10%
        marketBonus: 0 // as a flat addition
    }
};

export let field = Array(NUM_ROWS).fill(null).map(() => Array(NUM_COLS).fill({ crop: null, growthStage: 0, stageStartTime: 0 }));

export let warehouse = {
    'wheat_seed': 5,
    'carrot_seed': 3,
    'tomato_seed': 2,
    'potato_seed': 2,
    'wheat': 0,
    'carrot': 0,
    'tomato': 0,
    'potato': 0
};

export let marketState = {};
Object.keys(cropTypes).forEach(cropName => {
    marketState[cropName] = {
        currentPrice: cropTypes[cropName].maxPrice,
        totalSold: 0,
        lastRecoveryTime: Date.now()
    };
});
