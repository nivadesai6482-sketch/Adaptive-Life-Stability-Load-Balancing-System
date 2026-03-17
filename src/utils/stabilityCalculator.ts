export interface DomainScores {
    Time: number;
    Energy: number;
    Cognitive: number;
    Emotional: number;
    Financial: number;
    [key: string]: number;
}

/**
 * Default weights for calculating the Life Stability Index (LSI).
 * These weights reflect the relative importance of each domain to overall stability.
 * They sum up to 1.0.
 */
export const defaultWeights: DomainScores = {
    Time: 0.20,       // Time management and availability
    Energy: 0.25,     // Physical energy is often the foundational bottleneck
    Cognitive: 0.20,  // Mental bandwidth and focus
    Emotional: 0.20,  // Emotional regulation and resilience
    Financial: 0.15,  // Financial baseline security
};

/**
 * Calculates the Life Stability Index (LSI) using a weighted average of domain scores.
 * 
 * @param scores Current scores for each life stability domain (0-100)
 * @param weights Optional custom weights for each domain. Defaults to `defaultWeights`.
 * @returns The calculated LSI score (0-100), rounded to one decimal place.
 */
export const calculateLSI = (
    scores: DomainScores,
    weights: DomainScores = defaultWeights
): number => {
    // Calculate the total weight to normalize in case custom weights don't sum to exactly 1.0
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

    if (totalWeight === 0) {
        return 0; // Prevent division by zero if all weights are 0
    }

    const normalizedWeights = {
        Time: weights.Time / totalWeight,
        Energy: weights.Energy / totalWeight,
        Cognitive: weights.Cognitive / totalWeight,
        Emotional: weights.Emotional / totalWeight,
        Financial: weights.Financial / totalWeight,
    };

    const lsi =
        (scores.Time * normalizedWeights.Time) +
        (scores.Energy * normalizedWeights.Energy) +
        (scores.Cognitive * normalizedWeights.Cognitive) +
        (scores.Emotional * normalizedWeights.Emotional) +
        (scores.Financial * normalizedWeights.Financial);

    // Round the final LSI to one decimal place for display purposes
    return Math.round(lsi * 10) / 10;
};
/**
 * Threshold for a domain to be considered "unstable".
 * Scores below this value indicate significant strain in that domain.
 */
export const STABILITY_THRESHOLD = 50;

/**
 * Calculates the categorical instability risk based on the number of unstable domains.
 * 
 * @param scores Current scores for each life stability domain
 * @returns A string representing the risk level: Negligible, Low, Medium, High, or Critical
 */
export const calculateInstabilityRisk = (scores: DomainScores): string => {
    const unstableDomainsCount = Object.values(scores).filter(score => score < STABILITY_THRESHOLD).length;

    if (unstableDomainsCount === 0) return "Negligible";
    if (unstableDomainsCount === 1) return "Low";
    if (unstableDomainsCount === 2) return "Medium";
    if (unstableDomainsCount === 3) return "High";
    return "Critical"; // 4 or more
};

export interface StabilityAlert {
    id: string;
    domain: keyof DomainScores;
    level: 'warning' | 'critical';
    title: string;
    description: string;
}

/**
 * Thresholds for different alert levels.
 */
export const ALERT_THRESHOLDS = {
    warning: 50,
    critical: 30,
};

/**
 * Automatically generates alerts when domain scores fall below defined thresholds.
 * 
 * @param scores Current scores for each life stability domain
 * @returns An array of StabilityAlert objects
 */
export const generateDomainAlerts = (scores: DomainScores): StabilityAlert[] => {
    const alerts: StabilityAlert[] = [];

    (Object.keys(scores) as (keyof DomainScores)[]).forEach(domain => {
        const score = scores[domain];

        if (score < ALERT_THRESHOLDS.critical) {
            alerts.push({
                id: `crit-${domain}-${Date.now()}`,
                domain,
                level: 'critical',
                title: `Critical instability in ${domain}`,
                description: `Emergency capacity depletion detected in ${domain}. Immediate load shedding required.`
            });
        } else if (score < ALERT_THRESHOLDS.warning) {
            alerts.push({
                id: `warn-${domain}-${Date.now()}`,
                domain,
                level: 'warning',
                title: `Instability warning: ${domain}`,
                description: `${domain} capacity is below optimal threshold. Consider postponing non-essential tasks.`
            });
        }
    });

    return alerts;
};

/**
 * Threshold above which the system is considered "safe" and no recovery is required.
 */
export const SAFE_STABILITY_THRESHOLD = 70;

/**
 * Maps biological telemetry (sleep and activity) to a numerical Energy domain score (0-100).
 * 
 * Rules:
 * - Sleep < 6h: Low energy base (30-50)
 * - Sleep 6-8h: Medium energy base (50-80)
 * - Sleep > 8h: High energy base (80-100)
 * 
 * Activity level provides a +/- 10% adjustment.
 * 
 * @param sleepHours Number of hours of sleep
 * @param activity Activity level ('low' | 'medium' | 'high')
 * @returns Numerical score (0-100)
 */
export const mapHealthToEnergyScore = (
    sleepHours: number,
    activity: 'low' | 'medium' | 'high'
): number => {
    let baseScore = 50;

    if (sleepHours < 6) {
        // Scale 30 to 50 based on how close to 6 they got
        baseScore = 30 + (sleepHours / 6) * 20;
    } else if (sleepHours <= 8) {
        // Scale 50 to 80 based on how close to 8 they got
        baseScore = 50 + ((sleepHours - 6) / 2) * 30;
    } else {
        // Scale 80 to 100 capped at 10 hours
        baseScore = 80 + (Math.min(sleepHours - 8, 2) / 2) * 20;
    }

    // Activity Modifier
    const activityModifiers = {
        low: -5,
        medium: 0,
        high: 10
    };

    const finalScore = baseScore + activityModifiers[activity];

    return Math.min(Math.max(Math.round(finalScore), 0), 100);
};

/**
 * Estimates the recovery time needed based on the current Life Stability Index.
 * ...
 */
export const calculateRecoveryTime = (lsi: number): number => {
// ... existing implementation remains
