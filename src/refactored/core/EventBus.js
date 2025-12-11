/**
 * Event Bus for decoupled communication between systems
 */

class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Clear all listeners for an event or all events
     * @param {string} [event] - Optional event name
     */
    clear(event) {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }
}

// Singleton instance
export const eventBus = new EventBus();

// Game Events
export const GAME_EVENTS = {
    // Player events
    MONEY_CHANGED: 'money:changed',
    XP_GAINED: 'xp:gained',
    LEVEL_UP: 'level:up',
    
    // Field events
    CROP_PLANTED: 'crop:planted',
    CROP_HARVESTED: 'crop:harvested',
    CROP_GREW: 'crop:grew',
    
    // Market events
    ITEM_SOLD: 'item:sold',
    PRICE_CHANGED: 'price:changed',
    
    // Order events
    ORDER_GENERATED: 'order:generated',
    ORDER_FULFILLED: 'order:fulfilled',
    ORDER_EXPIRED: 'order:expired',
    
    // Building events
    BUILDING_PURCHASED: 'building:purchased',
    PRODUCTION_STARTED: 'production:started',
    PRODUCTION_FINISHED: 'production:finished',
    
    // Upgrade events
    UPGRADE_PURCHASED: 'upgrade:purchased',
    
    // UI events
    UI_UPDATE_REQUESTED: 'ui:update:requested',
    NOTIFICATION_SHOW: 'notification:show',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',
    
    // Save events
    GAME_SAVED: 'game:saved',
    GAME_LOADED: 'game:loaded',
};
