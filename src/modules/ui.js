import { t } from './localization.js';
import { player, field, warehouse, marketState } from './state.js';
import { NUM_ROWS, NUM_COLS, store, cropTypes, upgrades } from './config.js';

export const DOM = {
    fieldGrid: document.getElementById('field-grid'),
    warehouseItems: document.getElementById('warehouse-items'),
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
    // Store tabs
    storeTabs: document.querySelector('.store-tabs'),
    seedsContent: document.getElementById('seeds-content'),
    upgradesContent: document.getElementById('upgrades-content'),
    upgradesItems: document.getElementById('upgrades-items'),
    seedsTabBtn: document.getElementById('seeds-tab-btn'),
    upgradesTabBtn: document.getElementById('upgrades-tab-btn'),
    // Dev elements
    devMoneyBtn: document.getElementById('dev-money-btn'),
    moneyDisplay: document.getElementById('money-display'),
    bonusDisplay: document.getElementById('bonus-display')
};

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
    for (let r = 0; r < NUM_ROWS; r++) {
        for (let c = 0; c < NUM_COLS; c++) {
            const plot = document.createElement('div');
            plot.classList.add('plot');
            plot.dataset.row = r;
            plot.dataset.col = c;

            const cell = field[r][c];
            if (cell.crop) {
                plot.textContent = cropTypes[cell.crop].visuals[cell.growthStage];
                plot.classList.add(cell.crop); // Add class for crop color
            } else {
                plot.textContent = '🟫';
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
    store.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.classList.add(item.name.replace(/_/g, '-'));
        const icon = getIconForItem(item.name);
        const finalPrice = Math.round(item.price * (1 - player.upgrades.seedDiscount));

        let priceHtml = `$${item.price}`;
        if (finalPrice < item.price) {
            priceHtml = `<del>$${item.price}</del> <ins>$${finalPrice}</ins>`;
        }

        itemDiv.innerHTML = t('buy_item', {
            icon,
            itemName: t(item.name),
            price: priceHtml
        });
        itemDiv.dataset.itemName = item.name;
        DOM.storeItems.appendChild(itemDiv);
    });
}

function renderReference() {
    DOM.refContent.innerHTML = '';
    Object.keys(cropTypes).forEach(cropName => {
        const crop = cropTypes[cropName];
        const storeItem = store.find(s => s.name === `${cropName}_seed`);

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
                ${icon} ${t(itemName)}: ${warehouse[itemName]}
                <span>${t('market_item_price', { price })}</span>
                <button class="btn sell-btn" data-crop-name="${itemName}">${t('btn_sell_one')}</button>
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
    DOM.openStoreBtn.textContent = t('btn_store');
    DOM.openMarketBtn.textContent = t('btn_market');
    DOM.openRefBtn.textContent = t('btn_reference');
    DOM.seedsTabBtn.textContent = t('seeds_tab');
    DOM.upgradesTabBtn.textContent = t('upgrades_tab');
}

function renderUpgrades() {
    DOM.upgradesItems.innerHTML = '';
    for (const upgradeId in upgrades) {
        const upgrade = upgrades[upgradeId];
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');

        let buyButton = `<button class="btn" data-upgrade-id="${upgradeId}">Buy ($${upgrade.cost})</button>`;
        if (upgrade.purchased) {
            buyButton = `<span>Purchased</span>`;
        }

        itemDiv.innerHTML = `
            <strong>${upgrade.name}</strong>
            <p>${upgrade.description}</p>
            ${buyButton}
        `;
        DOM.upgradesItems.appendChild(itemDiv);
    }
}

function renderPlayerState() {
    DOM.moneyDisplay.textContent = `💰 $${player.money}`;

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
    DOM.bonusDisplay.innerHTML = bonusHtml;
}

export function renderAll() {
    renderStaticUI();
    renderField();
    renderWarehouse();
    renderStore();
    renderReference();
    renderMarket();
    renderUpgrades();
    renderPlayerState();
}
