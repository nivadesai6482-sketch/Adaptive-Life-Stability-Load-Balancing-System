import { DailyStabilityScore } from '../store/stabilityStore';

export type TrendDirection = 'increasing' | 'decreasing' | 'stable';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface StabilityPrediction {
    predictedValues: number[];
    trend: TrendDirection;
    slope: number;
    collapseWindow?: {
        daysUntilCollapse: number | null;
        riskLevel: RiskLevel;
    };
}

/**
 * Estimates the collapse time window based on predicted stability values.
 * Threshold for collapse is 40.
 * 
 * @param predictedValues Array of forecasted stability values
 * @returns Object with days until collapse and risk level
 */
export const estimateCollapseWindow = (predictedValues: number[]) => {
    const threshold = 40;
    const breachIndex = predictedValues.findIndex(v => v < threshold);

    if (breachIndex === -1) {
        return {
            daysUntilCollapse: null,
            riskLevel: 'LOW' as RiskLevel
        };
    }

    const days = breachIndex + 1; // 1-indexed days from "today"

    let riskLevel: RiskLevel = 'LOW';
    if (days <= 2) {
        riskLevel = 'HIGH';
    } else if (days <= 5) {
        riskLevel = 'MEDIUM';
    }

    return {
        daysUntilCollapse: days,
        riskLevel
    };
};

/**
 * Predicts next 5 stability values and determines the trend direction.
 * Uses simple linear regression (Least Squares Method).
 * 
 * @param scores Array of numerical stability scores or DailyStabilityScore objects
 * @returns Prediction object containing forecasted values and trend direction
 */
export const predictStabilityTrend = (
    scores: number[] | DailyStabilityScore[]
): StabilityPrediction => {
    // Normalize input to number[]
    const data: number[] = scores.length > 0 && typeof scores[0] === 'object'
        ? (scores as DailyStabilityScore[]).map(s => s.score)
        : (scores as number[]);

    if (data.length < 2) {
        return {
            predictedValues: new Array(5).fill(data[0] || 0),
            trend: 'stable',
            slope: 0
        };
    }

    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    data.forEach((y, x) => {
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    });

    const denominator = (n * sumX2 - sumX * sumX);
    if (denominator === 0) {
        return {
            predictedValues: new Array(5).fill(data[n - 1]),
            trend: 'stable',
            slope: 0
        };
    }

    const m = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;

    // Forecast next 5 values
    const predictedValues: number[] = [];
    for (let i = 0; i < 5; i++) {
        const targetX = n + i;
        let predicted = Number(((m * targetX) + b).toFixed(1));

        // Clamp 0-100
        predicted = Math.max(0, Math.min(100, predicted));
        predictedValues.push(predicted);
    }

    // Determine trend direction
    // Threshold of 0.5 per step for a "clear" trend
    let trend: TrendDirection = 'stable';
    if (m > 0.5) {
        trend = 'increasing';
    } else if (m < -0.5) {
        trend = 'decreasing';
    }

    return {
        predictedValues,
        trend,
        slope: Number(m.toFixed(3)),
        collapseWindow: estimateCollapseWindow(predictedValues)
    };
};

/**
 * Legacy support for existing consumers if any.
 */
export const predictFutureStability = (
    historicalScores: DailyStabilityScore[],
    daysToPredict: number = 7
): DailyStabilityScore[] => {
    const result = predictStabilityTrend(historicalScores);
    const lastDate = historicalScores.length > 0
        ? new Date(historicalScores[historicalScores.length - 1].date)
        : new Date();

    return result.predictedValues.map((score, i) => {
        const date = new Date(lastDate);
        date.setDate(date.getDate() + (i + 1));
        return {
            date: date.toISOString().split('T')[0],
            score
        };
    });
};
