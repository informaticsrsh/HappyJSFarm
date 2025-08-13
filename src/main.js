import { setLanguage } from './modules/localization.js';
import { DOM, renderAll } from './modules/ui.js';
import { plantSeed, harvestCrop, sellCrop, buyUpgrade, gameTick, buySeed } from './modules/game.js';
import { player, field, warehouse } from './modules/state.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Event Listeners ---
    DOM.fieldGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('plot')) {
            const r = e.target.dataset.row;
            const c = e.target.dataset.col;
            const cell = field[r][c];
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
        if (e.target.dataset.upgradeId) {
            if (buyUpgrade(e.target.dataset.upgradeId)) {
                renderAll();
            }
        }
    });

    DOM.storeTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            const tab = e.target.dataset.tab;
            DOM.storeTabs.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');

            DOM.seedsContent.classList.remove('active');
            DOM.upgradesContent.classList.remove('active');
            if (tab === 'seeds') {
                DOM.seedsContent.classList.add('active');
            } else {
                DOM.upgradesContent.classList.add('active');
            }
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
    });


    // --- Initial Game Start ---
    renderAll();
    setInterval(() => {
        if (gameTick()) {
            renderAll();
        }
    }, 100); // Check for growth every 100ms
});
