document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const fieldGrid = document.getElementById('field-grid');
    const warehouseItems = document.getElementById('warehouse-items');
    const storeItems = document.getElementById('store-items');
    const storeModal = document.getElementById('store-modal');
    const openStoreBtn = document.getElementById('open-store-btn');
    const closeBtn = document.querySelector('.close-btn');

    // --- Game State ---
    const NUM_ROWS = 5;
    const NUM_COLS = 5;

    let player = {
        money: 100,
        selectedSeed: null
    };

    let field = Array(NUM_ROWS).fill(null).map(() => Array(NUM_COLS).fill({ crop: null, growthStage: 0 }));

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
            maxGrowth: 3,
            visuals: ['🌱', '🌿', '🌾'],
            harvestYield: 1
        },
        'carrot': {
            icon: '🥕',
            seed_icon: '🌱',
            maxGrowth: 4,
            visuals: ['🌱', '🌿', '🥕', '🥕'],
            harvestYield: 1
        },
        'tomato': {
            icon: '🍅',
            seed_icon: '🌱',
            maxGrowth: 5,
            visuals: ['🌱', '🌿', '🍅', '🍅', '🍅'],
            harvestYield: 2
        },
        'potato': {
            icon: '🥔',
            seed_icon: '🌱',
            maxGrowth: 4,
            visuals: ['🌱', '🌿', '🥔', '🥔'],
            harvestYield: 3
        }
    };

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
            const icon = getIconForItem(item.name);
            itemDiv.textContent = `Buy ${icon} ${item.name.replace('_', ' ')} ($${item.price})`;
            itemDiv.dataset.itemName = item.name;
            storeItems.appendChild(itemDiv);
        });
    }

    function renderAll() {
        renderField();
        renderWarehouse();
        renderStore();
        // Could also render player money here if there was a dedicated element
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
                growthStage: 0
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
        if (cell.growthStage >= crop.maxGrowth -1) {
            warehouse[cell.crop] = (warehouse[cell.crop] || 0) + crop.harvestYield;
            field[r][c] = { crop: null, growthStage: 0 };
            renderAll();
        } else {
            alert("Not ready to harvest yet!");
        }
    }

    function gameTick() {
        let changed = false;
        for (let r = 0; r < NUM_ROWS; r++) {
            for (let c = 0; c < NUM_COLS; c++) {
                const cell = field[r][c];
                if (cell.crop) {
                    const crop = cropTypes[cell.crop];
                    if (cell.growthStage < crop.maxGrowth -1) {
                        cell.growthStage++;
                        changed = true;
                    }
                }
            }
        }
        if (changed) {
            renderField();
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

    closeBtn.addEventListener('click', () => {
        storeModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == storeModal) {
            storeModal.style.display = 'none';
        }
    });


    // --- Initial Game Start ---
    renderAll();
    setInterval(gameTick, 2000); // Grow crops every 2 seconds
});
