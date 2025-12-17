# 📋 TODO LIST - Happy JS Farm

**Останнє оновлення:** 2025-12-17
**Статус проекту:** MVP Complete, потребує критичних фіксів

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

## 🟡 ВИСОКИЙ ПРІОРИТЕТ - Наступний тиждень (8-12 годин)

Ці задачі важливі для балансу та retention.

### ✅ Task 4: Energy System

**Пріоритет:** 🟡 HIGH
**Час:** 3-4 години
**Статус:** ❌ Не розпочато

**Проблема:**
Automation дозволяє AFK farming. Гравець може заробити $822k за ніч без участі.

**Що зробити:**

1. **System Design (30 хв)**
   - [ ] Визначити energy costs:
     - Plant: 5 energy
     - Harvest: 3 energy
     - Start Production: 10 energy
     - Automated Plot: 2 energy/min (пасивне споживання)
   - [ ] Max energy: 100
   - [ ] Regen rate: 1 per minute
   - [ ] Offline cap: 50 energy

2. **State Management (30 хв)**
   - [ ] Додати `player.energy` в `state.js`
   - [ ] Додати `player.maxEnergy` в `state.js`
   - [ ] Додати `lastEnergyRegen` timestamp
   - [ ] Save/Load integration

3. **Core Functions (1 год)**
   - [ ] `consumeEnergy(amount)` - витратити energy
   - [ ] `hasEnergy(amount)` - перевірка
   - [ ] `regenerateEnergy()` - called в gameTick
   - [ ] Apply до `plantSeed()`, `harvestCrop()`, `startProduction()`
   - [ ] Block actions якщо не вистачає energy

4. **UI (1 год)**
   - [ ] Energy bar в player stats (як XP bar)
   - [ ] Show "⚡ 75/100"
   - [ ] Color coding: green > 50, yellow 20-50, red < 20
   - [ ] Tooltip показує regen rate
   - [ ] Warning notification при 0 energy

5. **Automation Cost (30 хв)**
   - [ ] Passive drain для automated plots
   - [ ] Update energy кожну хвилину
   - [ ] Warning якщо energy закінчується
   - [ ] Auto-pause automation при 0 energy?

6. **Balance Testing (30 хв)**
   - [ ] Тестувати чи можна грати нормально
   - [ ] Adjust costs якщо занадто harsh
   - [ ] Перевірити regen rate

**Файли для створення/редагування:**
- `src/modules/energy.js` (НОВИЙ)
- `src/modules/state.js` - додати energy state
- `src/modules/game.js` - інтеграція
- `src/modules/ui.js` - energy bar
- `css/style.css` - energy bar стилі

**Критерії готовності:**
- ✅ Energy витрачається при діях
- ✅ Regenerates 1/min
- ✅ UI показує поточну кількість
- ✅ Actions blocked при 0 energy
- ✅ Automation споживає energy пасивно

---

### ✅ Task 5: Daily Challenges System

**Пріоритет:** 🟡 HIGH
**Час:** 2-3 години
**Статус:** ❌ Не розпочато

**Проблема:**
Немає daily engagement механіки. Гравці не мають причини повертатись щодня.

**Що зробити:**

1. **Challenge Definitions (30 хв)**
   - [ ] Створити файл `src/modules/challenges.js`
   - [ ] Визначити 10-15 різних challenges:
     - "Harvest 50 crops today"
     - "Complete 10 orders today"
     - "Earn $10,000 today"
     - "Produce 20 items today"
     - "Reach level X"
     - "Use 3 boosts"
   - [ ] Різні tier складності
   - [ ] Різні rewards (tokens, XP, money, special seeds)

2. **State Management (30 хв)**
   - [ ] `player.dailyChallenges` - активні challenges
   - [ ] `player.completedChallenges` - історія
   - [ ] `lastChallengeReset` timestamp
   - [ ] Progress tracking для кожного

3. **Core Logic (1 год)**
   - [ ] `generateDailyChallenges()` - 3 random challenges
   - [ ] `updateChallengeProgress(type, amount)`
   - [ ] `checkChallengeCompletion()`
   - [ ] `claimChallengeReward(challengeId)`
   - [ ] Reset at midnight (local time)
   - [ ] Integration points в game actions

4. **UI (1 год)**
   - [ ] Panel або modal для challenges
   - [ ] Show active challenges (3)
   - [ ] Progress bars для кожного
   - [ ] Reward display
   - [ ] Claim button коли completed
   - [ ] Visual feedback при completion

**Файли для створення/редагування:**
- `src/modules/challenges.js` (НОВИЙ)
- `src/modules/state.js` - state
- `src/modules/game.js` - progress tracking
- `src/modules/ui.js` - UI
- `index.html` - challenges panel
- `css/style.css` - стилі

**Критерії готовності:**
- ✅ 3 challenges generate щодня
- ✅ Progress tracks автоматично
- ✅ Rewards claimable
- ✅ Resets at midnight
- ✅ Visual feedback працює

---

### ✅ Task 6: Production Dashboard

**Пріоритет:** 🟡 HIGH
**Час:** 2 години
**Статус:** ❌ Не розпочато

**Проблема:**
Гравець не бачить overview всіх активних виробництв. Потрібно scroll buildings.

**Що зробити:**

1. **HTML Structure (20 хв)**
   - [ ] Створити collapsible panel
   - [ ] Stats row (Active Jobs, In Queue, Next Completion)
   - [ ] Jobs list container

2. **Render Function (1 год)**
   - [ ] `renderProductionDashboard()` в `ui.js`
   - [ ] Loop через всі buildings
   - [ ] Count active jobs та queue
   - [ ] Find next completion time
   - [ ] Render job items з progress bars
   - [ ] Show building name, recipe, time left

3. **CSS (30 хв)**
   - [ ] Panel styling
   - [ ] Collapsible animation
   - [ ] Job items layout
   - [ ] Progress bars
   - [ ] Stats display

4. **Integration (10 хв)**
   - [ ] Update при production changes
   - [ ] Toggle collapse functionality

**Файли для редагування:**
- `index.html` - panel HTML
- `src/modules/ui.js` - render function
- `css/style.css` - стилі

**Критерії готовності:**
- ✅ Shows all active productions
- ✅ Next completion time accurate
- ✅ Progress bars update
- ✅ Collapsible працює

---

### ✅ Task 7: Special Seeds Reward System

**Пріоритет:** 🟡 HIGH
**Час:** 1-2 години
**Статус:** ❌ Не розпочато

**Проблема:**
Special Seeds реалізовані, але їх неможливо отримати в грі (тільки через console).

**Що зробити:**

1. **Reward Logic (45 хв)**
   - [ ] Додати drop chance в `fulfillOrder()` в `game.js`
   - [ ] 5-10% chance залежно від trust level
   - [ ] Higher trust = better seeds
   - [ ] Level 4+: rare seeds
   - [ ] Level 5: epic/legendary seeds

2. **Rarity System (30 хв)**
   - [ ] Common (50%): Golden Wheat, Instant Carrot
   - [ ] Rare (30%): Giant Tomato, Premium Potato
   - [ ] Epic (15%): Rainbow Berry, Mystic Blueberry
   - [ ] Legendary (5%): Eternal Corn

3. **Visual Feedback (30 хв)**
   - [ ] Special notification при drop
   - [ ] Floating text з rarity color
   - [ ] Звук? (optional)
   - [ ] Показати що отримали в warehouse

4. **Alternative Sources (15 хв)**
   - [ ] Level up rewards (1 seed per 5 levels)
   - [ ] Daily challenge rewards
   - [ ] Token shop (expensive)

**Файли для редагування:**
- `src/modules/game.js` - fulfillOrder()
- `src/modules/specialSeeds.js` - rarity logic
- `src/modules/ui.js` - notifications

**Критерії готовності:**
- ✅ Seeds drop від orders
- ✅ Rarity system працює
- ✅ Visual feedback показується
- ✅ Multiple sources working

---

## 🟢 СЕРЕДНІЙ ПРІОРИТЕТ - Наступний місяць (20-30 годин)

### Task 8: Weather System (4-6 годин)
### Task 9: Disease/Pest System (3-4 години)
### Task 10: Achievements (3-4 години)
### Task 11: Prestige System (6-8 годин)
### Task 12: Leaderboards (2-3 години)
### Task 13: XP Curve Rebalance (1 година)
### Task 14: More Crops (2-3 години)

**Деталі:** Див. `GAME_WEAKNESSES_ANALYSIS.md` - Категорія 5

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

### Високий пріоритет (Total: 8-12 год)
- [ ] Energy System (4h) - 0%
- [ ] Daily Challenges (3h) - 0%
- [ ] Production Dashboard (2h) - 0%
- [ ] Special Seeds Rewards (2h) - 0%

**Overall High Priority Progress: 0/4 (0%)**

---

## 🎯 RECOMMENDED WORKFLOW

### Week 1 - Critical Fixes
**Day 1-2:** Token Shop UI + Active Boosts (3h)
**Day 3:** Tooltips + Testing (1h)
**Goal:** Playable MVP ready

### Week 2 - Balance
**Day 1-2:** Energy System (4h)
**Day 3-4:** Daily Challenges (3h)
**Day 5:** Testing + Balance

### Week 3 - Polish
**Day 1:** Production Dashboard (2h)
**Day 2:** Special Seeds Rewards (2h)
**Day 3-5:** Bug fixing + Testing

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

**Last Updated:** 2025-12-17
**Next Review:** Після завершення критичних tasks
**Priority:** Focus on 🔴 CRITICAL first!
