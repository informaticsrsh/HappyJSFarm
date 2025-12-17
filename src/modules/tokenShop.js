/**
 * Trust Token Shop - MVP Version
 * Simple shop with essential boost items
 */

export const TOKEN_SHOP = {
    // ========== TEMPORARY BOOSTS ==========
    
    'boost_growth_1h': {
        id: 'boost_growth_1h',
        name: 'token_boost_growth_1h',
        description: 'token_boost_growth_1h_desc',
        cost: 5,
        type: 'boost',
        icon: '⚡',
        effect: {
            type: 'growthSpeed',
            value: 0.5,  // 50% faster growth
            duration: 3600000  // 1 hour
        },
        repeatable: true
    },
    
    'boost_double_harvest': {
        id: 'boost_double_harvest',
        name: 'token_boost_double_harvest',
        description: 'token_boost_double_harvest_desc',
        cost: 8,
        type: 'boost',
        icon: '×2',
        effect: {
            type: 'doubleHarvest',
            charges: 5  // Next 5 harvests are doubled
        },
        repeatable: true
    },
    
    'boost_lucky_day': {
        id: 'boost_lucky_day',
        name: 'token_boost_lucky_day',
        description: 'token_boost_lucky_day_desc',
        cost: 15,
        type: 'boost',
        icon: '🍀',
        effect: {
            type: 'luckyDay',
            duration: 1800000,  // 30 minutes
            multipliers: {
                xp: 2,      // Double XP
                yield: 2,   // +2 to all yields
                price: 1.5  // 1.5x prices
            }
        },
        repeatable: true
    },
    
    // ========== PERMANENT UPGRADES ==========
    
    'permanent_field_slot': {
        id: 'permanent_field_slot',
        name: 'token_permanent_field_slot',
        description: 'token_permanent_field_slot_desc',
        cost: 20,
        type: 'permanent',
        icon: '➕',
        effect: {
            type: 'addFieldSlot'
        },
        repeatable: true,
        maxPurchases: 5  // Max +5 extra slots
    },
    
    'permanent_warehouse': {
        id: 'permanent_warehouse',
        name: 'token_permanent_warehouse',
        description: 'token_permanent_warehouse_desc',
        cost: 25,
        type: 'permanent',
        icon: '📦',
        effect: {
            type: 'warehouseCapacity',
            value: 100  // +100 capacity (cosmetic for now)
        },
        repeatable: true,
        maxPurchases: 3
    }
};

/**
 * Get shop item by ID
 */
export function getTokenShopItem(itemId) {
    return TOKEN_SHOP[itemId] || null;
}

/**
 * Get all available shop items for player level
 */
export function getAvailableTokenShopItems(playerLevel) {
    const items = [];
    for (const itemId in TOKEN_SHOP) {
        const item = TOKEN_SHOP[itemId];
        items.push(item);
    }
    return items;
}

/**
 * Check if player can afford item
 */
export function canAffordTokenItem(itemId, playerTokens) {
    const item = TOKEN_SHOP[itemId];
    if (!item) return false;
    return playerTokens >= item.cost;
}
