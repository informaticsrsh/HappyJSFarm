/**
 * Game Logic Module - Refactored
 * All game logic with proper error handling, validation, and optimization
 */

import { t } from './localization.js';
import {
    player,
    field,
    warehouse,
    marketState,
    customers,
    saveGameState,
    activeBoosts,
    activeCrops,
    getCell,
    clearCell,
    addToWarehouse,
    removeFromWarehouse,
    hasInWarehouse,
    addActiveCrop,
    removeActiveCrop
} from './state.js';
import {
    SAVE_INTERVAL_MS,
    RESEARCH_BASE_COST,
    RESEARCH_COST_INCREMENT,
    RESEARCH_COST_INTERVAL,
    ORDER_GENERATION_BASE_CHANCE,
    NUM_COLS,
    MIN_PURCHASE_AMOUNT,
    MAX_PURCHASE_AMOUNT,
    MAX_EXTRA_FIELD_SLOTS
} from './constants.js';
import { cropTypes, upgrades, store, customerConfig, buildings, leveling } from './config.js';
import { showNotification, showLevelUpModal, showSimpleLevelUpModal, scheduleUpdate, showFloatingText } from './ui.js';
import { determineOrderType, calculateOrderReward, calculateOrderAmount } from './orderTypes.js';
import { SPECIAL_SEEDS, createSpecialCrop } from './specialSeeds.js';
import { getTokenShopItem } from './tokenShop.js';

let lastSaveTime = 0;

// CONTINUED IN PART 2...
