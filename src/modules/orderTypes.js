/**
 * Order Types Configuration
 * Defines different types of orders with unique characteristics
 */

export const ORDER_TYPES = {
    STANDARD: {
        id: 'standard',
        name: 'order_type_standard',
        duration: 480000, // 8 minutes (same as before)
        rewardMultiplier: 1.0,
        amountMultiplier: 1.0,
        icon: '📦',
        description: 'order_type_standard_desc',
        spawnWeight: 1.0 // Higher = more common
    },
    
    EXPRESS: {
        id: 'express',
        name: 'order_type_express',
        duration: 120000, // 2 minutes!
        rewardMultiplier: 1.5, // +50% reward for urgency
        amountMultiplier: 1.0,
        icon: '⚡',
        description: 'order_type_express_desc',
        spawnWeight: 0.3, // 30% spawn chance
        requiredLevel: 3 // Unlocks at level 3
    },
    
    BULK: {
        id: 'bulk',
        name: 'order_type_bulk',
        duration: 600000, // 10 minutes
        rewardMultiplier: 1.3, // +30% reward
        amountMultiplier: 3.0, // Requires 3x items!
        icon: '📦📦📦',
        description: 'order_type_bulk_desc',
        spawnWeight: 0.2, // 20% spawn chance
        requiredLevel: 3
    }
};

/**
 * Determine which order type to generate based on player level and randomness
 * @param {number} playerLevel - Current player level
 * @returns {Object} Selected order type
 */
export function determineOrderType(playerLevel) {
    // Before level 3, only standard orders
    if (playerLevel < 3) {
        return ORDER_TYPES.STANDARD;
    }
    
    // Build weighted pool of available order types
    const availableTypes = [];
    
    for (const typeKey in ORDER_TYPES) {
        const type = ORDER_TYPES[typeKey];
        if (!type.requiredLevel || playerLevel >= type.requiredLevel) {
            availableTypes.push(type);
        }
    }
    
    // Calculate total weight
    const totalWeight = availableTypes.reduce((sum, type) => sum + type.spawnWeight, 0);
    
    // Random selection based on weights
    let random = Math.random() * totalWeight;
    
    for (const type of availableTypes) {
        random -= type.spawnWeight;
        if (random <= 0) {
            return type;
        }
    }
    
    // Fallback to standard
    return ORDER_TYPES.STANDARD;
}

/**
 * Get order type by ID
 * @param {string} typeId - Order type ID
 * @returns {Object} Order type configuration
 */
export function getOrderType(typeId) {
    for (const key in ORDER_TYPES) {
        if (ORDER_TYPES[key].id === typeId) {
            return ORDER_TYPES[key];
        }
    }
    return ORDER_TYPES.STANDARD;
}

/**
 * Calculate final reward for an order
 * @param {number} baseReward - Base reward from trust level
 * @param {string} orderTypeId - Type of order
 * @returns {number} Final reward amount
 */
export function calculateOrderReward(baseReward, orderTypeId) {
    const orderType = getOrderType(orderTypeId);
    return Math.round(baseReward * orderType.rewardMultiplier);
}

/**
 * Calculate final amount required for an order
 * @param {number} baseAmount - Base amount of items
 * @param {string} orderTypeId - Type of order
 * @returns {number} Final amount required
 */
export function calculateOrderAmount(baseAmount, orderTypeId) {
    const orderType = getOrderType(orderTypeId);
    return Math.round(baseAmount * orderType.amountMultiplier);
}

/**
 * Get visual indicator for order urgency
 * @param {number} timeLeft - Milliseconds until expiration
 * @param {string} orderTypeId - Type of order
 * @returns {string} CSS class for urgency level
 */
export function getOrderUrgencyClass(timeLeft, orderTypeId) {
    const orderType = getOrderType(orderTypeId);
    const percentLeft = timeLeft / orderType.duration;
    
    if (percentLeft < 0.25) return 'urgent'; // Less than 25% time
    if (percentLeft < 0.5) return 'warning'; // Less than 50% time
    return 'normal';
}
