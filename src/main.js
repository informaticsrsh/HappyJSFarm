document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const fieldGrid = document.getElementById('field-grid');
    const warehouseItems = document.getElementById('warehouse-items');
    const storeItems = document.getElementById('store-items');
    const storeModal = document.getElementById('store-modal');
    const openStoreBtn = document.getElementById('open-store-btn');
    const storeCloseBtn = document.querySelector('.store-close');

    const refModal = document.getElementById('ref-modal');
    const openRefBtn = document.getElementById('open-ref-btn');
    const refCloseBtn = document.querySelector('.ref-close');
    const refContent = document.getElementById('ref-content');

    const marketModal = document.getElementById('market-modal');
    const openMarketBtn = document.getElementById('open-market-btn');
    const marketCloseBtn = document.querySelector('.market-close');
    const marketItems = document.getElementById('market-items');

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
        fieldGrid.innerHTML = '';
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
                fieldGrid.appendChild(plot);
            }
        }
    }

    function renderWarehouse() {
        warehouseItems.innerHTML = '';
        for (const item in warehouse) {
            if (warehouse[item] > 0) {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                itemDiv.classList.add(item.replace(/ /g, '-')); // Add class for styling
                const icon = getIconForItem(item);
                itemDiv.textContent = `${icon} ${item.replace('_', ' ')}: ${warehouse[item]}`;
                if (item.endsWith('_seed')) {
                    itemDiv.dataset.seed = item;
                    if (player.selectedSeed === item) {
                        itemDiv.classList.add('selected');
                    }
                }
                warehouseItems.appendChild(itemDiv);
            }
        }
    }

    function renderStore() {
        storeItems.innerHTML = '';
        store.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.classList.add(item.name.replace(/ /g, '-')); // Add class for styling
            const icon = getIconForItem(item.name);
            itemDiv.textContent = `Buy ${icon} ${item.name.replace('_', ' ')} ($${item.price})`;
            itemDiv.dataset.itemName = item.name;
            storeItems.appendChild(itemDiv);
        });
    }

    function renderReference() {
        refContent.innerHTML = '';
        Object.keys(cropTypes).forEach(cropName => {
            const crop = cropTypes[cropName];
            const storeItem = store.find(s => s.name === `${cropName}_seed`);

            const cropDiv = document.createElement('div');
            cropDiv.innerHTML = `
                <h3>${crop.icon} ${cropName.charAt(0).toUpperCase() + cropName.slice(1)}</h3>
                <p><strong>Seed Price:</strong> $${storeItem.price}</p>
                <p><strong>Growth Time:</strong> ${crop.growthTime / 1000}s per stage</p>
                <p><strong>Yield:</strong> ${crop.yieldRange[0]} to ${crop.yieldRange[1]}</p>
                <p><strong>Market Price:</strong> $${crop.minPrice} - $${crop.maxPrice}</p>
                <p><strong>Stages:</strong> ${crop.visuals.join(' → ')}</p>
            `;
            refContent.appendChild(cropDiv);
        });
    }

    function renderMarket() {
        marketItems.innerHTML = '';
        Object.keys(warehouse).forEach(itemName => {
            if (!itemName.endsWith('_seed') && warehouse[itemName] > 0) {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                const icon = getIconForItem(itemName);
                const price = marketState[itemName].currentPrice;
                itemDiv.innerHTML = `
                    ${icon} ${itemName}: ${warehouse[itemName]}
                    <span>(Price: $${price})</span>
                    <button class="btn sell-btn" data-crop-name="${itemName}">Sell 1</button>
                `;
                marketItems.appendChild(itemDiv);
            }
        });
    }

    function renderAll() {
        renderField();
        renderWarehouse();
        renderStore();
        renderReference();
        renderMarket();
    }

    // --- Game Logic Functions ---
    function plantSeed(r, c) {
        if (!player.selectedSeed) {
            alert("Select a seed from the warehouse first!");
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
            alert("Not ready to harvest yet!");
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
            alert("You don't have any to sell!");
        }
    }

    function gameTick() {
        const now = Date.now();
        let fieldChanged = false;

        // 1. Grow crops
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

        // 2. Update market prices
        let marketChanged = false;
        for (const cropName in marketState) {
            const market = marketState[cropName];
            const crop = cropTypes[cropName];
            if (market.currentPrice < crop.maxPrice) {
                if (now - market.lastRecoveryTime >= crop.priceRecoveryRate) {
                    // Recover some sales volume, which in turn raises the price
                    market.totalSold = Math.max(0, market.totalSold - crop.salesVolumeForPriceDrop);
                    const priceDrop = Math.floor(market.totalSold / crop.salesVolumeForPriceDrop);
                    market.currentPrice = Math.max(crop.minPrice, crop.maxPrice - priceDrop);
                    market.lastRecoveryTime = now;
                    marketChanged = true;
                }
            }
        }
        if (marketChanged) {
            // Re-render any components that show market prices
            if (typeof renderMarket === 'function') renderMarket();
            if (typeof renderReference === 'function') renderReference();
        }
    }

    // --- Event Listeners ---
    fieldGrid.addEventListener('click', (e) => {
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

    warehouseItems.addEventListener('click', (e) => {
        if (e.target.dataset.seed) {
            player.selectedSeed = e.target.dataset.seed;
            renderWarehouse(); // Re-render to show selection
        }
    });

    storeItems.addEventListener('click', (e) => {
        if (e.target.dataset.itemName) {
            const itemName = e.target.dataset.itemName;
            const item = store.find(i => i.name === itemName);
            if (player.money >= item.price) {
                player.money -= item.price;
                warehouse[itemName] = (warehouse[itemName] || 0) + 1;
                renderAll();
            } else {
                alert("Not enough money!");
            }
        }
    });

    // Modal event listeners
    openStoreBtn.addEventListener('click', () => {
        storeModal.style.display = 'block';
    });
    storeCloseBtn.addEventListener('click', () => {
        storeModal.style.display = 'none';
    });

    openRefBtn.addEventListener('click', () => {
        refModal.style.display = 'block';
    });
    refCloseBtn.addEventListener('click', () => {
        refModal.style.display = 'none';
    });

    openMarketBtn.addEventListener('click', () => {
        marketModal.style.display = 'block';
    });
    marketCloseBtn.addEventListener('click', () => {
        marketModal.style.display = 'none';
    });

    marketItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('sell-btn')) {
            const cropName = e.target.dataset.cropName;
            sellCrop(cropName);
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target == storeModal) {
            storeModal.style.display = 'none';
        }
        if (e.target == refModal) {
            refModal.style.display = 'none';
        }
        if (e.target == marketModal) {
            marketModal.style.display = 'none';
        }
    });


    // --- Initial Game Start ---
    renderAll();
    setInterval(gameTick, 100); // Check for growth every 100ms
});
