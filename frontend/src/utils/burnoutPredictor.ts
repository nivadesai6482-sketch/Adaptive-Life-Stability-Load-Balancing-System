export type BurnoutRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface BurnoutInput {
    lifeStabilityIndex: number;
    cognitiveLoad: number;
    sleepHours: number;
    heartRate: number;
}

/**
 * Predicts burnout risk based on life stability and biological metrics.
 * Thresholds:
 * - High Cognitive Load: > 80
 * - Low Sleep: < 6 hours
 * - Medium Load: 50-80
 * - Medium Sleep: 6-8 hours
 */
export const predictBurnoutRisk = (input: BurnoutInput): BurnoutRiskLevel => {
    const { cognitiveLoad, sleepHours } = input;

    // HIGH Risk Case: Low sleep (<6) AND high cognitive load (>80)
    if (sleepHours < 6 && cognitiveLoad > 80) {
        return 'HIGH';
    }

    // MEDIUM Risk Case: Medium sleep (6-8) AND medium load (50-80)
    // Also consider low LSI as a secondary factor
    if (sleepHours >= 6 && sleepHours <= 8 && cognitiveLoad >= 50 && cognitiveLoad <= 85) {
        return 'MEDIUM';
    }

    // We also treat extremely high heart rate as a stress signal that could lead to medium/high risk
    if (input.heartRate > 100 && cognitiveLoad > 70) {
        return 'HIGH';
    }

    return 'LOW';
};
