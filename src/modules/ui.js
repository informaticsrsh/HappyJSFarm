import { t } from './localization.js';
import { player, field, warehouse, marketState, customers } from './state.js';
import { NUM_ROWS, NUM_COLS, store, cropTypes, upgrades, customerConfig, buildings } from './config.js';

export const DOM = {
    fieldGrid: document.getElementById('field-grid'),
    warehouseItems: document.getElementById('warehouse-items'),
    orderItems: document.getElementById('order-items'),
    storeItems: document.getElementById('store-items'),
    storeModal: document.getElementById('store-modal'),
    openStoreBtn: document.getElementById('open-store-btn'),
    storeCloseBtn: document.querySelector('.store-close'),
    refModal: document.getElementById('ref-modal'),
    openRefBtn: document.getElementById('open-ref-btn'),
    refCloseBtn: document.querySelector('.ref-close'),
    refContent: document.getElementById('ref-content'),
    marketModal: document.getElementById('market-modal'),
    openMarketBtn: document.getElementById('open-market-btn'),
    marketCloseBtn: document.querySelector('.market-close'),
    marketItems: document.getElementById('market-items'),
    langEnBtn: document.getElementById('lang-en'),
    langUkBtn: document.getElementById('lang-uk'),
    mainTitle: document.getElementById('main-title'),
    warehouseTitle: document.querySelector('#warehouse-container h2'),
    marketTitle: document.querySelector('#market-modal h2'),
    refTitle: document.querySelector('#ref-modal h2'),
    fieldTitle: document.querySelector('#field-container h2'),
    buildingsContainer: document.getElementById('buildings-container'),
    buildingsGrid: document.getElementById('buildings-grid'),
    // Store tabs
    storeTabs: document.querySelector('.store-tabs'),
    seedsContent: document.getElementById('seeds-content'),
    productionContent: document.getElementById('production-content'),
    upgradesContent: document.getElementById('upgrades-content'),
    productionItems: document.getElementById('production-items'),
    upgradesItems: document.getElementById('upgrades-items'),
    seedsTabBtn: document.getElementById('seeds-tab-btn'),
    productionTabBtn: document.getElementById('production-tab-btn'),
    upgradesTabBtn: document.getElementById('upgrades-tab-btn'),
    // Dev elements
    devPanel: document.querySelector('.dev-panel'),
    devMoneyBtn: document.getElementById('dev-money-btn'),
    devOrderBtn: document.getElementById('dev-order-btn'),
    devAddAllBtn: document.getElementById('dev-add-all-btn'),
    devXpBtn: document.getElementById('dev-xp-btn'),
    moneyDisplay: document.getElementById('money-display'),
    levelDisplay: document.getElementById('level-display'),
    xpBarContainer: document.getElementById('xp-bar-container'),
    xpBar: document.getElementById('xp-bar'),
    xpText: document.getElementById('xp-text'),
    bonusDisplay: document.getElementById('bonus-display'),
    notificationBanner: document.getElementById('notification-banner'),
    levelUpModal: document.getElementById('level-up-modal'),
    levelUpTitle: document.getElementById('level-up-title'),
    levelUpUnlocks: document.getElementById('level-up-unlocks'),
    levelUpCloseBtn: document.querySelector('.level-up-close')
};

let notificationTimeout;

export function showNotification(message) {
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    DOM.notificationBanner.textContent = message;
    DOM.notificationBanner.classList.add('show');

    notificationTimeout = setTimeout(() => {
        DOM.notificationBanner.classList.remove('show');
    }, 3000);
}

function getIconForItem(itemName) {
    if (itemName.endsWith('_seed')) {
        const cropName = itemName.replace('_seed', '');
        return cropTypes[cropName]?.seed_icon || '🌰';
    } else {
        return cropTypes[itemName]?.icon || '📦';
    }
}

function renderField() {
    DOM.fieldGrid.innerHTML = '';
    DOM.fieldGrid.style.gridTemplateRows = `repeat(${field.length}, 50px)`;
    DOM.fieldGrid.style.gridTemplateColumns = `repeat(${field[0].length}, 50px)`;

    for (let r = 0; r < field.length; r++) {
        for (let c = 0; c < field[0].length; c++) {
            const plot = document.createElement('div');
            plot.classList.add('plot');
            plot.dataset.row = r;
            plot.dataset.col = c;

            const cell = field[r][c];
            if (cell.crop) {
                plot.textContent = cropTypes[cell.crop].visuals[cell.growthStage];
                plot.classList.add(cell.crop); // Add class for crop color
            } else if (cell.autoCrop) {
                plot.textContent = cropTypes[cell.autoCrop].icon; // Show icon on empty auto plot
            }
            else {
                plot.textContent = '🟫';
            }

            if (cell.autoCrop) {
                plot.classList.add('automated-plot', `automated-${cell.autoCrop}`);
            }
            DOM.fieldGrid.appendChild(plot);
        }
    }
}

function renderWarehouse() {
    DOM.warehouseItems.innerHTML = '';
    for (const item in warehouse) {
        if (warehouse[item] > 0) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.classList.add(item.replace(/_/g, '-'));
            const icon = getIconForItem(item);
            itemDiv.textContent = t('warehouse_item', {
                icon,
                itemName: t(item),
                amount: warehouse[item]
            });
            if (item.endsWith('_seed')) {
                itemDiv.dataset.seed = item;
                if (player.selectedSeed === item) {
                    itemDiv.classList.add('selected');
                }
            }
            DOM.warehouseItems.appendChild(itemDiv);
        }
    }
}

function renderStore() {
    DOM.storeItems.innerHTML = '';
    store
        .filter(item => player.level >= (item.requiredLevel || 1))
        .forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.classList.add(item.name.replace(/_/g, '-'));
        const icon = getIconForItem(item.name);
        const finalPrice = Math.round(item.price * (1 - player.upgrades.seedDiscount));

        let priceHtml = `$${item.price}`;
        if (finalPrice < item.price) {
            priceHtml = `<del>$${item.price}</del> <ins>$${finalPrice}</ins>`;
        }

        itemDiv.innerHTML = `
            <div class="store-item-info">
                ${icon} ${t(item.name)}
                <span>${priceHtml}</span>
            </div>
            <div class="store-actions">
                <input type="number" class="buy-amount-input" min="1" value="1" style="width: 50px;">
                <button class="btn buy-btn" data-item-name="${item.name}" data-amount="custom">${t('btn_buy')}</button>
                <button class="btn buy-btn" data-item-name="${item.name}" data-amount="10">10</button>
                <button class="btn buy-btn" data-item-name="${item.name}" data-amount="100">100</button>
                <button class="btn buy-btn" data-item-name="${item.name}" data-amount="max">${t('btn_max')}</button>
            </div>
        `;
        DOM.storeItems.appendChild(itemDiv);
    });
}

function renderReference() {
    DOM.refContent.innerHTML = '';
    Object.keys(cropTypes).forEach(cropName => {
        const crop = cropTypes[cropName];
        const storeItem = store.find(s => s.name === `${cropName}_seed`);

        // If it's not a seed you can buy, it's not a crop for the reference page.
        if (!storeItem) {
            return;
        }

        const cropDiv = document.createElement('div');
        cropDiv.innerHTML = `
            <h3>${crop.icon} ${t(cropName)}</h3>
            <p><strong>${t('ref_seed_price')}</strong> $${storeItem.price}</p>
            <p><strong>${t('ref_growth_time')}</strong> ${t('ref_per_stage', { time: crop.growthTime / 1000 })}</p>
            <p><strong>${t('ref_yield')}</strong> ${t('ref_yield_range', { min: crop.yieldRange[0], max: crop.yieldRange[1] })}</p>
            <p><strong>${t('ref_market_price')}</strong> $${crop.minPrice} - $${crop.maxPrice}</p>
            <p><strong>${t('ref_stages')}</strong> ${crop.visuals.join(' → ')}</p>
        `;
        DOM.refContent.appendChild(cropDiv);
    });
}

function renderMarket() {
    DOM.marketItems.innerHTML = '';
    Object.keys(warehouse).forEach(itemName => {
        if (!itemName.endsWith('_seed') && warehouse[itemName] > 0) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            const icon = getIconForItem(itemName);
            const price = marketState[itemName].currentPrice + player.upgrades.marketBonus;
            itemDiv.innerHTML = `
                <div class="market-item-info">
                    ${icon} ${t(itemName)}: ${warehouse[itemName]}
                    <span>${t('market_item_price', { price })}</span>
                </div>
                <div class="market-actions">
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="1">${t('btn_sell_one')}</button>
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="all">${t('btn_sell_all')}</button>
                    <input type="number" class="sell-amount-input" min="1" max="${warehouse[itemName]}" placeholder="Amount">
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="custom">${t('btn_sell_amount')}</button>
                </div>
            `;
            DOM.marketItems.appendChild(itemDiv);
        }
    });
}

function renderStaticUI() {
    DOM.mainTitle.textContent = t('title');
    DOM.marketTitle.textContent = t('market_title');
    DOM.refTitle.textContent = t('reference_title');
    DOM.warehouseTitle.textContent = t('warehouse_title');
    DOM.fieldTitle.textContent = t('field_title');
    document.querySelector('#buildings-container h2').textContent = t('buildings_title');
    DOM.openStoreBtn.textContent = t('btn_store');
    DOM.openMarketBtn.textContent = t('btn_market');
    DOM.openRefBtn.textContent = t('btn_reference');
    DOM.seedsTabBtn.textContent = t('seeds_tab');
    DOM.productionTabBtn.textContent = t('production_tab');
    DOM.upgradesTabBtn.textContent = t('upgrades_tab');
    document.querySelector('#orders-container h2').textContent = t('orders_title');
}

function renderOrders() {
    DOM.orderItems.innerHTML = '';
    for (const customerId in customers) {
        const customer = customers[customerId];
        const config = customerConfig.customers[customerId];
        if (customer.order) {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order', `order-customer-${customerId}`);
            orderDiv.dataset.customerId = customerId;

            const timeLeft = Math.round((customer.order.expiresAt - Date.now()) / 1000);
            const icon = getIconForItem(customer.order.crop);
            const haveAmount = warehouse[customer.order.crop] || 0;

            orderDiv.innerHTML = `
                <div class="order-info">
                    <strong>${t(config.name)}</strong> (Trust: ${customer.trust})<br>
                    Wants: ${icon} ${customer.order.amount} ${t(customer.order.crop)} (Have: ${haveAmount}/${customer.order.amount})<br>
                    Reward: $${customer.order.reward}<br>
                    Time left: <span class="order-timer">${timeLeft}s</span>
                </div>
                <button class="btn fulfill-btn" data-customer-id="${customerId}" ${haveAmount >= customer.order.amount ? '' : 'disabled'}>Fulfill</button>
            `;
            DOM.orderItems.appendChild(orderDiv);
        }
    }
}

export function renderOrderTimers() {
    const orderElements = DOM.orderItems.querySelectorAll('.order');
    orderElements.forEach(orderElement => {
        const customerId = orderElement.dataset.customerId;
        const customer = customers[customerId];
        if (customer && customer.order) {
            const timerSpan = orderElement.querySelector('.order-timer');
            if (timerSpan) {
                const timeLeft = Math.round((customer.order.expiresAt - Date.now()) / 1000);
                timerSpan.textContent = `${Math.max(0, timeLeft)}s`;
            }
        }
    });
}

function renderUpgrades() {
    DOM.upgradesItems.innerHTML = '';
    for (const upgradeId in upgrades) {
        const upgrade = upgrades[upgradeId];
        if (player.level < (upgrade.requiredLevel || 1)) {
            continue;
        }
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');

        let buyButton;
        if (upgrade.repeatable) {
            const canPurchase = upgrade.purchasedCount < upgrade.maxPurchases;
            const purchaseStatus = `(${upgrade.purchasedCount}/${upgrade.maxPurchases})`;
            buyButton = canPurchase
                ? `<button class="btn buy-upgrade-btn" data-upgrade-id="${upgradeId}">${t('btn_buy')} ($${upgrade.cost})</button> <span>${purchaseStatus}</span>`
                : `<span>${t('status_maxed_out')} ${purchaseStatus}</span>`;
        } else {
            buyButton = upgrade.purchased
                ? `<span>${t('status_purchased')}</span>`
                : `<button class="btn buy-upgrade-btn" data-upgrade-id="${upgradeId}">${t('btn_buy')} ($${upgrade.cost})</button>`;
        }

        itemDiv.innerHTML = `
            <strong>${t(upgrade.name)}</strong>
            <p>${t(upgrade.description)}</p>
            <div class="upgrade-actions">${buyButton}</div>
        `;
        DOM.upgradesItems.appendChild(itemDiv);
    }
}

function renderProduction() {
    DOM.productionItems.innerHTML = '';
    for (const buildingId in buildings) {
        const building = buildings[buildingId];
        if (player.level < (building.requiredLevel || 1)) {
            continue;
        }

        const playerBuilding = player.buildings[buildingId];
        if (playerBuilding.purchased) {
            continue; // Skip purchased buildings
        }

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');

        let recipesHtml = building.recipes.map(recipe => {
            const inputs = Object.entries(recipe.input).map(([key, value]) => `${value} ${t(key)}`).join(', ');
            const outputs = Object.entries(recipe.output).map(([key, value]) => `${value} ${t(key)}`).join(', ');
            return `<div class="recipe-info"><strong>${t('production_recipe')}:</strong> ${inputs} → ${outputs} (${recipe.productionTime / 1000}s)</div>`;
        }).join('');

        const actionButton = `<button class="btn buy-building-btn" data-building-id="${buildingId}">${t('btn_buy')} ($${building.cost})</button>`;

        itemDiv.innerHTML = `
            <strong>${t(building.name)}</strong>
            <p>${t(building.description)}</p>
            ${recipesHtml}
            ${actionButton}
        `;
        DOM.productionItems.appendChild(itemDiv);
    }
}

function renderBuildings() {
    DOM.buildingsGrid.innerHTML = '';
    for (const buildingId in player.buildings) {
        const playerBuilding = player.buildings[buildingId];
        if (playerBuilding.purchased) {
            const building = buildings[buildingId];
            const buildingDiv = document.createElement('div');
            buildingDiv.classList.add('building');
            if (playerBuilding.automated) {
                buildingDiv.classList.add('automated');
            }

            let statusHtml = '';
            if (playerBuilding.production) {
                const recipe = building.recipes[playerBuilding.production.recipeIndex];
                const timeLeft = Math.round((playerBuilding.production.startTime + recipe.productionTime - Date.now()) / 1000);
                statusHtml = `<div class="building-status">${t('status_producing')} (${t('status_time_left', { time: timeLeft })})</div>`;
            } else {
                building.recipes.forEach((recipe, index) => {
                    const inputs = Object.entries(recipe.input).map(([key, value]) => `${value} ${t(key)}`).join(', ');
                    const outputs = Object.entries(recipe.output).map(([key, value]) => `${value} ${t(key)}`).join(', ');
                    statusHtml += `
                        <div class="recipe">
                            <div class="recipe-io">${inputs} → ${outputs}</div>
                            <button class="btn start-production-btn" data-building-id="${buildingId}" data-recipe-index="${index}">
                                ${t('btn_start_production')}
                            </button>
                        </div>`;
                });
            }

            let autoButton = '';
            if (player.upgrades.buildingAutomation) {
                const btnTextKey = playerBuilding.automated ? 'btn_deactivate_auto' : 'btn_activate_auto';
                autoButton = `<button class="btn toggle-auto-btn" data-building-id="${buildingId}">${t(btnTextKey)}</button>`;
            }

            buildingDiv.innerHTML = `
                <div class="building-icon">${building.icon}</div>
                <strong class="building-name">${t(building.name)}</strong>
                <div class="building-recipes">${statusHtml}</div>
                <div class="building-automation">${autoButton}</div>
            `;
            DOM.buildingsGrid.appendChild(buildingDiv);
        }
    }
}

function renderXpBar() {
    DOM.levelDisplay.textContent = t('level_display', { level: player.level });
    const xpPercentage = (player.xp / player.xpToNextLevel) * 100;
    DOM.xpBar.style.width = `${xpPercentage}%`;
    DOM.xpText.textContent = `${player.xp} / ${player.xpToNextLevel} XP`;
}

function renderPlayerState() {
    DOM.moneyDisplay.textContent = `💰 $${player.money}`;
    renderXpBar();

    let bonusHtml = '';
    if (player.upgrades.growthMultiplier < 1.0) {
        const percentage = (1 - player.upgrades.growthMultiplier) * 100;
        bonusHtml += `<div>Growth: +${percentage.toFixed(0)}%</div>`;
    }
    if (player.upgrades.yieldBonus > 0) {
        bonusHtml += `<div>Yield: +${player.upgrades.yieldBonus}</div>`;
    }
    if (player.upgrades.seedDiscount > 0) {
        const percentage = player.upgrades.seedDiscount * 100;
        bonusHtml += `<div>Seed Discount: ${percentage.toFixed(0)}%</div>`;
    }
    if (player.upgrades.marketBonus > 0) {
        bonusHtml += `<div>Market Bonus: +$${player.upgrades.marketBonus}</div>`;
    }

    // Display NPC Bonuses
    const { npcBonuses } = player;
    const hasNpcBonus =
        npcBonuses.yieldBonus > 0 ||
        npcBonuses.growthMultiplier < 1.0 ||
        npcBonuses.marketBonus > 0 ||
        npcBonuses.seedDiscount > 0 ||
        Object.keys(npcBonuses.priceBonus).length > 0;

    if (hasNpcBonus) {
        bonusHtml += `<div class="bonus-section-title">NPC Bonuses:</div>`;
        if (npcBonuses.growthMultiplier < 1.0) {
            const percentage = Math.round((1 - npcBonuses.growthMultiplier) * 100);
            bonusHtml += `<div>- Growth Speed: +${percentage}%</div>`;
        }
        if (npcBonuses.yieldBonus > 0) {
            bonusHtml += `<div>- Yield: +${npcBonuses.yieldBonus}</div>`;
        }
        if (npcBonuses.seedDiscount > 0) {
            const percentage = Math.round(npcBonuses.seedDiscount * 100);
            bonusHtml += `<div>- Seed Discount: ${percentage}%</div>`;
        }
        if (npcBonuses.marketBonus > 0) {
            bonusHtml += `<div>- Market Prices: +$${npcBonuses.marketBonus}</div>`;
        }
        for (const cropName in npcBonuses.priceBonus) {
            const bonus = npcBonuses.priceBonus[cropName];
            bonusHtml += `<div>- ${t(cropName)} Price: +$${bonus}</div>`;
        }
    }

    DOM.bonusDisplay.innerHTML = bonusHtml;
}

export function renderAll() {
    renderStaticUI();
    renderField();
    renderWarehouse();
    renderStore();
    renderReference();
    renderMarket();
    renderOrders();
    renderUpgrades();
    renderProduction();
    renderBuildings();
    renderPlayerState();
}

// Export DOM elements to be used in main.js for event listeners
export const {
    storeTabs,
    seedsContent,
    productionContent,
    upgradesContent,
    productionItems,
    upgradesItems,
    storeModal,
    buildingsGrid
} = DOM;

export function showLevelUpModal(level, unlocked, farmExpanded) {
    DOM.levelUpTitle.textContent = t('level_up_title', { level });

    let unlocksHtml = '';

    if (farmExpanded) {
        unlocksHtml += `<h3>${t('unlock_farm_expanded')}</h3>`;
    }

    if (unlocked.crops.length > 0) {
        unlocksHtml += `<h3>${t('unlocks_crops')}</h3><ul>`;
        unlocked.crops.forEach(crop => {
            unlocksHtml += `<li>${t(crop)}</li>`;
        });
        unlocksHtml += '</ul>';
    }

    if (unlocked.buildings.length > 0) {
        unlocksHtml += `<h3>${t('unlocks_buildings')}</h3><ul>`;
        unlocked.buildings.forEach(building => {
            unlocksHtml += `<li>${t(building)}</li>`;
        });
        unlocksHtml += '</ul>';
    }

    if (unlocked.upgrades.length > 0) {
        unlocksHtml += `<h3>${t('unlocks_upgrades')}</h3><ul>`;
        unlocked.upgrades.forEach(upgrade => {
            unlocksHtml += `<li>${t(upgrade)}</li>`;
        });
        unlocksHtml += '</ul>';
    }

    DOM.levelUpUnlocks.innerHTML = unlocksHtml;
    DOM.levelUpModal.style.display = 'block';
}

export function showSimpleLevelUpModal(level, message) {
    DOM.levelUpTitle.textContent = t('level_up_title', { level });
    DOM.levelUpUnlocks.innerHTML = `<p>${message}</p>`;
    DOM.levelUpModal.style.display = 'block';
}
