import { setLanguage } from './modules/localization.js';
import { DOM, renderAll, renderOrderTimers } from './modules/ui.js';
import { plantSeed, harvestCrop, sellCrop, buyUpgrade, gameTick, buySeed, fulfillOrder, forceGenerateOrder, increaseTrust, buyBuilding, startProduction, devAddAllProducts, toggleBuildingAutomation, addXp } from './modules/game.js';
import { player, field, warehouse } from './modules/state.js';
import { leveling } from './modules/config.js';

document.addEventListener('DOMContentLoaded', () => {
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
            if (stateChanged) renderAll();
        }
    });

    DOM.upgradesItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-upgrade-btn')) {
            if (buyUpgrade(e.target.dataset.upgradeId)) {
                renderAll();
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
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${tab}-content`).classList.add('active');
        }
    });

    DOM.productionItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-building-btn')) {
            if (buyBuilding(e.target.dataset.buildingId)) {
                renderAll();
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
        }
    });

    DOM.devXpBtn.addEventListener('click', () => {
        addXp(200);
        renderAll();
    });

    DOM.warehouseItems.addEventListener('click', (e) => {
        const seed = e.target.closest('[data-seed]');
        if (seed) {
            player.selectedSeed = seed.dataset.seed;
            renderAll();
        }
    });

    DOM.devPanel.addEventListener('click', (e) => {
        if (e.target.classList.contains('dev-trust-btn')) {
            const customerId = e.target.dataset.customerId;
            if (increaseTrust(customerId, 50)) {
                renderAll();
            }
        }
    });

    DOM.storeItems.addEventListener('click', (e) => {
        if (!e.target.classList.contains('buy-btn')) return;

        const itemName = e.target.dataset.itemName;
        const input = e.target.previousElementSibling;
        const amount = parseInt(input.value, 10);

        if (buySeed(itemName, amount)) {
            renderAll();
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
    DOM.devMoneyBtn.addEventListener('click', () => {
        player.money += 1000;
        renderAll();
    });
    DOM.devOrderBtn.addEventListener('click', () => {
        if (forceGenerateOrder()) {
            renderAll();
        }
    });
    DOM.devAddAllBtn.addEventListener('click', () => {
        if (devAddAllProducts()) {
            renderAll();
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

        if (amountType === '1') {
            amountToSell = 1;
        } else if (amountType === 'all') {
            amountToSell = warehouse[cropName];
        } else if (amountType === 'custom') {
            const input = e.target.previousElementSibling;
            amountToSell = parseInt(input.value, 10);
        }

        if (sellCrop(cropName, amountToSell)) {
            renderAll();
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
            }
        }
    });


    // --- Initial Game Start ---
    const initialLevel = leveling.find(l => l.level === player.level);
    if (initialLevel) {
        player.xpToNextLevel = initialLevel.xpRequired;
    }
    renderAll();
    setInterval(() => {
        if (gameTick()) {
            renderAll();
        }
    }, 100); // Main game loop
    setInterval(renderOrderTimers, 1000); // Timer-only render loop
});
