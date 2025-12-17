/**
 * Game Constants
 * All magic numbers and configuration values
 */

// Save System
export const SAVE_INTERVAL_MS = 5000;
export const SAVE_KEY = 'happyJsFarmState';
export const MAX_SAVE_RETRIES = 3;

// Orders
export const ORDER_LIFETIME_MS = 480000; // 8 minutes
export const ORDER_GENERATION_BASE_CHANCE = 0.05; // 5% per second

// Production
export const PRODUCTION_TICK_INTERVAL_MS = 1000;
export const RENDER_TICK_INTERVAL_MS = 1000;

// Field - REMOVED (використовуємо з config.js)
// export const NUM_ROWS = 3;
// export const NUM_COLS = 5;
export const MAX_EXTRA_FIELD_SLOTS = 10;

// Research
export const RESEARCH_BASE_COST = 1000;
export const RESEARCH_COST_INCREMENT = 100;
export const RESEARCH_COST_INTERVAL = 10;

// Boosts
export const BOOST_GROWTH_SPEED_MULTIPLIER = 0.5;
export const BOOST_DOUBLE_HARVEST_CHARGES = 5;
export const BOOST_LUCKY_DAY_DURATION_MS = 1800000; // 30 minutes
export const BOOST_GROWTH_1H_DURATION_MS = 3600000; // 1 hour

// UI
export const NOTIFICATION_DURATION_MS = 3000;
export const FLOATING_TEXT_DURATION_MS = 1000;
export const TOOLTIP_POSITION_OFFSET = 5;

// Validation
export const MIN_PURCHASE_AMOUNT = 0;
export const MAX_PURCHASE_AMOUNT = 999999;
export const MIN_MONEY = 0;
export const MAX_MONEY = Number.MAX_SAFE_INTEGER;

// Performance
export const DOM_CACHE_MAX_SIZE = 1000;
export const ACTIVE_CROP_TRACKING = true;
