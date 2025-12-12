// Це продовження ui.js для функцій render

function finishRenderOrders(orderDiv, customerId, newOrder, config, icon, haveAmount, timeLeft) {
    orderDiv.innerHTML = `
        <div class="order-info">
            <strong>${t(config.name)}</strong> (${t('order_trust')}: ${customers[customerId].trust})<br>
            ${t('order_wants')}: ${icon} ${newOrder.amount} ${t(newOrder.crop)} (${t('order_have')}: ${haveAmount}/${newOrder.amount})<br>
            ${t('order_reward')}: $${newOrder.reward}<br>
            ${t('order_time_left')}: <span class="order-timer">${formatTime(timeLeft)}</span>
        </div>
        <button class="btn fulfill-btn" data-customer-id="${customerId}" ${haveAmount >= newOrder.amount ? '' : 'disabled'}>${t('btn_fulfill')}</button>
    `;
}

export function renderOrderTimers() {
    const orderElements = DOM.orderItems.querySelectorAll('.order');
    orderElements.forEach(orderElement => {
        const customerId = orderElement.dataset.customerId;
        const customer = customers[customerId];
        if (customer && customer.order) {
            const timerSpan = orderElement.querySelector('.order-timer');
            if (timerSpan) {
                const timeLeft = customer.order.expiresAt - Date.now();
                timerSpan.textContent = formatTime(timeLeft);
            }
        }
    });
}

function renderUpgrades(force = false) {
    const container = DOM.upgradesItems;

    for (const upgradeId in upgrades) {
        const oldUpgrade = oldState.upgrades?.[upgradeId];
        const newUpgrade = upgrades[upgradeId];
        const oldLevel = oldState.player?.level;
        const newLevel = player.level;

        if (force || JSON.stringify(oldUpgrade) !== JSON.stringify(newUpgrade) || oldLevel !== newLevel) {
            let itemDiv = document.getElementById(`upgrade-item-${upgradeId}`);

            const isVisible = newLevel >= (newUpgrade.requiredLevel || 1);
            const isPurchased = !newUpgrade.repeatable && newUpgrade.purchased;

            if (!isVisible || isPurchased) {
                if (itemDiv) itemDiv.remove();
                continue;
            }

            if (!itemDiv) {
                itemDiv = document.createElement('div');
                itemDiv.id = `upgrade-item-${upgradeId}`;
                itemDiv.classList.add('item');
                container.appendChild(itemDiv);
            }

            let buyButton;
            const cost = newUpgrade.costCurrency === 'research_points'
                ? `${newUpgrade.cost} ${cropTypes['research_points'].icon}`
                : `$${newUpgrade.cost}`;

            if (newUpgrade.repeatable) {
                const hasMax = typeof newUpgrade.maxPurchases !== 'undefined';
                const purchasedCount = newUpgrade.purchasedCount || 0;
                const canPurchase = hasMax ? purchasedCount < newUpgrade.maxPurchases : true;
                const purchaseStatus = hasMax ? `(${purchasedCount}/${newUpgrade.maxPurchases})` : `(${purchasedCount})`;
                buyButton = canPurchase
                    ? `<button class="btn buy-upgrade-btn" data-upgrade-id="${upgradeId}">${t('btn_buy')} (${cost})</button> <span>${purchaseStatus}</span>`
                    : `<span>${t('status_maxed_out')} ${purchaseStatus}</span>`;
            } else {
                buyButton = `<button class="btn buy-upgrade-btn" data-upgrade-id="${upgradeId}">${t('btn_buy')} (${cost})</button>`;
            }

            itemDiv.innerHTML = `
                <strong>${t(newUpgrade.name)}</strong>
                <p>${t(newUpgrade.description)}</p>
                <div class="upgrade-actions">${buyButton}</div>
            `;
        }
    }
}

function renderProduction(force = false) {
    const container = DOM.productionItems;

    for (const buildingId in buildings) {
        const oldPBuilding = oldState.player?.buildings[buildingId];
        const newPBuilding = player.buildings[buildingId];
        const oldLevel = oldState.player?.level;
        const newLevel = player.level;

        if (force || oldPBuilding?.purchased !== newPBuilding.purchased || oldLevel !== newLevel) {
            let itemDiv = document.getElementById(`production-item-${buildingId}`);

            const building = buildings[buildingId];
            const isVisible = newLevel >= (building.requiredLevel || 1);
            const isPurchased = newPBuilding.purchased;

            if (!isVisible || isPurchased) {
                if (itemDiv) itemDiv.remove();
                continue;
            }

            if (!itemDiv) {
                itemDiv = document.createElement('div');
                itemDiv.id = `production-item-${buildingId}`;
                itemDiv.classList.add('item');
                container.appendChild(itemDiv);
            }

            let recipesHtml = building.recipes.map(recipe => {
                const inputs = Object.entries(recipe.input).map(([key, value]) => `${value} ${t(key)}`).join(', ');
                const outputs = Object.entries(recipe.output).map(([key, value]) => `${value} ${t(key)}`).join(', ');
                return `<div class="recipe-info"><strong>${t('production_recipe')}:</strong> ${inputs} → ${outputs} (${formatTime(recipe.productionTime)})</div>`;
            }).join('');

            const actionButton = `<button class="btn buy-building-btn" data-building-id="${buildingId}">${t('btn_buy')} ($${building.cost})</button>`;

            itemDiv.innerHTML = `
                <strong>${t(building.name)}</strong>
                <p>${t(building.description)}</p>
                ${recipesHtml}
                ${actionButton}
            `;
        }
    }
}

function renderBuildings(force = false) {
    const container = DOM.buildingsGrid;

    for (const buildingId in buildings) {
        const oldPBuilding = oldState.player?.buildings[buildingId];
        const newPBuilding = player.buildings[buildingId];
        const oldProdVol = oldState.player?.upgrades.productionVolume;
        const newProdVol = player.upgrades.productionVolume;

        if (force || JSON.stringify(oldPBuilding) !== JSON.stringify(newPBuilding) || oldProdVol !== newProdVol) {
            let buildingDiv = document.getElementById(`building-${buildingId}`);

            if (newPBuilding.purchased && !buildingDiv) {
                buildingDiv = document.createElement('div');
                buildingDiv.id = `building-${buildingId}`;
                container.appendChild(buildingDiv);
            }

            if (!newPBuilding.purchased) {
                if (buildingDiv) buildingDiv.remove();
                continue;
            }

            const building = buildings[buildingId];
            buildingDiv.className = 'building';
            buildingDiv.dataset.buildingId = buildingId;
            if (newPBuilding.automated) {
                buildingDiv.classList.add('automated');
            }

            let statusHtml = '';
            if (newPBuilding.production.length > 0) {
                const job = newPBuilding.production[0];
                const recipe = building.recipes[job.recipeIndex];
                const effectiveTime = recipe.productionTime * (1 - (player.upgrades.productionSpeed || 0));
                const timeLeft = job.startTime + effectiveTime - Date.now();
                let queueStatus = newPBuilding.production.length > 1 ? ` (+${newPBuilding.production.length - 1} in queue)` : '';
                statusHtml = `<div class="building-status">${t('status_producing')} (<span class="production-timer">${formatTime(timeLeft)}</span>) ${queueStatus}</div>`;
            } else if (newPBuilding.automated) {
                const batchSize = 1 + (player.upgrades.productionVolume || 0);
                const selectedRecipe = building.recipes[newPBuilding.selectedRecipe];
                const missing = checkIngredients(selectedRecipe, batchSize, buildingId);
                if (missing.length > 0) {
                    statusHtml = `<div class="building-status-problem">${t('status_missing_resources')}</div>`;
                } else {
                    statusHtml = `<div class="building-status">${t('status_idle')}</div>`;
                }
            } else {
                const batchSize = 1 + (player.upgrades.productionVolume || 0);
                 building.recipes.forEach((recipe, index) => {
                    let inputs;
                    if (buildingId === 'research_lab') {
                        inputs = `${getResearchCost() * batchSize} ${t('money')}`;
                    } else {
                        inputs = Object.entries(recipe.input).map(([key, value]) => `${value * batchSize} ${t(key)}`).join(', ');
                    }
                    const outputs = Object.entries(recipe.output).map(([key, value]) => `${value * batchSize} ${t(key)}`).join(', ');

                    const missing = checkIngredients(recipe, batchSize, buildingId);
                    let buttonClass = 'btn start-production-btn';
                    let buttonData = '';
                    if (missing.length > 0) {
                        buttonClass += ' btn-danger';
                        const missingText = t('alert_missing_ingredients', { items: missing.join(', ') });
                        buttonData = `data-missing="${missingText}"`;
                    }

                    statusHtml += `
                        <div class="recipe">
                            <div class="recipe-io">${inputs} → ${outputs}</div>
                            <button class="${buttonClass}" data-building-id="${buildingId}" data-recipe-index="${index}" ${buttonData}>
                                ${t('btn_start_production')}
                            </button>
                        </div>`;
                });
            }

            let autoButton = '';
            if (player.upgrades.buildingAutomation) {
                const btnTextKey = newPBuilding.automated ? 'btn_deactivate_auto' : 'btn_activate_auto';
                autoButton = `<button class="btn toggle-auto-btn" data-building-id="${buildingId}">${t(btnTextKey)}</button>`;
            }

            if (newPBuilding.automated && building.recipes.length > 1) {
                autoButton += '<div class="recipe-selectors">';
                building.recipes.forEach((recipe, index) => {
                    const output = Object.keys(recipe.output)[0];
                    const icon = getIconForItem(output);
                    let activeClass = '';
                    if (index === newPBuilding.selectedRecipe) {
                        activeClass = 'active';
                    } else {
                        activeClass = 'btn-inactive';
                    }
                    autoButton += `<button class="btn recipe-selector-btn ${activeClass}" data-building-id="${buildingId}" data-recipe-index="${index}">${icon}</button>`;
                });
                autoButton += '</div>';
            }

            buildingDiv.innerHTML = `
                <div class="building-icon">${building.icon}</div>
                <strong class="building-name">${t(building.name)}</strong>
                <div class="building-recipes">${statusHtml}</div>
                <div class="building-automation">${autoButton}</div>
            `;
        }
    }
}

function renderPlayerState(force = false) {
    const oldP = oldState.player;
    const newP = player;
    const oldWh = oldState.warehouse;
    const newWh = warehouse;

    if (force || oldP?.money !== newP.money) {
        DOM.moneyDisplay.textContent = `💰 $${newP.money}`;
    }

    if (force || oldWh?.research_points !== newWh.research_points) {
        const rp = newWh.research_points || 0;
        DOM.researchPointsDisplay.textContent = `💡 ${rp}`;
        DOM.researchPointsDisplay.style.display = rp > 0 ? 'block' : 'none';
    }

    if (force || oldP?.xp !== newP.xp || oldP?.level !== newP.level) {
        DOM.levelDisplay.textContent = t('level_display', { level: newP.level });
        const xpPercentage = (newP.xp / newP.xpToNextLevel) * 100;
        DOM.xpBar.style.width = `${xpPercentage}%`;
        DOM.xpText.textContent = `${newP.xp} / ${newP.xpToNextLevel} XP`;
    }

    if (force || JSON.stringify(oldP?.upgrades) !== JSON.stringify(newP.upgrades) || JSON.stringify(oldP?.npcBonuses) !== JSON.stringify(newP.npcBonuses)) {
        let bonusHtml = '';
        if (newP.upgrades.growthMultiplier < 1.0) {
            const percentage = (1 - newP.upgrades.growthMultiplier) * 100;
            bonusHtml += `<div>${t('bonus_growth')}: +${percentage.toFixed(0)}%</div>`;
        }
        if (newP.upgrades.yieldBonus > 0) {
            bonusHtml += `<div>${t('bonus_yield')}: +${newP.upgrades.yieldBonus}</div>`;
        }
        if (newP.upgrades.seedDiscount > 0) {
            const percentage = newP.upgrades.seedDiscount * 100;
            bonusHtml += `<div>${t('bonus_seed_discount')}: ${percentage.toFixed(0)}%</div>`;
        }
        if (newP.upgrades.marketBonus > 0) {
            bonusHtml += `<div>${t('bonus_market_bonus')}: +$${newP.upgrades.marketBonus}</div>`;
        }

        const { npcBonuses } = newP;
        const hasNpcBonus =
            npcBonuses.yieldBonus > 0 ||
            npcBonuses.growthMultiplier < 1.0 ||
            npcBonuses.marketBonus > 0 ||
            npcBonuses.seedDiscount > 0 ||
            Object.keys(npcBonuses.priceBonus).length > 0;

        if (hasNpcBonus) {
            bonusHtml += `<div class="bonus-section-title">${t('bonus_npc_bonuses')}:</div>`;
            if (npcBonuses.growthMultiplier < 1.0) {
                const percentage = Math.round((1 - npcBonuses.growthMultiplier) * 100);
                bonusHtml += `<div>- ${t('bonus_growth_speed')}: +${percentage}%</div>`;
            }
            if (npcBonuses.yieldBonus > 0) {
                bonusHtml += `<div>- ${t('bonus_yield')}: +${npcBonuses.yieldBonus}</div>`;
            }
            if (npcBonuses.seedDiscount > 0) {
                const percentage = Math.round(npcBonuses.seedDiscount * 100);
                bonusHtml += `<div>- ${t('bonus_seed_discount')}: ${percentage}%</div>`;
            }
            if (npcBonuses.marketBonus > 0) {
                bonusHtml += `<div>- ${t('bonus_market_prices')}: +$${npcBonuses.marketBonus}</div>`;
            }
            for (const cropName in npcBonuses.priceBonus) {
                const bonus = npcBonuses.priceBonus[cropName];
                bonusHtml += `<div>- ${t(cropName)} ${t('bonus_price')}: +$${bonus}</div>`;
            }
        }
        DOM.bonusDisplay.innerHTML = bonusHtml;
    }
}

export function renderAll(force = false) {
    renderStaticUI();
    renderField(force);
    renderWarehouse(force);
    renderStore();
    renderReference();
    renderMarket(force);
    renderOrders(force);
    renderUpgrades(force);
    renderProduction(force);
    renderBuildings(force);
    renderPlayerState(force);
}

export function showLevelUpModal(level, unlocked, farmExpanded) {
    DOM.levelUpTitle.textContent = t('level_up_title', { level });

    let unlocksHtml = '';

    if (farmExpanded) {
        unlocksHtml += `<h3>${t('unlock_farm_expanded')}</h3>`;
    }

    if (unlocked.crops.length > 0) {
        unlocksHtml += `<h3>${t('unlocks_crops')}</h3><ul>`;
        unlocked.crops.forEach(crop => {
            unlocksHtml += `<li>${t(crop)}</li>`;
        });
        unlocksHtml += '</ul>';
    }

    if (unlocked.buildings.length > 0) {
        unlocksHtml += `<h3>${t('unlocks_buildings')}</h3><ul>`;
        unlocked.buildings.forEach(building => {
            unlocksHtml += `<li>${t(building)}</li>`;
        });
        unlocksHtml += '</ul>';
    }

    if (unlocked.upgrades.length > 0) {
        unlocksHtml += `<h3>${t('unlocks_upgrades')}</h3><ul>`;
        unlocked.upgrades.forEach(upgrade => {
            unlocksHtml += `<li>${t(upgrade)}</li>`;
        });
        unlocksHtml += '</ul>';
    }

    DOM.levelUpUnlocks.innerHTML = unlocksHtml;
    DOM.levelUpModal.style.display = 'block';
}

export function showSimpleLevelUpModal(level, message) {
    DOM.levelUpTitle.textContent = t('level_up_title', { level });
    DOM.levelUpUnlocks.innerHTML = `<p>${message}</p>`;
    DOM.levelUpModal.style.display = 'block';
}

export function toggleDebugMenu() {
    if (!debugMenuInitialized) {
        const buttons = [
            { id: 'dev-add-level', text: '+1 Level' },
            { id: 'dev-add-money', text: '+1M Money' },
            { id: 'dev-add-products', text: '+1k Products' }
        ];

        buttons.forEach(btnInfo => {
            const button = document.createElement('button');
            button.id = btnInfo.id;
            button.textContent = btnInfo.text;
            button.classList.add('btn');
            DOM.debugControls.appendChild(button);
        });

        debugMenuInitialized = true;
    }

    DOM.debugControls.classList.toggle('hidden');
}

requestAnimationFrame(renderLoop);
