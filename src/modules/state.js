import { NUM_ROWS, NUM_COLS, cropTypes } from './config.js';

export let player = {
    money: 100,
    selectedSeed: null,
    upgrades: {
        growthMultiplier: 1.0,
        yieldBonus: 0,
        seedDiscount: 0,
        marketBonus: 0
    },
    buildings: {
        'bakery': { purchased: false, productionStartTime: 0, automated: false },
        'dairy': { purchased: false, productionStartTime: 0, automated: false },
        'pig_pen': { purchased: false, productionStartTime: 0, automated: false },
        'sandwich_shop': { purchased: false, productionStartTime: 0, automated: false },
        'breakfast_bar': { purchased: false, productionStartTime: 0, automated: false }
    },
    npcBonuses: {
        growthMultiplier: 1.0,
        yieldBonus: 0,
        seedDiscount: 0,
        marketBonus: 0,
        priceBonus: {} // e.g., { 'wheat': 5 }
    }
};

export let field = Array(NUM_ROWS).fill(null).map(() => Array(NUM_COLS).fill(null).map(() => ({ crop: null, growthStage: 0, stageStartTime: 0, automated: false })));

export let warehouse = {
    'wheat_seed': 5,
    'carrot_seed': 3,
    'tomato_seed': 2,
    'potato_seed': 2,
    'wheat': 0,
    'carrot': 0,
    'tomato': 0,
    'potato': 0,
    'bread': 0,
    'milk': 0,
    'bacon': 0,
    'sandwich': 0,
    'cereal': 0
};

export let marketState = {};
Object.keys(cropTypes).forEach(cropName => {
    marketState[cropName] = {
        currentPrice: cropTypes[cropName].maxPrice,
        totalSold: 0,
        lastRecoveryTime: Date.now()
    };
});

export let customers = {
    'npc1': {
        trust: 0,
        order: null // { crop, amount, reward, expiresAt }
    },
    'npc2': {
        trust: 0,
        order: null
    },
    'npc3': {
        trust: 0,
        order: null
    },
    'npc4': {
        trust: 0,
        order: null
    },
    'npc5': {
        trust: 0,
        order: null
    }
};
