/**
 * Validation utilities for game data
 */

export class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

export const Validator = {
    /**
     * Validate positive number
     */
    isPositiveNumber(value, fieldName = 'value') {
        if (typeof value !== 'number' || value < 0) {
            throw new ValidationError(
                `${fieldName} must be a positive number`,
                fieldName
            );
        }
        return true;
    },

    /**
     * Validate integer
     */
    isInteger(value, fieldName = 'value') {
        if (!Number.isInteger(value)) {
            throw new ValidationError(
                `${fieldName} must be an integer`,
                fieldName
            );
        }
        return true;
    },

    /**
     * Validate range
     */
    isInRange(value, min, max, fieldName = 'value') {
        if (value < min || value > max) {
            throw new ValidationError(
                `${fieldName} must be between ${min} and ${max}`,
                fieldName
            );
        }
        return true;
    },

    /**
     * Validate object has required properties
     */
    hasProperties(obj, properties, objectName = 'object') {
        const missing = properties.filter(prop => !(prop in obj));
        if (missing.length > 0) {
            throw new ValidationError(
                `${objectName} is missing properties: ${missing.join(', ')}`,
                objectName
            );
        }
        return true;
    },

    /**
     * Validate warehouse has sufficient items
     */
    hasSufficientItems(warehouse, required, itemName = 'items') {
        for (const [item, amount] of Object.entries(required)) {
            if ((warehouse[item] || 0) < amount) {
                throw new ValidationError(
                    `Insufficient ${item}: need ${amount}, have ${warehouse[item] || 0}`,
                    itemName
                );
            }
        }
        return true;
    },

    /**
     * Validate amount is sufficient
     */
    hasSufficientAmount(current, required, resourceName = 'resource') {
        if (current < required) {
            throw new ValidationError(
                `Insufficient ${resourceName}: need ${required}, have ${current}`,
                resourceName
            );
        }
        return true;
    },
};

/**
 * Safe wrapper for operations that might fail
 */
export function tryCatch(fn, fallback = null) {
    try {
        return fn();
    } catch (error) {
        if (error instanceof ValidationError) {
            console.warn('Validation error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        return fallback;
    }
}

/**
 * Type guards
 */
export const TypeGuards = {
    isCrop(value) {
        return value && typeof value === 'object' && 'growthTime' in value;
    },

    isRecipe(value) {
        return (
            value &&
            typeof value === 'object' &&
            'input' in value &&
            'output' in value &&
            'productionTime' in value
        );
    },

    isOrder(value) {
        return (
            value &&
            typeof value === 'object' &&
            'crop' in value &&
            'amount' in value &&
            'reward' in value &&
            'expiresAt' in value
        );
    },
};
