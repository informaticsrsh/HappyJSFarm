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
    debugControls: document.getElementById('debug-controls'),
    playerStats: document.getElementById('player-stats')
};

let notificationTimeout;
let debugMenuInitialized = false;

// НОВЕ: Floating text animation
export function showFloatingText(x, y, text, color = '#4CAF50') {
    const floater = document.createElement('div');
    floater.className = 'floating-text';
    floater.textContent = text;
    floater.style.left = x + 'px';
    floater.style.top = y + 'px';
    floater.style.color = color;
    document.body.appendChild(floater);
    
    setTimeout(() => floater.remove(), 1000);
}

// НОВЕ: Tooltip system
export function createTooltip(element, getContent) {
    let tooltip = null;
    
    element.addEventListener('mouseenter', (e) => {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = typeof getContent === 'function' ? getContent() : getContent;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Position tooltip
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.bottom + 5;
        
        // Keep tooltip on screen
        if (left < 5) left = 5;
        if (left + tooltipRect.width > window.innerWidth - 5) {
            left = window.innerWidth - tooltipRect.width - 5;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    });
    
    element.addEventListener('mouseleave', () => {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    });
}

// НОВЕ: Calculate growth progress
function getGrowthProgress(cell) {
    if (!cell.crop) return 0;
    const crop = cropTypes[cell.crop];
    const timeInStage = Date.now() - cell.stageStartTime;
    const stageTime = crop.growthTime * player.upgrades.growthMultiplier * player.npcBonuses.growthMultiplier;
    return Math.min(100, (timeInStage / stageTime) * 100);
}

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
        grid.style.gridTemplateRows = `repeat(${field.length}, 60px)`;
        grid.style.gridTemplateColumns = `repeat(${field[0]?.length || 0}, 60px)`;

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

            if (!plot) continue;

            // Compare states and update if necessary
            if (force || gridRebuilt || !oldCell || oldCell.crop !== newCell.crop || oldCell.growthStage !== newCell.growthStage || oldCell.autoCrop !== newCell.autoCrop) {
                // Clear previous content
                plot.innerHTML = '';
                plot.className = 'plot';
                
                // Update visuals
                if (newCell.crop) {
                    const cropIcon = document.createElement('div');
                    cropIcon.className = 'crop-icon';
                    cropIcon.textContent = cropTypes[newCell.crop].visuals[newCell.growthStage];
                    plot.appendChild(cropIcon);
                    
                    plot.classList.add(newCell.crop);
                    
                    // НОВЕ: Add progress bar
                    const crop = cropTypes[newCell.crop];
                    if (newCell.growthStage < crop.visuals.length - 1) {
                        const progressBar = document.createElement('div');
                        progressBar.className = 'growth-progress-bar';
                        const progress = getGrowthProgress(newCell);
                        progressBar.innerHTML = `<div class="growth-progress-fill" style="width: ${progress}%"></div>`;
                        plot.appendChild(progressBar);
                    } else {
                        // Ready to harvest
                        plot.classList.add('ready-to-harvest');
                    }
                } else {
                    plot.textContent = '🟫';
                }

                // Update automation visuals
                if (newCell.autoCrop) {
                    plot.classList.add('automated-plot', `automated-${newCell.autoCrop}`);
                    
                    const productIcon = document.createElement('div');
                    productIcon.classList.add('product-icon');
                    productIcon.textContent = cropTypes[newCell.autoCrop].icon;
                    plot.appendChild(productIcon);

                    const automationIcon = document.createElement('div');
                    automationIcon.classList.add('automation-icon');
                    automationIcon.textContent = '⚙️';
                    plot.appendChild(automationIcon);
                }
                
                // НОВЕ: Add tooltip
                if (newCell.crop) {
                    createTooltip(plot, () => {
                        const crop = cropTypes[newCell.crop];
                        const progress = getGrowthProgress(newCell);
                        const stage = newCell.growthStage + 1;
                        const totalStages = crop.visuals.length;
                        
                        return `
                            <strong>${t(newCell.crop)}</strong><br>
                            ${t('stage')}: ${stage}/${totalStages}<br>
                            ${stage < totalStages ? `${t('progress')}: ${Math.round(progress)}%` : t('ready_to_harvest')}
                        `;
                    });
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
                itemDiv.classList.add('warehouse-item', item.replace(/_/g, '-'));
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
            itemDiv.innerHTML = `
                <span class="warehouse-icon">${icon}</span>
                <span class="warehouse-count">${newAmount}</span>
            `;

            // Update selection status for seeds
            if (item.endsWith('_seed')) {
                itemDiv.dataset.seed = item;
                if (newSelected === item) {
                    itemDiv.classList.add('selected');
                } else {
                    itemDiv.classList.remove('selected');
                }
            }
            
            // НОВЕ: Add detailed tooltip
            createTooltip(itemDiv, () => {
                const cropInfo = cropTypes[item.replace('_seed', '')];
                let content = `<strong>${t(item)}</strong><br>${t('quantity')}: ${newAmount}`;
                
                if (marketState[item]) {
                    content += `<br>${t('market_price')}: $${marketState[item].currentPrice}`;
                }
                
                return content;
            });
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
        const finalPrice = Math.round(item.price * (1 - (player.upgrades.seedDiscount + player.npcBonuses.seedDiscount)));

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
    const allMarketItems = new Set([...Object.keys(warehouse), ...(oldState.warehouse ? Object.keys(oldState.warehouse) : [])]);

    allMarketItems.forEach(itemName => {
        if (itemName.endsWith('_seed') || !marketState[itemName]) {
            return;
        }

        const oldAmount = oldState.warehouse?.[itemName] || 0;
        const newAmount = warehouse[itemName] || 0;
        const oldPrice = oldState.marketState?.[itemName]?.currentPrice;
        const newPrice = marketState[itemName].currentPrice;

        if (force || oldAmount !== newAmount || oldPrice !== newPrice) {
            let itemDiv = document.getElementById(`market-item-${itemName}`);

            if (newAmount === 0) {
                if (itemDiv) {
                    itemDiv.remove();
                }
                return;
            }

            if (!itemDiv) {
                itemDiv = document.createElement('div');
                itemDiv.id = `market-item-${itemName}`;
                itemDiv.classList.add('market-item');
                container.appendChild(itemDiv);
            }

            const icon = getIconForItem(itemName);
            const price = newPrice + player.upgrades.marketBonus + player.npcBonuses.marketBonus;
            const priceBonus = player.npcBonuses.priceBonus[itemName] || 0;
            const finalPrice = price + priceBonus;
            
            itemDiv.innerHTML = `
                <div class="market-item-header">
                    <span class="market-item-icon">${icon}</span>
                    <span class="market-item-name">${t(itemName)}</span>
                    <span class="market-item-stock">${newAmount}</span>
                </div>
                <div class="market-item-price">
                    ${t('price')}: $${finalPrice}
                </div>
                <div class="market-actions">
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="1">1</button>
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="10">10</button>
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="100">100</button>
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="10%">10%</button>
                    <button class="btn sell-btn" data-crop-name="${itemName}" data-amount="50%">50%</button>
                    <button class="btn btn-success sell-btn" data-crop-name="${itemName}" data-amount="max">${t('btn_sell_all')}</button>
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
    
    // НОВЕ: Додати текст для My Upgrades
    const myUpgradesBtn = document.getElementById('ref-my-upgrades-tab-btn');
    if (myUpgradesBtn) {
        myUpgradesBtn.textContent = t('ref_my_upgrades_tab');
    }
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

            if (!newOrder) {
                if (orderDiv) {
                    orderDiv.remove();
                }
                continue;
            }

            if (!orderDiv) {
                orderDiv = document.createElement('div');
                orderDiv.id = `order-${customerId}`;
                orderDiv.classList.add('order', `order-customer-${customerId}`);
                orderDiv.dataset.customerId = customerId;
                container.appendChild(orderDiv);
            }

            const config = customerConfig.customers[customerId];
            const timeLeft = newOrder.expiresAt - Date.now();
            const icon = getIconForItem(newOrder.crop);
            const haveAmount = warehouse[newOrder.crop] || 0;

            orderDiv.innerHTML = `
                <div class="order-info">
                    <strong>${t(config.name)}</strong> (${t('order_trust')}: ${customers[customerId].trust})<br>
                    ${t('order_wants')}: ${icon} ${newOrder.amount} ${t(newOrder.crop)} (${t('order_have')}: ${haveAmount}/${newOrder.amount})<br>
                    ${t('order_reward')}: $${newOrder.reward}<br>