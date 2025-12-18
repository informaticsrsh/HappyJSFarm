# 📋 TODO LIST - Happy JS Farm

**Останнє оновлення:** 2025-12-18
**Статус проекту:** MVP Complete, новий напрямок - organic engagement без mobile F2P mechanics

---

## 🔴 КРИТИЧНО - Зробити ЗАРАЗ (3-4 години)

Ці задачі блокують релізs гри. Без них гравці не зможуть використовувати основні фічі.

### ✅ Task 1: Token Shop UI - ЗАВЕРШЕНО

**Пріоритет:** 🔴 CRITICAL
**Час:** 1.5-2 години
**Статус:** ✅ **ВИКОНАНО** (2025-12-18)

**Що було зроблено:**
- ✅ Додано Token Shop modal з компактним дизайном (550px width)
- ✅ Створено кнопку "🪙 Token Shop" з token counter
- ✅ Реалізовано 2-column grid layout для items
- ✅ Додано tabs (Boosts / Permanent) з переключенням
- ✅ Інтегровано render functions (`renderTokenShop`, `updateTokenCounter`)
- ✅ Підключено event listeners для покупок
- ✅ Застосовано дизайн у стилі гри (#f4f1de background, #667eea accents)
- ✅ Оптимізовано для фіксованого вікна 1280x720px

**Commit:** `0fe6908` - "feat: Add Token Shop UI with compact design"

---

### ✅ Task 2: Active Boosts Display

**Пріоритет:** 🔴 CRITICAL
**Час:** 1 година
**Статус:** ✅ **ВИКОНАНО** (2025-12-18)

**Проблема:**
Бусти працюють в фоні, але гравець не бачить:
- Які ефекти активні
- Скільки часу залишилось
- Скільки charges для doubleHarvest

**Що було зроблено:**

1. **HTML (10 хв)**
   - ✅ Створено `<div id="active-boosts-panel">` в `index.html`
   - ✅ Додано в top-right corner
   - ✅ Структура: header + list container

2. **CSS (15 хв)**
   - ✅ Fixed position в top-right (top: 20px, right: 20px)
   - ✅ Напівпрозорий фон з backdrop blur
   - ✅ Градієнтні backgrounds для boost cards
   - ✅ Pulse glow animation (2s ease-in-out infinite)
   - ✅ Progress bar стилі
   - ✅ Різні кольори для типів бустів:
     - Growth Speed: зелений (#4CAF50 → #2e7d32)
     - Lucky Day: золотий (#ffd700 → #ff8c00)
     - Double Harvest: рожевий (#ff6b9d → #c44569)

3. **JavaScript (25 хв)**
   - ✅ Створено `renderActiveBoosts()` в `ui.js`
   - ✅ Loop через `activeBoosts` array
   - ✅ Розрахунок timeLeft для кожного
   - ✅ Format time як "M:SS"
   - ✅ Розрахунок progress % для progress bar
   - ✅ Показ charge-based boosts окремо
   - ✅ Handle empty state (auto-hide panel)

4. **Helper Functions (10 хв)**
   - ✅ `getBoostIcon(type)` - повертає emoji
   - ✅ `getBoostName(type)` - повертає назву
   - ✅ `formatBoostTime(ms)` - конвертує в M:SS

5. **Auto-Update Timer (10 хв)**
   - ✅ Додано `renderActiveBoosts()` до interval в `main.js`
   - ✅ Update кожну секунду
   - ✅ Викликається при завантаженні гри
   - ✅ Викликається після покупки з Token Shop

**Файли відредаговано:**
- `index.html` - додано panel HTML
- `css/style.css` - додано 120+ рядків стилів + animations
- `src/modules/ui.js` - додано renderActiveBoosts() + 3 helper functions
- `src/main.js` - інтегровано в timer + imports

**Критерії готовності:**
- ✅ Panel видимий в top-right
- ✅ Таймери оновлюються щосекунди
- ✅ Progress bars працюють
- ✅ Різні типи бустів мають різні кольори
- ✅ Charges показуються для doubleHarvest
- ✅ Після закінчення буст зникає (auto-hide)

---

### ✅ Task 3: Tooltips на Disabled Buttons

**Пріоритет:** 🔴 CRITICAL
**Час:** 30 хвилин
**Статус:** ✅ **ВИКОНАНО** (2025-12-18)

**Проблема:**
Кнопки стають сірими без пояснення чому. Гравці frustrated.

**Що було зроблено:**

1. **Helper Functions (10 хв)**
   - ✅ Створено `getPurchaseBlockReason(cost, requiredLevel)` в `ui.js`
   - ✅ Створено `getUpgradeBlockReason(upgrade)` в `ui.js`
   - ✅ Створено `getBuildingBlockReason(building)` в `ui.js`
   - ✅ Functions повертають string з причиною (newline separated)

2. **Apply to Store (10 хв)**
   - ✅ Оновлено `renderStore()` в `ui.js`
   - ✅ Додано `title` attribute до disabled buttons
   - ✅ Показує:
     - "Requires level X (you are Y)"
     - "Need $X more money"

3. **Apply to Upgrades (10 хв)**
   - ✅ Оновлено `renderUpgrades()` в `ui.js`
   - ✅ Додано tooltips до disabled upgrade buttons
   - ✅ Показує:
     - "Requires level X (you are Y)"
     - "Need $X more money"
     - "Need X more research points"
     - "Requires [Building Name]"
     - "Maximum purchases reached (X/Y)"

4. **Apply to Production Buildings (Bonus)**
   - ✅ Оновлено `renderProduction()` в `ui.js`
   - ✅ Додано tooltips до disabled building purchase buttons

**Файли відредаговано:**
- `src/modules/ui.js` - додано 3 helper functions + tooltips до render functions

**Критерії готовності:**
- ✅ Hover на disabled button показує причину
- ✅ Точна сума яка потрібна
- ✅ Required level показується
- ✅ Required building показується
- ✅ Max purchases показується

---

## 🟡 ВИСОКИЙ ПРІОРИТЕТ - Наступний тиждень (6-9 годин)

**НОВИЙ НАПРЯМОК:** AFK farming - це OK! Фокус на warehouse bottleneck, production chains, та prestige system замість artificial gates (energy/daily quests).

---

### Task 4: Warehouse Rebalance & Bottleneck System

**Пріоритет:** 🟡 HIGH
**Час:** 1-1.5 години
**Статус:** ❌ Не розпочато

**Філософія:**
Warehouse space стає природнім bottleneck. Automation fills склад за 30-60 хв → гравець повертається → приймає strategic decisions (fulfill orders? craft? sell?).

**Що зробити:**

1. **Config Rebalance (20 хв)**
   - [ ] Зменшити базову ємність: `maxWarehouseCapacity: 50 → 30`
   - [ ] Warehouse upgrades дають менше: `+50 → +20 per upgrade`
   - [ ] Збільшити ціну upgrades: `basePrice * 2`
   - [ ] Max upgrades: залишити ~5-7

2. **Smart Capacity System (30 хв)**
   - [ ] Кожен item займає різну кількість slots:
     - Basic crops (wheat, carrot): 1 slot
     - Processed goods (bread, cheese): 2 slots
     - Special items: 3 slots
   - [ ] Додати `itemWeight` в config.js
   - [ ] Update `addToWarehouse()` для перевірки weight

3. **UI Updates (20 хв)**
   - [ ] Показувати `Used: 28/30 slots` замість item counts
   - [ ] Warning при 80%+ заповненні
   - [ ] Color coding: green < 50%, yellow 50-80%, red 80%+
   - [ ] Tooltip показує breakdown по categories

4. **Testing (10 хв)**
   - [ ] Automated plots fills warehouse за ~1 год
   - [ ] Гравець змушений повертатись
   - [ ] Orders звільняють space ефективно

**Файли для редагування:**
- `src/modules/config.js` - capacity values, item weights
- `src/modules/game.js` - addToWarehouse() logic
- `src/modules/ui.js` - warehouse display
- `css/style.css` - warning colors

**Критерії готовності:**
- ✅ Warehouse fills швидше (30-60 хв з automation)
- ✅ Item weights працюють
- ✅ UI показує space usage accurately
- ✅ Warning показується при high capacity
- ✅ Upgrades дорожчі та дають менше

---

### Task 5: Order Value Buff

**Пріоритет:** 🟡 HIGH
**Час:** 30 хвилин
**Статус:** ❌ Не розпочато

**Філософія:**
Orders мають бути ЯВНО найвигіднішими (3-5x більше ніж market). Гравець має хотіти звільняти warehouse space через orders, не через selling.

**Що зробити:**

1. **Reward Multipliers (15 хв)**
   - [ ] Збільшити base order rewards на +50%
   - [ ] Express orders: x2.5 (було x1.5)
   - [ ] Bulk orders: x2.0 (було x1.3)
   - [ ] Trust tokens: +2-5 per order

2. **XP Bonuses (10 хв)**
   - [ ] Orders дають +100% XP (подвійне)
   - [ ] Bulk orders: +150% XP
   - [ ] Express orders: +200% XP (швидко + багато)

3. **Visual Feedback (5 хв)**
   - [ ] Показати порівняння в tooltip: "Order: $500 vs Market: $150"
   - [ ] Highlight best value orders

**Файли для редагування:**
- `src/modules/config.js` або `orderTypes.js` - multipliers
- `src/modules/game.js` - fulfillOrder() rewards
- `src/modules/ui.js` - tooltips

**Критерії готовності:**
- ✅ Orders дають 3-5x більше ніж market equivalent
- ✅ XP bonuses працюють
- ✅ Visual comparison показується
- ✅ Гравці очевидно бачать переваги orders

---

### Task 6: Production Chain Expansion

**Пріоритет:** 🟡 HIGH
**Час:** 2-3 години
**Статус:** ❌ Не розпочато

**Філософія:**
Late game = strategic management. Multi-step production chains стають endgame content. High-value crafted goods >> raw crops.

**Що зробити:**

1. **New Multi-Step Recipes (1 год)**
   - [ ] Tier 1 (вже є): Wheat → Bread, Milk → Cheese
   - [ ] Tier 2 (додати):
     - Wheat → Flour (Mill, 2 min)
     - Flour + Eggs → Cake (Bakery, 5 min)
     - Tomato + Cheese → Pizza (Kitchen, 7 min)
     - Berries + Sugar → Jam (Kitchen, 4 min)
   - [ ] Tier 3 (complex):
     - Flour + Butter + Jam → Croissant (Bakery, 10 min)
     - Bread + Cheese + Tomato → Sandwich (Kitchen, 6 min)
     - Multiple ingredients → Feast (Restaurant, 15 min)

2. **Recipe Config (30 хв)**
   - [ ] Додати нові recipes в `config.js`
   - [ ] Input/Output definitions
   - [ ] Production times
   - [ ] Unlock requirements (level, buildings)
   - [ ] Sell prices (high-value!)

3. **New Buildings (30 хв)**
   - [ ] Mill (unlock level 8) - processes grains
   - [ ] Restaurant (unlock level 12) - complex recipes
   - [ ] Додати в config.js
   - [ ] Purchase prices, requirements

4. **Balance Values (30 хв)**
   - [ ] Raw crop value: $10-50
   - [ ] Tier 1 processed: $100-200 (2x time investment)
   - [ ] Tier 2 processed: $500-800 (multi-ingredient)
   - [ ] Tier 3 processed: $2000+ (complex chains)
   - [ ] Orders для processed goods дають premium rewards

**Файли для редагування:**
- `src/modules/config.js` - recipes, buildings, prices
- `src/modules/game.js` - possible production logic updates
- `src/modules/ui.js` - render new recipes

**Критерії готовності:**
- ✅ 8-10 нових recipes додано
- ✅ Multi-step chains працюють
- ✅ High-value items продаються дорого
- ✅ Orders запрашують crafted goods
- ✅ Late game shifted до management gameplay

---

### Task 7: Special Seeds Reward System

**Пріоритет:** 🟡 HIGH
**Час:** 1.5-2 години
**Статус:** ❌ Не розпочато

**Проблема:**
Special Seeds реалізовані, але їх неможливо отримати в грі (тільки через console).

**Що зробити:**

1. **Drop System від Orders (45 хв)**
   - [ ] Додати drop chance в `fulfillOrder()` в `game.js`
   - [ ] Base chance: 8-12% залежно від trust level
   - [ ] Trust Level 1-2: Common seeds only
   - [ ] Trust Level 3-4: Common + Rare seeds
   - [ ] Trust Level 5: All rarities including Legendary
   - [ ] Express orders: +5% drop chance
   - [ ] Bulk orders: guaranteed 1 seed (random rarity)

2. **Rarity Weights (20 хв)**
   - [ ] Common (50%): Golden Wheat, Instant Carrot
   - [ ] Rare (30%): Giant Tomato, Premium Potato
   - [ ] Epic (15%): Rainbow Berry, Mystic Blueberry
   - [ ] Legendary (5%): Eternal Corn
   - [ ] Weighted random selection based on trust level

3. **Visual Feedback (30 хв)**
   - [ ] Special notification modal при drop
   - [ ] Floating text з rarity color
   - [ ] Animation (sparkle effect)
   - [ ] Show seed icon + name + rarity
   - [ ] "Added to warehouse" confirmation

4. **Alternative Sources (15 хв)**
   - [ ] Level up rewards: 1 random seed per 5 levels (5, 10, 15...)
   - [ ] Token shop: buy specific seeds (expensive, 30-50 tokens)
   - [ ] Crafting recipes: combine crops → seed (advanced)

5. **Warehouse Visual (10 хв)**
   - [ ] Special seeds показуються з rarity border
   - [ ] Color coding в warehouse list
   - [ ] Sort by rarity option

**Файли для редагування:**
- `src/modules/game.js` - fulfillOrder() drop logic
- `src/modules/specialSeeds.js` - rarity weights
- `src/modules/ui.js` - notifications, warehouse display
- `src/modules/tokenShop.js` - add seed purchases
- `css/style.css` - rarity colors, animations

**Критерії готовності:**
- ✅ Seeds drop від orders (8-12% chance)
- ✅ Rarity system працює correctly
- ✅ Visual feedback exciting
- ✅ Multiple sources working
- ✅ Warehouse shows rarity visually

---

### Task 8: Production Dashboard

**Пріоритет:** 🟡 HIGH
**Час:** 1.5-2 години
**Статус:** ❌ Не розпочато

**Проблема:**
З expansion production chains, гравець не бачить overview. Потрібно scroll через buildings.

**Що зробити:**

1. **HTML Structure (20 хв)**
   - [ ] Collapsible panel в top-left або sidebar
   - [ ] Header: "Production Overview" з toggle button
   - [ ] Stats summary: Active Jobs, Completed, Next Finish
   - [ ] Scrollable list container

2. **Render Function (1 год)**
   - [ ] `renderProductionDashboard()` в `ui.js`
   - [ ] Loop через всі `ownedBuildings`
   - [ ] Show активні productions з progress bars
   - [ ] Show queue (if implemented)
   - [ ] Calculate next completion time
   - [ ] Click item → scroll to building

3. **CSS Styling (20 хв)**
   - [ ] Panel background, borders
   - [ ] Collapsible slide animation
   - [ ] Job cards layout
   - [ ] Progress bar colors
   - [ ] Hover effects

4. **Auto-Update (10 хв)**
   - [ ] Update кожну секунду в game loop
   - [ ] Highlight when production ready
   - [ ] Notification badge on panel

**Файли для редагування:**
- `index.html` - panel HTML
- `src/modules/ui.js` - render function
- `src/main.js` - integration в game loop
- `css/style.css` - styling

**Критерії готовності:**
- ✅ Shows all active productions
- ✅ Next completion accurate
- ✅ Progress updates in real-time
- ✅ Collapsible works smoothly
- ✅ Click navigates to building

---

## 🟢 СЕРЕДНІЙ ПРІОРИТЕТ - Наступні тижні (15-25 годин)

### Task 9: Prestige System

**Пріоритет:** 🟢 MEDIUM
**Час:** 4-6 годин
**Статус:** ❌ Не розпочато

**Філософія:**
Коли гравець досягає level 20-30 та має всі unlocks, prestige дає reason to restart з permanent bonuses. Infinite progression loop.

**Що зробити:**

1. **Prestige Currency Design (1 год)**
   - [ ] Назва: "Farm Stars" ⭐ або "Legacy Points"
   - [ ] Формула: `Math.floor(totalEarnings / 100000)` stars
   - [ ] Minimum для prestige: level 15, $500k earned
   - [ ] Calculator показує скільки stars отримаєш
   - [ ] Confirmation modal (WARNING: reset progress!)

2. **Prestige Bonuses (1.5 год)**
   - [ ] Star Shop з permanent upgrades:
     - +10% growth speed (cost: 5 stars, max 10 purchases)
     - +20% harvest yield (cost: 8 stars, max 5 purchases)
     - +15% order rewards (cost: 10 stars, max 8 purchases)
     - Start with 2 automated plots (cost: 15 stars, one-time)
     - Unlock special building (cost: 25 stars)
     - +50% trust gain rate (cost: 12 stars, max 5)
   - [ ] Compound bonuses (stacking multipliers)
   - [ ] Visual: star counter в header

3. **Reset Logic (1 god)**
   - [ ] `prestigeReset()` function
   - [ ] Calculate earned stars
   - [ ] Reset: level, money, XP, field, warehouse, buildings
   - [ ] Keep: prestige stars, permanent bonuses, unlocked special seeds (1 of each)
   - [ ] Add to `player.prestigeLevel` counter
   - [ ] Achievement: "Prestige Master" (prestige 5 times)

4. **State Management (30 хв)**
   - [ ] `player.prestigeStars` - total earned
   - [ ] `player.prestigeLevel` - times prestiged
   - [ ] `player.prestigeBonuses` - active bonuses
   - [ ] Save/Load integration
   - [ ] Migration для existing saves

5. **UI Implementation (1.5 год)**
   - [ ] "Prestige" button в header (unlocked at level 15+)
   - [ ] Modal з:
     - Current stats
     - Stars calculation
     - Preview bonuses
     - Confirm/Cancel buttons
   - [ ] Star Shop modal
     - Grid layout для upgrades
     - Purchase buttons
     - Tooltips з multiplier info
   - [ ] Visual feedback на prestige (animation, confetti)

6. **Balance Testing (30 хв)**
   - [ ] First prestige at ~4-6 hours gameplay
   - [ ] 5-10 stars на перший prestige
   - [ ] Second run швидший (bonuses працюють)
   - [ ] Long-term: 10-20 prestiges feasible

**Файли для створення/редагування:**
- `src/modules/prestige.js` (НОВИЙ)
- `src/modules/state.js` - prestige state
- `src/modules/game.js` - apply prestige bonuses
- `src/modules/ui.js` - prestige UI
- `index.html` - prestige modals
- `css/style.css` - star shop styling

**Критерії готовності:**
- ✅ Prestige unlocks at level 15
- ✅ Stars calculated correctly
- ✅ Reset works (keeps stars + bonuses)
- ✅ Star Shop functional
- ✅ Bonuses apply on restart
- ✅ Multiple prestige runs work
- ✅ Balance feels rewarding

---

### Task 10: Chain Orders / Quest System

**Пріоритет:** 🟢 MEDIUM
**Час:** 3-4 години
**Статус:** ❌ Не розпочато

**Філософія:**
Story-driven engagement. Multi-step quests з narrative. Велика нагорода в кінці.

**Що зробити:**

1. **Quest Definitions (1.5 год)**
   - [ ] 5-7 quest chains:
     - "Wedding Preparation" (5 steps): Bread → Cake → Flowers → Champagne → Feast
     - "Festival Supply" (4 steps): разні crops для village festival
     - "Restaurant Opening" (6 steps): build recipes для new restaurant
   - [ ] Story text для кожного step
   - [ ] Rewards: tokens, special seeds, unique items

2. **Quest Logic (1 год)**
   - [ ] `activeQuests` state
   - [ ] `startQuest(questId)`
   - [ ] `completeQuestStep(questId, stepIndex)`
   - [ ] Unlock next step
   - [ ] Final reward claim

3. **UI (1 час)**
   - [ ] Quest panel/modal
   - [ ] Progress tracker (step 2/5)
   - [ ] Story text display
   - [ ] Rewards preview
   - [ ] Notification при unlock нового quest

4. **Integration (30 хв)**
   - [ ] Quests unlock at certain levels
   - [ ] Some quests repeatable (weekly?)
   - [ ] Track completion history

**Файли:**
- `src/modules/quests.js` (НОВИЙ)
- `src/modules/state.js`, `ui.js`, `game.js`

---

### Task 11: Achievements System

**Пріоритет:** 🟢 MEDIUM
**Час:** 2-3 години
**Статус:** ❌ Не розпочато

**Що зробити:**
- [ ] 30-50 achievements (harvest X crops, earn $Y, level Z)
- [ ] Categories: Farming, Orders, Production, Collection
- [ ] Rewards: tokens, cosmetics, titles
- [ ] Progress tracking
- [ ] Achievement modal/panel
- [ ] Notifications при unlock

---

### Task 12: Weather System (Optional)

**Пріоритет:** 🟢 MEDIUM-LOW
**Час:** 3-4 години

**Що зробити:**
- [ ] Random weather events (rain, sun, storm)
- [ ] Effects: rain = faster growth, sun = higher yield
- [ ] Visual: weather icons, animations
- [ ] Forecast system (plan ahead)

---

### Task 13: Market Events

**Пріоритет:** 🟢 MEDIUM
**Час:** 2-3 години

**Що зробити:**
- [ ] Random events: "High demand for tomatoes! +50% price"
- [ ] Events last 10-30 minutes
- [ ] Notification system
- [ ] Visual highlight в market tab

---

### Task 14: More Crops & Seeds

**Пріоритет:** 🟢 MEDIUM-LOW
**Час:** 2-3 години

**Що зробити:**
- [ ] 10-15 нових crops
- [ ] Seasonal varieties
- [ ] Exotic crops (unlocked late game)
- [ ] Balance prices та growth times

---

## 🔵 НИЗЬКИЙ ПРІОРИТЕТ - Nice-to-have

### Task 15: Harvest Mini-games
### Task 16: Trading Post
### Task 17: Cloud Save
### Task 18: Seasonal Events
### Task 19: Market Speculation
### Task 20: Crop Combo System

---

## 📊 PROGRESS TRACKER

### Критичні (Total: 3-4 год)
- [x] Token Shop UI (2h) - ✅ 100% **DONE** (2025-12-18)
- [x] Active Boosts Display (1h) - ✅ 100% **DONE** (2025-12-18)
- [x] Tooltips (30m) - ✅ 100% **DONE** (2025-12-18)

**Overall Critical Progress: 3/3 (100%)** 🎉

### Високий пріоритет (Total: 6-9 год) - НОВИЙ ПЛАН
- [ ] Warehouse Rebalance (1.5h) - 0%
- [ ] Order Value Buff (30m) - 0%
- [ ] Production Chain Expansion (2.5h) - 0%
- [ ] Special Seeds Rewards (2h) - 0%
- [ ] Production Dashboard (2h) - 0%

**Overall High Priority Progress: 0/5 (0%)**

### Середній пріоритет (Total: 15-25 год)
- [ ] Prestige System (5h) - 0%
- [ ] Chain Orders/Quests (3h) - 0%
- [ ] Achievements (2h) - 0%
- [ ] Market Events (2h) - 0%
- [ ] Weather System (3h) - 0%
- [ ] More Crops (2h) - 0%

**Overall Medium Priority Progress: 0/6 (0%)**

---

## 🎯 RECOMMENDED WORKFLOW

### Тиждень 1 - Quick Wins + Balance (3-4 години)
**День 1:** Warehouse Rebalance + Order Buff (2h)
- Quick config changes
- Immediate impact на balance
- Testing в грі

**День 2:** Special Seeds Rewards (2h)
- Робимо seeds accessible
- High player satisfaction
- Швидка feature

**Goal:** Game feels more balanced, seeds отримуються природньо

---

### Тиждень 2 - Endgame Content (4-5 годин)
**День 1-2:** Production Chain Expansion (2.5h)
- Додаємо 8-10 recipes
- Multi-step chains
- Late game depth

**День 3:** Production Dashboard (2h)
- UI для management
- Quality of life

**Goal:** Endgame стає про strategic management

---

### Тиждень 3 - Infinite Progression (5-6 годин)
**День 1-2:** Prestige System (5h)
- Core system
- Star Shop
- Reset logic
- Testing balance

**День 3:** Testing + Polish
- Перевірити progression curve
- Balance prestige rewards
- Bug fixing

**Goal:** Infinite replayability

---

### Тиждень 4 - Engagement Features (5-7 годин)
**День 1-2:** Chain Orders/Quests (3h)
**День 3:** Achievements (2h)
**День 4:** Market Events (2h)

**Goal:** More variety, engagement hooks

---

## 📝 NOTES

### Перед початком будь-якої задачі:
1. ✅ Прочитати детальний код в `QUICK_FIXES_ROADMAP.md`
2. ✅ Перевірити що всі файли існують
3. ✅ Зробити git commit перед змінами
4. ✅ Тестувати після кожного кроку

### Після завершення задачі:
1. ✅ Перевірити всі критерії готовності
2. ✅ Протестувати в браузері
3. ✅ Оновити цей TODO.md (mark as done)
4. ✅ Git commit з описовим message
5. ✅ Update PROGRESS TRACKER

### Testing Checklist:
- [ ] Відкрити гру в Chrome
- [ ] Clear localStorage (fresh start)
- [ ] Пройти tutorial
- [ ] Тестувати нову фічу
- [ ] Перевірити edge cases
- [ ] Перевірити на mobile (responsive)

---

## 🐛 KNOWN BUGS (не критичні)

1. Order timers іноді десинхронізуються
2. Warehouse scroll не плавний на довгих списках
3. Floating text overlap при багатьох одночасних збоpax
4. Modal backdrop click не завжди працює
5. Language switch не оновлює деякі dynamic strings

**Виправити після critical tasks.**

---

## 💡 FEATURE IDEAS (Backlog)

- Seasonal skins для crops
- Pet system (помічники на фермі)
- Farm decorations
- NPC visitors з random quests
- Cooking system (recipes з multiple ingredients)
- Trading caravan (купівля рідкісних items)
- Farm expansion (купівля нових земель)
- Multiplayer co-op (допомагати friends)

---

**Last Updated:** 2025-12-18
**Next Review:** Після Тижня 1 (Warehouse + Seeds)
**Priority:** Focus on organic engagement, NOT mobile F2P mechanics!

---

## 📌 PHILOSOPHY SUMMARY

**✅ DO:**
- Warehouse bottleneck (natural limit)
- Production chains (strategic depth)
- Prestige system (infinite progression)
- Organic rewards (special seeds from gameplay)
- Player choice and optimization

**❌ DON'T:**
- Energy systems (artificial gates)
- Daily login rewards (FOMO mechanics)
- Time-limited events (pressure)
- Pay-to-skip timers
- Forced engagement hooks

**Goal:** Make incremental game яка RESPECTS player's time and choices!
