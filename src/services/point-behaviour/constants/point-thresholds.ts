/**
 * Point behavior thresholds and adjustments
 */

/** High probability point threshold (80%) */
export const POINT_THRESHOLD_HIGH = 80;

/** Adjusted high probability point (85%) when critical regions are active */
export const POINT_ADJUSTED_HIGH = 85;

/** Medium probability point threshold (40%) */
export const POINT_THRESHOLD_MEDIUM = 40;

/** Adjusted medium probability point (50%) when key regions are active */
export const POINT_ADJUSTED_MEDIUM = 50;

/** Maximum point threshold for time-based adjustments (< 80) */
export const POINT_TIME_ADJUSTMENT_MAX_THRESHOLD = 80;

/** Minimum point threshold for time-based adjustments (> 4) */
export const POINT_TIME_ADJUSTMENT_MIN_THRESHOLD = 4;

/** Point increment for time-based and day-based adjustments */
export const POINT_INCREMENT = 5;

/** Day offset for statistical day comparison */
export const STATISTICAL_DAY_OFFSET = 1;
