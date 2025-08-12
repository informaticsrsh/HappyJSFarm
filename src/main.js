document.addEventListener('DOMContentLoaded', () => {
    // --- Localization Engine ---
    const locales = {
        "en": {
            "title": "My Farm Game",
            "store_title": "Store",
            "market_title": "Market",
            "reference_title": "Reference",
            "warehouse_title": "Warehouse",
            "btn_store": "Store",
            "btn_market": "Market",
            "btn_reference": "Reference",
            "btn_sell_one": "Sell 1",
            "wheat_seed": "wheat seed",
            "carrot_seed": "carrot seed",
            "tomato_seed": "tomato seed",
            "potato_seed": "potato seed",
            "wheat": "wheat",
            "carrot": "carrot",
            "tomato": "tomato",
            "potato": "potato",
            "buy_item": "Buy {icon} {itemName} (${price})",
            "warehouse_item": "{icon} {itemName}: {amount}",
            "market_item_price": "(Price: ${price})",
            "ref_seed_price": "Seed Price:",
            "ref_growth_time": "Growth Time:",
            "ref_yield": "Yield:",
            "ref_market_price": "Market Price:",
            "ref_stages": "Stages:",
            "ref_per_stage": "{time}s per stage",
            "ref_yield_range": "{min} to {max}",
            "alert_select_seed": "Select a seed from the warehouse first!",
            "alert_not_ready_harvest": "Not ready to harvest yet!",
            "alert_no_crop_to_sell": "You don't have any to sell!",
            "alert_not_enough_money": "Not enough money!"
        },
        "uk": {
            "title": "Моя Ферма",
            "store_title": "Крамниця",
            "market_title": "Ринок",
            "reference_title": "Довідник",
            "warehouse_title": "Склад",
            "btn_store": "Крамниця",
            "btn_market": "Ринок",
            "btn_reference": "Довідник",
            "btn_sell_one": "Продати 1",
            "wheat_seed": "насіння пшениці",
            "carrot_seed": "насіння моркви",
            "tomato_seed": "насіння томатів",
            "potato_seed": "насіння картоплі",
            "wheat": "пшениця",
            "carrot": "морква",
            "tomato": "томат",
            "potato": "картопля",
            "buy_item": "Купити {icon} {itemName} (${price})",
            "warehouse_item": "{icon} {itemName}: {amount}",
            "market_item_price": "(Ціна: ${price})",
            "ref_seed_price": "Ціна насіння:",
            "ref_growth_time": "Час росту:",
            "ref_yield": "Урожай:",
            "ref_market_price": "Ринкова ціна:",
            "ref_stages": "Стадії:",
            "ref_per_stage": "{time}с за стадію",
            "ref_yield_range": "від {min} до {max}",
            "alert_select_seed": "Спочатку виберіть насіння зі складу!",
            "alert_not_ready_harvest": "Ще не готово для збору!",
            "alert_no_crop_to_sell": "У вас немає нічого для продажу!",
            "alert_not_enough_money": "Недостатньо грошей!"
        }
    };

    let currentLang = 'en';
    let translations = locales[currentLang];

    function t(key, options = {}) {
        let text = translations[key] || key;
        for (const option in options) {
            text = text.replace(`{${option}}`, options[option]);
        }
        return text;
    }

    function setLanguage(lang) {
        currentLang = lang;
        translations = locales[lang];
        renderAll();
    }

    // --- DOM Elements ---
    const DOM = {
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
        storeTitle: document.querySelector('#store-modal h2'),
        marketTitle: document.querySelector('#market-modal h2'),
        refTitle: document.querySelector('#ref-modal h2')
    };

    // --- Game State ---
    const NUM_ROWS = 5;
    const NUM_COLS = 5;

    let player = {
        money: 100,
        selectedSeed: null
    };

    let field = Array(NUM_ROWS).fill(null).map(() => Array(NUM_COLS).fill({ crop: null, growthStage: 0, stageStartTime: 0 }));

    let warehouse = {
        'wheat_seed': 5,
        'carrot_seed': 3,
        'tomato_seed': 2,
        'potato_seed': 2,
        'wheat': 0,
        'carrot': 0,
        'tomato': 0,
        'potato': 0
    };

    const store = [
        { name: 'wheat_seed', price: 10, type: 'seed' },
        { name: 'carrot_seed', price: 15, type: 'seed' },
        { name: 'tomato_seed', price: 20, type: 'seed' },
        { name: 'potato_seed', price: 25, type: 'seed' }
    ];

    const cropTypes = {
        'wheat': {
            icon: '🌾',
            seed_icon: '🌱',
            growthTime: 3000, // ms per stage
            visuals: ['🌱', '🌿', '🌾'],
            yieldRange: [1, 3],
            maxPrice: 15,
            minPrice: 5,
            priceRecoveryRate: 10000, // ms to recover 1 price point
            salesVolumeForPriceDrop: 10 // amount of sales to drop price by 1
        },
        'carrot': {
            icon: '🥕',
            seed_icon: '🌱',
            growthTime: 4000,
            visuals: ['🌱', '🌿', '🥕'],
            yieldRange: [1, 2],
            maxPrice: 25,
            minPrice: 10,
            priceRecoveryRate: 12000,
            salesVolumeForPriceDrop: 8
        },
        'tomato': {
            icon: '🍅',
            seed_icon: '🌱',
            growthTime: 5000,
            visuals: ['🌱', '🌿', '🍅'],
            yieldRange: [2, 4],
            maxPrice: 50,
            minPrice: 20,
            priceRecoveryRate: 15000,
            salesVolumeForPriceDrop: 5
        },
        'potato': {
            icon: '🥔',
            seed_icon: '🌱',
            growthTime: 6000,
            visuals: ['🌱', '🌿', '🥔'],
            yieldRange: [3, 6],
            maxPrice: 80,
            minPrice: 30,
            priceRecoveryRate: 20000,
            salesVolumeForPriceDrop: 3
        }
    };

    let marketState = {};
    Object.keys(cropTypes).forEach(cropName => {
        marketState[cropName] = {
            currentPrice: cropTypes[cropName].maxPrice,
            totalSold: 0,
            lastRecoveryTime: Date.now()
        };
    });

    function getIconForItem(itemName) {
        if (itemName.endsWith('_seed')) {
            const cropName = itemName.replace('_seed', '');
            return cropTypes[cropName]?.seed_icon || '🌰';
        } else {
            return cropTypes[itemName]?.icon || '📦';
        }
    }

    // --- Rendering Functions ---
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
                itemDiv.classList.add(item.replace(/ /g, '-'));
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
            itemDiv.classList.add(item.name.replace(/ /g, '-'));
            const icon = getIconForItem(item.name);
            itemDiv.textContent = t('buy_item', {
                icon,
                itemName: t(item.name),
                price: item.price
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
                const price = marketState[itemName].currentPrice;
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
        DOM.storeTitle.textContent = t('store_title');
        DOM.marketTitle.textContent = t('market_title');
        DOM.refTitle.textContent = t('reference_title');
        DOM.warehouseTitle.textContent = t('warehouse_title');
        DOM.openStoreBtn.textContent = t('btn_store');
        DOM.openMarketBtn.textContent = t('btn_market');
        DOM.openRefBtn.textContent = t('btn_reference');
    }

    function renderAll() {
        renderStaticUI();
        renderField();
        renderWarehouse();
        renderStore();
        renderReference();
        renderMarket();
    }

    // --- Game Logic Functions ---
    function plantSeed(r, c) {
        if (!player.selectedSeed) {
            alert(t('alert_select_seed'));
            return;
        }
        if (warehouse[player.selectedSeed] > 0) {
            warehouse[player.selectedSeed]--;
            const cropName = player.selectedSeed.replace('_seed', '');
            field[r][c] = {
                crop: cropName,
                growthStage: 0,
                stageStartTime: Date.now()
            };
            if (warehouse[player.selectedSeed] === 0) {
                player.selectedSeed = null; // Deselect if non left
            }
            renderAll();
        }
    }

    function harvestCrop(r, c) {
        const cell = field[r][c];
        const crop = cropTypes[cell.crop];
        if (cell.growthStage >= crop.visuals.length - 1) {
            const [min, max] = crop.yieldRange;
            const yieldAmount = Math.floor(Math.random() * (max - min + 1)) + min;
            warehouse[cell.crop] = (warehouse[cell.crop] || 0) + yieldAmount;
            field[r][c] = { crop: null, growthStage: 0, stageStartTime: 0 };
            renderAll();
        } else {
            alert(t('alert_not_ready_harvest'));
        }
    }

    function sellCrop(cropName) {
        if (warehouse[cropName] > 0) {
            const crop = cropTypes[cropName];
            const market = marketState[cropName];

            warehouse[cropName]--;
            player.money += market.currentPrice;
            market.totalSold++;

            // Recalculate price
            const priceDrop = Math.floor(market.totalSold / crop.salesVolumeForPriceDrop);
            market.currentPrice = Math.max(crop.minPrice, crop.maxPrice - priceDrop);

            renderAll();
        } else {
            alert(t('alert_no_crop_to_sell'));
        }
    }

    function updateCropGrowth(now) {
        let fieldChanged = false;
        for (let r = 0; r < NUM_ROWS; r++) {
            for (let c = 0; c < NUM_COLS; c++) {
                const cell = field[r][c];
                if (cell.crop) {
                    const crop = cropTypes[cell.crop];
                    if (cell.growthStage < crop.visuals.length - 1) {
                        if (now - cell.stageStartTime >= crop.growthTime) {
                            cell.growthStage++;
                            cell.stageStartTime = now;
                            fieldChanged = true;
                        }
                    }
                }
            }
        }
        if (fieldChanged) {
            renderField();
        }
    }

    function updateMarketPrices(now) {
        let marketChanged = false;
        for (const cropName in marketState) {
            const market = marketState[cropName];
            const crop = cropTypes[cropName];
            if (market.currentPrice < crop.maxPrice) {
                if (now - market.lastRecoveryTime >= crop.priceRecoveryRate) {
                    market.totalSold = Math.max(0, market.totalSold - crop.salesVolumeForPriceDrop);
                    const priceDrop = Math.floor(market.totalSold / crop.salesVolumeForPriceDrop);
                    market.currentPrice = Math.max(crop.minPrice, crop.maxPrice - priceDrop);
                    market.lastRecoveryTime = now;
                    marketChanged = true;
                }
            }
        }
        if (marketChanged) {
            renderMarket();
            renderReference();
        }
    }

    function gameTick() {
        const now = Date.now();
        updateCropGrowth(now);
        updateMarketPrices(now);
    }

    // --- Event Listeners ---
    DOM.fieldGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('plot')) {
            const r = e.target.dataset.row;
            const c = e.target.dataset.col;
            const cell = field[r][c];
            if (cell.crop) {
                harvestCrop(r, c);
            } else {
                plantSeed(r, c);
            }
        }
    });

    DOM.warehouseItems.addEventListener('click', (e) => {
        if (e.target.dataset.seed) {
            player.selectedSeed = e.target.dataset.seed;
            renderWarehouse(); // Re-render to show selection
        }
    });

    DOM.storeItems.addEventListener('click', (e) => {
        if (e.target.dataset.itemName) {
            const itemName = e.target.dataset.itemName;
            const item = store.find(i => i.name === itemName);
            if (player.money >= item.price) {
                player.money -= item.price;
                warehouse[itemName] = (warehouse[itemName] || 0) + 1;
                renderAll();
            } else {
                alert(t('alert_not_enough_money'));
            }
        }
    });

    DOM.langEnBtn.addEventListener('click', () => setLanguage('en'));
    DOM.langUkBtn.addEventListener('click', () => setLanguage('uk'));

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
        if (e.target.classList.contains('sell-btn')) {
            const cropName = e.target.dataset.cropName;
            sellCrop(cropName);
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
    setInterval(gameTick, 100); // Check for growth every 100ms
});
