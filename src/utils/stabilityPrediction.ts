import { DailyStabilityScore } from '../store/stabilityStore';

/**
 * Calculates a simple linear regression (line of best fit) and returns
 * new daily predictive scores for the requested number of future days.
 */
export const predictFutureStability = (
    historicalScores: DailyStabilityScore[],
    daysToPredict: number = 7
): DailyStabilityScore[] => {
    
    // Cannot project without at least 2 data points
    if (historicalScores.length < 2) {
        return [];
    }

    // Ensure we are working with sorted dates ascending
    const sortedScores = [...historicalScores].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const n = sortedScores.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    // Use zero-based numeric representation for 'x' to avoid massive timestamp values in the regression formula
    sortedScores.forEach((entry, i) => {
        const x = i;
        const y = entry.score;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    });

    // Formula for slope (m) and intercept (b):
    // m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX^2)
    // b = (sumY - m * sumX) / n
    const denominator = (n * sumX2 - sumX * sumX);
    
    // If the denominator is 0, the points are a perfectly vertical line (impossible with day index)
    if (denominator === 0) {
        return [];
    }

    const m = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;

    // We start predicting from the index AFTER our last known historical point
    const startIdx = n;
    
    // Calculate the actual Date object of the last entry to properly stringify future dates
    const lastDateEntry = new Date(sortedScores[n - 1].date);
    
    const predictions: DailyStabilityScore[] = [];

    for (let i = 0; i < daysToPredict; i++) {
        const targetX = startIdx + i;
        
        // Calculate y = mx + b
        let predictedScore = Math.round((m * targetX) + b);
        
        // Clamp to sensible boundaries
        if (predictedScore > 100) predictedScore = 100;
        if (predictedScore < 0) predictedScore = 0;

        // Calculate logical next date (add 'i + 1' days to the last historical date)
        const nextDate = new Date(lastDateEntry);
        nextDate.setDate(nextDate.getDate() + (i + 1));
        
        predictions.push({
            date: nextDate.toISOString().split('T')[0],
            score: predictedScore
        });
    }

    return predictions;
};
