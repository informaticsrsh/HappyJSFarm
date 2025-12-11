# Quick Start Guide - Refactored Architecture

## 🚀 5-Minute Introduction

This guide will get you up to speed with the new architecture in just 5 minutes.

## 📚 Table of Contents

1. [Core Concepts](#core-concepts)
2. [Common Patterns](#common-patterns)
3. [Step-by-Step Examples](#step-by-step-examples)
4. [Troubleshooting](#troubleshooting)
5. [Cheat Sheet](#cheat-sheet)

---

## Core Concepts

### 1. Systems Are Independent
Each system manages one aspect of the game:
- **PlayerSystem** → Player state (money, XP, level)
- **FieldSystem** → Crops and field operations
- **WarehouseSystem** → Inventory management
- **MarketSystem** → Prices and sales
- **OrderSystem** → Customer orders
- **BuildingSystem** → Production buildings

### 2. Event-Driven Communication
Systems don't call each other directly. They use events:
```javascript
// ❌ Old way: Direct calls
function harvest() {
    // ... harvest logic ...
    renderField();
    renderWarehouse();
    updatePlayerStats();
}

// ✅ New way: Events
function harvest() {
    const result = fieldSystem.harvest(row, col);
    // Events automatically notify UI
}
```

### 3. Validation First
Always validate inputs:
```javascript
// ❌ Old way: No validation
player.money += amount;

// ✅ New way: Validated
playerSystem.addMoney(amount); // Throws if invalid
```

### 4. Clear Data Flow
```
User Action → System Method → Validation → Logic → Event → UI Update
```

---

## Common Patterns

### Pattern 1: Reading State (No Side Effects)
```javascript
// Get information
const money = playerSystem.state.money;
const level = playerSystem.getLevel();
const stats = fieldSystem.getStats();

// Check conditions
if (playerSystem.hasMoney(1000)) {
    // Can afford
}

if (warehouseSystem.hasItem('wheat', 5)) {
    // Has enough wheat
}
```

### Pattern 2: Modifying State (With Validation)
```javascript
try {
    // Operations that might fail
    playerSystem.deductMoney(1000);
    warehouseSystem.removeItem('wheat', 5);
    fieldSystem.plant(0, 0, 'wheat');
    
    // Success!
} catch (error) {
    if (error instanceof ValidationError) {
        showNotification(error.message);
    }
}
```

### Pattern 3: Listening to Events
```javascript
// UI listens to game events
eventBus.on(GAME_EVENTS.CROP_HARVESTED, (data) => {
    updateFieldVisual(data.row, data.col);
    updateWarehouseUI();
});

eventBus.on(GAME_EVENTS.LEVEL_UP, (data) => {
    showLevelUpModal(data.level);
});
```

### Pattern 4: Working with Constants
```javascript
// ❌ Don't use magic numbers
setTimeout(save, 5000);

// ✅ Use named constants
setTimeout(save, GAME_CONFIG.SAVE_INTERVAL);

// ❌ Don't use strings directly
applyUpgrade('yieldBonus', 5);

// ✅ Use constants
applyUpgrade(UPGRADE_TYPES.YIELD_BONUS, 5);
```

---

## Step-by-Step Examples

### Example 1: Plant a Crop

**Step 1: Check requirements**
```javascript
const hasSeeds = warehouseSystem.hasItem('wheat_seed', 1);
const isEmpty = !fieldSystem.getCell(row, col).crop;
```

**Step 2: Perform action**
```javascript
try {
    fieldSystem.plant(row, col, 'wheat');
    warehouseSystem.removeItem('wheat_seed', 1);
} catch (error) {
    showNotification(error.message);
}
```

**Step 3: Done!**
Events automatically update the UI.

### Example 2: Harvest a Crop

**Step 1: Get bonuses**
```javascript
const yieldBonus = playerSystem.getTotalYieldBonus();
```

**Step 2: Harvest**
```javascript
try {
    const result = fieldSystem.harvest(row, col, yieldBonus);
    // result = { crop, amount, xp }
} catch (error) {
    showNotification('Not ready to harvest');
}
```

**Step 3: Update related systems**
```javascript
warehouseSystem.addItem(result.crop, result.amount);
playerSystem.addXP(result.xp);
```

**Step 4: Done!**
Events handle UI updates.

### Example 3: Buy an Upgrade

**Step 1: Get upgrade info**
```javascript
const upgrade = upgrades['fertilizer1'];
const canAfford = playerSystem.hasMoney(upgrade.cost);
const levelReq = upgrade.requiredLevel;
const currentLevel = playerSystem.getLevel();
```

**Step 2: Check requirements**
```javascript
if (currentLevel < levelReq) {
    showNotification('Level too low!');
    return;
}

if (!canAfford) {
    showNotification('Not enough money!');
    return;
}
```

**Step 3: Purchase**
```javascript
try {
    playerSystem.deductMoney(upgrade.cost);
    playerSystem.applyUpgrade(
        upgrade.effect.type,
        upgrade.effect.value
    );
    upgrade.purchased = true;
} catch (error) {
    showNotification(error.message);
}
```

### Example 4: Sell to Market

**Step 1: Calculate price**
```javascript
const basePrice = marketSystem.getPrice('wheat');
const marketBonus = playerSystem.getTotalMarketBonus();
const priceBonus = playerSystem.getPriceBonus('wheat');
const finalPrice = basePrice + marketBonus + priceBonus;
```

**Step 2: Check inventory**
```javascript
if (!warehouseSystem.hasItem('wheat', amount)) {
    showNotification('Not enough wheat!');
    return;
}
```

**Step 3: Sell**
```javascript
try {
    warehouseSystem.removeItem('wheat', amount);
    playerSystem.addMoney(finalPrice * amount);
    marketSystem.recordSale('wheat', amount);
} catch (error) {
    showNotification(error.message);
}
```

---

## Troubleshooting

### Problem: "ValidationError: [field] must be..."
**Solution:** Check your inputs. The error message tells you what's wrong.
```javascript
// Error says "amount must be positive"
playerSystem.addMoney(-100); // ❌ Negative

// Fix:
playerSystem.addMoney(100); // ✅ Positive
```

### Problem: "Cannot read property 'crop' of undefined"
**Solution:** Always check if a cell exists before accessing it.
```javascript
// ❌ Might be out of bounds
const cell = field[10][10];

// ✅ Use validation
if (fieldSystem.isValidPosition(row, col)) {
    const cell = fieldSystem.getCell(row, col);
}
```

### Problem: UI not updating
**Solution:** Make sure you're using system methods, not direct state modification.
```javascript
// ❌ Direct modification (no events)
player.money += 100;

// ✅ Use system method (emits events)
playerSystem.addMoney(100);
```

### Problem: Can't find a system method
**Solution:** Check the system's file. All public methods are documented.
```javascript
// Look in PlayerSystem.js for available methods:
// - addMoney(amount)
// - deductMoney(amount)
// - addXP(amount)
// - getLevel()
// - etc.
```

---

## Cheat Sheet

### Quick Reference

#### PlayerSystem
```javascript
// Money
playerSystem.addMoney(100);
playerSystem.deductMoney(50);
playerSystem.hasMoney(1000); // boolean

// XP & Level
playerSystem.addXP(50);
playerSystem.getLevel(); // number
playerSystem.getXPProgress(); // 0-1

// Upgrades
playerSystem.applyUpgrade(type, value);
playerSystem.getUpgrade(type);

// Bonuses
playerSystem.getTotalYieldBonus();
playerSystem.getTotalGrowthMultiplier();
playerSystem.getTotalMarketBonus();
playerSystem.getPriceBonus(crop);
```

#### FieldSystem
```javascript
// Basic Operations
fieldSystem.plant(row, col, cropName);
fieldSystem.harvest(row, col, yieldBonus);
fieldSystem.updateGrowth(multiplier);

// Queries
fieldSystem.getCell(row, col);
fieldSystem.getEmptyPlots(); // array
fieldSystem.getMatureCrops(); // array
fieldSystem.getStats(); // object

// Automation
fieldSystem.setAutoCrop(row, col, cropName);
fieldSystem.isAutomated(row, col); // boolean

// Visuals
fieldSystem.getCropVisual(row, col); // string
fieldSystem.getGrowthProgress(row, col); // 0-1
```

#### Events
```javascript
// Listen
eventBus.on(GAME_EVENTS.CROP_HARVESTED, callback);
eventBus.on(GAME_EVENTS.LEVEL_UP, callback);
eventBus.on(GAME_EVENTS.MONEY_CHANGED, callback);

// Emit (done automatically by systems)
eventBus.emit(GAME_EVENTS.CROP_PLANTED, data);

// Stop listening
const unsubscribe = eventBus.on(event, callback);
unsubscribe(); // Later
```

#### Validation
```javascript
// Numbers
Validator.isPositiveNumber(value, name);
Validator.isInteger(value, name);
Validator.isInRange(value, min, max, name);

// Amounts
Validator.hasSufficientAmount(current, required, name);
Validator.hasSufficientItems(warehouse, { wheat: 5 });

// Objects
Validator.hasProperties(obj, ['prop1', 'prop2']);
```

#### Utilities
```javascript
// Math
MathUtils.randomInt(1, 10);
MathUtils.clamp(value, 0, 100);
MathUtils.roundTo(value, 2);

// Time
TimeUtils.formatTime(ms); // "05:30"
TimeUtils.hasElapsed(start, duration);
TimeUtils.getRemaining(start, duration);

// Arrays
ArrayUtils.randomElement(array);
ArrayUtils.shuffle(array);
ArrayUtils.groupBy(array, keyFn);
```

#### Constants
```javascript
// Game Config
GAME_CONFIG.SAVE_INTERVAL
GAME_CONFIG.ORDER_LIFETIME
GAME_CONFIG.MAX_LEVEL

// Upgrade Types
UPGRADE_TYPES.YIELD_BONUS
UPGRADE_TYPES.GROWTH_MULTIPLIER
UPGRADE_TYPES.MARKET_BONUS

// Events
GAME_EVENTS.CROP_HARVESTED
GAME_EVENTS.LEVEL_UP
GAME_EVENTS.MONEY_CHANGED
```

---

## Best Practices

### ✅ DO

1. **Always validate inputs**
   ```javascript
   addMoney(amount) {
       Validator.isPositiveNumber(amount);
       // ... rest of code
   }
   ```

2. **Use events for communication**
   ```javascript
   eventBus.emit(GAME_EVENTS.CROP_HARVESTED, data);
   ```

3. **Use constants instead of magic numbers**
   ```javascript
   setTimeout(save, GAME_CONFIG.SAVE_INTERVAL);
   ```

4. **Handle errors gracefully**
   ```javascript
   try {
       operation();
   } catch (ValidationError) {
       showNotification('Clear error message');
   }
   ```

5. **Document your code**
   ```javascript
   /**
    * Plant a crop at position
    * @param {number} row - Row index
    * @param {number} col - Column index
    * @param {string} cropName - Name of crop to plant
    */
   ```

### ❌ DON'T

1. **Don't modify state directly**
   ```javascript
   player.money += 100; // ❌
   playerSystem.addMoney(100); // ✅
   ```

2. **Don't use magic numbers**
   ```javascript
   setTimeout(save, 5000); // ❌
   setTimeout(save, GAME_CONFIG.SAVE_INTERVAL); // ✅
   ```

3. **Don't catch errors silently**
   ```javascript
   try { operation(); } catch {} // ❌
   try { operation(); } catch (e) { showError(e); } // ✅
   ```

4. **Don't call render functions directly**
   ```javascript
   harvest();
   renderField(); // ❌ Let events handle it
   ```

5. **Don't skip validation**
   ```javascript
   function addMoney(amount) {
       this.money += amount; // ❌ No validation
   }
   ```

---

## Next Steps

1. **Read the docs**: Check individual system files
2. **Try examples**: Run the USAGE_EXAMPLES.js examples
3. **Write tests**: Test-driven development works great
4. **Ask questions**: Check the code comments
5. **Extend**: Add new features using the same patterns

---

## Help & Support

- **Documentation**: See individual system files
- **Examples**: Check USAGE_EXAMPLES.js
- **Architecture**: Read ARCHITECTURE_DIAGRAMS.md
- **Comparison**: See BEFORE_AFTER_COMPARISON.md
- **Full Plan**: Read REFACTORING_PLAN.md

---

**Remember:** The new architecture is designed to make your life easier. If something seems hard, you might be doing it the old way. Check the patterns above! 🚀
