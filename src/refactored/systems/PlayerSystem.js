/**
 * Player System - Manages player state and progression
 */

import { eventBus, GAME_EVENTS } from '../core/EventBus.js';
import { GAME_CONFIG, UPGRADE_TYPES } from '../constants/gameConstants.js';
import { Validator } from '../utils/validation.js';
import { MathUtils } from '../utils/helpers.js';

export class PlayerSystem {
    constructor(leveling) {
        this.leveling = leveling;
        this.state = this.createInitialState();
    }

    createInitialState() {
        return {
            money: GAME_CONFIG.STARTING_MONEY,
            level: GAME_CONFIG.STARTING_LEVEL,
            xp: GAME_CONFIG.STARTING_XP,
            xpToNextLevel: GAME_CONFIG.INITIAL_XP_TO_NEXT_LEVEL,
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
            npcBonuses: {
                growthMultiplier: 1.0,
                yieldBonus: 0,
                seedDiscount: 0,
                marketBonus: 0,
                priceBonus: {},
            },
            scienceProductionCount: 0,
        };
    }

    /**
     * Add money to player
     */
    addMoney(amount) {
        Validator.isPositiveNumber(amount, 'money amount');
        this.state.money += amount;
        eventBus.emit(GAME_EVENTS.MONEY_CHANGED, { amount: this.state.money });
    }

    /**
     * Deduct money from player
     */
    deductMoney(amount) {
        Validator.isPositiveNumber(amount, 'money amount');
        Validator.hasSufficientAmount(this.state.money, amount, 'money');
        this.state.money -= amount;
        eventBus.emit(GAME_EVENTS.MONEY_CHANGED, { amount: this.state.money });
    }

    /**
     * Check if player has enough money
     */
    hasMoney(amount) {
        return this.state.money >= amount;
    }

    /**
     * Add experience points
     */
    addXP(amount) {
        Validator.isPositiveNumber(amount, 'XP amount');
        this.state.xp += amount;
        eventBus.emit(GAME_EVENTS.XP_GAINED, { 
            amount, 
            total: this.state.xp,
            toNext: this.state.xpToNextLevel 
        });
        this.checkLevelUp();
    }

    /**
     * Check and process level ups
     */
    checkLevelUp() {
        const levelsGained = [];

        while (this.state.xp >= this.state.xpToNextLevel) {
            this.state.level++;
            this.state.xp -= this.state.xpToNextLevel;

            const nextLevelConfig = this.leveling.find(
                l => l.level === this.state.level
            );

            if (nextLevelConfig) {
                this.state.xpToNextLevel = nextLevelConfig.xpRequired;
            } else {
                this.state.xpToNextLevel = Infinity;
            }

            levelsGained.push(this.state.level);
        }

        if (levelsGained.length > 0) {
            levelsGained.forEach(level => {
                eventBus.emit(GAME_EVENTS.LEVEL_UP, { level });
            });
        }

        return levelsGained;
    }

    /**
     * Get current level
     */
    getLevel() {
        return this.state.level;
    }

    /**
     * Get XP progress (0-1)
     */
    getXPProgress() {
        if (this.state.xpToNextLevel === Infinity) return 1;
        return this.state.xp / this.state.xpToNextLevel;
    }

    /**
     * Apply upgrade effect
     */
    applyUpgrade(upgradeType, value, operation = 'add') {
        switch (upgradeType) {
            case UPGRADE_TYPES.GROWTH_MULTIPLIER:
                if (operation === 'set') {
                    this.state.upgrades.growthMultiplier = value;
                } else {
                    this.state.upgrades.growthMultiplier *= value;
                }
                break;

            case UPGRADE_TYPES.BUILDING_AUTOMATION:
                this.state.upgrades.buildingAutomation = value;
                break;

            default:
                if (operation === 'add') {
                    this.state.upgrades[upgradeType] = 
                        (this.state.upgrades[upgradeType] || 0) + value;
                } else {
                    this.state.upgrades[upgradeType] = value;
                }
        }

        eventBus.emit(GAME_EVENTS.UPGRADE_PURCHASED, { 
            upgradeType, 
            value 
        });
    }

    /**
     * Get upgrade value
     */
    getUpgrade(upgradeType) {
        return this.state.upgrades[upgradeType] || 0;
    }

    /**
     * Update NPC bonuses
     */
    updateNPCBonuses(bonuses) {
        this.state.npcBonuses = {
            growthMultiplier: 1.0,
            yieldBonus: 0,
            seedDiscount: 0,
            marketBonus: 0,
            priceBonus: {},
        };

        for (const bonus of bonuses) {
            this.applyNPCBonus(bonus);
        }
    }

    /**
     * Apply single NPC bonus
     */
    applyNPCBonus(bonus) {
        const { type, value, crop } = bonus;

        switch (type) {
            case UPGRADE_TYPES.GROWTH_MULTIPLIER:
                this.state.npcBonuses.growthMultiplier *= value;
                break;

            case UPGRADE_TYPES.PRICE_BONUS:
                if (!this.state.npcBonuses.priceBonus[crop]) {
                    this.state.npcBonuses.priceBonus[crop] = 0;
                }
                this.state.npcBonuses.priceBonus[crop] += value;
                break;

            default:
                this.state.npcBonuses[type] = 
                    (this.state.npcBonuses[type] || 0) + value;
        }
    }

    /**
     * Get total growth multiplier (upgrades + NPC bonuses)
     */
    getTotalGrowthMultiplier() {
        return this.state.upgrades.growthMultiplier * 
               this.state.npcBonuses.growthMultiplier;
    }

    /**
     * Get total yield bonus
     */
    getTotalYieldBonus() {
        return this.state.upgrades.yieldBonus + 
               this.state.npcBonuses.yieldBonus;
    }

    /**
     * Get total seed discount
     */
    getTotalSeedDiscount() {
        return MathUtils.clamp(
            this.state.upgrades.seedDiscount + this.state.npcBonuses.seedDiscount,
            0,
            0.99
        );
    }

    /**
     * Get total market bonus
     */
    getTotalMarketBonus() {
        return this.state.upgrades.marketBonus + 
               this.state.npcBonuses.marketBonus;
    }

    /**
     * Get price bonus for specific crop
     */
    getPriceBonus(crop) {
        return this.state.npcBonuses.priceBonus[crop] || 0;
    }

    /**
     * Select seed for planting
     */
    selectSeed(seedName) {
        this.state.selectedSeed = seedName;
    }

    /**
     * Get selected seed
     */
    getSelectedSeed() {
        return this.state.selectedSeed;
    }

    /**
     * Increment science production count
     */
    incrementScienceProduction(amount = 1) {
        this.state.scienceProductionCount += amount;
    }

    /**
     * Get science production count
     */
    getScienceProductionCount() {
        return this.state.scienceProductionCount;
    }

    /**
     * Save state
     */
    saveState() {
        return { ...this.state };
    }

    /**
     * Load state
     */
    loadState(savedState) {
        this.state = {
            ...this.createInitialState(),
            ...savedState,
            scienceProductionCount: savedState.scienceProductionCount || 0,
        };
    }

    /**
     * Reset state
     */
    reset() {
        this.state = this.createInitialState();
    }
}
