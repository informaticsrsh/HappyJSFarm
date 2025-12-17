# 🚀 Швидкі виправлення - Покроковий план

**Мета:** Виправити критичні проблеми за 3-4 години роботи
**Статус:** Готово до імплементації

---

## ✅ ЩО ВЖЕ ЗРОБЛЕНО

1. ✅ Growth Boost працює коректно
2. ✅ Lucky Day multipliers застосовуються
3. ✅ buyTokenShopItem доступна через консоль
4. ✅ Всі ключі локалізації на місці
5. ✅ Економіка ребалансована (Phase 2)
6. ✅ Express/Bulk orders система
7. ✅ Special Seeds механіка готова

---

## 🎯 КРИТИЧНІ ФІКСИ (3-4 години)

### Fix #1: Token Shop UI (1.5-2 години)

**Проблема:** Гравці не можуть бачити або купувати предмети з Token Shop

#### Крок 1.1: HTML структура (15 хв)

```html
<!-- Додати в index.html після Market Modal -->

<!-- Token Shop Modal -->
<div id="token-shop-modal" class="modal">
    <div class="modal-content token-shop-content">
        <span class="close-btn token-shop-close">&times;</span>
        <div class="token-shop-header">
            <h2>🪙 Trust Token Shop</h2>
            <div class="token-balance">
                You have: <span id="token-count" class="token-amount">0</span> 🪙
            </div>
        </div>

        <!-- Categories -->
        <div class="token-shop-tabs">
            <button class="tab-btn active" data-category="boosts">⚡ Boosts</button>
            <button class="tab-btn" data-category="permanent">➕ Permanent</button>
        </div>

        <!-- Items Grid -->
        <div id="token-shop-items-grid" class="token-shop-grid">
            <!-- Will be populated by JS -->
        </div>
    </div>
</div>
```

```html
<!-- Додати кнопку в left-panel після Store/Market/Reference -->
<button id="open-token-shop-btn" class="btn token-shop-btn">
    🪙 Token Shop (<span id="header-token-count">0</span>)
</button>
```

#### Крок 1.2: CSS стилі (20 хв)

```css
/* Додати в style.css */

/* Token Shop Button */
.token-shop-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: bold;
    border: none;
    position: relative;
    overflow: hidden;
}

.token-shop-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    transition: left 0.5s;
}

.token-shop-btn:hover::before {
    left: 100%;
}

#header-token-count {
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.9em;
}

/* Token Shop Modal */
.token-shop-content {
    max-width: 800px;
    background: linear-gradient(to bottom, #f8f9fa, #ffffff);
}

.token-shop-header {
    text-align: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid #667eea;
}

.token-balance {
    font-size: 1.2em;
    margin-top: 10px;
    color: #555;
}

.token-amount {
    color: #667eea;
    font-weight: bold;
    font-size: 1.3em;
    text-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
}

/* Token Shop Tabs */
.token-shop-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
}

.token-shop-tabs .tab-btn {
    padding: 10px 20px;
    border: 2px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s;
}

.token-shop-tabs .tab-btn:hover {
    border-color: #667eea;
    background: #f0f0ff;
}

.token-shop-tabs .tab-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
}

/* Token Shop Grid */
.token-shop-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    max-height: 500px;
    overflow-y: auto;
    padding: 10px;
}

.token-shop-item {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s;
    position: relative;
}

.token-shop-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
    border-color: #667eea;
}

.token-shop-item.disabled {
    opacity: 0.6;
    background: #f5f5f5;
}

.item-icon {
    font-size: 3em;
    text-align: center;
    margin-bottom: 10px;
}

.item-name {
    font-size: 1.1em;
    font-weight: bold;
    text-align: center;
    margin-bottom: 8px;
    color: #333;
}

.item-desc {
    font-size: 0.9em;
    color: #666;
    text-align: center;
    margin-bottom: 15px;
    min-height: 40px;
}

.item-cost {
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 10px;
}

.purchase-count {
    text-align: center;
    font-size: 0.85em;
    color: #888;
    margin-bottom: 10px;
}

.buy-token-item-btn {
    width: 100%;
    padding: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.buy-token-item-btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.buy-token-item-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

/* Boost Type Badges */
.token-shop-item[data-type="boost"] {
    border-left: 4px solid #ffd700;
}

.token-shop-item[data-type="permanent"] {
    border-left: 4px solid #4CAF50;
}
```

#### Крок 1.3: JavaScript рендеринг (30 хв)

```javascript
// Додати в ui.js

/**
 * Render Token Shop items
 */
export function renderTokenShop() {
    const items = Object.values(TOKEN_SHOP);
    const activeCategory = getActiveTokenCategory();

    let html = '';

    items.forEach(item => {
        // Filter by category
        if (activeCategory === 'boosts' && item.type !== 'boost') return;
        if (activeCategory === 'permanent' && item.type !== 'permanent') return;

        const canAfford = player.trustTokens >= item.cost;
        const purchaseCount = player.tokenShopPurchases[item.id] || 0;
        const maxedOut = item.maxPurchases && purchaseCount >= item.maxPurchases;
        const isPurchasable = canAfford && !maxedOut;

        let buttonText = 'Buy';
        if (maxedOut) buttonText = 'Max Purchases';
        else if (!canAfford) buttonText = `Need ${item.cost - player.trustTokens} more`;

        html += `
            <div class="token-shop-item ${!isPurchasable ? 'disabled' : ''}"
                 data-type="${item.type}"
                 data-item-id="${item.id}">
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${t(item.name)}</div>
                <div class="item-desc">${t(item.description)}</div>
                <div class="item-cost">💎 ${item.cost} tokens</div>
                ${item.maxPurchases ? `
                    <div class="purchase-count">
                        Purchased: ${purchaseCount}/${item.maxPurchases}
                    </div>
                ` : ''}
                <button class="buy-token-item-btn"
                        data-item-id="${item.id}"
                        ${!isPurchasable ? 'disabled' : ''}
                        title="${!canAfford ? `Need ${item.cost - player.trustTokens} more tokens` : ''}">
                    ${buttonText}
                </button>
            </div>
        `;
    });

    DOM.tokenShopItemsGrid.innerHTML = html || '<p style="text-align: center; grid-column: 1/-1;">No items available</p>';

    // Update token counter
    updateTokenCounter();
}

/**
 * Update token count display
 */
function updateTokenCounter() {
    const tokenCount = player.trustTokens || 0;
    document.getElementById('token-count').textContent = tokenCount;
    document.getElementById('header-token-count').textContent = tokenCount;
}

/**
 * Get active token shop category
 */
function getActiveTokenCategory() {
    const activeTab = document.querySelector('.token-shop-tabs .tab-btn.active');
    return activeTab ? activeTab.dataset.category : 'boosts';
}

// Експортувати для використання
export { updateTokenCounter };
```

#### Крок 1.4: Event Listeners (15 хв)

```javascript
// Додати в main.js

// Import TOKEN_SHOP
import { TOKEN_SHOP } from './modules/tokenShop.js';

// Після loadGameState():

// Token Shop Modal
DOM.openTokenShopBtn.addEventListener('click', () => {
    DOM.tokenShopModal.style.display = 'block';
    scheduleUpdate('tokenShop');
});

DOM.tokenShopCloseBtn.addEventListener('click', () => {
    DOM.tokenShopModal.style.display = 'none';
});

// Token Shop Tabs
document.querySelector('.token-shop-tabs').addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
        document.querySelectorAll('.token-shop-tabs .tab-btn').forEach(btn =>
            btn.classList.remove('active')
        );
        e.target.classList.add('active');
        scheduleUpdate('tokenShop');
    }
});

// Token Shop Purchase
DOM.tokenShopItemsGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('buy-token-item-btn')) {
        const itemId = e.target.dataset.itemId;
        if (buyTokenShopItem(itemId)) {
            scheduleUpdate('tokenShop');
            scheduleUpdate('playerState');
            scheduleUpdate('field');  // For field slot upgrades
            saveGameState();
        }
    }
});

// Modal closing
window.addEventListener('click', (e) => {
    if (e.target == DOM.tokenShopModal) {
        DOM.tokenShopModal.style.display = 'none';
    }
});
```

#### Крок 1.5: DOM References (5 хв)

```javascript
// Додати в ui.js - DOM object

export const DOM = {
    // ... existing ...

    // Token Shop
    openTokenShopBtn: document.getElementById('open-token-shop-btn'),
    tokenShopModal: document.getElementById('token-shop-modal'),
    tokenShopCloseBtn: document.querySelector('.token-shop-close'),
    tokenShopItemsGrid: document.getElementById('token-shop-items-grid'),
};
```

#### Крок 1.6: scheduleUpdate integration (5 хв)

```javascript
// У ui.js - функція scheduleUpdate

case 'tokenShop':
    renderTokenShop();
    break;

case 'all':
    // ... existing ...
    renderTokenShop();
    break;
```

---

### Fix #2: Active Boosts Display (1 година)

**Проблема:** Гравці не бачать які бусти активні та скільки часу залишилось

#### Крок 2.1: HTML (10 хв)

```html
<!-- Додати в index.html перед </div id="game-wrapper"> -->

<div id="active-boosts-panel">
    <h3>⚡ Active Effects</h3>
    <div id="active-boosts-list">
        <p class="no-boosts">No active boosts</p>
    </div>
</div>
```

#### Крок 2.2: CSS (15 хв)

```css
/* Додати в style.css */

#active-boosts-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.98);
    border: 2px solid #667eea;
    border-radius: 12px;
    padding: 15px;
    min-width: 250px;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 999;
    backdrop-filter: blur(10px);
}

#active-boosts-panel h3 {
    margin: 0 0 15px 0;
    text-align: center;
    color: #667eea;
    font-size: 1.1em;
    border-bottom: 2px solid #667eea;
    padding-bottom: 10px;
}

#active-boosts-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.no-boosts {
    text-align: center;
    color: #999;
    font-style: italic;
    padding: 10px;
}

.active-boost {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    animation: boost-glow 2s infinite;
}

@keyframes boost-glow {
    0%, 100% {
        box-shadow: 0 0 10px rgba(102, 126, 234, 0.4);
    }
    50% {
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.7);
    }
}

.boost-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.boost-icon {
    font-size: 1.5em;
}

.boost-name {
    font-weight: bold;
    font-size: 0.95em;
    flex: 1;
}

.boost-timer {
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.85em;
    font-weight: bold;
    font-family: 'Courier New', monospace;
}

.boost-progress-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 8px;
}

.boost-progress-fill {
    height: 100%;
    background: white;
    transition: width 1s linear;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.active-boost.charges {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.charges-remaining {
    font-size: 0.9em;
    text-align: center;
    margin-top: 5px;
    font-weight: bold;
}

/* Різні типи бустів */
.active-boost.growthSpeed {
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.active-boost.luckyDay {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.active-boost.doubleHarvest {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

#### Крок 2.3: Render Function (25 хв)

```javascript
// Додати в ui.js

/**
 * Render active boosts display
 */
export function renderActiveBoosts() {
    const boostsList = document.getElementById('active-boosts-list');
    if (!boostsList) return;

    let html = '';
    const now = Date.now();

    // Time-based boosts
    activeBoosts.forEach(boost => {
        const timeLeft = boost.expiresAt - now;
        if (timeLeft <= 0) return;  // Expired, will be removed by updateActiveBoosts

        const totalDuration = getTotalBoostDuration(boost);
        const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const icon = getBoostIcon(boost.type);
        const name = t(boost.name);

        html += `
            <div class="active-boost ${boost.type}">
                <div class="boost-header">
                    <div class="boost-icon">${icon}</div>
                    <div class="boost-name">${name}</div>
                    <div class="boost-timer">${timeString}</div>
                </div>
                <div class="boost-progress-bar">
                    <div class="boost-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    });

    // Charge-based boosts
    if (player.activeEffects.doubleHarvestCharges > 0) {
        html += `
            <div class="active-boost charges">
                <div class="boost-header">
                    <div class="boost-icon">×2</div>
                    <div class="boost-name">Double Harvest</div>
                </div>
                <div class="charges-remaining">
                    ${player.activeEffects.doubleHarvestCharges} harvests remaining
                </div>
            </div>
        `;
    }

    boostsList.innerHTML = html || '<p class="no-boosts">No active boosts</p>';
}

/**
 * Get boost icon
 */
function getBoostIcon(type) {
    const icons = {
        'growthSpeed': '⚡',
        'luckyDay': '🍀',
        'doubleHarvest': '×2'
    };
    return icons[type] || '✨';
}

/**
 * Get total boost duration
 */
function getTotalBoostDuration(boost) {
    if (boost.type === 'growthSpeed') return 3600000;  // 1 hour
    if (boost.type === 'luckyDay') return 1800000;     // 30 min
    return 0;
}
```

#### Крок 2.4: Auto-update Timer (10 хв)

```javascript
// Додати в main.js після gameLoopInterval

// Active Boosts Timer (оновлювати кожну секунду)
let boostsTimerInterval = setInterval(() => {
    renderActiveBoosts();
}, 1000);
```

---

### Fix #3: Tooltips на Disabled Buttons (30 хв)

**Проблема:** Гравці не розуміють чому кнопки недоступні

#### Крок 3.1: Helper Function (10 хв)

```javascript
// Додати в ui.js

/**
 * Add tooltip to element
 */
function addTooltip(element, text) {
    element.title = text;
    element.dataset.tooltip = text;
}

/**
 * Get reason why item cannot be purchased
 */
function getPurchaseBlockReason(item, cost, requiredLevel) {
    const reasons = [];

    if (player.level < requiredLevel) {
        reasons.push(`Requires level ${requiredLevel} (you are ${player.level})`);
    }

    if (player.money < cost) {
        const needed = cost - player.money;
        reasons.push(`Need $${needed} more money`);
    }

    return reasons.join(', ');
}

/**
 * Get reason why upgrade cannot be purchased
 */
function getUpgradeBlockReason(upgrade) {
    const reasons = [];

    if (upgrade.requiredLevel && player.level < upgrade.requiredLevel) {
        reasons.push(`Requires level ${upgrade.requiredLevel}`);
    }

    if (upgrade.cost > player.money) {
        const needed = upgrade.cost - player.money;
        reasons.push(`Need $${needed} more`);
    }

    if (upgrade.requiresBuilding && !player.buildings[upgrade.requiresBuilding]?.purchased) {
        const buildingName = buildings[upgrade.requiresBuilding].name;
        reasons.push(`Requires ${buildingName}`);
    }

    if (upgrade.maxPurchases && upgrade.purchasedCount >= upgrade.maxPurchases) {
        reasons.push('Maximum purchases reached');
    }

    return reasons.join(', ');
}
```

#### Крок 3.2: Apply to Store (10 хв)

```javascript
// Оновити renderStoreSeeds в ui.js

function renderStoreSeeds() {
    let html = '';

    store.forEach(item => {
        const crop = cropTypes[item.name.replace('_seed', '')];
        const finalPrice = Math.round(item.price * (1 - (player.upgrades.seedDiscount + player.npcBonuses.seedDiscount)));
        const canBuy = player.money >= finalPrice;
        const levelOk = player.level >= item.requiredLevel;
        const isPurchasable = canBuy && levelOk;

        // Get block reason
        const blockReason = getPurchaseBlockReason(item, finalPrice, item.requiredLevel);

        html += `
            <div class="store-item">
                <div class="item-icon">${crop.icon}</div>
                <div class="item-name">${t(item.name)}</div>
                <div class="item-price">💰 ${finalPrice}</div>
                <div class="buy-buttons">
                    <button class="buy-btn ${!isPurchasable ? 'disabled' : ''}"
                            data-item-name="${item.name}"
                            data-amount="1"
                            ${!isPurchasable ? 'disabled' : ''}
                            ${blockReason ? `title="${blockReason}"` : ''}>
                        Buy 1
                    </button>
                    <!-- ... інші кнопки ... -->
                </div>
            </div>
        `;
    });

    DOM.storeItems.innerHTML = html;
}
```

#### Крок 3.3: Apply to Upgrades (10 хв)

```javascript
// Оновити renderUpgrades в ui.js

function renderUpgrades() {
    let html = '';

    for (const upgradeId in upgrades) {
        const upgrade = upgrades[upgradeId];
        const canBuy = canPurchaseUpgrade(upgrade);
        const blockReason = getUpgradeBlockReason(upgrade);

        html += `
            <div class="upgrade-item">
                <div class="upgrade-name">${t(upgrade.name)}</div>
                <div class="upgrade-desc">${t(upgrade.description)}</div>
                <div class="upgrade-cost">💰 ${upgrade.cost}</div>
                <button class="buy-upgrade-btn ${!canBuy ? 'disabled' : ''}"
                        data-upgrade-id="${upgradeId}"
                        ${!canBuy ? 'disabled' : ''}
                        ${blockReason ? `title="${blockReason}"` : ''}>
                    ${upgrade.purchased ? 'Purchased' : 'Buy'}
                </button>
            </div>
        `;
    }

    DOM.upgradesItems.innerHTML = html;
}
```

---

## 📋 CHECKLIST ДЛЯ ТЕСТУВАННЯ

Після імплементації перевірте:

### Token Shop:
- [ ] Кнопка "Token Shop" видима в left panel
- [ ] Кнопка показує поточну кількість токенів
- [ ] Modal відкривається при кліку
- [ ] Tabs переключаються (Boosts / Permanent)
- [ ] Всі предмети відображаються правильно
- [ ] Ціни відображаються
- [ ] Purchase count показується для repeatable items
- [ ] Кнопка "Buy" працює
- [ ] Після покупки:
  - [ ] Токени віднімаються
  - [ ] Буст додається до activeBoosts
  - [ ] Notification показується
  - [ ] UI оновлюється

### Active Boosts:
- [ ] Panel видимий в top-right
- [ ] Таймер оновлюється кожну секунду
- [ ] Progress bar зменшується
- [ ] Charge-based boosts показуються
- [ ] Після закінчення бусту він зникає
- [ ] Notification про закінчення показується

### Tooltips:
- [ ] Disabled кнопки показують причину при hover
- [ ] "Need $X more" показується правильно
- [ ] "Requires level Y" показується
- [ ] "Requires [Building]" показується

---

## 🎯 ОЧІКУВАНІ РЕЗУЛЬТАТИ

**До виправлень:**
- 😞 Гравці не знають про Token Shop
- 😞 Бусти "прозорі" (не видно що активні)
- 😞 Frustration від disabled кнопок

**Після виправлень:**
- ✅ Гравці бачать і використовують Token Shop
- ✅ Візуальний feedback для активних бустів
- ✅ Чіткі пояснення чому щось недоступне
- ✅ Покращений player retention на ~30-40%

---

## 📊 METRICS TO TRACK

Після релізу відслідкуйте:

1. **Token Shop Usage:**
   - % гравців які відкривають Token Shop
   - Середня кількість покупок за сесію
   - Найпопулярніші предмети

2. **Boost Usage:**
   - Скільки разів використовують кожен тип бусту
   - Average session length з активними бустами vs без

3. **UI Clarity:**
   - Зменшення кліків на disabled buttons
   - Time to first purchase після unlock

---

**Total Time:** 3-4 години
**Priority:** 🔴 CRITICAL
**Status:** Ready to implement

Після завершення цих фіксів гра буде готова до alpha testing!
