import { t } from './localization.js';
import { player, field, warehouse, marketState, customers, saveGameState } from './state.js';
import { cropTypes, upgrades, NUM_COLS, store, customerConfig, buildings, leveling } from './config.js';
import { showNotification, showLevelUpModal, showSimpleLevelUpModal } from './ui.js';

let lastSaveTime = 0;
const SAVE_INTERVAL = 5000; // 5 seconds

export function addXp(amount) {
    player.xp += amount;
    checkForLevelUp();
}

function checkForLevelUp() {
    while (player.xp >= player.xpToNextLevel) {
        player.level++;
        player.xp -= player.xpToNextLevel;
        const newLevel = player.level;

        const nextLevelConfig = leveling.find(l => l.level === newLevel);
        if (nextLevelConfig) {
            player.xpToNextLevel = nextLevelConfig.xpRequired;
        } else {
            player.xpToNextLevel = Infinity;
        }
        showNotification(t('alert_level_up', { level: newLevel }));

        const newlyUnlocked = {
            crops: store.filter(item => item.requiredLevel === newLevel).map(item => item.name),
            buildings: Object.keys(buildings).filter(id => buildings[id].requiredLevel === newLevel).map(id => buildings[id].name),
            upgrades: Object.keys(upgrades).filter(id => upgrades[id].requiredLevel === newLevel).map(id => upgrades[id].name)
        };

        let farmExpanded = false;
        if (newLevel % 2 === 0 && newLevel <= 10) {
            const newRows = newLevel / 2;
            const expectedRows = 3 + newRows;
            if (field.length < expectedRows) {
                field.push(Array(NUM_COLS).fill(null).map(() => ({ crop: null, growthStage: 0, stageStartTime: 0, autoCrop: null })));
                farmExpanded = true;
            }
        }

        if (newlyUnlocked.crops.length > 0 || newlyUnlocked.buildings.length > 0 || newlyUnlocked.upgrades.length > 0 || farmExpanded) {
            showLevelUpModal(newLevel, newlyUnlocked, farmExpanded);
        } else if (newLevel === 11) {
            showSimpleLevelUpModal(newLevel, t('level_up_max_level'));
        } else {
            showSimpleLevelUpModal(newLevel, t('level_up_congrats', { level: newLevel }));
        }
    }
}

export function plantSeed(r, c, cropToPlant = null) {
    const isAuto = !!cropToPlant;
    const seedName = isAuto ? `${cropToPlant}_seed` : player.selectedSeed;

    if (!seedName) {
        showNotification(t('alert_select_seed'));
        return false;
    }

    const cropName = isAuto ? cropToPlant : seedName.replace('_seed', '');
    const crop = cropTypes[cropName];
    if (player.level < (crop.requiredLevel || 1)) {
        showNotification(t('alert_seed_locked'));
        return false;
    }

    if (warehouse[seedName] > 0) {
        warehouse[seedName]--;
        field[r][c].crop = cropName;
        field[r][c].growthStage = 0;
        field[r][c].stageStartTime = Date.now();

        if (!isAuto && warehouse[seedName] === 0) {
            player.selectedSeed = null; // Deselect if none left
        }
        return true;
    }
    return false;
}

export function harvestCrop(r, c) {
    const cell = field[r][c];
    if (!cell.crop) return false;

    const crop = cropTypes[cell.crop];
    if (cell.growthStage >= crop.visuals.length - 1) {
        const [min, max] = crop.yieldRange;
        let yieldAmount = Math.floor(Math.random() * (max - min + 1)) + min;
        yieldAmount += (player.upgrades.yieldBonus + player.npcBonuses.yieldBonus);
        warehouse[cell.crop] = (warehouse[cell.crop] || 0) + yieldAmount;
        addXp(crop.xpValue * yieldAmount);
        cell.crop = null;
        cell.growthStage = 0;
        cell.stageStartTime = 0;
        return true;
    } else {
        showNotification(t('alert_not_ready_harvest'));
        return false;
    }
}

function updateMarketPrice(cropName) {
    const crop = cropTypes[cropName];
    const market = marketState[cropName];
    const priceDrop = Math.floor(market.totalSold / crop.salesVolumeForPriceDrop);
    market.currentPrice = Math.max(crop.minPrice, crop.maxPrice - priceDrop);
}

export function sellCrop(cropName, amount) {
    if (!amount || amount <= 0) return false;
    if (warehouse[cropName] > 0 && warehouse[cropName] >= amount) {
        const market = marketState[cropName];

        // Calculate sale price based on the current market price
        const priceBonus = player.npcBonuses.priceBonus[cropName] || 0;
        const salePrice = market.currentPrice + player.upgrades.marketBonus + player.npcBonuses.marketBonus + priceBonus;
        const totalSalePrice = salePrice * amount;

        // Update player money and warehouse
        warehouse[cropName] -= amount;
        player.money += totalSalePrice;

        // Update market state *after* the sale
        market.totalSold += amount;
        updateMarketPrice(cropName);

        return true;
    } else {
        showNotification(t('alert_no_crop_to_sell'));
        return false;
    }
}

export function buySeed(itemName, amount) {
    if (!amount || amount <= 0) return false;
    const item = store.find(i => i.name === itemName);
    if (!item) return false;

    const finalPrice = Math.round(item.price * (1 - (player.upgrades.seedDiscount + player.npcBonuses.seedDiscount)));
    const totalCost = finalPrice * amount;

    if (player.money >= totalCost) {
        player.money -= totalCost;
        warehouse[itemName] = (warehouse[itemName] || 0) + amount;
        return true;
    } else {
        showNotification(t('alert_not_enough_money'));
        return false;
    }
}

export function buyUpgrade(upgradeId) {
    const upgrade = upgrades[upgradeId];
    if (!upgrade) return false;

    if (player.level < (upgrade.requiredLevel || 1)) {
        showNotification(t('alert_upgrade_locked'));
        return false;
    }

    if (upgrade.requiresBuilding && !player.buildings[upgrade.requiresBuilding]?.purchased) {
        showNotification(t('alert_building_required', { building: t(buildings[upgrade.requiresBuilding].name) }));
        return false;
    }

    // Check if max purchases reached
    if (upgrade.repeatable && upgrade.purchasedCount >= upgrade.maxPurchases) {
        showNotification(t('alert_max_purchases'));
        return false;
    }

    // Check if already purchased for non-repeatable upgrades
    if (!upgrade.repeatable && upgrade.purchased) {
        showNotification(t('alert_already_purchased'));
        return false;
    }

    if (upgrade.costCurrency === 'research_points') {
        if (warehouse.research_points < upgrade.cost) {
            showNotification(t('alert_not_enough_research_points'));
            return false;
        }
    } else {
        if (player.money < upgrade.cost) {
            showNotification(t('alert_not_enough_money'));
            return false;
        }
    }


    const { type, crop } = upgrade.effect;

    // Handle auto plot upgrades
    if (type === 'autoPlot') {
        const emptyPlot = field.flat().find(cell => !cell.crop && !cell.autoCrop);
        if (!emptyPlot) {
            showNotification(t('alert_no_empty_plots'));
            return false;
        }
        player.money -= upgrade.cost;
        upgrade.purchasedCount++;
        emptyPlot.autoCrop = crop;
        showNotification(t('alert_plot_converted', { crop: t(crop) }));
        return true;
    }

    // Handle other upgrade types
    if (upgrade.costCurrency === 'research_points') {
        warehouse.research_points -= upgrade.cost;
    } else {
        player.money -= upgrade.cost;
    }

    if (upgrade.repeatable) {
        upgrade.purchasedCount = (upgrade.purchasedCount || 0) + 1;
    } else {
        upgrade.purchased = true;
    }

    const { value } = upgrade.effect;
    if (type === 'growthMultiplier') {
        player.upgrades[type] = value;
    } else if (type === 'buildingAutomation') {
        player.upgrades.buildingAutomation = value;
    } else if (type === 'productionSpeed' || type === 'productionEfficiency' || type === 'productionLuck' || type === 'productionVolume') {
        player.upgrades[type] = (player.upgrades[type] || 0) + value;
    } else {
        player.upgrades[type] = (player.upgrades[type] || 0) + value;
    }

    return true;
}

export function toggleBuildingAutomation(buildingId) {
    if (player.upgrades.buildingAutomation) {
        const building = player.buildings[buildingId];
        if (building && building.purchased) {
            building.automated = !building.automated;
            return true;
        }
    }
    return false;
}

export function buyBuilding(buildingId) {
    const building = buildings[buildingId];
    if (!building || player.buildings[buildingId].purchased) {
        showNotification("Building not available.");
        return false;
    }

    if (player.level < (building.requiredLevel || 1)) {
        showNotification(t('alert_building_locked'));
        return false;
    }

    if (player.money >= building.cost) {
        player.money -= building.cost;
        player.buildings[buildingId].purchased = true;
        return true;
    } else {
        showNotification(t('alert_not_enough_money'));
        return false;
    }
}

export function startProduction(buildingId, recipeIndex) {
    const building = buildings[buildingId];
    const playerBuilding = player.buildings[buildingId];
    const recipe = building.recipes[recipeIndex];

    if (!building || !playerBuilding.purchased) {
        showNotification("Building not purchased.");
        return false;
    }

    const batchSize = 1 + (player.upgrades.productionVolume || 0);

    // Check for required ingredients for the entire batch
    for (const ingredient in recipe.input) {
        const requiredAmount = recipe.input[ingredient] * batchSize;
        if (ingredient === 'money') {
            if (player.money < requiredAmount) {
                showNotification(t('alert_not_enough_money'));
                return false;
            }
        } else {
            if ((warehouse[ingredient] || 0) < requiredAmount) {
                showNotification(t('alert_not_enough_ingredients', { item: t(ingredient) }));
                return false;
            }
        }
    }

    // Consume ingredients for the entire batch
    for (const ingredient in recipe.input) {
        const consumedAmount = recipe.input[ingredient] * batchSize;
        if (ingredient === 'money') {
            player.money -= consumedAmount;
        } else {
            warehouse[ingredient] -= consumedAmount;
        }
    }

    playerBuilding.production.push({
        recipeIndex,
        startTime: Date.now(),
        batchSize
    });
    return true;
}

function updateCropGrowth(now) {
    let fieldChanged = false;
    for (let r = 0; r < field.length; r++) {
        for (let c = 0; c < field[r].length; c++) {
            const cell = field[r][c];

            // Handle automated plots
            if (cell.autoCrop) {
                if (!cell.crop) {
                    // If empty, try to plant
                    if (plantSeed(r, c, cell.autoCrop)) {
                        fieldChanged = true;
                    }
                } else {
                    // If crop is mature, harvest it
                    const crop = cropTypes[cell.crop];
                    if (cell.growthStage >= crop.visuals.length - 1) {
                        if (harvestCrop(r, c)) {
                            fieldChanged = true;
                        }
                    }
                }
            }

            // Handle growth for all plots (manual and auto)
            if (cell.crop && cell.growthStage < cropTypes[cell.crop].visuals.length - 1) {
                const timeToGrow = cropTypes[cell.crop].growthTime * player.upgrades.growthMultiplier * player.npcBonuses.growthMultiplier;
                if (now - cell.stageStartTime >= timeToGrow) {
                    cell.growthStage++;
                    cell.stageStartTime = now;
                    fieldChanged = true;
                }
            }
        }
    }
    return fieldChanged;
}

function updateMarketPrices(now) {
    let marketChanged = false;
    for (const cropName in marketState) {
        const market = marketState[cropName];
        const crop = cropTypes[cropName];
        if (market.currentPrice < crop.maxPrice) {
            if (now - market.lastRecoveryTime >= crop.priceRecoveryRate) {
                market.totalSold = Math.max(0, market.totalSold - crop.salesVolumeForPriceDrop);
                updateMarketPrice(cropName);
                market.lastRecoveryTime = now;
                marketChanged = true;
            }
        }
    }
    return marketChanged;
}

function updateProduction(now) {
    let productionChanged = false;
    for (const buildingId in player.buildings) {
        const playerBuilding = player.buildings[buildingId];
        if (!playerBuilding.purchased) continue;

        const building = buildings[buildingId];

        // --- Handle finished production ---
        if (playerBuilding.production.length > 0) {
            const job = playerBuilding.production[0];
            const recipe = building.recipes[job.recipeIndex];
            const effectiveTime = recipe.productionTime * (1 - (player.upgrades.productionSpeed || 0));

            if (now - job.startTime >= effectiveTime) {
                // Production finished, calculate output
                for (const product in recipe.output) {
                    const baseAmount = recipe.output[product] * job.batchSize;

                    // Apply efficiency bonus
                    let finalAmount = baseAmount * (1 + (player.upgrades.productionEfficiency || 0));

                    // Apply luck bonus
                    if (Math.random() < (player.upgrades.productionLuck || 0)) {
                        finalAmount *= 2; // Double production on lucky roll
                    }

                    const discreteAmount = Math.floor(finalAmount);

                    if (discreteAmount > 0) {
                        warehouse[product] = (warehouse[product] || 0) + discreteAmount;
                        addXp(cropTypes[product].xpValue * discreteAmount);
                        showNotification(t('alert_production_finished', { item: t(product) }));
                    }
                }

                // Remove completed job from queue
                playerBuilding.production.shift();
                productionChanged = true;
            }
        }

        // --- Handle auto-starting production ---
        if (playerBuilding.automated && playerBuilding.production.length === 0) {
             if (building.recipes.length > 0) {
                if (startProduction(buildingId, 0)) {
                    productionChanged = true;
                }
            }
        }
    }
    return productionChanged;
}

function getCustomerTier(trust) {
    let currentTier = customerConfig.trustLevels[0];
    for (const tier of customerConfig.trustLevels) {
        if (trust >= tier.trust) {
            currentTier = tier;
        } else {
            break;
        }
    }
    return currentTier;
}

function generateOrder(customerId) {
    const customer = customers[customerId];
    if (customer.order) return; // Don't generate if one is active

    const availableCrops = Object.keys(cropTypes).filter(crop => cropTypes[crop].requiredLevel <= player.level);
    if (availableCrops.length === 0) return;

    const randomCrop = availableCrops[Math.floor(Math.random() * availableCrops.length)];
    const tier = getCustomerTier(customer.trust);
    const [minSize, maxSize] = tier.size;
    const amount = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    const marketPrice = marketState[randomCrop].currentPrice;
    const reward = Math.round(marketPrice * amount * tier.reward);

    customer.order = {
        crop: randomCrop,
        amount,
        reward,
        expiresAt: Date.now() + customerConfig.orderLifetime
    };
}

function updateOrders(now) {
    let ordersChanged = false;

    // Expire old orders
    for (const customerId in customers) {
        const customer = customers[customerId];
        if (customer.order && now > customer.order.expiresAt) {
            customer.order = null;
            customer.trust = Math.max(0, customer.trust - 10); // Penalty
            updateNpcBonuses();
            ordersChanged = true;
            showNotification(t('alert_order_expired', { name: customerConfig.customers[customerId].name }));
        }
    }

    // --- New Generation Logic ---
    const activeOrderCount = Object.values(customers).filter(c => c.order).length;
    const customersWithoutOrders = Object.keys(customers).filter(id => !customers[id].order);

    if (customersWithoutOrders.length === 0) {
        return ordersChanged;
    }

    let ordersToAttempt = 0;
    if (activeOrderCount < 1) {
        ordersToAttempt = 1;
    } else if (activeOrderCount < 3 && Math.random() < 0.05) { // ~40% chance per second
        ordersToAttempt = 1;
    }

    if (ordersToAttempt > 0) {
        customersWithoutOrders.sort(() => 0.5 - Math.random());

        for (let i = 0; i < Math.min(ordersToAttempt, customersWithoutOrders.length); i++) {
            generateOrder(customersWithoutOrders[i]);
            ordersChanged = true;
        }
    }
    return ordersChanged;
}

function updateNpcBonuses() {
    // Reset bonuses to default state
    player.npcBonuses = {
        growthMultiplier: 1.0,
        yieldBonus: 0,
        seedDiscount: 0,
        marketBonus: 0,
        priceBonus: {}
    };

    for (const customerId in customers) {
        const customer = customers[customerId];
        const bonusConfig = customerConfig.customers[customerId].bonus;
        if (!bonusConfig) continue;

        let bonusLevel = 0;
        if (customer.trust >= 400) bonusLevel = 5;
        else if (customer.trust >= 300) bonusLevel = 4;

        if (bonusLevel > 0) {
            const value = bonusConfig[`value_l${bonusLevel}`];
            switch (bonusConfig.type) {
                case 'yieldBonus':
                case 'marketBonus':
                case 'seedDiscount':
                    player.npcBonuses[bonusConfig.type] += value;
                    break;
                case 'growthMultiplier':
                    // For multipliers, we multiply them together, starting from 1.0
                    player.npcBonuses[bonusConfig.type] *= value;
                    break;
                case 'priceBonus':
                    if (!player.npcBonuses.priceBonus[bonusConfig.crop]) {
                        player.npcBonuses.priceBonus[bonusConfig.crop] = 0;
                    }
                    player.npcBonuses.priceBonus[bonusConfig.crop] += value;
                    break;
            }
        }
    }
}


export function gameTick() {
    const now = Date.now();
    const growthChanged = updateCropGrowth(now);
    const marketChanged = updateMarketPrices(now);
    const ordersChanged = updateOrders(now);
    const productionChanged = updateProduction(now);

    if (now - lastSaveTime > SAVE_INTERVAL) {
        saveGameState();
        lastSaveTime = now;
    }

    return growthChanged || marketChanged || ordersChanged || productionChanged;
}

export function fulfillOrder(customerId) {
    const customer = customers[customerId];
    const order = customer.order;

    if (!order) {
        showNotification("This order is no longer available.");
        return false;
    }

    if (warehouse[order.crop] >= order.amount) {
        const xpForItems = (cropTypes[order.crop].xpValue || 0) * order.amount;
        addXp(10 + xpForItems); // Base XP for order + XP for items

        warehouse[order.crop] -= order.amount;
        player.money += order.reward;
        customer.trust += 20; // Reward for fulfilling
        customer.order = null;
        updateNpcBonuses();
        showNotification(t('alert_order_fulfilled', { name: customerConfig.customers[customerId].name }));
        return true;
    } else {
        showNotification(t('alert_not_enough_crops'));
        return false;
    }
}

export function increaseTrust(customerId, amount) {
    if (customers[customerId]) {
        customers[customerId].trust += amount;
        updateNpcBonuses();
        return true;
    }
    return false;
}

export function forceGenerateOrder() {
    const customersWithoutOrders = Object.keys(customers).filter(id => !customers[id].order);
    if (customersWithoutOrders.length > 0) {
        const randomCustomerId = customersWithoutOrders[Math.floor(Math.random() * customersWithoutOrders.length)];
        generateOrder(randomCustomerId);
        return true;
    }
    showNotification("All customers already have orders!");
    return false;
}

export function devAddAllProducts() {
    for (const item in warehouse) {
        if (warehouse.hasOwnProperty(item)) {
            warehouse[item] += 1000;
        }
    }
    return true;
}

export function devAddMoney() {
    player.money += 1000000;
    return true;
}

export function devAddLevel() {
    addXp(player.xpToNextLevel - player.xp);
    return true;
}
