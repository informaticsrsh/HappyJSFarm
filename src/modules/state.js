import { NUM_ROWS, NUM_COLS, cropTypes, upgrades, buildings } from './config.js';

const initialBuildings = {};
for (const buildingId in buildings) {
    initialBuildings[buildingId] = { purchased: false, production: [], automated: false, selectedRecipe: 0 };
}

export let player = {
    money: 100,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    selectedSeed: null,
    upgrades: {
        growthMultiplier: 1.0,
        yieldBonus: 0,
        seedDiscount: 0,
        marketBonus: 0,
        buildingAutomation: false,
        productionSpeed: 0,
        productionEfficiency: 0,
        productionVolume: 0,
        productionLuck: 0,
    },
    buildings: initialBuildings,
    npcBonuses: {
        growthMultiplier: 1.0,
        yieldBonus: 0,
        seedDiscount: 0,
        marketBonus: 0,
        priceBonus: {} // e.g., { 'wheat': 5 }
    }
};

export let field = Array(NUM_ROWS).fill(null).map(() => Array(NUM_COLS).fill(null).map(() => ({ crop: null, growthStage: 0, stageStartTime: 0, autoCrop: null })));

export let warehouse = {
    'wheat_seed': 5,
    'carrot_seed': 3,
    'tomato_seed': 2,
    'potato_seed': 2,
    'strawberry_seed': 0,
    'blueberry_seed': 0,
    'wheat': 0,
    'carrot': 0,
    'tomato': 0,
    'potato': 0,
    'bread': 0,
    'milk': 0,
    'bacon': 0,
    'sandwich': 0,
    'cereal': 0,
    'tomato_juice': 0,
    'carrot_juice': 0,
    'strawberry': 0,
    'blueberry': 0,
    'strawberry_jam': 0,
    'blueberry_jam': 0,
    'research_points': 0,
    'corn_seed': 0,
    'bell_pepper_seed': 0,
    'corn': 0,
    'bell_pepper': 0,
    'taco': 0,
    'salad': 0,
    'cheese': 0,
    'pizza': 0,
    'fruit_tart': 0
};

export let marketState = {};
Object.keys(cropTypes).forEach(cropName => {
    if (cropTypes[cropName].maxPrice) {
        marketState[cropName] = {
            currentPrice: cropTypes[cropName].maxPrice,
            totalSold: 0,
            lastRecoveryTime: Date.now()
        };
    }
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

const SAVE_KEY = 'happyJsFarmState';

export function saveGameState() {
    const gameState = {
        player,
        field,
        warehouse,
        marketState,
        customers,
        upgrades
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

export function loadGameState() {
    const savedState = localStorage.getItem(SAVE_KEY);
    if (savedState) {
        const restoredState = JSON.parse(savedState);

        // Restore the state
        Object.assign(player, restoredState.player);

        // Correctly restore array to avoid leaving old data
        field.length = 0;
        restoredState.field.forEach(row => field.push(row));

        Object.assign(warehouse, restoredState.warehouse);
        Object.assign(marketState, restoredState.marketState);
        Object.assign(customers, restoredState.customers);
        if (restoredState.upgrades) {
            Object.assign(upgrades, restoredState.upgrades);
        }
    }
}

export function clearGameState(gameLoopInterval, orderTimerInterval) {
    clearInterval(gameLoopInterval);
    clearInterval(orderTimerInterval);
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
}

export function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    return JSON.parse(JSON.stringify(obj));
}
