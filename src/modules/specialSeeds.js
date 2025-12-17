/**
 * Special Seeds System
 * Unique seeds with powerful bonuses that can only be obtained through special means
 */

export const SPECIAL_SEEDS = {
    // ========== BASIC TIER (Early Game) ==========
    
    'golden_wheat_seed': {
        name: 'special_golden_wheat',
        baseCrop: 'wheat',
        icon: '🌟🌾',
        seed_icon: '✨🌱',
        rarity: 'rare',
        effects: {
            growthTimeMultiplier: 0.7,  // 30% faster growth
            yieldBonus: 1,                // +1 extra yield
            priceMultiplier: 1.5          // Sells for 1.5x price
        },
        source: 'chain_order_starter',
        requiredLevel: 2,
        description: 'special_golden_wheat_desc'
    },
    
    'instant_carrot_seed': {
        name: 'special_instant_carrot',
        baseCrop: 'carrot',
        icon: '⚡🥕',
        seed_icon: '⚡🌱',
        rarity: 'rare',
        effects: {
            growthTimeMultiplier: 0.1,   // 90% faster! Almost instant
            yieldRange: [1, 1],           // Only 1 carrot (balance)
            limitedUses: 5                 // Can only plant 5 times
        },
        source: 'express_order_reward',
        requiredLevel: 3,
        description: 'special_instant_carrot_desc'
    },
    
    // ========== ADVANCED TIER (Mid Game) ==========
    
    'giant_tomato_seed': {
        name: 'special_giant_tomato',
        baseCrop: 'tomato',
        icon: '🍅🍅',
        seed_icon: '💪🌱',
        rarity: 'epic',
        effects: {
            yieldMultiplier: 2,           // Double yield!
            growthTimeMultiplier: 1.3,   // 30% slower (balance)
            xpMultiplier: 2
        },
        source: 'trust_level_4_farmer_joe',
        requiredLevel: 4,
        description: 'special_giant_tomato_desc'
    },
    
    'premium_potato_seed': {
        name: 'special_premium_potato',
        baseCrop: 'potato',
        icon: '👑🥔',
        seed_icon: '👑🌱',
        rarity: 'epic',
        effects: {
            yieldRange: [6, 10],          // Always high yield
            priceMultiplier: 2.0,         // Double price
            growthTimeMultiplier: 1.5    // 50% slower
        },
        source: 'collection_veggie_basket',
        requiredLevel: 5,
        description: 'special_premium_potato_desc'
    },
    
    // ========== LEGENDARY TIER (Late Game) ==========
    
    'rainbow_berry_seed': {
        name: 'special_rainbow_berry',
        baseCrop: 'strawberry',
        icon: '🌈🍓',
        seed_icon: '🌈🌱',
        rarity: 'legendary',
        effects: {
            priceMultiplier: 3.0,         // Triple price! 🔥
            yieldRange: [5, 10],          // Lots of berries
            growthTimeMultiplier: 1.5,   // 50% slower
            xpMultiplier: 3,
            visualEffect: 'rainbow'        // Special animation
        },
        source: 'collection_berry_paradise',
        requiredLevel: 8,
        description: 'special_rainbow_berry_desc'
    },
    
    'mystic_blueberry_seed': {
        name: 'special_mystic_blueberry',
        baseCrop: 'blueberry',
        icon: '✨🔵',
        seed_icon: '✨🌱',
        rarity: 'legendary',
        effects: {
            yieldMultiplier: 2.5,
            priceMultiplier: 2.0,
            growthTimeMultiplier: 0.8,   // 20% faster!
            xpMultiplier: 2.5,
            bonusTokenChance: 0.2         // 20% chance for +1 token on harvest
        },
        source: 'trust_level_5_all_npcs',
        requiredLevel: 10,
        description: 'special_mystic_blueberry_desc'
    },
    
    'eternal_corn_seed': {
        name: 'special_eternal_corn',
        baseCrop: 'corn',
        icon: '♾️🌽',
        seed_icon: '♾️🌱',
        rarity: 'legendary',
        effects: {
            infiniteHarvest: true,        // NEVER disappears after harvest!
            yieldRange: [2, 4],           // Lower yield (balance)
            growthTimeMultiplier: 2.0,   // 2x slower
            harvestCooldown: 60000        // 1 minute cooldown between harvests
        },
        source: 'chain_order_master_farmer',
        requiredLevel: 12,
        description: 'special_eternal_corn_desc'
    }
};

/**
 * Create a special crop configuration based on special seed
 * @param {string} seedId - Special seed ID
 * @returns {Object} Modified crop configuration
 */
export function createSpecialCrop(seedId) {
    const specialSeed = SPECIAL_SEEDS[seedId];
    if (!specialSeed) return null;
    
    const baseCrop = cropTypes[specialSeed.baseCrop];
    if (!baseCrop) return null;
    
    const specialCrop = {
        ...baseCrop,
        icon: specialSeed.icon,
        seed_icon: specialSeed.seed_icon,
        isSpecial: true,
        rarity: specialSeed.rarity,
        specialSeedId: seedId
    };
    
    // Apply growth time modifier
    if (specialSeed.effects.growthTimeMultiplier) {
        specialCrop.growthTime = Math.round(
            baseCrop.growthTime * specialSeed.effects.growthTimeMultiplier
        );
    }
    
    // Apply yield modifications
    if (specialSeed.effects.yieldMultiplier) {
        specialCrop.yieldRange = baseCrop.yieldRange.map(y => 
            Math.round(y * specialSeed.effects.yieldMultiplier)
        );
    }
    
    if (specialSeed.effects.yieldBonus) {
        specialCrop.yieldRange = baseCrop.yieldRange.map(y => 
            y + specialSeed.effects.yieldBonus
        );
    }
    
    if (specialSeed.effects.yieldRange) {
        specialCrop.yieldRange = specialSeed.effects.yieldRange;
    }
    
    // Apply price modifications
    if (specialSeed.effects.priceMultiplier) {
        specialCrop.maxPrice = Math.round(baseCrop.maxPrice * specialSeed.effects.priceMultiplier);
        specialCrop.minPrice = Math.round(baseCrop.minPrice * specialSeed.effects.priceMultiplier);
    }
    
    // Apply XP modifications
    if (specialSeed.effects.xpMultiplier) {
        specialCrop.xpValue = Math.round(baseCrop.xpValue * specialSeed.effects.xpMultiplier);
    }
    
    // Special properties
    if (specialSeed.effects.visualEffect) {
        specialCrop.visualEffect = specialSeed.effects.visualEffect;
    }
    
    if (specialSeed.effects.bonusTokenChance) {
        specialCrop.bonusTokenChance = specialSeed.effects.bonusTokenChance;
    }
    
    if (specialSeed.effects.infiniteHarvest) {
        specialCrop.infiniteHarvest = true;
        specialCrop.harvestCooldown = specialSeed.effects.harvestCooldown || 0;
    }
    
    if (specialSeed.effects.limitedUses) {
        specialCrop.limitedUses = specialSeed.effects.limitedUses;
    }
    
    return specialCrop;
}

/**
 * Check if player has a special seed
 * @param {string} seedId - Special seed ID
 * @returns {number} Amount in warehouse
 */
export function hasSpecialSeed(seedId) {
    return warehouse[seedId] || 0;
}

/**
 * Get rarity color for UI
 * @param {string} rarity - Seed rarity
 * @returns {string} CSS color
 */
export function getRarityColor(rarity) {
    const colors = {
        'common': '#888',
        'rare': '#4CAF50',
        'epic': '#9C27B0',
        'legendary': '#FFD700'
    };
    return colors[rarity] || colors.common;
}

/**
 * Get rarity display name
 * @param {string} rarity - Seed rarity
 * @returns {string} Localized rarity name
 */
export function getRarityName(rarity) {
    return `rarity_${rarity}`;
}

// Import this to use in game logic
import { cropTypes } from './config.js';
import { warehouse } from './state.js';
