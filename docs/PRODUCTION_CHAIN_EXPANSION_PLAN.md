# Production Chain Expansion Plan

**Date:** 2025-12-18
**Task:** Task 6 from TODO.md
**Estimated Time:** 2-3 hours

---

## 🎯 Goals

1. **Add 8-10 new multi-step recipes** across tiers
2. **Introduce 2 new buildings** (Mill, Restaurant)
3. **Create deep production chains** (3+ steps)
4. **Balance values** - processed goods >> raw crops
5. **Make late game about strategic management**

---

## 📊 Current State Analysis

### Existing Buildings (9 total):
1. **Bakery** (L1): Wheat → Bread
2. **Dairy** (L3): Wheat → Milk, Milk → Cheese
3. **Pig Pen** (L5): Potato → Bacon
4. **Juicer** (L4): Tomato/Carrot → Juice
5. **Sandwich Shop** (L7): Bread + Bacon → Sandwich
6. **Breakfast Bar** (L8): Milk + Wheat → Cereal
7. **Jam Factory** (L8): Berries → Jam
8. **Research Lab** (L10): Money → Research Points
9. **Taco Stand** (L12): Corn/Tomato/Cheese → Taco

### Current Production Tiers:
- **Tier 0 (Raw):** Crops from field ($8-50)
- **Tier 1 (Simple):** Single ingredient → Product ($28-100)
- **Tier 2 (Complex):** 2 ingredients → Product ($100-200)

### Gap: No Tier 3+ (Multi-step chains)

---

## 🏗️ New Buildings to Add

### 1. Mill (Unlock Level 8)
**Icon:** 🏗️
**Cost:** $8,000
**Description:** Processes grains into flour and other refined ingredients.

**Recipes:**
```javascript
{
    input: { 'wheat': 4 },
    output: { 'flour': 2 },
    productionTime: 120000 // 2 minutes
}
```

**New Item - Flour:**
```javascript
'flour': {
    icon: '🍚',
    maxPrice: 60,
    minPrice: 30,
    priceRecoveryRate: 35000,
    salesVolumeForPriceDrop: 4,
    xpValue: 10,
    requiredLevel: 8
}
```

---

### 2. Restaurant (Unlock Level 12)
**Icon:** 🍽️
**Cost:** $25,000
**Description:** Creates gourmet meals from multiple complex ingredients.

**Recipes:**
```javascript
// Recipe 1: Fancy Dinner
{
    input: { 'sandwich': 1, 'cheese': 1, 'tomato_juice': 1 },
    output: { 'fancy_dinner': 1 },
    productionTime: 180000 // 3 minutes
}

// Recipe 2: Breakfast Platter
{
    input: { 'bacon': 2, 'bread': 2, 'milk': 1 },
    output: { 'breakfast_platter': 1 },
    productionTime: 150000 // 2.5 minutes
}

// Recipe 3: Berry Feast
{
    input: { 'strawberry_jam': 1, 'blueberry_jam': 1, 'bread': 2 },
    output: { 'berry_feast': 1 },
    productionTime: 200000 // 3.3 minutes
}
```

**New Items:**
```javascript
'fancy_dinner': {
    icon: '🍽️',
    maxPrice: 2500,
    minPrice: 1250,
    priceRecoveryRate: 60000,
    salesVolumeForPriceDrop: 2,
    xpValue: 100,
    requiredLevel: 12
},
'breakfast_platter': {
    icon: '🥞',
    maxPrice: 2000,
    minPrice: 1000,
    priceRecoveryRate: 55000,
    salesVolumeForPriceDrop: 2,
    xpValue: 80,
    requiredLevel: 12
},
'berry_feast': {
    icon: '🫐',
    maxPrice: 1800,
    minPrice: 900,
    priceRecoveryRate: 50000,
    salesVolumeForPriceDrop: 2,
    xpValue: 75,
    requiredLevel: 12
}
```

---

## 🔄 New Recipes for Existing Buildings

### Bakery (extend)
**New Recipe: Cake (Tier 2)**
```javascript
{
    input: { 'flour': 2, 'milk': 1, 'strawberry': 3 },
    output: { 'cake': 1 },
    productionTime: 300000 // 5 minutes
}
```

**New Item - Cake:**
```javascript
'cake': {
    icon: '🎂',
    maxPrice: 800,
    minPrice: 400,
    priceRecoveryRate: 45000,
    salesVolumeForPriceDrop: 3,
    xpValue: 50,
    requiredLevel: 8
}
```

---

### Sandwich Shop (extend)
**New Recipe: Gourmet Sandwich (Tier 2)**
```javascript
{
    input: { 'bread': 2, 'cheese': 1, 'tomato': 3, 'bacon': 1 },
    output: { 'gourmet_sandwich': 1 },
    productionTime: 180000 // 3 minutes
}
```

**New Item - Gourmet Sandwich:**
```javascript
'gourmet_sandwich': {
    icon: '🥪',
    maxPrice: 600,
    minPrice: 300,
    priceRecoveryRate: 40000,
    salesVolumeForPriceDrop: 3,
    xpValue: 40,
    requiredLevel: 9
}
```

---

### Jam Factory (extend)
**New Recipe: Mixed Berry Preserves (Tier 2)**
```javascript
{
    input: { 'strawberry': 3, 'blueberry': 3, 'flour': 1 },
    output: { 'mixed_preserves': 1 },
    productionTime: 240000 // 4 minutes
}
```

**New Item - Mixed Preserves:**
```javascript
'mixed_preserves': {
    icon: '🍯',
    maxPrice: 700,
    minPrice: 350,
    priceRecoveryRate: 42000,
    salesVolumeForPriceDrop: 3,
    xpValue: 45,
    requiredLevel: 10
}
```

---

### NEW Building: Kitchen (Level 6)
**Icon:** 👨‍🍳
**Cost:** $6,000
**Description:** Prepares meals and processed foods.

**Recipes:**
```javascript
// Pizza
{
    input: { 'flour': 2, 'tomato': 3, 'cheese': 1 },
    output: { 'pizza': 1 },
    productionTime: 420000 // 7 minutes
}

// Tomato Soup
{
    input: { 'tomato': 5, 'flour': 1 },
    output: { 'tomato_soup': 1 },
    productionTime: 180000 // 3 minutes
}
```

**New Items:**
```javascript
'pizza': {
    icon: '🍕',
    maxPrice: 900,
    minPrice: 450,
    priceRecoveryRate: 48000,
    salesVolumeForPriceDrop: 3,
    xpValue: 55,
    requiredLevel: 6
},
'tomato_soup': {
    icon: '🍲',
    maxPrice: 500,
    minPrice: 250,
    priceRecoveryRate: 38000,
    salesVolumeForPriceDrop: 4,
    xpValue: 35,
    requiredLevel: 6
}
```

---

## 📈 Production Chain Examples

### Chain 1: Wheat → Fancy Dinner (5 steps)
```
1. Plant Wheat (2 min)
2. Wheat (x2) → Bread @ Bakery (8 sec)
3. Potato (x5) → Bacon @ Pig Pen (35 sec)
4. Bread + Bacon → Sandwich @ Sandwich Shop (50 sec)
5. Tomato (x3) → Juice @ Juicer (20 sec)
6. Milk → Cheese @ Dairy (30 sec)
7. Sandwich + Cheese + Juice → Fancy Dinner @ Restaurant (3 min)

Total: ~6-8 minutes active play
Value: $2500 (vs $8 raw wheat = 312x multiplier!)
```

### Chain 2: Berries → Berry Feast (4 steps)
```
1. Plant Strawberry + Blueberry (grow time)
2. Strawberry (x5) → Strawberry Jam @ Jam Factory (30 sec)
3. Blueberry (x5) → Blueberry Jam @ Jam Factory (40 sec)
4. Wheat (x2) → Bread @ Bakery (8 sec)
5. Both Jams + Bread → Berry Feast @ Restaurant (3.3 min)

Total: ~5 minutes
Value: $1800
```

### Chain 3: Wheat → Cake (3 steps)
```
1. Wheat (x4) → Flour @ Mill (2 min)
2. Wheat (x3) → Milk @ Dairy (25 sec)
3. Plant Strawberry
4. Flour + Milk + Strawberry → Cake @ Bakery (5 min)

Total: ~7 minutes
Value: $800
```

---

## 💰 Economic Balance

### Price Tiers (updated):
- **Tier 0 (Raw Crops):** $8-90
- **Tier 1 (Simple Processed):** $28-350
- **Tier 2 (Complex):** $500-900
- **Tier 3 (Gourmet):** $1800-2500

### ROI Analysis:

**Example: Fancy Dinner**
- Inputs cost: ~$200 (raw ingredients)
- Output value: $2500
- Profit: $2300
- Time investment: 6-8 minutes
- **Profit per minute: ~$350**

**Compare to:**
- Raw wheat farming: ~$10/min
- Simple bread: ~$50/min
- Tier 2 sandwich: ~$150/min

**Result:** Tier 3 is 7-35x more profitable!

---

## 🎮 Gameplay Impact

### Early Game (Level 1-5):
- Focus: Plant crops, simple production (Bread, Milk)
- Income: $50-200/min

### Mid Game (Level 6-10):
- Unlock: Mill, Kitchen
- Strategy: Start multi-step chains (Pizza, Cake)
- Income: $300-800/min

### Late Game (Level 11-15):
- Unlock: Restaurant
- Strategy: Complex chains, optimize warehouse
- Income: $1500-3000/min
- **Warehouse becomes critical bottleneck!**

---

## 🛠️ Implementation Steps

### Step 1: Add New Item Definitions (30 min)
**File:** `src/modules/config.js`

Add to `cropTypes` object:
- `flour`
- `cake`
- `gourmet_sandwich`
- `mixed_preserves`
- `pizza`
- `tomato_soup`
- `fancy_dinner`
- `breakfast_platter`
- `berry_feast`

**Total:** 9 new items

---

### Step 2: Add New Buildings (30 min)
**File:** `src/modules/config.js`

Add to `buildings` object:
1. `mill` - Level 8, $8k
2. `kitchen` - Level 6, $6k
3. `restaurant` - Level 12, $25k

**Total:** 3 new buildings

---

### Step 3: Extend Existing Buildings (30 min)
**File:** `src/modules/config.js`

Update `buildings` object:
- **Bakery:** Add cake recipe
- **Sandwich Shop:** Add gourmet sandwich recipe
- **Jam Factory:** Add mixed preserves recipe

Just add to their `recipes` arrays.

---

### Step 4: Add Localization (15 min)
**File:** `src/modules/localization.js`

Add entries for:
- Building names/descriptions (3 buildings)
- Item names (9 items)
- Both EN and UK languages

---

### Step 5: Test & Balance (30 min)
1. Load game
2. Use console to unlock buildings:
   ```javascript
   player.level = 12;
   player.money = 100000;
   ```
3. Test each new recipe
4. Verify production times feel right
5. Check prices are profitable
6. Adjust if needed

---

## 📋 Checklist

### Config Changes:
- [ ] Add 9 new item definitions to `cropTypes`
- [ ] Add 3 new buildings to `buildings`
- [ ] Extend 3 existing buildings with new recipes
- [ ] Verify all `requiredLevel` values

### Localization:
- [ ] Add EN translations (items + buildings)
- [ ] Add UK translations (items + buildings)

### Testing:
- [ ] Test Mill (wheat → flour)
- [ ] Test Kitchen (flour → pizza/soup)
- [ ] Test Restaurant (all 3 recipes)
- [ ] Test extended recipes (cake, gourmet sandwich, preserves)
- [ ] Verify production chains work end-to-end
- [ ] Check warehouse fills at appropriate rate
- [ ] Verify prices make sense

### Balance Verification:
- [ ] Tier 3 items give 7-10x profit vs raw crops
- [ ] Production times feel engaging (not too fast/slow)
- [ ] Late game players want to use these chains
- [ ] Warehouse bottleneck is noticeable

---

## 🎯 Success Metrics

**Feature is successful if:**
1. ✅ Players at level 10+ use multi-step chains
2. ✅ Tier 3 items more profitable than market selling raw
3. ✅ Warehouse space becomes strategic choice
4. ✅ Late game feels like management, not farming
5. ✅ Production chains take 5-10 minutes (engaging but not tedious)

---

## 🔮 Future Expansion Ideas

**After this implementation:**
- Tier 4 recipes (catering service, food festival)
- Special event recipes (holiday meals)
- Cross-breeding crops for rare ingredients
- Recipe unlock via achievements
- Custom recipes (player experimentation)

---

## 📝 Notes

**Important:**
- Keep existing buildings/recipes unchanged (backward compatibility)
- New recipes are ADDITIONS to existing buildings
- Price values are pre-market-fatigue (max prices)
- Production times in milliseconds (1 min = 60000)

**Design Philosophy:**
- More steps = higher reward
- Complex ingredients = premium output
- Late game = strategic optimization
- Warehouse = natural bottleneck

---

**Last Updated:** 2025-12-18
**Status:** Ready for implementation
**Next Step:** Begin Step 1 (Add Item Definitions)
