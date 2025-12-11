/**
 * Refactored Game Entry Point
 * 
 * This file demonstrates how to initialize and use the refactored systems.
 * It's meant to be used alongside (or eventually replace) the old main.js
 */

// Import systems
import { PlayerSystem } from './systems/PlayerSystem.js';
import { FieldSystem } from './systems/FieldSystem.js';

// Import core
import { eventBus, GAME_EVENTS } from './core/EventBus.js';

// Import configuration (from old structure until fully migrated)
import { leveling, cropTypes } from '../modules/config.js';

// Import constants
import { GAME_CONFIG } from './constants/gameConstants.js';

/**
 * Main Game Manager
 * Coordinates all game systems
 */
class GameManager {
    constructor() {
        this.systems = {
            player: new PlayerSystem(leveling),
            field: new FieldSystem(cropTypes),
            // Add other systems as they're created
        };
        
        this.setupEventListeners();
        this.startGameLoop();
    }

    /**
     * Set up event listeners for UI updates
     */
    setupEventListeners() {
        // Player events
        eventBus.on(GAME_EVENTS.MONEY_CHANGED, (data) => {
            this.updateMoneyDisplay(data.amount);
        });

        eventBus.on(GAME_EVENTS.LEVEL_UP, (data) => {
            this.showLevelUpNotification(data.level);
        });

        eventBus.on(GAME_EVENTS.XP_GAINED, (data) => {
            this.updateXPBar(data.total, data.toNext);
        });

        // Field events
        eventBus.on(GAME_EVENTS.CROP_PLANTED, (data) => {
            this.updateFieldCell(data.row, data.col);
        });

        eventBus.on(GAME_EVENTS.CROP_HARVESTED, (data) => {
            this.updateFieldCell(data.row, data.col);
            this.showHarvestNotification(data);
        });

        eventBus.on(GAME_EVENTS.CROP_GREW, (data) => {
            this.updateFieldCell(data.row, data.col);
        });
    }

    /**
     * Start the main game loop
     */
    startGameLoop() {
        setInterval(() => {
            this.gameTick();
        }, GAME_CONFIG.TICK_INTERVAL);
    }

    /**
     * Main game loop - runs every tick
     */
    gameTick() {
        // Update all systems
        this.systems.field.updateGrowth(
            this.systems.player.getTotalGrowthMultiplier()
        );

        // Other system updates...
    }

    /**
     * UI Update Methods
     * These would connect to your actual UI
     */
    updateMoneyDisplay(amount) {
        console.log(`Money: ${amount}`);
        // Update DOM here
    }

    updateXPBar(current, toNext) {
        console.log(`XP: ${current}/${toNext}`);
        // Update DOM here
    }

    showLevelUpNotification(level) {
        console.log(`Level Up! Now level ${level}`);
        // Show modal here
    }

    updateFieldCell(row, col) {
        console.log(`Field cell ${row},${col} updated`);
        // Update DOM here
    }

    showHarvestNotification(data) {
        console.log(`Harvested ${data.amount}x ${data.crop} (+${data.xp} XP)`);
        // Show notification here
    }

    /**
     * Save game state
     */
    save() {
        const state = {
            player: this.systems.player.saveState(),
            field: this.systems.field.saveState(),
            // Other systems...
        };

        localStorage.setItem('happyJsFarmState', JSON.stringify(state));
    }

    /**
     * Load game state
     */
    load() {
        const savedState = localStorage.getItem('happyJsFarmState');
        if (!savedState) return;

        const state = JSON.parse(savedState);
        
        this.systems.player.loadState(state.player);
        this.systems.field.loadState(state.field);
        // Other systems...
    }
}

/**
 * Initialize game when DOM is ready
 */
let game = null;

document.addEventListener('DOMContentLoaded', () => {
    // Option 1: Use new architecture
    game = new GameManager();
    game.load();

    // Set up auto-save
    setInterval(() => {
        game.save();
    }, GAME_CONFIG.SAVE_INTERVAL);
});

// Export for external access
export { game };
