import { t } from './localization.js';
import { player, field, warehouse, marketState, customers, deepCopy } from './state.js';
import { NUM_ROWS, NUM_COLS, store, cropTypes, upgrades, customerConfig, buildings } from './config.js';
import { checkIngredients, getResearchCost } from './game.js';

// --- State Cache ---
let oldState = {};

// --- Render Queue & Loop ---
const renderQueue = new Set();

function renderLoop() {
    if (renderQueue.size > 0) {
        const forceAll = renderQueue.has('all');
        // Create a deep copy of the current state for diffing
        const newState = {
            player: deepCopy(player),
            field: deepCopy(field),
            warehouse: deepCopy(warehouse),
            marketState: deepCopy(marketState),
            customers: deepCopy(customers),
        };

        if (forceAll) {
            renderAll(true);
        } else {
            renderQueue.forEach(component => {
                switch(component) {
                    case 'field':
                        renderField();
                        break;
                    case 'warehouse':
                        renderWarehouse();
                        break;
                    case 'market':
                        renderMarket();
                        break;
                    case 'playerState':
                        renderPlayerState();
                        break;
                    case 'orders':
                        renderOrders();
                        break;
                    case 'buildings':
                        renderBuildings();
                        break;
                    case 'upgrades':
                        renderUpgrades();
                        break;
                    case 'production':
                        renderProduction();
                        break;
                    case 'store':
                        renderStore();
                        break;
                    // Cases for other components will be added here
                }
            });
        }

        // Update the old state cache
        oldState = newState;
        renderQueue.clear();
    }
    requestAnimationFrame(renderLoop);
}

export function scheduleUpdate(component = 'all') {
    renderQueue.add(component);
}

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
    refTabs: document.querySelector('.ref-tabs'),
    refCropsTabBtn: document.getElementById('ref-crops-tab-btn'),
    refProductionTabBtn: document.getElementById('ref-production-tab-btn'),
    refCustomersTabBtn: document.getElementById('ref-customers-tab-btn'),
    refCropsContent: document.getElementById('ref-crops-content'),
    refProductionContent: document.getElementById('ref-production-content'),
    refCustomersContent: document.getElementById('ref-customers-content'),
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
    moneyDisplay: document.getElementById('money-display'),
    researchPointsDisplay: document.getElementById('research-points-display'),
    levelDisplay: document.getElementById('level-display'),
    xpBarContainer: document.getElementById('xp-bar-container'),
    xpBar: document.getElementById('xp-bar'),
    xpText: document.getElementById('xp-text'),
    bonusDisplay: document.getElementById('bonus-display'),
    notificationBanner: document.getElementById('notification-banner'),
    levelUpModal: document.getElementById('level-up-modal'),
    levelUpTitle: document.getElementById('level-up-title'),
    levelUpUnlocks: document.getElementById('level-up-unlocks'),
    levelUpCloseBtn: document.querySelector('.level-up-close'),
    debugControls: document.getElementById('debug-controls')
};

let notificationTimeout;
let debugMenuInitialized = false;

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

function renderField(force = false) {
    const grid = DOM.fieldGrid;
    let gridRebuilt = false;

    // Initial setup or if forced (e.g., farm expansion)
    if (force || grid.children.length !== field.length * (field[0]?.length || 0)) {
        gridRebuilt = true;
        grid.innerHTML = '';
        grid.style.gridTemplateRows = `repeat(${field.length}, 50px)`;
        grid.style.gridTemplateColumns = `repeat(${field[0]?.length || 0}, 50px)`;

        for (let r = 0; r < field.length; r++) {
            for (let c = 0; c < field[0].length; c++) {
                const plot = document.createElement('div');
                plot.id = `plot-${r}-${c}`;
                plot.classList.add('plot');
                plot.dataset.row = r;
                plot.dataset.col = c;
                grid.appendChild(plot);
            }
        }
    }

    // Diffing and targeted updates
    for (let r = 0; r < field.length; r++) {
        for (let c = 0; c < field[0].length; c++) {
            const oldCell = oldState.field?.[r]?.[c];
            const newCell = field[r][c];
            const plot = document.getElementById(`plot-${r}-${c}`);

            if (!plot) continue; // Should not happen after initial setup

            // Compare states and update if necessary
            if (force || gridRebuilt || !oldCell || oldCell.crop !== newCell.crop || oldCell.growthStage !== newCell.growthStage || oldCell.autoCrop !== newCell.autoCrop) {
                // Update visuals
                if (newCell.crop) {
                    plot.textContent = cropTypes[newCell.crop].visuals[newCell.growthStage];
                    plot.className = `plot ${newCell.crop}`; // Reset and add crop class
                } else {
                    plot.textContent = '🟫';
                    plot.className = 'plot';
                }

                // Update automation visuals
                if (newCell.autoCrop) {
                    plot.classList.add('automated-plot', `automated-${newCell.autoCrop}`);
                    // Ensure icons are present if needed, but avoid re-creating them if they exist
                    if (!plot.querySelector('.product-icon')) {
                        const productIcon = document.createElement('div');
                        productIcon.classList.add('product-icon');
                        productIcon.textContent = cropTypes[newCell.autoCrop].icon;
                        plot.appendChild(productIcon);

                        const automationIcon = document.createElement('div');
                        automationIcon.classList.add('automation-icon');
                        automationIcon.textContent = '⚙️';
                        plot.appendChild(automationIcon);
                    }
                } else {
                    // Clean up automation visuals if they exist
                    plot.classList.remove('automated-plot');
                    const productIcon = plot.querySelector('.product-icon');
                    if (productIcon) productIcon.remove();
                    const automationIcon = plot.querySelector('.automation-icon');
                    if (automationIcon) automationIcon.remove();
                }
            }
        }
    }
}

function renderWarehouse(force = false) {
    const container = DOM.warehouseItems;

    // 1. Define a canonical order
    const seedOrder = store.map(s => s.name);
    const productOrder = Object.keys(cropTypes)
        .filter(item => !item.endsWith('_seed') && item !== 'research_points')
        .sort();
    const canonicalOrder = [...seedOrder, ...productOrder];

    // 2. Get and sort current warehouse items
    const warehouseItems = Object.keys(warehouse).filter(item => warehouse[item] > 0 && item !== 'research_points');
    warehouseItems.sort((a, b) => {
        const indexA = canonicalOrder.indexOf(a);
        const indexB = canonicalOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    // 3. Diff and render
    const allItemsToRender = new Set([...warehouseItems, ...(oldState.warehouse ? Object.keys(oldState.warehouse) : [])]);

    // Efficiently re-order DOM elements if needed
    if (force || warehouseItems.some((item, index) => container.children[index]?.id !== `warehouse-item-${item}`)) {
         // Create a map of existing elements for quick lookup
        const existingElements = new Map();
        for (const child of container.children) {
            existingElements.set(child.id.replace('warehouse-item-', ''), child);
        }

        // Append elements in the correct order
        warehouseItems.forEach(item => {
            const el = existingElements.get(item);
            if (el) {
                container.appendChild(el); // Re-appending moves the element
            }
        });
    }


    for (const item of allItemsToRender) {
         if (item === 'research_points') continue;

        const oldAmount = oldState.warehouse?.[item] || 0;
        const newAmount = warehouse[item] || 0;
        const oldSelected = oldState.player?.selectedSeed;
        const newSelected = player.selectedSeed;

        if (force || oldAmount !== newAmount || (item === oldSelected && oldSelected !== newSelected) || (item === newSelected && oldSelected !== newSelected)) {
            let itemDiv = document.getElementById(`warehouse-item-${item}`);

            // Remove item if amount is zero
            if (newAmount === 0) {
                if (itemDiv) {
                    itemDiv.remove();
                }
                continue;
            }

            // Create item if it's new
            if (!itemDiv) {
                itemDiv = document.createElement('div');
                itemDiv.id = `warehouse-item-${item}`;
                itemDiv.classList.add('item', item.replace(/_/g, '-'));
                // Find the correct position to insert
                const index = warehouseItems.indexOf(item);
                if (index !== -1 && container.children[index]) {
                    container.insertBefore(itemDiv, container.children[index]);
                } else {
                    container.appendChild(itemDiv);
                }
            }

            // Update content
            const icon = getIconForItem(item);
            itemDiv.textContent = t('warehouse_item', {
                icon,
                itemName: t(item),
                amount: newAmount
            });

            // Update selection status for seeds
            if (item.endsWith('_seed')) {
                itemDiv.dataset.seed = item;
                if (newSelected === item) {
                    itemDiv.classList.add('selected');
                } else {
                    itemDiv.classList.remove('selected');
                }
            }
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
                <button class="btn buy-btn" data-item-name="${item.name}" data-amount="1">1</button>
                <button class="btn buy-btn" data-item-name="${item.name}" data-amount="10">10</button>
                <button class="btn buy-btn" data-item-name="${item.name}" data-amount="100">100</button>
                <button class="btn buy-btn" data-item-name="${item.name}" data-amount="10%">10%</button>
                <button class="btn buy-btn" data-item-name="${item.name}" data-amount="50%">50%</button>
                <button class="btn buy-btn" data-item-name="${item.name}" data-amount="max">${t('btn_max')}</button>
            </div>
        `;
        DOM.storeItems.appendChild(itemDiv);
    });
}

function formatTime(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

function renderCropReference() {
    const content = DOM.refContent;
    content.innerHTML = '';
    Object.keys(cropTypes).forEach(cropName => {
        const crop = cropTypes[cropName];
        const storeItem = store.find(s => s.name === `${cropName}_seed`);

        if (!storeItem) return;

        const cropDiv = document.createElement('div');
        cropDiv.innerHTML = `
            <h3>${crop.icon} ${t(cropName)}</h3>
            <p><strong>${t('ref_seed_price')}:</strong> $${storeItem.price}</p>
            <p><strong>${t('ref_growth_time')}:</strong> ${t('ref_per_stage', { time: formatTime(crop.growthTime) })}</p>
            <p><strong>${t('ref_yield')}:</strong> ${t('ref_yield_range', { min: crop.yieldRange[0], max: crop.yieldRange[1] })}</p>
            <p><strong>${t('ref_market_price')}:</strong> $${crop.minPrice} - $${crop.maxPrice}</p>
            <p><strong>${t('ref_stages')}:</strong> ${crop.visuals.join(' → ')}</p>
        `;
        content.appendChild(cropDiv);
    });
}

function renderProductionReference() {
    const content = DOM.refProductionContent;
    content.innerHTML = '';
    for (const buildingId in buildings) {
        const building = buildings[buildingId];
        const itemDiv = document.createElement('div');

        let recipesHtml = building.recipes.map(recipe => {
            const inputs = Object.entries(recipe.input).map(([key, value]) => `${value} ${t(key)}`).join(', ');
            const outputs = Object.entries(recipe.output).map(([key, value]) => `${value} ${t(key)}`).join(', ');
            return `<div class="recipe-info"><strong>${t('production_recipe')}:</strong> ${inputs} → ${outputs} (${formatTime(recipe.productionTime)})</div>`;
        }).join('');

        itemDiv.innerHTML = `
            <h3>${building.icon} ${t(building.name)}</h3>
            <p>${t(building.description)}</p>
            <p><strong>${t('ref_cost')}:</strong> $${building.cost}</p>
            <p><strong>${t('ref_required_level')}:</strong> ${building.requiredLevel}</p>
            ${recipesHtml}
        `;
        content.appendChild(itemDiv);
    }
}

function renderCustomerReference() {
    const content = DOM.refCustomersContent;
    content.innerHTML = '';
    for (const customerId in customerConfig.customers) {
        const customer = customerConfig.customers[customerId];
        const playerCustomer = customers[customerId];
        const bonus = customer.bonus;
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('customer-reference');

        let bonusHtml = `<h4>${t('ref_bonus_effect')}</h4><p>${t(bonus.description)}</p>`;
        bonusHtml += '<table>';
        bonusHtml += `<tr><th>${t('ref_trust_level')}</th><th>${t('ref_bonus')}</th></tr>`;

        // Assuming bonus levels are l4 and l5, corresponding to trust levels 300 and 400
        const trustTiers = [
            { trust: 300, value: bonus.value_l4 },
            { trust: 400, value: bonus.value_l5 }
        ];

        trustTiers.forEach(tier => {
            if (tier.value) {
                let bonusValueText = '';
                switch (bonus.type) {
                    case 'yieldBonus':
                    case 'marketBonus':
                        bonusValueText = `+${tier.value}`;
                        break;
                    case 'growthMultiplier':
                        bonusValueText = `+${Math.round((1 - tier.value) * 100)}%`;
                        break;
                    case 'seedDiscount':
                        bonusValueText = `${tier.value * 100}%`;
                        break;
                    case 'priceBonus':
                        bonusValueText = `+$${tier.value} for ${t(bonus.crop)}`;
                        break;
                    default:
                        bonusValueText = tier.value;
                }
                bonusHtml += `<tr><td>${tier.trust}+</td><td>${bonusValueText}</td></tr>`;
            }
        });
        bonusHtml += '</table>';

        itemDiv.innerHTML = `
            <h3>${t(customer.name)}</h3>
            <p><strong>${t('ref_current_trust')}:</strong> ${playerCustomer.trust}</p>
            ${bonusHtml}
        `;
        content.appendChild(itemDiv);
    }
}

function renderReference() {
    renderCropReference();
    renderProductionReference();
    renderCustomerReference();
}

function renderMarket(force = false) {
    const container = DOM.marketItems;
    // Consider all items that are currently in the market or were in the last state
    const allMarketItems = new Set([...Object.keys(warehouse), ...(oldState.warehouse ? Object.keys(oldState.warehouse) : [])]);

    allMarketItems.forEach(itemName => {
        if (itemName.endsWith('_seed') || !marketState[itemName]) {
            return; // Skip seeds and items not in market state
        }

        const oldAmount = oldState.warehouse?.[itemName] || 0;
        const newAmount = warehouse[itemName] || 0;
        const oldPrice = oldState.marketState?.[itemName]?.currentPrice;
        const newPrice = marketState[itemName].currentPrice;

        if (force || oldAmount !== newAmount || oldPrice !== newPrice) {
            let itemDiv = document.getElementById(`market-item-${itemName}`);

            // If item is gone from warehouse, remove it from market view
            if (newAmount === 0) {
                if (itemDiv) {
                    itemDiv.remove();
                }
                return;
            }

            // If item is new to the market view, create it
            if (!itemDiv) {
                itemDiv = document.createElement('div');
                itemDiv.id = `market-item-${itemName}`;
                itemDiv.classList.add('item');
                container.appendChild(itemDiv);
            }

            // Update the content
            const icon = getIconForItem(itemName);
            const price = newPrice + player.upgrades.marketBonus;
            itemDiv.innerHTML = `
                <div class="market-item-info">
                    ${icon} ${t(itemName)}: ${newAmount}
                    <span>${t('market_item_price', { price })}</span>
                </div>
                <div class="market-actions">
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="1">1</button>
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="10">10</button>
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="100">100</button>
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="10%">10%</button>
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="50%">50%</button>
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="max">${t('btn_sell_all')}</button>
                </div>
            `;
        }
    });
}

export function renderProductionTimers() {
    const buildingElements = DOM.buildingsGrid.querySelectorAll('.building');
    buildingElements.forEach(buildingElement => {
        const buildingId = buildingElement.dataset.buildingId;
        const playerBuilding = player.buildings[buildingId];
        if (playerBuilding && playerBuilding.production.length > 0) {
            const timerSpan = buildingElement.querySelector('.production-timer');
            if (timerSpan) {
                const building = buildings[buildingId];
                const job = playerBuilding.production[0];
                const recipe = building.recipes[job.recipeIndex];
                const effectiveTime = recipe.productionTime * (1 - (player.upgrades.productionSpeed || 0));
                const timeLeft = job.startTime + effectiveTime - Date.now();
                timerSpan.textContent = formatTime(timeLeft);
            }
        }
    });
}

function renderStaticUI() {
    DOM.mainTitle.textContent = t('title');
    DOM.marketTitle.textContent = t('market_title');
    DOM.refTitle.textContent = t('reference_title');
    DOM.refCropsTabBtn.textContent = t('ref_crops_tab');
    DOM.refProductionTabBtn.textContent = t('ref_production_tab');
    DOM.refCustomersTabBtn.textContent = t('ref_customers_tab');
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

function renderOrders(force = false) {
    const container = DOM.orderItems;
    const allCustomers = { ...customers, ...(oldState.customers || {}) };

    for (const customerId in allCustomers) {
        const oldOrder = oldState.customers?.[customerId]?.order;
        const newOrder = customers[customerId].order;
        const oldTrust = oldState.customers?.[customerId]?.trust;
        const newTrust = customers[customerId].trust;
        const cropAmount = newOrder ? (warehouse[newOrder.crop] || 0) : 0;
        const oldCropAmount = (oldOrder && oldState.warehouse) ? (oldState.warehouse[oldOrder.crop] || 0) : 0;


        if (force || JSON.stringify(oldOrder) !== JSON.stringify(newOrder) || oldTrust !== newTrust || cropAmount !== oldCropAmount) {
            let orderDiv = document.getElementById(`order-${customerId}`);

            // If order is gone, remove the div
            if (!newOrder) {
                if (orderDiv) {
                    orderDiv.remove();
                }
                continue;
            }

            // If order is new, create the div
            if (!orderDiv) {
                orderDiv = document.createElement('div');
                orderDiv.id = `order-${customerId}`;
                orderDiv.classList.add('order', `order-customer-${customerId}`);
                orderDiv.dataset.customerId = customerId;
                container.appendChild(orderDiv);
            }

            // Update the content
            const config = customerConfig.customers[customerId];
            const timeLeft = newOrder.expiresAt - Date.now();
            const icon = getIconForItem(newOrder.crop);
            const haveAmount = warehouse[newOrder.crop] || 0;

            orderDiv.innerHTML = `
                <div class="order-info">
                    <strong>${t(config.name)}</strong> (${t('order_trust')}: ${customers[customerId].trust})<br>
                    ${t('order_wants')}: ${icon} ${newOrder.amount} ${t(newOrder.crop)} (${t('order_have')}: ${haveAmount}/${newOrder.amount})<br>
                    ${t('order_reward')}: $${newOrder.reward}<br>
                    ${t('order_time_left')}: <span class="order-timer">${formatTime(timeLeft)}</span>
                </div>
                <button class="btn fulfill-btn" data-customer-id="${customerId}" ${haveAmount >= newOrder.amount ? '' : 'disabled'}>${t('btn_fulfill')}</button>
            `;
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
                const timeLeft = customer.order.expiresAt - Date.now();
                timerSpan.textContent = formatTime(timeLeft);
            }
        }
    });
}

function renderUpgrades(force = false) {
    const container = DOM.upgradesItems;

    for (const upgradeId in upgrades) {
        const oldUpgrade = oldState.upgrades?.[upgradeId];
        const newUpgrade = upgrades[upgradeId];
        const oldLevel = oldState.player?.level;
        const newLevel = player.level;

        if (force || JSON.stringify(oldUpgrade) !== JSON.stringify(newUpgrade) || oldLevel !== newLevel) {
            let itemDiv = document.getElementById(`upgrade-item-${upgradeId}`);

            const isVisible = newLevel >= (newUpgrade.requiredLevel || 1);
            const isPurchased = !newUpgrade.repeatable && newUpgrade.purchased;

            if (!isVisible || isPurchased) {
                if (itemDiv) itemDiv.remove();
                continue;
            }

            if (!itemDiv) {
                itemDiv = document.createElement('div');
                itemDiv.id = `upgrade-item-${upgradeId}`;
                itemDiv.classList.add('item');
                container.appendChild(itemDiv);
            }

            let buyButton;
            const cost = newUpgrade.costCurrency === 'research_points'
                ? `${newUpgrade.cost} ${cropTypes['research_points'].icon}`
                : `$${newUpgrade.cost}`;

            if (newUpgrade.repeatable) {
                const hasMax = typeof newUpgrade.maxPurchases !== 'undefined';
                const purchasedCount = newUpgrade.purchasedCount || 0;
                const canPurchase = hasMax ? purchasedCount < newUpgrade.maxPurchases : true;
                const purchaseStatus = hasMax ? `(${purchasedCount}/${newUpgrade.maxPurchases})` : `(${purchasedCount})`;
                buyButton = canPurchase
                    ? `<button class="btn buy-upgrade-btn" data-upgrade-id="${upgradeId}">${t('btn_buy')} (${cost})</button> <span>${purchaseStatus}</span>`
                    : `<span>${t('status_maxed_out')} ${purchaseStatus}</span>`;
            } else {
                buyButton = `<button class="btn buy-upgrade-btn" data-upgrade-id="${upgradeId}">${t('btn_buy')} (${cost})</button>`;
            }

            itemDiv.innerHTML = `
                <strong>${t(newUpgrade.name)}</strong>
                <p>${t(newUpgrade.description)}</p>
                <div class="upgrade-actions">${buyButton}</div>
            `;
        }
    }
}

function renderProduction(force = false) {
    const container = DOM.productionItems;

    for (const buildingId in buildings) {
        const oldPBuilding = oldState.player?.buildings[buildingId];
        const newPBuilding = player.buildings[buildingId];
        const oldLevel = oldState.player?.level;
        const newLevel = player.level;

        if (force || oldPBuilding?.purchased !== newPBuilding.purchased || oldLevel !== newLevel) {
            let itemDiv = document.getElementById(`production-item-${buildingId}`);

            const building = buildings[buildingId];
            const isVisible = newLevel >= (building.requiredLevel || 1);
            const isPurchased = newPBuilding.purchased;

            if (!isVisible || isPurchased) {
                if (itemDiv) itemDiv.remove();
                continue;
            }

            if (!itemDiv) {
                itemDiv = document.createElement('div');
                itemDiv.id = `production-item-${buildingId}`;
                itemDiv.classList.add('item');
                container.appendChild(itemDiv);
            }

            let recipesHtml = building.recipes.map(recipe => {
                const inputs = Object.entries(recipe.input).map(([key, value]) => `${value} ${t(key)}`).join(', ');
                const outputs = Object.entries(recipe.output).map(([key, value]) => `${value} ${t(key)}`).join(', ');
                return `<div class="recipe-info"><strong>${t('production_recipe')}:</strong> ${inputs} → ${outputs} (${formatTime(recipe.productionTime)})</div>`;
            }).join('');

            const actionButton = `<button class="btn buy-building-btn" data-building-id="${buildingId}">${t('btn_buy')} ($${building.cost})</button>`;

            itemDiv.innerHTML = `
                <strong>${t(building.name)}</strong>
                <p>${t(building.description)}</p>
                ${recipesHtml}
                ${actionButton}
            `;
        }
    }
}

function renderBuildings(force = false) {
    const container = DOM.buildingsGrid;

    for (const buildingId in buildings) {
        const oldPBuilding = oldState.player?.buildings[buildingId];
        const newPBuilding = player.buildings[buildingId];
        const oldProdVol = oldState.player?.upgrades.productionVolume;
        const newProdVol = player.upgrades.productionVolume;

        // If a building is newly purchased or its state changes significantly, render it.
        if (force || JSON.stringify(oldPBuilding) !== JSON.stringify(newPBuilding) || oldProdVol !== newProdVol) {
            let buildingDiv = document.getElementById(`building-${buildingId}`);

            // If building wasn't purchased but is now, create the div
            if (newPBuilding.purchased && !buildingDiv) {
                buildingDiv = document.createElement('div');
                buildingDiv.id = `building-${buildingId}`;
                container.appendChild(buildingDiv);
            }

            // If building is not purchased, ensure it's not on the DOM
            if (!newPBuilding.purchased) {
                if (buildingDiv) buildingDiv.remove();
                continue;
            }

            // Re-render the whole card for simplicity, as its state is complex.
            // This is still a huge win over re-rendering the whole page.
            const building = buildings[buildingId];
            buildingDiv.className = 'building'; // Reset class
            buildingDiv.dataset.buildingId = buildingId;
            if (newPBuilding.automated) {
                buildingDiv.classList.add('automated');
            }

            let statusHtml = '';
            if (newPBuilding.production.length > 0) {
                const job = newPBuilding.production[0];
                const recipe = building.recipes[job.recipeIndex];
                const effectiveTime = recipe.productionTime * (1 - (player.upgrades.productionSpeed || 0));
                const timeLeft = job.startTime + effectiveTime - Date.now();
                let queueStatus = newPBuilding.production.length > 1 ? ` (+${newPBuilding.production.length - 1} in queue)` : '';
                statusHtml = `<div class="building-status">${t('status_producing')} (<span class="production-timer">${formatTime(timeLeft)}</span>) ${queueStatus}</div>`;
            } else if (newPBuilding.automated) {
                const batchSize = 1 + (player.upgrades.productionVolume || 0);
                const selectedRecipe = building.recipes[newPBuilding.selectedRecipe];
                const missing = checkIngredients(selectedRecipe, batchSize, buildingId);
                if (missing.length > 0) {
                    statusHtml = `<div class="building-status-problem">${t('status_missing_resources')}</div>`;
                } else {
                    statusHtml = `<div class="building-status">${t('status_idle')}</div>`;
                }
            } else {
                const batchSize = 1 + (player.upgrades.productionVolume || 0);
                 building.recipes.forEach((recipe, index) => {
                    let inputs;
                    if (buildingId === 'research_lab') {
                        inputs = `${getResearchCost() * batchSize} ${t('money')}`;
                    } else {
                        inputs = Object.entries(recipe.input).map(([key, value]) => `${value * batchSize} ${t(key)}`).join(', ');
                    }
                    const outputs = Object.entries(recipe.output).map(([key, value]) => `${value * batchSize} ${t(key)}`).join(', ');

                    const missing = checkIngredients(recipe, batchSize, buildingId);
                    let buttonClass = 'btn start-production-btn';
                    let buttonData = '';
                    if (missing.length > 0) {
                        buttonClass += ' btn-danger';
                        const missingText = t('alert_missing_ingredients', { items: missing.join(', ') });
                        buttonData = `data-missing="${missingText}"`;
                    }

                    statusHtml += `
                        <div class="recipe">
                            <div class="recipe-io">${inputs} → ${outputs}</div>
                            <button class="${buttonClass}" data-building-id="${buildingId}" data-recipe-index="${index}" ${buttonData}>
                                ${t('btn_start_production')}
                            </button>
                        </div>`;
                });
            }

            let autoButton = '';
            if (player.upgrades.buildingAutomation) {
                const btnTextKey = newPBuilding.automated ? 'btn_deactivate_auto' : 'btn_activate_auto';
                autoButton = `<button class="btn toggle-auto-btn" data-building-id="${buildingId}">${t(btnTextKey)}</button>`;
            }

            if (newPBuilding.automated && building.recipes.length > 1) {
                autoButton += '<div class="recipe-selectors">';
                building.recipes.forEach((recipe, index) => {
                    const output = Object.keys(recipe.output)[0];
                    const icon = getIconForItem(output);
                    let activeClass = '';
                    if (index === newPBuilding.selectedRecipe) {
                        activeClass = 'active';
                    } else {
                        activeClass = 'btn-inactive';
                    }
                    autoButton += `<button class="btn recipe-selector-btn ${activeClass}" data-building-id="${buildingId}" data-recipe-index="${index}">${icon}</button>`;
                });
                autoButton += '</div>';
            }

            buildingDiv.innerHTML = `
                <div class="building-icon">${building.icon}</div>
                <strong class="building-name">${t(building.name)}</strong>
                <div class="building-recipes">${statusHtml}</div>
                <div class="building-automation">${autoButton}</div>
            `;
        }
    }
}

function renderXpBar() {
    DOM.levelDisplay.textContent = t('level_display', { level: player.level });
    const xpPercentage = (player.xp / player.xpToNextLevel) * 100;
    DOM.xpBar.style.width = `${xpPercentage}%`;
    DOM.xpText.textContent = `${player.xp} / ${player.xpToNextLevel} XP`;
}

function renderPlayerState(force = false) {
    const oldP = oldState.player;
    const newP = player;
    const oldWh = oldState.warehouse;
    const newWh = warehouse;

    // Money
    if (force || oldP?.money !== newP.money) {
        DOM.moneyDisplay.textContent = `💰 $${newP.money}`;
    }

    // Research Points
    if (force || oldWh?.research_points !== newWh.research_points) {
        const rp = newWh.research_points || 0;
        DOM.researchPointsDisplay.textContent = `💡 ${rp}`;
        DOM.researchPointsDisplay.style.display = rp > 0 ? 'block' : 'none';
    }

    // XP Bar and Level
    if (force || oldP?.xp !== newP.xp || oldP?.level !== newP.level) {
        DOM.levelDisplay.textContent = t('level_display', { level: newP.level });
        const xpPercentage = (newP.xp / newP.xpToNextLevel) * 100;
        DOM.xpBar.style.width = `${xpPercentage}%`;
        DOM.xpText.textContent = `${newP.xp} / ${newP.xpToNextLevel} XP`;
    }

    // Bonuses - This part is complex, so for now we'll re-render it fully on any upgrade change
    // A more granular approach could be implemented if needed
    if (force || JSON.stringify(oldP?.upgrades) !== JSON.stringify(newP.upgrades) || JSON.stringify(oldP?.npcBonuses) !== JSON.stringify(newP.npcBonuses)) {
        let bonusHtml = '';
        if (newP.upgrades.growthMultiplier < 1.0) {
            const percentage = (1 - newP.upgrades.growthMultiplier) * 100;
            bonusHtml += `<div>${t('bonus_growth')}: +${percentage.toFixed(0)}%</div>`;
        }
        if (newP.upgrades.yieldBonus > 0) {
            bonusHtml += `<div>${t('bonus_yield')}: +${newP.upgrades.yieldBonus}</div>`;
        }
        if (newP.upgrades.seedDiscount > 0) {
            const percentage = newP.upgrades.seedDiscount * 100;
            bonusHtml += `<div>${t('bonus_seed_discount')}: ${percentage.toFixed(0)}%</div>`;
        }
        if (newP.upgrades.marketBonus > 0) {
            bonusHtml += `<div>${t('bonus_market_bonus')}: +$${newP.upgrades.marketBonus}</div>`;
        }

        const { npcBonuses } = newP;
        const hasNpcBonus =
            npcBonuses.yieldBonus > 0 ||
            npcBonuses.growthMultiplier < 1.0 ||
            npcBonuses.marketBonus > 0 ||
            npcBonuses.seedDiscount > 0 ||
            Object.keys(npcBonuses.priceBonus).length > 0;

        if (hasNpcBonus) {
            bonusHtml += `<div class="bonus-section-title">${t('bonus_npc_bonuses')}:</div>`;
            if (npcBonuses.growthMultiplier < 1.0) {
                const percentage = Math.round((1 - npcBonuses.growthMultiplier) * 100);
                bonusHtml += `<div>- ${t('bonus_growth_speed')}: +${percentage}%</div>`;
            }
            if (npcBonuses.yieldBonus > 0) {
                bonusHtml += `<div>- ${t('bonus_yield')}: +${npcBonuses.yieldBonus}</div>`;
            }
            if (npcBonuses.seedDiscount > 0) {
                const percentage = Math.round(npcBonuses.seedDiscount * 100);
                bonusHtml += `<div>- ${t('bonus_seed_discount')}: ${percentage}%</div>`;
            }
            if (npcBonuses.marketBonus > 0) {
                bonusHtml += `<div>- ${t('bonus_market_prices')}: +$${npcBonuses.marketBonus}</div>`;
            }
            for (const cropName in npcBonuses.priceBonus) {
                const bonus = npcBonuses.priceBonus[cropName];
                bonusHtml += `<div>- ${t(cropName)} ${t('bonus_price')}: +$${bonus}</div>`;
            }
        }
        DOM.bonusDisplay.innerHTML = bonusHtml;
    }
}

export function renderAll(force = false) {
    renderStaticUI();
    renderField(force);
    renderWarehouse(force);
    renderStore();
    renderReference();
    renderMarket(force);
    renderOrders(force);
    renderUpgrades(force);
    renderProduction(force);
    renderBuildings(force);
    renderPlayerState(force);
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

export function toggleDebugMenu() {
    if (!debugMenuInitialized) {
        const buttons = [
            { id: 'dev-add-level', text: '+1 Level' },
            { id: 'dev-add-money', text: '+1M Money' },
            { id: 'dev-add-products', text: '+1k Products' }
        ];

        buttons.forEach(btnInfo => {
            const button = document.createElement('button');
            button.id = btnInfo.id;
            button.textContent = btnInfo.text;
            button.classList.add('btn');
            DOM.debugControls.appendChild(button);
        });

        debugMenuInitialized = true;
    }

    DOM.debugControls.classList.toggle('hidden');
}

// --- Initial Kick-off ---
requestAnimationFrame(renderLoop);
