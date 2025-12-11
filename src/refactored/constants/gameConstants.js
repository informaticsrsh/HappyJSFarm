/**
 * Game Constants
 * All magic numbers and configuration values centralized here
 */

export const GAME_CONFIG = {
    // Field configuration
    INITIAL_ROWS: 3,
    INITIAL_COLS: 5,
    MAX_LEVEL: 15,
    
    // Time intervals (milliseconds)
    SAVE_INTERVAL: 5000,
    TICK_INTERVAL: 100,
    ORDER_UPDATE_INTERVAL: 100,
    
    // Player starting values
    STARTING_MONEY: 100,
    STARTING_LEVEL: 1,
    STARTING_XP: 0,
    INITIAL_XP_TO_NEXT_LEVEL: 100,
    
    // Order configuration
    ORDER_LIFETIME: 480000, // 8 minutes
    MAX_ACTIVE_ORDERS: 3,
    ORDER_GENERATION_CHANCE: 0.05, // 5% per second when < 3 orders
    
    // Field expansion
    FIELD_EXPANSION_FREQUENCY: 2, // Every 2 levels
    FIELD_EXPANSION_MAX_LEVEL: 10,
};

export const STARTING_SEEDS = {
    wheat_seed: 5,
    carrot_seed: 3,
    tomato_seed: 2,
    potato_seed: 2,
};

export const CURRENCY_TYPES = {
    MONEY: 'money',
    RESEARCH_POINTS: 'research_points',
};

export const UPGRADE_TYPES = {
    GROWTH_MULTIPLIER: 'growthMultiplier',
    YIELD_BONUS: 'yieldBonus',
    SEED_DISCOUNT: 'seedDiscount',
    MARKET_BONUS: 'marketBonus',
    BUILDING_AUTOMATION: 'buildingAutomation',
    PRODUCTION_SPEED: 'productionSpeed',
    PRODUCTION_EFFICIENCY: 'productionEfficiency',
    PRODUCTION_VOLUME: 'productionVolume',
    PRODUCTION_LUCK: 'productionLuck',
    AUTO_PLOT: 'autoPlot',
    PRICE_BONUS: 'priceBonus',
};

export const NOTIFICATION_DURATION = 3000;
