/**
 * Math and calculation utilities
 */

export const MathUtils = {
    /**
     * Clamp a value between min and max
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * Random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Random float between min and max
     */
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Calculate percentage
     */
    percentage(value, total) {
        if (total === 0) return 0;
        return (value / total) * 100;
    },

    /**
     * Round to decimal places
     */
    roundTo(value, decimals = 2) {
        const multiplier = Math.pow(10, decimals);
        return Math.round(value * multiplier) / multiplier;
    },

    /**
     * Linear interpolation
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Check if value is in range (inclusive)
     */
    inRange(value, min, max) {
        return value >= min && value <= max;
    },
};

export const TimeUtils = {
    /**
     * Convert minutes to milliseconds
     */
    minutesToMs(minutes) {
        return minutes * 60 * 1000;
    },

    /**
     * Convert seconds to milliseconds
     */
    secondsToMs(seconds) {
        return seconds * 1000;
    },

    /**
     * Convert milliseconds to seconds
     */
    msToSeconds(ms) {
        return Math.floor(ms / 1000);
    },

    /**
     * Convert milliseconds to minutes
     */
    msToMinutes(ms) {
        return Math.floor(ms / 60000);
    },

    /**
     * Format time as MM:SS
     */
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    /**
     * Check if time has elapsed
     */
    hasElapsed(startTime, duration) {
        return Date.now() - startTime >= duration;
    },

    /**
     * Get elapsed time
     */
    getElapsed(startTime) {
        return Date.now() - startTime;
    },

    /**
     * Get remaining time
     */
    getRemaining(startTime, duration) {
        const elapsed = this.getElapsed(startTime);
        return Math.max(0, duration - elapsed);
    },
};

export const ArrayUtils = {
    /**
     * Shuffle array (Fisher-Yates)
     */
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    /**
     * Get random element from array
     */
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Sum array of numbers
     */
    sum(array) {
        return array.reduce((acc, val) => acc + val, 0);
    },

    /**
     * Group array by key
     */
    groupBy(array, keyFn) {
        return array.reduce((acc, item) => {
            const key = keyFn(item);
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    },

    /**
     * Chunk array into smaller arrays
     */
    chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
};

export const ObjectUtils = {
    /**
     * Deep clone object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Merge objects deeply
     */
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return this.deepMerge(target, ...sources);
    },

    /**
     * Check if value is plain object
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },

    /**
     * Get nested property safely
     */
    getNestedProperty(obj, path, defaultValue = undefined) {
        const keys = path.split('.');
        let result = obj;

        for (const key of keys) {
            if (result && typeof result === 'object' && key in result) {
                result = result[key];
            } else {
                return defaultValue;
            }
        }

        return result;
    },

    /**
     * Pick properties from object
     */
    pick(obj, keys) {
        return keys.reduce((acc, key) => {
            if (key in obj) {
                acc[key] = obj[key];
            }
            return acc;
        }, {});
    },

    /**
     * Omit properties from object
     */
    omit(obj, keys) {
        const result = { ...obj };
        keys.forEach(key => delete result[key]);
        return result;
    },
};
