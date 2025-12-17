import { t } from './localization.js';
import { player, field, warehouse, marketState, customers, saveGameState, activeBoosts } from './state.js';
import { cropTypes, upgrades, NUM_COLS, store, customerConfig, buildings, leveling } from './config.js';
import { showNotification, showLevelUpModal, showSimpleLevelUpModal, scheduleUpdate, showFloatingText } from './ui.js';
import { determineOrderType, calculateOrderReward, calculateOrderAmount, ORDER_TYPES } from './orderTypes.js';
import { SPECIAL_SEEDS, createSpecialCrop, hasSpecialSeed } from './specialSeeds.js';
import { TOKEN_SHOP, getTokenShopItem, canAffordTokenItem } from './tokenShop.js';  // НОВИЙ

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
        } else if (newLevel === 15) {
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

    // НОВИЙ: Перевірити, чи це особливе насіння
    const isSpecialSeed = SPECIAL_SEEDS[seedName];
    
    if (isSpecialSeed) {
        // Посадити особливе насіння
        return plantSpecialSeed(r, c, seedName);
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
        field[r][c].isSpecial = false;  // НОВИЙ

        if (!isAuto && warehouse[seedName] === 0) {
            player.selectedSeed = null; // Deselect if none left
        }
        return true;
    }
    return false;
}

// НОВИЙ: Посадити особливе насіння
export function plantSpecialSeed(r, c, seedId) {
    const specialSeed = SPECIAL_SEEDS[seedId];
    if (!specialSeed) {
        console.error(`Unknown special seed: ${seedId}`);
        return false;
    }
    
    // Перевірити рівень
    if (player.level < (specialSeed.requiredLevel || 1)) {
        showNotification(t('alert_seed_locked'));
        return false;
    }
    
    // Перевірити limited uses
    if (specialSeed.effects.limitedUses) {
        const usesKey = `${seedId}_uses`;
        if (!warehouse[usesKey]) {
            warehouse[usesKey] = specialSeed.effects.limitedUses;
        }
        if (warehouse[usesKey] <= 0) {
            showNotification(t('alert_special_seed_depleted'));
            return false;
        }
    }
    
    // Перевірити наявність насіння
    if ((warehouse[seedId] || 0) <= 0) {
        showNotification(t('alert_no_seeds'));
        return false;
    }
    
    // Посадити
    warehouse[seedId]--;
    
    // Зменшити uses якщо limited
    if (specialSeed.effects.limitedUses) {
        warehouse[`${seedId}_uses`]--;
    }
    
    field[r][c].crop = seedId;  // Зберігаємо ID особливого насіння
    field[r][c].growthStage = 0;
    field[r][c].stageStartTime = Date.now();
    field[r][c].isSpecial = true;
    field[r][c].specialSeedId = seedId;
    
    if (warehouse[seedId] === 0 && player.selectedSeed === seedId) {
        player.selectedSeed = null;
    }
    
    return true;
}

// НОВИЙ: Зібрати особливу культуру
export function harvestSpecialCrop(r, c) {
    const cell = field[r][c];
    const specialSeed = SPECIAL_SEEDS[cell.specialSeedId];
    if (!specialSeed) return false;
    
    // Створити особливу конфігурацію культури
    const specialCrop = createSpecialCrop(cell.specialSeedId);
    if (!specialCrop) return false;
    
    // Перевірити, чи готова до збору
    if (cell.growthStage < specialCrop.visuals.length - 1) {
        showNotification(t('alert_not_ready_harvest'));
        return false;
    }
    
    // Обчислити врожай
    const [min, max] = specialCrop.yieldRange;
    let yieldAmount = Math.floor(Math.random() * (max - min + 1)) + min;
    yieldAmount += (player.upgrades.yieldBonus + player.npcBonuses.yieldBonus);

    // НОВИЙ: Перевірити Lucky Day boost для yield
    const luckyBoost = activeBoosts.find(b => b.type === 'luckyDay');
    if (luckyBoost) {
        yieldAmount += luckyBoost.multipliers.yield;  // +2 extra yield
    }

    // Double harvest boost
    if (player.activeEffects.doubleHarvestCharges > 0) {
        yieldAmount *= 2;
        player.activeEffects.doubleHarvestCharges--;
        const plotElement = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        if (plotElement) {
            const rect = plotElement.getBoundingClientRect();
            showFloatingText(rect.left + rect.width / 2, rect.top - 20, '×2 BOOST!', '#FFD700');
        }
    }

    // Додати врожай
    const baseCropName = specialSeed.baseCrop;
    warehouse[baseCropName] = (warehouse[baseCropName] || 0) + yieldAmount;

    // НОВИЙ: XP з Lucky Day множником
    let xpMultiplier = 1.0;
    if (luckyBoost) {
        xpMultiplier = luckyBoost.multipliers.xp;  // 2x XP
    }
    const xpGained = Math.floor(specialCrop.xpValue * yieldAmount * xpMultiplier);
    addXp(xpGained);
    
    // Бонусні токени (для Mystic Blueberry)
    if (specialCrop.bonusTokenChance && Math.random() < specialCrop.bonusTokenChance) {
        player.trustTokens++;
        showFloatingText(window.innerWidth / 2, 100, '+1 🪙 Bonus Token!', '#FFD700');
    }
    
    // Floating text
    const plotElement = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (plotElement) {
        const rect = plotElement.getBoundingClientRect();
        showFloatingText(rect.left + rect.width / 2, rect.top, `+${yieldAmount} ${specialCrop.icon}`, '#FFD700');
        showFloatingText(rect.left + rect.width / 2 + 30, rect.top + 10, `+${specialCrop.xpValue * yieldAmount} XP`, '#FFC107');
    }
    
    // Спеціальна логіка: Eternal Corn (нескінченний врожай)
    if (specialCrop.infiniteHarvest) {
        // Повернути до початкового стану росту
        cell.growthStage = 0;
        cell.stageStartTime = Date.now();
        showNotification('♾️ ' + t('special_eternal_harvest'));
    } else {
        // Звичайний збір - очистити клітинку
        cell.crop = null;
        cell.growthStage = 0;
        cell.stageStartTime = 0;
        cell.isSpecial = false;
        cell.specialSeedId = null;
    }
    
    return true;
}

export function harvestCrop(r, c) {
    const cell = field[r][c];
    if (!cell.crop) return false;

    // НОВИЙ: Перевірити, чи це особлива культура
    if (cell.isSpecial && cell.specialSeedId) {
        return harvestSpecialCrop(r, c);
    }

    const crop = cropTypes[cell.crop];
    if (cell.growthStage >= crop.visuals.length - 1) {
        const [min, max] = crop.yieldRange;
        let yieldAmount = Math.floor(Math.random() * (max - min + 1)) + min;
        yieldAmount += (player.upgrades.yieldBonus + player.npcBonuses.yieldBonus);

        // НОВИЙ: Перевірити Lucky Day boost для yield
        const luckyBoost = activeBoosts.find(b => b.type === 'luckyDay');
        if (luckyBoost) {
            yieldAmount += luckyBoost.multipliers.yield;  // +2 extra yield
        }

        // НОВИЙ: Перевірити double harvest boost
        if (player.activeEffects.doubleHarvestCharges > 0) {
            yieldAmount *= 2;
            player.activeEffects.doubleHarvestCharges--;
            const plotElement = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            if (plotElement) {
                const rect = plotElement.getBoundingClientRect();
                showFloatingText(rect.left + rect.width / 2, rect.top - 20, '×2 BOOST!', '#FFD700');
            }
        }

        warehouse[cell.crop] = (warehouse[cell.crop] || 0) + yieldAmount;

        // НОВИЙ: Розрахувати XP з Lucky Day множником
        let xpMultiplier = 1.0;
        if (luckyBoost) {
            xpMultiplier = luckyBoost.multipliers.xp;  // 2x XP
        }
        const xpGained = Math.floor(crop.xpValue * yieldAmount * xpMultiplier);

        // НОВЕ: Показати floating text
        const plotElement = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        if (plotElement) {
            const rect = plotElement.getBoundingClientRect();
            showFloatingText(rect.left + rect.width / 2, rect.top, `+${yieldAmount} ${crop.icon}`, '#4CAF50');
            showFloatingText(rect.left + rect.width / 2 + 30, rect.top + 10, `+${xpGained} XP`, '#FFC107');
        }

        addXp(xpGained);
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
        let salePrice = market.currentPrice + player.upgrades.marketBonus + player.npcBonuses.marketBonus + priceBonus;

        // НОВИЙ: Застосувати Lucky Day price boost
        const luckyBoost = activeBoosts.find(b => b.type === 'luckyDay');
        if (luckyBoost) {
            salePrice = Math.floor(salePrice * luckyBoost.multipliers.price);  // 1.5x price
        }

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

export function getResearchCost() {
    return 1000 + (Math.floor(player.scienceProductionCount / 10) * 100);
}

export function checkIngredients(recipe, batchSize, buildingId) {
    const missing = [];
    for (const ingredient in recipe.input) {
        let requiredAmount = recipe.input[ingredient] * batchSize;
        if (ingredient === 'money') {
            if (buildingId === 'research_lab') {
                requiredAmount = getResearchCost() * batchSize;
            }
            if (player.money < requiredAmount) {
                missing.push(t('money'));
            }
        } else {
            if ((warehouse[ingredient] || 0) < requiredAmount) {
                missing.push(t(ingredient));
            }
        }
    }
    return missing;
}

export function startProduction(buildingId, recipeIndex) {
    const building = buildings[buildingId];
    const playerBuilding = player.buildings[buildingId];
    const recipe = building.recipes[recipeIndex];

    if (!building || !playerBuilding.purchased) {
        showNotification("Building not purchased.");
        return false; // Should not happen in normal gameplay
    }

    const batchSize = 1 + (player.upgrades.productionVolume || 0);
    const missingIngredients = checkIngredients(recipe, batchSize, buildingId);

    if (missingIngredients.length > 0) {
        // The UI will handle showing the specific missing ingredients.
        // This is a fallback notification.
        showNotification(t('alert_not_enough_ingredients_generic'));
        return false;
    }


    // Consume ingredients for the entire batch
    for (const ingredient in recipe.input) {
        let consumedAmount = recipe.input[ingredient] * batchSize;
        if (ingredient === 'money') {
            if (buildingId === 'research_lab') {
                consumedAmount = getResearchCost() * batchSize;
            }
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
                // НОВИЙ: Перевірити активний growth speed boost
                let growthBoostMultiplier = 1.0;
                const growthBoost = activeBoosts.find(b => b.type === 'growthSpeed');
                if (growthBoost) {
                    growthBoostMultiplier = 1 - growthBoost.value; // 0.5 -> 0.5x time (2x speed)
                }

                const timeToGrow = cropTypes[cell.crop].growthTime
                    * player.upgrades.growthMultiplier
                    * player.npcBonuses.growthMultiplier
                    * growthBoostMultiplier;  // НОВИЙ: застосувати boost

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
                        if (product === 'research_points') {
                            player.scienceProductionCount += discreteAmount;
                            scheduleUpdate('buildings');
                        }
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
                const recipeIndex = playerBuilding.selectedRecipe || 0;
                if (startProduction(buildingId, recipeIndex)) {
                    productionChanged = true;
                }
            }
        }
    }
    return productionChanged;
}

const productionTimeCache = new Map();

function calculateProductionTime(itemName) {
    if (productionTimeCache.has(itemName)) {
        return productionTimeCache.get(itemName);
    }

    // Base case: is it a growable crop?
    if (cropTypes[itemName] && cropTypes[itemName].growthTime) {
        const time = cropTypes[itemName].growthTime;
        productionTimeCache.set(itemName, time);
        return time;
    }

    // Recursive step: is it a manufactured good?
    for (const buildingId in buildings) {
        const building = buildings[buildingId];
        const recipe = building.recipes.find(r => r.output[itemName]);
        if (recipe) {
            let totalTime = recipe.productionTime;
            for (const ingredient in recipe.input) {
                if (ingredient === 'money') continue;
                const quantity = recipe.input[ingredient];
                totalTime += calculateProductionTime(ingredient) * quantity;
            }
            productionTimeCache.set(itemName, totalTime);
            return totalTime;
        }
    }

    // Fallback for items without a defined time (like seeds or special items)
    productionTimeCache.set(itemName, 0);
    return 0;
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

    const availableCrops = Object.keys(cropTypes).filter(crop => {
        if (crop === 'research_points') return false;
        const item = cropTypes[crop];
        const hasRecipe = Object.values(buildings).some(b => b.recipes.some(r => r.output[crop]));
        const isGrowable = !!item.growthTime;
        return (item.requiredLevel <= player.level) && (isGrowable || hasRecipe);
    });

    if (availableCrops.length === 0) return;

    const randomCrop = availableCrops[Math.floor(Math.random() * availableCrops.length)];
    const tier = getCustomerTier(customer.trust);
    const [minTime, maxTime] = tier.size; // Time in minutes

    const targetTimeMs = (Math.random() * (maxTime - minTime) + minTime) * 60 * 1000;
    const timePerUnit = calculateProductionTime(randomCrop);

    if (timePerUnit === 0) {
        console.error(`Could not generate order for ${randomCrop}, timePerUnit is 0.`);
        return;
    }

    // НОВИЙ: Визначити тип замовлення
    const orderType = determineOrderType(player.level);

    // Обчислити базову кількість
    const baseAmount = Math.max(1, Math.floor(targetTimeMs / timePerUnit));
    
    // НОВИЙ: Застосувати amountMultiplier для типу замовлення
    const finalAmount = calculateOrderAmount(baseAmount, orderType.id);

    const marketPrice = marketState[randomCrop].currentPrice;
    
    // НОВИЙ: Базова винагорода з trust tier
    const baseReward = Math.round(marketPrice * finalAmount * tier.reward);
    
    // НОВИЙ: Застосувати rewardMultiplier для типу замовлення
    const finalReward = calculateOrderReward(baseReward, orderType.id);

    customer.order = {
        crop: randomCrop,
        amount: finalAmount,
        reward: finalReward,
        type: orderType.id,  // НОВИЙ: зберігаємо тип замовлення
        expiresAt: Date.now() + orderType.duration  // НОВИЙ: використовуємо duration з типу
    };
}

function updateOrders(now) {
    let ordersChanged = false;

    // Expire old orders
    for (const customerId in customers) {
        const customer = customers[customerId];
        if (customer.order && now > customer.order.expiresAt) {
            const tier = getCustomerTier(customer.trust);
            customer.trust = Math.max(0, customer.trust - tier.trustPenalty);
            customer.order = null;
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
    const changes = {
        growth: updateCropGrowth(now),
        market: updateMarketPrices(now),
        orders: updateOrders(now),
        production: updateProduction(now),
        boosts: updateActiveBoosts(now)  // НОВИЙ
    };

    if (now - lastSaveTime > SAVE_INTERVAL) {
        saveGameState();
        lastSaveTime = now;
    }

    return changes;
}

export function fulfillOrder(customerId) {
    const customer = customers[customerId];
    const order = customer.order;

    if (!order) {
        showNotification("This order is no longer available.");
        return false;
    }

    if (warehouse[order.crop] >= order.amount) {
        // Обчислити XP: базове + за ітеми + бонус з замовлення
        const xpForItems = (cropTypes[order.crop].xpValue || 0) * order.amount;
        const tier = getCustomerTier(customer.trust);
        const totalXP = 10 + xpForItems + (tier.xpBonus || 0);  // НОВИЙ: + xpBonus
        addXp(totalXP);

        // Відняти ітеми та дати гроші
        warehouse[order.crop] -= order.amount;
        player.money += order.reward;

        // НОВИЙ: Дати Trust Tokens
        const tokensEarned = tier.tokenReward || 0;
        if (tokensEarned > 0) {
            player.trustTokens += tokensEarned;
            showFloatingText(window.innerWidth / 2, 100, `+${tokensEarned} 🪙 Trust Tokens!`, '#FFD700');
        }

        // Збільшити trust
        customer.trust += tier.trustReward;

        customer.order = null;
        updateNpcBonuses();
        
        // Показати повідомлення з деталями
        showNotification(
            t('alert_order_fulfilled', { name: customerConfig.customers[customerId].name }) +
            ` (+${order.reward}, +${totalXP} XP, +${tokensEarned} tokens)`
        );
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

// ========== TOKEN SHOP ==========

/**
 * Купити предмет з Token Shop
 */
export function buyTokenShopItem(itemId) {
    const item = getTokenShopItem(itemId);
    if (!item) {
        console.error(`Unknown token shop item: ${itemId}`);
        return false;
    }
    
    // Перевірити вартість
    if (player.trustTokens < item.cost) {
        showNotification(t('alert_not_enough_tokens'));
        return false;
    }
    
    // Перевірити maxPurchases
    if (item.maxPurchases) {
        const purchased = player.tokenShopPurchases[itemId] || 0;
        if (purchased >= item.maxPurchases) {
            showNotification(t('alert_max_purchases'));
            return false;
        }
    }
    
    // Відняти токени
    player.trustTokens -= item.cost;
    
    // Застосувати ефект
    applyTokenShopEffect(item);
    
    // Зберегти покупку
    if (item.maxPurchases) {
        player.tokenShopPurchases[itemId] = (player.tokenShopPurchases[itemId] || 0) + 1;
    }
    
    showNotification(t('alert_token_purchase_success', { item: t(item.name) }));
    return true;
}

/**
 * Застосувати ефект предмета
 */
function applyTokenShopEffect(item) {
    const effect = item.effect;
    
    switch (effect.type) {
        case 'growthSpeed':
            activeBoosts.push({
                type: 'growthSpeed',
                value: effect.value,
                expiresAt: Date.now() + effect.duration,
                name: item.name
            });
            showFloatingText(window.innerWidth / 2, 100, `⚡ ${t(item.name)} активовано!`, '#4CAF50');
            break;
            
        case 'doubleHarvest':
            player.activeEffects.doubleHarvestCharges += effect.charges;
            showFloatingText(window.innerWidth / 2, 100, `×2 ${effect.charges} зборів!`, '#FFD700');
            break;
            
        case 'luckyDay':
            activeBoosts.push({
                type: 'luckyDay',
                multipliers: effect.multipliers,
                expiresAt: Date.now() + effect.duration,
                name: item.name
            });
            showFloatingText(window.innerWidth / 2, 100, `🍀 ${t(item.name)} активовано!`, '#FFD700');
            break;
            
        case 'addFieldSlot':
            // Додати клітинку до першого рядка, де є місце
            for (let r = 0; r < field.length; r++) {
                if (field[r].length < NUM_COLS + 10) {  // Макс +10 слотів
                    field[r].push({
                        crop: null,
                        growthStage: 0,
                        stageStartTime: 0,
                        autoCrop: null,
                        isSpecial: false
                    });
                    showFloatingText(window.innerWidth / 2, 100, `➕ Нова клітинка!`, '#4CAF50');
                    scheduleUpdate('field');
                    break;
                }
            }
            break;
            
        case 'warehouseCapacity':
            // Косметична покупка (немає лімітів зараз)
            showFloatingText(window.innerWidth / 2, 100, `📦 +${effect.value} місця!`, '#4CAF50');
            break;
    }
}

/**
 * Оновити активні бусти (викликати у gameTick)
 */
export function updateActiveBoosts(now) {
    let changed = false;
    
    // Видалити прострочені бусти
    for (let i = activeBoosts.length - 1; i >= 0; i--) {
        const boost = activeBoosts[i];
        if (boost.expiresAt && now > boost.expiresAt) {
            showNotification(t('boost_expired', { name: t(boost.name) }));
            activeBoosts.splice(i, 1);
            changed = true;
        }
    }
    
    return changed;
}
