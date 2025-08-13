import { t } from './localization.js';
import { player, field, warehouse, marketState } from './state.js';
import { cropTypes, upgrades, NUM_ROWS, NUM_COLS, store } from './config.js';

export function plantSeed(r, c) {
    if (!player.selectedSeed) {
        alert(t('alert_select_seed'));
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
        yieldAmount += player.upgrades.yieldBonus; // Add yield bonus
        warehouse[cell.crop] = (warehouse[cell.crop] || 0) + yieldAmount;
        field[r][c] = { crop: null, growthStage: 0, stageStartTime: 0 };
        return true;
    } else {
        alert(t('alert_not_ready_harvest'));
        return false;
    }
}

export function sellCrop(cropName) {
    if (warehouse[cropName] > 0) {
        const crop = cropTypes[cropName];
        const market = marketState[cropName];
        const salePrice = market.currentPrice + player.upgrades.marketBonus;

        warehouse[cropName]--;
        player.money += salePrice;
        market.totalSold++;

        // Recalculate price
        const priceDrop = Math.floor(market.totalSold / crop.salesVolumeForPriceDrop);
        market.currentPrice = Math.max(crop.minPrice, crop.maxPrice - priceDrop);

        return true;
    } else {
        alert(t('alert_no_crop_to_sell'));
        return false;
    }
}

export function buySeed(itemName) {
    const item = store.find(i => i.name === itemName);
    if (!item) return false;

    const finalPrice = Math.round(item.price * (1 - player.upgrades.seedDiscount));

    if (player.money >= finalPrice) {
        player.money -= finalPrice;
        warehouse[itemName] = (warehouse[itemName] || 0) + 1;
        return true;
    } else {
        alert(t('alert_not_enough_money'));
        return false;
    }
}

export function buyUpgrade(upgradeId) {
    const upgrade = upgrades[upgradeId];
    if (!upgrade || upgrade.purchased) {
        alert("Upgrade not available."); // Should not happen in normal gameplay
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
        alert(t('alert_not_enough_money'));
        return false;
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
                    const timeToGrow = crop.growthTime * player.upgrades.growthMultiplier;
                    if (now - cell.stageStartTime >= timeToGrow) {
                        cell.growthStage++;
                        cell.stageStartTime = now;
                        fieldChanged = true;
                    }
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
                const priceDrop = Math.floor(market.totalSold / crop.salesVolumeForPriceDrop);
                market.currentPrice = Math.max(crop.minPrice, crop.maxPrice - priceDrop);
                market.lastRecoveryTime = now;
                marketChanged = true;
            }
        }
    }
    return marketChanged;
}

export function gameTick() {
    const now = Date.now();
    const growthChanged = updateCropGrowth(now);
    const marketChanged = updateMarketPrices(now);
    return growthChanged || marketChanged;
}
