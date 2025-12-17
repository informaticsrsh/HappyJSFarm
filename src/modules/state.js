import { NUM_ROWS, NUM_COLS } from './config.js';
import { cropTypes, upgrades, buildings } from './config.js';

/**
 * Player Stats - Separated concerns
 */
class PlayerStats {
    constructor() {
        this.money = 100;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.trustTokens = 0;
        this.scienceProductionCount = 0;
    }

    canAfford(amount) {
        return this.money >= amount && amount >= 0;
    }

    addMoney(amount) {
        const newAmount = this.money + amount;
        if (newAmount < 0 || !Number.isFinite(newAmount)) {
            console.error('Invalid money amount:', amount);
            return false;
        }
        this.money = newAmount;
        return true;
    }

    subtractMoney(amount) {
        if (!this.canAfford(amount)) return false;
        this.money -= amount;
        return true;
    }
}

/**
 * Player Upgrades
 */
class PlayerUpgrades {
    constructor() {
        this.growthMultiplier = 1.0;
        this.yieldBonus = 0;
        this.seedDiscount = 0;
        this.marketBonus = 0;
        this.buildingAutomation = false;
        this.productionSpeed = 0;
        this.productionEfficiency = 0;
        this.productionVolume = 0;
        this.productionLuck = 0;
    }
}

/**
 * NPC Bonuses
 */
class NpcBonuses {
    constructor() {
        this.growthMultiplier = 1.0;
        this.yieldBonus = 0;
        this.seedDiscount = 0;
        this.marketBonus = 0;
        this.priceBonus = {};
    }

    reset() {
        this.growthMultiplier = 1.0;
        this.yieldBonus = 0;
        this.seedDiscount = 0;
        this.marketBonus = 0;
        this.priceBonus = {};
    }
}

/**
 * Active Effects
 */
class ActiveEffects {
    constructor() {
        this.doubleHarvestCharges = 0;
    }
}

/**
 * Initialize buildings state
 */
function initializeBuildings() {
    const initialBuildings = {};
    for (const buildingId in buildings) {
        initialBuildings[buildingId] = {
            purchased: false,
            production: [],
            automated: false,
            selectedRecipe: 0
        };
    }
    return initialBuildings;
}

/**
 * Main Player State
 */
export let player = {
    stats: new PlayerStats(),
    upgrades: new PlayerUpgrades(),
    npcBonuses: new NpcBonuses(),
    activeEffects: new ActiveEffects(),
    buildings: initializeBuildings(),
    selectedSeed: null,
    tokenShopPurchases: {},
    
    // Legacy accessors for backward compatibility
    get money() { return this.stats.money; },
    set money(val) { this.stats.money = val; },
    get level() { return this.stats.level; },
    set level(val) { this.stats.level = val; },
    get xp() { return this.stats.xp; },
    set xp(val) { this.stats.xp = val; },
    get xpToNextLevel() { return this.stats.xpToNextLevel; },
    set xpToNextLevel(val) { this.stats.xpToNextLevel = val; },
    get trustTokens() { return this.stats.trustTokens; },
    set trustTokens(val) { this.stats.trustTokens = val; },
    get scienceProductionCount() { return this.stats.scienceProductionCount; },
    set scienceProductionCount(val) { this.stats.scienceProductionCount = val; }
};

/**
 * Initialize field with proper null checks
 */
function createEmptyCell() {
    return {
        crop: null,
        growthStage: 0,
        stageStartTime: 0,
        autoCrop: null,
        isSpecial: false,
        specialSeedId: null
    };
}

export let field = Array(NUM_ROWS)
    .fill(null)
    .map(() => Array(NUM_COLS).fill(null).map(createEmptyCell));

/**
 * Safe field access
 */
export function getCell(r, c) {
    if (!field[r] || !field[r][c]) {
        console.error(`Invalid cell access: [${r}][${c}]`);
        return null;
    }
    return field[r][c];
}

export function setCellCrop(r, c, cropName) {
    const cell = getCell(r, c);
    if (!cell) return false;
    cell.crop = cropName;
    cell.growthStage = 0;
    cell.stageStartTime = Date.now();
    return true;
}

export function clearCell(r, c) {
    const cell = getCell(r, c);
    if (!cell) return false;
    cell.crop = null;
    cell.growthStage = 0;
    cell.stageStartTime = 0;
    cell.isSpecial = false;
    cell.specialSeedId = null;
    return true;
}

/**
 * Warehouse with validation
 */
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

export function addToWarehouse(itemName, amount) {
    if (!itemName || amount < 0 || !Number.isFinite(amount)) {
        console.error('Invalid warehouse addition:', itemName, amount);
        return false;
    }
    warehouse[itemName] = (warehouse[itemName] || 0) + amount;
    return true;
}

export function removeFromWarehouse(itemName, amount) {
    if (!itemName || amount < 0 || !Number.isFinite(amount)) {
        console.error('Invalid warehouse removal:', itemName, amount);
        return false;
    }
    const current = warehouse[itemName] || 0;
    if (current < amount) return false;
    warehouse[itemName] = current - amount;
    return true;
}

export function hasInWarehouse(itemName, amount) {
    return (warehouse[itemName] || 0) >= amount;
}

/**
 * Market State
 */
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

/**
 * Customers
 */
export let customers = {
    'npc1': { trust: 0, order: null },
    'npc2': { trust: 0, order: null },
    'npc3': { trust: 0, order: null },
    'npc4': { trust: 0, order: null },
    'npc5': { trust: 0, order: null }
};

/**
 * Active Boosts tracking
 */
export let activeBoosts = [];

/**
 * Active crops tracking for optimization
 */
export let activeCrops = new Set();

export function addActiveCrop(r, c) {
    activeCrops.add(`${r},${c}`);
}

export function removeActiveCrop(r, c) {
    activeCrops.delete(`${r},${c}`);
}

export function hasActiveCrop(r, c) {
    return activeCrops.has(`${r},${c}`);
}

/**
 * Save/Load with error handling
 */
const SAVE_KEY = 'happyJsFarmState';
const MAX_RETRIES = 3;

export function saveGameState() {
    const gameState = {
        player: {
            stats: player.stats,
            upgrades: player.upgrades,
            npcBonuses: player.npcBonuses,
            activeEffects: player.activeEffects,
            buildings: player.buildings,
            selectedSeed: player.selectedSeed,
            tokenShopPurchases: player.tokenShopPurchases
        },
        field,
        warehouse,
        marketState,
        customers,
        upgrades,
        activeBoosts,
        activeCrops: Array.from(activeCrops),
        version: '1.0.0',
        timestamp: Date.now()
    };

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const serialized = JSON.stringify(gameState);
            localStorage.setItem(SAVE_KEY, serialized);
            return true;
        } catch (error) {
            console.error(`Save attempt ${attempt + 1} failed:`, error);
            
            if (error.name === 'QuotaExceededError') {
                // Try to clean up old data
                try {
                    const keys = Object.keys(localStorage);
                    keys.forEach(key => {
                        if (key !== SAVE_KEY && key.startsWith('happyJsFarm')) {
                            localStorage.removeItem(key);
                        }
                    });
                } catch (cleanupError) {
                    console.error('Cleanup failed:', cleanupError);
                }
            }
            
            if (attempt === MAX_RETRIES - 1) {
                alert('Failed to save game! Storage may be full.');
                return false;
            }
        }
    }
    return false;
}

export function loadGameState() {
    try {
        const savedState = localStorage.getItem(SAVE_KEY);
        if (!savedState) return false;

        const restoredState = JSON.parse(savedState);

        // Restore player state with validation
        if (restoredState.player) {
            const p = restoredState.player;
            
            // Restore stats
            if (p.stats) {
                Object.assign(player.stats, p.stats);
            }
            
            // Restore upgrades
            if (p.upgrades) {
                Object.assign(player.upgrades, p.upgrades);
            }
            
            // Restore NPC bonuses
            if (p.npcBonuses) {
                Object.assign(player.npcBonuses, p.npcBonuses);
            }
            
            // Restore active effects
            if (p.activeEffects) {
                Object.assign(player.activeEffects, p.activeEffects);
            }
            
            // Restore buildings
            if (p.buildings) {
                Object.assign(player.buildings, p.buildings);
            }
            
            // Restore other properties
            player.selectedSeed = p.selectedSeed || null;
            player.tokenShopPurchases = p.tokenShopPurchases || {};
        }

        // Restore field
        if (restoredState.field) {
            field.length = 0;
            restoredState.field.forEach(row => {
                const validatedRow = row.map(cell => ({
                    crop: cell.crop || null,
                    growthStage: cell.growthStage || 0,
                    stageStartTime: cell.stageStartTime || 0,
                    autoCrop: cell.autoCrop || null,
                    isSpecial: cell.isSpecial || false,
                    specialSeedId: cell.specialSeedId || null
                }));
                field.push(validatedRow);
            });
        }

        // Restore warehouse
        if (restoredState.warehouse) {
            Object.assign(warehouse, restoredState.warehouse);
        }

        // Restore market state
        if (restoredState.marketState) {
            Object.assign(marketState, restoredState.marketState);
        }

        // Restore customers
        if (restoredState.customers) {
            Object.assign(customers, restoredState.customers);
        }

        // Restore upgrades
        if (restoredState.upgrades) {
            Object.assign(upgrades, restoredState.upgrades);
        }

        // Restore active boosts
        if (restoredState.activeBoosts) {
            activeBoosts.length = 0;
            restoredState.activeBoosts.forEach(boost => activeBoosts.push(boost));
        }

        // Restore active crops tracking
        if (restoredState.activeCrops) {
            activeCrops.clear();
            restoredState.activeCrops.forEach(coord => activeCrops.add(coord));
        } else {
            // Rebuild active crops if not saved
            rebuildActiveCrops();
        }

        return true;
    } catch (error) {
        console.error('Failed to load game state:', error);
        alert('Failed to load saved game! Starting fresh.');
        return false;
    }
}

function rebuildActiveCrops() {
    activeCrops.clear();
    for (let r = 0; r < field.length; r++) {
        for (let c = 0; c < field[r].length; c++) {
            const cell = field[r][c];
            if (cell && cell.crop) {
                activeCrops.add(`${r},${c}`);
            }
        }
    }
}

export function clearGameState(gameLoopInterval, orderTimerInterval) {
    try {
        clearInterval(gameLoopInterval);
        clearInterval(orderTimerInterval);
        localStorage.removeItem(SAVE_KEY);
        window.location.reload();
    } catch (error) {
        console.error('Failed to clear game state:', error);
        alert('Failed to clear data. Please refresh the page manually.');
    }
}

export function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (error) {
        console.error('Deep copy failed:', error);
        return obj;
    }
}
