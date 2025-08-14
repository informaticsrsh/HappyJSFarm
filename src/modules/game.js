import { t } from './localization.js';
import { player, field, warehouse, marketState, customers } from './state.js';
import { cropTypes, upgrades, NUM_ROWS, NUM_COLS, store, customerConfig } from './config.js';
import { showNotification } from './ui.js';

export function plantSeed(r, c) {
    if (!player.selectedSeed) {
        showNotification(t('alert_select_seed'));
        return false;
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
        return true;
    }
    return false;
}

export function harvestCrop(r, c) {
    const cell = field[r][c];
    const crop = cropTypes[cell.crop];
    if (cell.growthStage >= crop.visuals.length - 1) {
        const [min, max] = crop.yieldRange;
        let yieldAmount = Math.floor(Math.random() * (max - min + 1)) + min;
        yieldAmount += (player.upgrades.yieldBonus + player.npcBonuses.yieldBonus); // Add yield bonus
        warehouse[cell.crop] = (warehouse[cell.crop] || 0) + yieldAmount;
        field[r][c] = { crop: null, growthStage: 0, stageStartTime: 0 };
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
    if (!upgrade || upgrade.purchased) {
        showNotification("Upgrade not available."); // Should not happen in normal gameplay
        return false;
    }

    if (player.money >= upgrade.cost) {
        player.money -= upgrade.cost;
        upgrade.purchased = true;

        // Apply the effect to the player's state
        const { type, value } = upgrade.effect;
        if (type === 'growthMultiplier') {
            // Multipliers are set directly, not added
            player.upgrades[type] = value;
        } else {
            // Bonuses are additive
            player.upgrades[type] += value;
        }

        return true;
    } else {
        showNotification(t('alert_not_enough_money'));
        return false;
    }
}

function updateCropGrowth(now) {
    for (let r = 0; r < NUM_ROWS; r++) {
        for (let c = 0; c < NUM_COLS; c++) {
            const cell = field[r][c];
            if (cell.crop) {
                const crop = cropTypes[cell.crop];
                if (cell.growthStage < crop.visuals.length - 1) {
                    const timeToGrow = crop.growthTime * player.upgrades.growthMultiplier * player.npcBonuses.growthMultiplier;
                    if (now - cell.stageStartTime >= timeToGrow) {
                        cell.growthStage++;
                        cell.stageStartTime = now;
                    }
                }
            }
        }
    }
}

function updateMarketPrices(now) {
    for (const cropName in marketState) {
        const market = marketState[cropName];
        const crop = cropTypes[cropName];
        if (market.currentPrice < crop.maxPrice) {
            if (now - market.lastRecoveryTime >= crop.priceRecoveryRate) {
                market.totalSold = Math.max(0, market.totalSold - crop.salesVolumeForPriceDrop);
                updateMarketPrice(cropName);
                market.lastRecoveryTime = now;
            }
        }
    }
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

    const availableCrops = Object.keys(cropTypes);
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
    // Expire old orders
    for (const customerId in customers) {
        const customer = customers[customerId];
        if (customer.order && now > customer.order.expiresAt) {
            customer.order = null;
            customer.trust = Math.max(0, customer.trust - 10); // Penalty
            updateNpcBonuses();
            showNotification(t('alert_order_expired', { name: customerConfig.customers[customerId].name }));
        }
    }

    // --- New Generation Logic ---
    const activeOrderCount = Object.values(customers).filter(c => c.order).length;
    const customersWithoutOrders = Object.keys(customers).filter(id => !customers[id].order);

    if (customersWithoutOrders.length === 0) {
        return;
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
        }
    }
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
    updateCropGrowth(now);
    updateMarketPrices(now);
    updateOrders(now);
    return true; // Always return true to force a re-render for the timers
}

export function fulfillOrder(customerId) {
    const customer = customers[customerId];
    const order = customer.order;

    if (!order) {
        showNotification("This order is no longer available.");
        return false;
    }

    if (warehouse[order.crop] >= order.amount) {
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
