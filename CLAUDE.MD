# CLAUDE.MD - Happy JS Farm Project Guide

## Project Overview

**Happy JS Farm** is an incremental farming simulation game built with vanilla JavaScript, HTML5, and CSS. Players plant crops, fulfill customer orders, build production facilities, and progressively unlock new features through a leveling system.

**Tech Stack:**
- Vanilla JavaScript (ES6 modules)
- HTML5 + CSS3
- No external dependencies
- Local storage for game saves

## How to Run

```bash
python serve.py
```

The game requires a local web server due to ES6 module imports. The included Python script automatically starts a server on `http://localhost:8000`.

## Project Structure

```
HappyJSFarm/
├── index.html              # Main entry point
├── serve.py               # Development server script
├── css/
│   └── style.css          # All game styles + animations
├── src/
│   ├── main.js            # Application bootstrap
│   ├── modules/
│   │   ├── config.js      # Game balance, prices, crop definitions
│   │   ├── state.js       # Global game state (player, field, warehouse)
│   │   ├── game.js        # Core game logic (plant, harvest, orders)
│   │   ├── ui.js          # UI rendering and interactions
│   │   ├── ui-continued.js # Extended UI (order badges, animations)
│   │   ├── localization.js # EN/UK translations
│   │   ├── orderTypes.js  # Express/Bulk order system
│   │   ├── specialSeeds.js # Special seed mechanics
│   │   └── tokenShop.js   # Trust token shop system
│   └── refactored/        # WIP modular refactoring (not in use)
└── docs/
    ├── ECONOMY_ANALYSIS.md    # Economic balance analysis
    ├── MVP_COMPLETE.md        # Phase 1-5 completion summary
    ├── WORK_SUMMARY.md        # Detailed phase breakdown
    └── [other docs]
```

## Core Systems

### 1. Field & Crops (`game.js`, `config.js`)

**Planting:**
- Player selects seed from warehouse
- Clicks empty plot to plant
- Crops grow through stages over time

**Growth:**
- `updateCropGrowth()` runs every second
- Progression: 0% → 100% based on `growTime`
- Visual stages update automatically

**Harvesting:**
- Click mature crop (100% growth)
- Adds items to warehouse
- Grants XP based on crop type
- Special seeds have bonus mechanics

**Key Functions:**
- `plantSeed(plotIndex)` - Plant selected seed
- `harvestCrop(plotIndex)` - Harvest mature crop
- `updateCropGrowth()` - Growth tick (1s interval)

### 2. Customer Orders (`game.js`, `orderTypes.js`)

**Order Types:**
- **Standard:** Base rewards (10min duration)
- **Express (⚡):** +50% rewards, 2min duration (unlocked at level 3)
- **Bulk (📦📦📦):** x3 quantity, +30% rewards (unlocked at level 3)

**Order Flow:**
1. `generateOrder(customer)` - Creates random order
2. Player fulfills from warehouse
3. Rewards: money, XP, trust tokens
4. Trust level increases → permanent bonuses

**Key Functions:**
- `generateOrder(customer)` - Generate weighted random order
- `fulfillOrder(customerKey)` - Complete order, apply rewards
- `checkTrustLevelUp(customer)` - Handle trust progression

### 3. Trust System (`game.js`, `state.js`)

**Trust Levels:**
- Earned by fulfilling customer orders
- Each level grants permanent bonuses (growth speed, harvest yield, prices)
- Progression speed doubled in Phase 2 rebalance

**Trust Tokens:**
- Currency earned from orders (1-10 per order)
- Used in Token Shop for boosts and upgrades
- Tracked in `player.trustTokens`

### 4. Token Shop (`tokenShop.js`)

**Available Items:**
1. **Growth Boost (5 tokens):** 1.5x growth speed for 1 hour
2. **Double Harvest (8 tokens):** 2x yield for 5 harvests
3. **Lucky Day (15 tokens):** All bonuses for 30 minutes
4. **Extra Field Slot (20 tokens):** Permanent +1 plot
5. **Warehouse Upgrade (25 tokens):** +50 max capacity

**Key Functions:**
- `buyTokenShopItem(itemId)` - Purchase shop item
- `applyBoost(itemId)` - Activate timed boost
- `checkBoostExpiration()` - Remove expired boosts

**Current Limitation:** No UI implemented yet (purchase via console only)

### 5. Special Seeds (`specialSeeds.js`)

**Types:**
- **Golden Wheat:** 1.5x growth speed, 1.2x sell price
- **Instant Carrot:** 0.1x growth time (nearly instant)
- **Giant Tomato:** 2x harvest yield
- **Premium Potato:** 1.5x sell price
- **Rainbow Berry:** 3x sell price
- **Mystic Blueberry:** +5 trust tokens per harvest
- **Eternal Corn:** Infinite harvests (limitedUses: Infinity)

**Key Functions:**
- `createSpecialCrop(seedId, plotIndex)` - Plant special seed
- `harvestSpecialCrop(plot)` - Harvest with bonuses
- `getRarityColor(rarity)` - Visual styling

**Current Limitation:** No UI for obtaining seeds (console only)

### 6. Production Buildings (`game.js`, `config.js`)

**Flow:**
1. Purchase building from Store
2. Select recipe (requires ingredients)
3. Wait for production time
4. Collect crafted goods

**Examples:**
- Bakery: Wheat → Bread
- Dairy: Grass → Milk → Cheese
- Kitchen: Berries → Jam

**Key Functions:**
- `startProduction(buildingId, recipeId)` - Begin crafting
- `collectProduction(buildingId)` - Claim finished goods
- `updateProduction()` - Progress tick

### 7. Market System (`game.js`, `config.js`)

**Dynamic Pricing:**
- Selling items decreases their price (market fatigue)
- Prices slowly recover over time
- Formula: `basePrice × (1 - saturation × 0.5)`

**Rebalance (Phase 2):**
- All market prices reduced by 30%
- Orders now 1.5-2x more profitable than market
- Encourages order completion over bulk selling

**Key Functions:**
- `sellItem(itemId, quantity)` - Sell to market
- `updateMarketPrices()` - Recovery tick

### 8. Leveling & Unlocks (`game.js`, `config.js`)

**XP Sources:**
- Harvesting crops
- Fulfilling orders (+bonus in Phase 2)
- Completing production

**Unlocks by Level:**
- New seeds and crops
- New buildings and recipes
- Advanced upgrades
- Farm expansions (+2 plots per expansion)
- Order types (Express/Bulk at level 3)

**Key Functions:**
- `addExperience(amount)` - Grant XP, check level up
- `levelUp()` - Process level progression

## Recent Changes (Phases 1-5)

### Phase 2: Economy Rebalance
- Market prices: -30% across all items
- Order rewards: x1.8-3.0 increase
- Trust progression: 2x faster
- XP bonuses added to orders

### Phase 3: Order Types
- Express orders: 2min timer, +50% reward
- Bulk orders: x3 quantity, +30% reward
- Visual badges with animations
- Weighted generation system

### Phase 4: Special Seeds
- 7 unique seed types with bonuses
- Full integration into game loop
- Support for infinite harvests and token bonuses

### Phase 5: Token Shop
- 5 purchasable items (3 boosts, 2 permanents)
- Active boost tracking system
- Automatic expiration handling

**Status:** MVP complete, needs UI polish

## Modified Files on Branch `claude`

```
M  css/style.css              # Order badges, animations
M  src/modules/config.js      # Rebalanced prices
M  src/modules/state.js       # Trust tokens, active boosts
M  src/modules/game.js        # All new systems integrated
M  src/modules/localization.js # Translations for new features
M  src/modules/ui-continued.js # Order badge rendering
?? src/modules/orderTypes.js  # New: Order type system
?? src/modules/specialSeeds.js # New: Special seed mechanics
?? src/modules/tokenShop.js   # New: Token shop system
```

## Known Issues & TODO

### Critical (Needed for Full Release)
- [ ] Token Shop UI (currently console-only)
- [ ] Growth Boost not applied in `updateCropGrowth()`
- [ ] Lucky Day multipliers not integrated
- [ ] No way to obtain special seeds in-game
- [ ] Special seeds not visually distinguished in warehouse

### Nice-to-Have
- [ ] Active boosts display (top-right corner)
- [ ] Token counter in header
- [ ] Chain orders (multi-stage quests)
- [ ] Collection orders (gather variety of items)
- [ ] Sound effects
- [ ] Mobile responsiveness improvements

## Testing Guide

### Console Commands

**Add Trust Tokens:**
```javascript
player.trustTokens = 100;
```

**Add Special Seeds:**
```javascript
warehouse['golden_wheat_seed'] = 5;
warehouse['instant_carrot_seed'] = 3;
warehouse['eternal_corn_seed'] = 1;
player.selectedSeed = 'golden_wheat_seed';
```

**Buy Token Shop Items:**
```javascript
buyTokenShopItem('boost_growth_1h');
buyTokenShopItem('boost_double_harvest');
buyTokenShopItem('permanent_field_slot');
```

**Check Active Boosts:**
```javascript
activeBoosts
player.activeEffects
```

**Force Order Generation:**
```javascript
Object.values(customers).forEach(c => generateOrder(c));
```

### Expected Behavior

**Economy:**
- Market selling gives less money (nerfed)
- Orders give ~1.5-2x more than market equivalent
- Express orders most profitable per minute
- Tokens accumulate steadily (1-10 per order)

**Special Seeds:**
- Golden Wheat: Noticeably faster growth
- Instant Carrot: Nearly instant harvest
- Eternal Corn: Never depletes (infinite harvests)

**Boosts:**
- Growth Boost: Faster crop progression
- Double Harvest: 2x floating text + resources
- Field Slot: New plot appears immediately

## Architecture Notes

**State Management:**
- Global state in `state.js` (player, field, warehouse, customers)
- Modified by functions in `game.js`
- Persisted to localStorage on change

**Module System:**
- ES6 modules with explicit imports
- Main entry: `src/main.js`
- Modular systems: `orderTypes`, `specialSeeds`, `tokenShop`

**UI Pattern:**
- `ui.js` handles rendering
- Event listeners in `main.js`
- Updates triggered by state changes

**Performance:**
- Main game loop: 1 second interval
- Growth updates: O(n) on active plots
- Market recovery: O(1) per tick

## Development Workflow

### Making Changes

1. **Balance tweaks:** Edit `config.js` (prices, growth times, XP)
2. **New features:** Create module in `src/modules/`, import in `main.js`
3. **UI changes:** Modify `ui.js` or add to `ui-continued.js`
4. **Translations:** Update `localization.js` (both `en` and `uk`)

### Testing Changes

1. Clear localStorage: Run game → "Clear Progress"
2. Test early game (levels 1-3)
3. Test mid game (console: `player.level = 10; player.xp = 0;`)
4. Test economy: Track gold/hour at different strategies

### Git Workflow

```bash
# Current branch: claude
git status
git add <files>
git commit -m "Brief description"
git push origin claude

# Create PR to main when ready
gh pr create --title "Feature: Description"
```

## Key Design Decisions

**Why vanilla JavaScript?**
- No build step required
- Easy for beginners to understand
- Small codebase suitable for learning

**Why modular refactoring in progress?**
- Original `game.js` grew to 2000+ lines
- New features easier to add as modules
- Maintaining backward compatibility

**Why Trust Tokens?**
- Provides non-monetary progression
- Encourages order completion over market selling
- Creates meaningful choices (which boost to buy?)

**Why special seeds?**
- Late-game reward system
- "Wow" moments (eternal crops!)
- Rarity creates collection goals

## Contact & Contribution

**Repository:** https://github.com/informaticsrsh/puzzle
**Issues:** Report bugs via GitHub Issues
**Main Branch:** `main`
**Active Branch:** `claude` (current work)

## Quick Reference

**Global Objects:**
- `player` - Stats, level, money, tokens
- `field` - Array of plot states
- `warehouse` - Item inventory
- `customers` - Order states
- `ownedBuildings` - Production facilities
- `activeBoosts` - Active timed effects

**Key Files:**
- `config.js` - All game data
- `state.js` - Save/load logic
- `game.js` - Core mechanics (1000+ lines)
- `ui.js` - Rendering logic

**Localization:**
- `t(key)` function for translations
- Keys in `localization.js`
- Language switcher in top-right

---

**Last Updated:** 2025-12-17
**Game Version:** Phase 5 Complete (MVP)
**Status:** Playable, needs UI polish for Token Shop and Special Seeds
