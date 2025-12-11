/**
 * Example: How to use the refactored systems
 * This demonstrates the new architecture and patterns
 */

import { eventBus, GAME_EVENTS } from './core/EventBus.js';
import { PlayerSystem } from './systems/PlayerSystem.js';
import { FieldSystem } from './systems/FieldSystem.js';
import { leveling, cropTypes } from '../modules/config.js';

// ============================================================================
// 1. INITIALIZATION
// ============================================================================

// Create game systems
const playerSystem = new PlayerSystem(leveling);
const fieldSystem = new FieldSystem(cropTypes);

// ============================================================================
// 2. EVENT-DRIVEN COMMUNICATION
// ============================================================================

// Listen to game events (UI layer)
eventBus.on(GAME_EVENTS.CROP_HARVESTED, (data) => {
    console.log(`Harvested ${data.amount}x ${data.crop}`);
    // Update UI automatically
    updateFieldUI();
    updateWarehouseUI();
});

eventBus.on(GAME_EVENTS.LEVEL_UP, (data) => {
    console.log(`Level up! Now level ${data.level}`);
    showLevelUpModal(data.level);
});

eventBus.on(GAME_EVENTS.XP_GAINED, (data) => {
    updateXPBar(data.total, data.toNext);
});

// ============================================================================
// 3. SAFE OPERATIONS WITH VALIDATION
// ============================================================================

// Old way (no validation, errors hard to trace)
function oldPlantSeed(row, col) {
    field[row][col].crop = 'wheat';
    field[row][col].stageStartTime = Date.now();
    warehouse['wheat_seed']--;
}

// New way (validated, clear error messages)
function newPlantSeed(row, col, cropName) {
    try {
        // Validation happens inside
        fieldSystem.plant(row, col, cropName);
        warehouseSystem.removeItem(`${cropName}_seed`, 1);
        
        // Event automatically notifies UI
        // No need to manually call render functions
    } catch (error) {
        if (error instanceof ValidationError) {
            showNotification(error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

// ============================================================================
// 4. CLEAR DATA FLOW
// ============================================================================

// Old way (unclear flow, side effects everywhere)
function oldHarvestCrop(r, c) {
    const cell = field[r][c];
    const crop = cropTypes[cell.crop];
    const yield = Math.random() * (crop.maxYield - crop.minYield) + crop.minYield;
    warehouse[cell.crop] += yield;
    player.xp += crop.xpValue * yield;
    cell.crop = null;
    renderField();
    renderWarehouse();
    checkLevelUp();
}

// New way (clear flow, no side effects)
function newHarvestCrop(row, col) {
    // 1. Harvest (pure operation)
    const result = fieldSystem.harvest(
        row, 
        col, 
        playerSystem.getTotalYieldBonus()
    );
    // Returns: { crop, amount, xp }
    
    // 2. Update warehouse
    warehouseSystem.addItem(result.crop, result.amount);
    
    // 3. Update player
    playerSystem.addXP(result.xp);
    
    // 4. Events handle UI updates automatically
    // fieldSystem.harvest() emitted CROP_HARVESTED
    // warehouseSystem.addItem() emitted WAREHOUSE_UPDATED
    // playerSystem.addXP() emitted XP_GAINED (and maybe LEVEL_UP)
}

// ============================================================================
// 5. QUERY OPERATIONS (NO SIDE EFFECTS)
// ============================================================================

// Get field statistics
const fieldStats = fieldSystem.getStats();
console.log(`
    Total plots: ${fieldStats.totalPlots}
    Empty: ${fieldStats.emptyPlots}
    Growing: ${fieldStats.growingCrops}
    Mature: ${fieldStats.matureCrops}
    Automated: ${fieldStats.autoPlots}
`);

// Get player progress
const xpProgress = playerSystem.getXPProgress();
console.log(`XP Progress: ${Math.round(xpProgress * 100)}%`);

// Check if player can afford something
if (playerSystem.hasMoney(1000)) {
    console.log('Can afford upgrade');
}

// ============================================================================
// 6. TESTABLE CODE
// ============================================================================

// Each system can be tested independently
function testPlayerLeveling() {
    const testPlayer = new PlayerSystem(leveling);
    
    // Test level up
    testPlayer.addXP(200); // Should level up
    console.assert(testPlayer.getLevel() === 2, 'Level should be 2');
    
    // Test XP overflow
    testPlayer.addXP(1000);
    console.assert(testPlayer.getLevel() === 3, 'Should level up multiple times');
    
    // Test upgrades
    testPlayer.applyUpgrade('yieldBonus', 5);
    console.assert(testPlayer.getUpgrade('yieldBonus') === 5);
    
    console.log('All player tests passed!');
}

// ============================================================================
// 7. GAME LOOP INTEGRATION
// ============================================================================

function gameLoop() {
    const now = Date.now();
    
    // Update all systems
    const growthChanged = fieldSystem.updateGrowth(
        playerSystem.getTotalGrowthMultiplier()
    );
    
    const marketChanged = marketSystem.updatePrices(now);
    
    const ordersChanged = orderSystem.updateOrders(now);
    
    const productionChanged = buildingSystem.updateProduction(now);
    
    // Auto-save periodically
    if (shouldSave(now)) {
        saveSystem.save({
            player: playerSystem.saveState(),
            field: fieldSystem.saveState(),
            warehouse: warehouseSystem.saveState(),
            market: marketSystem.saveState(),
            orders: orderSystem.saveState(),
            buildings: buildingSystem.saveState(),
        });
    }
    
    // Events automatically update UI
    // No manual render calls needed
}

// ============================================================================
// 8. HELPER UTILITIES
// ============================================================================

import { MathUtils, TimeUtils, ArrayUtils } from './utils/helpers.js';

// Math utilities
const randomYield = MathUtils.randomInt(1, 5);
const clampedDiscount = MathUtils.clamp(discount, 0, 0.99);

// Time utilities
const timeRemaining = TimeUtils.getRemaining(startTime, duration);
const formattedTime = TimeUtils.formatTime(timeRemaining); // "05:30"

// Array utilities
const randomCrop = ArrayUtils.randomElement(availableCrops);
const shuffledOrders = ArrayUtils.shuffle(orders);

// ============================================================================
// 9. ERROR HANDLING
// ============================================================================

import { tryCatch, ValidationError } from './utils/validation.js';

// Safe operation with fallback
const result = tryCatch(
    () => riskyOperation(),
    { success: false, error: 'Operation failed' }
);

// Specific error handling
try {
    playerSystem.deductMoney(1000);
} catch (error) {
    if (error instanceof ValidationError) {
        showNotification(`Cannot purchase: ${error.message}`);
    } else {
        throw error; // Re-throw unexpected errors
    }
}

// ============================================================================
// 10. CONFIGURATION MANAGEMENT
// ============================================================================

import { GAME_CONFIG, UPGRADE_TYPES } from './constants/gameConstants.js';

// Use named constants instead of magic numbers
setTimeout(autoSave, GAME_CONFIG.SAVE_INTERVAL);

// Type-safe upgrade types
playerSystem.applyUpgrade(UPGRADE_TYPES.YIELD_BONUS, 5);

// ============================================================================
// COMPARISON: OLD vs NEW
// ============================================================================

/*
OLD CODE:
- 1 file, 600+ lines
- Mixed concerns
- No validation
- Hard to test
- Tight coupling
- Direct DOM manipulation
- Magic numbers
- Unclear data flow

NEW CODE:
- Multiple focused files
- Clear separation of concerns
- Input validation
- Easy to test
- Loose coupling via events
- Separated UI layer
- Named constants
- Clear, documented data flow
*/

// ============================================================================
// BENEFITS IN PRACTICE
// ============================================================================

/*
1. MAINTAINABILITY
   - Change field logic? Only edit FieldSystem
   - Add new upgrade? Only edit UpgradeSystem
   - Fix bug? Clear where to look

2. TESTABILITY
   - Test systems in isolation
   - Mock dependencies easily
   - Clear assertions

3. SCALABILITY
   - Add new systems without touching existing code
   - Events make it easy to add new features
   - Plugin architecture ready

4. DEVELOPER EXPERIENCE
   - Clear documentation
   - Type hints (via JSDoc)
   - Helpful error messages
   - Easy to understand

5. PERFORMANCE
   - Efficient event system
   - No unnecessary renders
   - Optimized loops
   - Clear bottlenecks

6. CODE QUALITY
   - SOLID principles
   - DRY (no duplication)
   - Clean code practices
   - Professional patterns
*/
