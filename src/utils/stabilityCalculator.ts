export interface DomainScores {
    Time: number;
    Energy: number;
    Cognitive: number;
    Emotional: number;
    Financial: number;
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
 * Estimates the recovery time needed based on the current Life Stability Index.
 * 
 * @param lsi The current Life Stability Index (0-100)
 * @returns Estimated recovery time in hours
 */
export const calculateRecoveryTime = (lsi: number): number => {
    if (lsi >= SAFE_STABILITY_THRESHOLD) {
        return 0;
    }

    if (lsi >= 40) {
        // Warning Zone (40-70): Scale between 4 and 24 hours
        // (70-70)*0.67 + 4 = 4
        // (70-40)*0.67 + 4 = 20.1 + 4 = 24.1
        return Math.round((SAFE_STABILITY_THRESHOLD - lsi) * 0.67 + 4);
    }

    // Critical Zone (<40): Scale between 24 and 120 hours (5 days)
    // (40-40)*2.4 + 24 = 24
    // (40-0)*2.4 + 24 = 96 + 24 = 120
    return Math.round((40 - lsi) * 2.4 + 24);
};
