import { setLanguage, t } from './modules/localization.js';
import { DOM, renderAll, renderOrderTimers } from './modules/ui.js';
import { plantSeed, harvestCrop, sellCrop, buyUpgrade, gameTick, buySeed, fulfillOrder, forceGenerateOrder, increaseTrust, buyBuilding, startProduction, devAddAllProducts, toggleBuildingAutomation, addXp } from './modules/game.js';
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
                renderAll();
                saveGameState();
            }
        }
    });

    DOM.upgradesItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-upgrade-btn')) {
            if (buyUpgrade(e.target.dataset.upgradeId)) {
                renderAll();
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
                renderAll();
                saveGameState();
            }
        }
    });

    DOM.buildingsGrid.addEventListener('click', (e) => {
        const buildingId = e.target.dataset.buildingId;
        if (!buildingId) return;

        let stateChanged = false;
        if (e.target.classList.contains('start-production-btn')) {
            const recipeIndex = e.target.dataset.recipeIndex;
            stateChanged = startProduction(buildingId, recipeIndex);
        } else if (e.target.classList.contains('toggle-auto-btn')) {
            stateChanged = toggleBuildingAutomation(buildingId);
        }

        if (stateChanged) {
            renderAll();
            saveGameState();
        }
    });

    DOM.warehouseItems.addEventListener('click', (e) => {
        const seed = e.target.closest('[data-seed]');
        if (seed) {
            player.selectedSeed = seed.dataset.seed;
            renderAll();
        }
    });

    DOM.storeItems.addEventListener('click', (e) => {
        if (!e.target.classList.contains('buy-btn')) return;

        const itemName = e.target.dataset.itemName;
        const amountType = e.target.dataset.amount;
        let amount = 0;

    if (amountType === 'max') {
            const item = store.find(i => i.name === itemName);
            if (!item) return;
            const finalPrice = Math.round(item.price * (1 - (player.upgrades.seedDiscount + player.npcBonuses.seedDiscount)));
            if (finalPrice <= 0) {
                amount = 9999; // Or some other large number if price is free
            } else {
                amount = Math.floor(player.money / finalPrice);
            }
        } else {
            amount = parseInt(amountType, 10);
        }


        if (buySeed(itemName, amount)) {
            renderAll();
            saveGameState();
        }
    });

    DOM.langEnBtn.addEventListener('click', () => {
        setLanguage('en');
        renderAll();
    });
    DOM.langUkBtn.addEventListener('click', () => {
        setLanguage('uk');
        renderAll();
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

    if (amountType === 'max') {
            amountToSell = warehouse[cropName];
    } else {
        amountToSell = parseInt(amountType, 10);
        }

        if (sellCrop(cropName, amountToSell)) {
            renderAll();
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
                renderAll();
                saveGameState();
            }
        }
    });


    // --- Initial Game Start ---
    const initialLevel = leveling.find(l => l.level === player.level);
    if (initialLevel) {
        player.xpToNextLevel = initialLevel.xpRequired;
    }
    renderAll();
    gameLoopInterval = setInterval(() => {
        if (gameTick()) {
            renderAll();
        }
    }, 1000); // Main game loop
    orderTimerInterval = setInterval(renderOrderTimers, 1000); // Timer-only render loop
});
