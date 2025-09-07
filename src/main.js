import { setLanguage, t } from './modules/localization.js';
import { DOM, scheduleUpdate, renderOrderTimers, toggleDebugMenu, renderProductionTimers, showNotification } from './modules/ui.js';
import { plantSeed, harvestCrop, sellCrop, buyUpgrade, gameTick, buySeed, fulfillOrder, forceGenerateOrder, increaseTrust, buyBuilding, startProduction, devAddAllProducts, toggleBuildingAutomation, addXp, devAddMoney, devAddLevel } from './modules/game.js';
import { player, field, warehouse, saveGameState, clearGameState, loadGameState } from './modules/state.js';
import { leveling, store } from './modules/config.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('clear-data-btn').textContent = t('btn_clear_data');
    let gameLoopInterval;
    let orderTimerInterval;

    loadGameState();
    // --- Event Listeners ---
    DOM.fieldGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('plot')) {
            const r = e.target.dataset.row;
            const c = e.target.dataset.col;
            const cell = field[r][c];

            // Prevent interaction with auto-plots
            if (cell.autoCrop) {
                return;
            }

            let stateChanged = false;
            if (cell.crop) {
                stateChanged = harvestCrop(r, c);
            } else {
                stateChanged = plantSeed(r, c);
            }
            if (stateChanged) {
                scheduleUpdate('field');
                scheduleUpdate('warehouse');
                scheduleUpdate('market');
                scheduleUpdate('orders');
                scheduleUpdate('buildings');
                scheduleUpdate('playerState');
                scheduleUpdate('store');
                scheduleUpdate('production');
                scheduleUpdate('upgrades');
                saveGameState();
            }
        }
    });

    DOM.upgradesItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-upgrade-btn')) {
            if (buyUpgrade(e.target.dataset.upgradeId)) {
                // Upgrades can affect many things, so a targeted render is complex.
                // For now, let's update the most common ones.
                scheduleUpdate('playerState');
                scheduleUpdate('warehouse'); // For RP
                scheduleUpdate('upgrades'); // The list of upgrades itself
                scheduleUpdate('field'); // In case of auto-plotter
                saveGameState();
            }
        }
    });

    DOM.storeTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            const tab = e.target.dataset.tab;
            // Toggle active button
            DOM.storeTabs.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');

            // Toggle active content
            document.querySelectorAll('#store-modal .tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${tab}-content`).classList.add('active');
        }
    });

    DOM.refTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            const tab = e.target.dataset.tab;
            // Toggle active button
            DOM.refTabs.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');

            // Toggle active content
            document.querySelectorAll('#ref-modal .tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${tab}-content`).classList.add('active');
        }
    });

    DOM.productionItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-building-btn')) {
            if (buyBuilding(e.target.dataset.buildingId)) {
                scheduleUpdate('buildings');
                scheduleUpdate('production'); // The store tab for production
                scheduleUpdate('playerState'); // For money
                saveGameState();
            }
        }
    });

    DOM.buildingsGrid.addEventListener('click', (e) => {
        const buildingId = e.target.dataset.buildingId;
        if (!buildingId) return;

        let stateChanged = false;
        if (e.target.classList.contains('start-production-btn')) {
            const missing = e.target.dataset.missing;
            if (missing) {
                showNotification(missing);
                return; // Do not proceed with production
            }
            const recipeIndex = e.target.dataset.recipeIndex;
            stateChanged = startProduction(buildingId, recipeIndex);
        } else if (e.target.classList.contains('toggle-auto-btn')) {
            stateChanged = toggleBuildingAutomation(buildingId);
        } else if (e.target.classList.contains('recipe-selector-btn')) {
            const recipeIndex = parseInt(e.target.dataset.recipeIndex, 10);
            player.buildings[buildingId].selectedRecipe = recipeIndex;
            stateChanged = true;
        }

        if (stateChanged) {
            scheduleUpdate('buildings');
            scheduleUpdate('warehouse'); // Starting production can use items
            scheduleUpdate('playerState'); // Starting production can cost money
            saveGameState();
        }
    });

    DOM.warehouseItems.addEventListener('click', (e) => {
        const seed = e.target.closest('[data-seed]');
        if (seed) {
            player.selectedSeed = seed.dataset.seed;
            scheduleUpdate('warehouse');
        }
    });

    DOM.storeItems.addEventListener('click', (e) => {
        if (!e.target.classList.contains('buy-btn')) return;

        const itemName = e.target.dataset.itemName;
        const amountType = e.target.dataset.amount;
        let amount = 0;

    const item = store.find(i => i.name === itemName);
    if (!item) return;
    const finalPrice = Math.round(item.price * (1 - (player.upgrades.seedDiscount + player.npcBonuses.seedDiscount)));

    let maxAmount;
    if (finalPrice <= 0) {
        maxAmount = 9999; // A large number for free items
    } else {
        maxAmount = Math.floor(player.money / finalPrice);
    }

    if (amountType === 'max') {
        amount = maxAmount;
    } else if (amountType.endsWith('%')) {
        const percentage = parseInt(amountType.slice(0, -1), 10) / 100;
        amount = Math.ceil(maxAmount * percentage);
        } else {
            amount = parseInt(amountType, 10);
        }


        if (buySeed(itemName, amount)) {
            scheduleUpdate('warehouse');
            scheduleUpdate('playerState'); // Money changes
            saveGameState();
        }
    });

    DOM.langEnBtn.addEventListener('click', () => {
        setLanguage('en');
        scheduleUpdate('all');
    });
    DOM.langUkBtn.addEventListener('click', () => {
        setLanguage('uk');
        scheduleUpdate('all');
    });

    document.getElementById('clear-data-btn').addEventListener('click', () => {
        if (confirm(t('confirm_clear_data'))) {
            clearGameState(gameLoopInterval, orderTimerInterval);
        }
    });

    // Modal event listeners
    DOM.openStoreBtn.addEventListener('click', () => {
        DOM.storeModal.style.display = 'block';
    });
    DOM.storeCloseBtn.addEventListener('click', () => {
        DOM.storeModal.style.display = 'none';
    });

    DOM.openRefBtn.addEventListener('click', () => {
        DOM.refModal.style.display = 'block';
    });
    DOM.refCloseBtn.addEventListener('click', () => {
        DOM.refModal.style.display = 'none';
    });

    DOM.openMarketBtn.addEventListener('click', () => {
        DOM.marketModal.style.display = 'block';
    });
    DOM.marketCloseBtn.addEventListener('click', () => {
        DOM.marketModal.style.display = 'none';
    });

    DOM.marketItems.addEventListener('click', (e) => {
        if (!e.target.classList.contains('sell-btn')) return;

        const cropName = e.target.dataset.cropName;
        const amountType = e.target.dataset.amount;
        let amountToSell = 0;

    const availableAmount = warehouse[cropName];

    if (amountType === 'max') {
        amountToSell = availableAmount;
    } else if (amountType.endsWith('%')) {
        const percentage = parseInt(amountType.slice(0, -1), 10) / 100;
        amountToSell = Math.ceil(availableAmount * percentage);
    } else {
        amountToSell = parseInt(amountType, 10);
        }

        if (sellCrop(cropName, amountToSell)) {
            scheduleUpdate('warehouse');
            scheduleUpdate('market');
            scheduleUpdate('playerState'); // Money changes
            saveGameState();
        }
    });

    // --- Modal Closing Logic ---
    DOM.levelUpCloseBtn.addEventListener('click', () => {
        DOM.levelUpModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == DOM.storeModal) {
            DOM.storeModal.style.display = 'none';
        }
        if (e.target == DOM.refModal) {
            DOM.refModal.style.display = 'none';
        }
        if (e.target == DOM.marketModal) {
            DOM.marketModal.style.display = 'none';
        }
        if (e.target == DOM.levelUpModal) {
            DOM.levelUpModal.style.display = 'none';
        }
    });

    DOM.orderItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('fulfill-btn')) {
            const customerId = e.target.dataset.customerId;
            if (fulfillOrder(customerId)) {
                scheduleUpdate('orders');
                scheduleUpdate('warehouse');
                scheduleUpdate('playerState'); // For money and XP
                scheduleUpdate('store');
                scheduleUpdate('production');
                scheduleUpdate('upgrades');
                saveGameState();
            }
        }
    });


    // --- Initial Game Start ---
    const initialLevel = leveling.find(l => l.level === player.level);
    if (initialLevel) {
        player.xpToNextLevel = initialLevel.xpRequired;
    }
    scheduleUpdate('all');
    gameLoopInterval = setInterval(() => {
        const changes = gameTick();
        if (changes.growth) {
            scheduleUpdate('field');
            scheduleUpdate('warehouse');
            scheduleUpdate('playerState');
            scheduleUpdate('orders');
        }
        if (changes.market) {
            scheduleUpdate('market');
        }
        if (changes.orders) {
            scheduleUpdate('orders');
        }
        if (changes.production) {
            scheduleUpdate('buildings');
            scheduleUpdate('warehouse'); // Production creates items
            scheduleUpdate('playerState'); // Production gives XP
            scheduleUpdate('orders');
            scheduleUpdate('store');
            scheduleUpdate('production');
            scheduleUpdate('upgrades');
        }

    }, 1000); // Main game loop
    orderTimerInterval = setInterval(() => {
        renderOrderTimers();
        renderProductionTimers();
    }, 1000);

    // --- Debug ---
    let sequence = '';
    const cheatCode = 'shnaider';
    document.addEventListener('keydown', (e) => {
        sequence += e.key.toLowerCase();
        if (sequence.length > cheatCode.length) {
            sequence = sequence.slice(1);
        }
        if (sequence === cheatCode) {
            toggleDebugMenu();
            sequence = ''; // Reset sequence
        }
    });

    DOM.debugControls.addEventListener('click', (e) => {
        const id = e.target.id;
        let stateChanged = false;

        if (id === 'dev-add-level') {
            stateChanged = devAddLevel();
        } else if (id === 'dev-add-money') {
            stateChanged = devAddMoney();
        } else if (id === 'dev-add-products') {
            stateChanged = devAddAllProducts();
        }

        if (stateChanged) {
            scheduleUpdate('buildings');
            scheduleUpdate('warehouse'); // Starting production can use items
            scheduleUpdate('playerState'); // Starting production can cost money
            saveGameState();
        }
    });
});
