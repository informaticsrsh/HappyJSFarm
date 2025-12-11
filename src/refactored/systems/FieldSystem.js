/**
 * Field System - Manages crop growing and harvesting
 */

import { eventBus, GAME_EVENTS } from '../core/EventBus.js';
import { GAME_CONFIG } from '../constants/gameConstants.js';
import { Validator } from '../utils/validation.js';
import { TimeUtils, MathUtils } from '../utils/helpers.js';

export class FieldSystem {
    constructor(cropTypes) {
        this.cropTypes = cropTypes;
        this.field = this.createEmptyField(
            GAME_CONFIG.INITIAL_ROWS,
            GAME_CONFIG.INITIAL_COLS
        );
    }

    /**
     * Create empty field
     */
    createEmptyField(rows, cols) {
        return Array(rows).fill(null).map(() =>
            Array(cols).fill(null).map(() => ({
                crop: null,
                growthStage: 0,
                stageStartTime: 0,
                autoCrop: null,
            }))
        );
    }

    /**
     * Get field dimensions
     */
    getDimensions() {
        return {
            rows: this.field.length,
            cols: this.field[0]?.length || 0,
        };
    }

    /**
     * Get cell at position
     */
    getCell(row, col) {
        if (!this.isValidPosition(row, col)) {
            throw new Error(`Invalid position: ${row}, ${col}`);
        }
        return this.field[row][col];
    }

    /**
     * Check if position is valid
     */
    isValidPosition(row, col) {
        return (
            row >= 0 &&
            row < this.field.length &&
            col >= 0 &&
            col < this.field[0].length
        );
    }

    /**
     * Plant seed at position
     */
    plant(row, col, cropName) {
        const cell = this.getCell(row, col);

        if (cell.crop) {
            throw new Error('Cell already has a crop');
        }

        if (cell.autoCrop) {
            throw new Error('Cannot manually plant on auto plot');
        }

        const crop = this.cropTypes[cropName];
        if (!crop) {
            throw new Error(`Unknown crop: ${cropName}`);
        }

        cell.crop = cropName;
        cell.growthStage = 0;
        cell.stageStartTime = Date.now();

        eventBus.emit(GAME_EVENTS.CROP_PLANTED, {
            row,
            col,
            crop: cropName,
        });

        return true;
    }

    /**
     * Harvest crop at position
     */
    harvest(row, col, yieldBonus = 0) {
        const cell = this.getCell(row, col);

        if (!cell.crop) {
            throw new Error('No crop to harvest');
        }

        const crop = this.cropTypes[cell.crop];
        const maxStage = crop.visuals.length - 1;

        if (cell.growthStage < maxStage) {
            throw new Error('Crop is not fully grown');
        }

        // Calculate yield
        const [minYield, maxYield] = crop.yieldRange;
        let yieldAmount = MathUtils.randomInt(minYield, maxYield);
        yieldAmount += yieldBonus;

        const harvestedCrop = cell.crop;
        const xpValue = crop.xpValue * yieldAmount;

        // Clear cell
        cell.crop = null;
        cell.growthStage = 0;
        cell.stageStartTime = 0;

        eventBus.emit(GAME_EVENTS.CROP_HARVESTED, {
            row,
            col,
            crop: harvestedCrop,
            amount: yieldAmount,
            xp: xpValue,
        });

        return {
            crop: harvestedCrop,
            amount: yieldAmount,
            xp: xpValue,
        };
    }

    /**
     * Update growth for all crops
     */
    updateGrowth(growthMultiplier = 1.0) {
        const now = Date.now();
        let anyChanged = false;

        for (let row = 0; row < this.field.length; row++) {
            for (let col = 0; col < this.field[row].length; col++) {
                const cell = this.field[row][col];

                if (cell.crop) {
                    const crop = this.cropTypes[cell.crop];
                    const maxStage = crop.visuals.length - 1;

                    if (cell.growthStage < maxStage) {
                        const timeToGrow = crop.growthTime * growthMultiplier;

                        if (TimeUtils.hasElapsed(cell.stageStartTime, timeToGrow)) {
                            cell.growthStage++;
                            cell.stageStartTime = now;
                            anyChanged = true;

                            eventBus.emit(GAME_EVENTS.CROP_GREW, {
                                row,
                                col,
                                crop: cell.crop,
                                stage: cell.growthStage,
                            });
                        }
                    }
                }
            }
        }

        return anyChanged;
    }

    /**
     * Get all empty plots
     */
    getEmptyPlots() {
        const empty = [];
        for (let row = 0; row < this.field.length; row++) {
            for (let col = 0; col < this.field[row].length; col++) {
                const cell = this.field[row][col];
                if (!cell.crop && !cell.autoCrop) {
                    empty.push({ row, col });
                }
            }
        }
        return empty;
    }

    /**
     * Get all mature crops
     */
    getMatureCrops() {
        const mature = [];
        for (let row = 0; row < this.field.length; row++) {
            for (let col = 0; col < this.field[row].length; col++) {
                const cell = this.field[row][col];
                if (cell.crop) {
                    const crop = this.cropTypes[cell.crop];
                    const maxStage = crop.visuals.length - 1;
                    if (cell.growthStage >= maxStage) {
                        mature.push({ row, col, crop: cell.crop });
                    }
                }
            }
        }
        return mature;
    }

    /**
     * Set auto crop for a plot
     */
    setAutoCrop(row, col, cropName) {
        const cell = this.getCell(row, col);

        if (cell.crop) {
            throw new Error('Cannot convert plot with active crop');
        }

        cell.autoCrop = cropName;
        return true;
    }

    /**
     * Check if plot is automated
     */
    isAutomated(row, col) {
        const cell = this.getCell(row, col);
        return !!cell.autoCrop;
    }

    /**
     * Get crop visual
     */
    getCropVisual(row, col) {
        const cell = this.getCell(row, col);
        if (!cell.crop) return null;

        const crop = this.cropTypes[cell.crop];
        return crop.visuals[cell.growthStage] || crop.icon;
    }

    /**
     * Get growth progress (0-1)
     */
    getGrowthProgress(row, col) {
        const cell = this.getCell(row, col);
        if (!cell.crop) return 0;

        const crop = this.cropTypes[cell.crop];
        const maxStage = crop.visuals.length - 1;
        return cell.growthStage / maxStage;
    }

    /**
     * Expand field by one row
     */
    expandField() {
        const { cols } = this.getDimensions();
        const newRow = Array(cols).fill(null).map(() => ({
            crop: null,
            growthStage: 0,
            stageStartTime: 0,
            autoCrop: null,
        }));
        this.field.push(newRow);
    }

    /**
     * Get field statistics
     */
    getStats() {
        let totalPlots = 0;
        let emptyPlots = 0;
        let growingCrops = 0;
        let matureCrops = 0;
        let autoPlots = 0;

        for (const row of this.field) {
            for (const cell of row) {
                totalPlots++;
                if (cell.autoCrop) autoPlots++;
                if (!cell.crop) {
                    emptyPlots++;
                } else {
                    const crop = this.cropTypes[cell.crop];
                    const maxStage = crop.visuals.length - 1;
                    if (cell.growthStage >= maxStage) {
                        matureCrops++;
                    } else {
                        growingCrops++;
                    }
                }
            }
        }

        return {
            totalPlots,
            emptyPlots,
            growingCrops,
            matureCrops,
            autoPlots,
        };
    }

    /**
     * Save state
     */
    saveState() {
        return [...this.field.map(row => [...row])];
    }

    /**
     * Load state
     */
    loadState(savedField) {
        this.field = savedField.map(row => [...row]);
    }

    /**
     * Reset field
     */
    reset() {
        this.field = this.createEmptyField(
            GAME_CONFIG.INITIAL_ROWS,
            GAME_CONFIG.INITIAL_COLS
        );
    }
}
