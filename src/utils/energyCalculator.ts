/**
 * Calculates a numeric energy score (0-100) based on biological telemetry.
 * 
 * Formula:
 * - Step Component: 0-50 points (steps / 200, capped at 10,000 steps for max bonus)
 * - HR Component: 0-50 points (based on proximity to optimal resting HR of 70-75 BPM)
 * - Activity Multiplier: Adjusts the total based on perceived intensity
 * 
 * @param heartRate Heart rate in BPM
 * @param steps Number of steps taken today
 * @param activity Activity level ('low' | 'medium' | 'high')
 * @returns Numeric score between 0 and 100
 */
export const calculateEnergyScoreMetrics = (
    heartRate: number,
    steps: number,
    activity: 'low' | 'medium' | 'high'
): number => {
    // 1. Step Factor (Linear up to 10k steps)
    const stepFactor = Math.min(steps / 200, 50);

    // 2. Heart Rate Factor (Bell curve around 72 BPM)
    // Penalty of 2 points for every BPM away from 72
    const hrDeviation = Math.abs(heartRate - 72);
    const hrFactor = Math.max(50 - (hrDeviation * 2), 0);

    // 3. Activity Multiplier
    const activityMultipliers = {
        low: 0.8,
        medium: 1.0,
        high: 1.2
    };

    const multiplier = activityMultipliers[activity];

    // Combine and scale
    const rawScore = (stepFactor + hrFactor) * multiplier;

    // Final clamp between 0 and 100
    return Math.min(Math.max(Math.round(rawScore), 0), 100);
};
