import { DomainScores } from './stabilityCalculator';

/**
 * Mapping of life domains to targeted recommendations.
 */
export const RECOMMENDATION_MAP: Record<keyof DomainScores, string[]> = {
    Time: [
        "Audit schedule for time leaks and automated distractions",
        "Block 2 hours of deep work for your primary objective",
        "Delegate or postpone one low-priority meeting or task"
    ],
    Energy: [
        "Schedule a 20-minute physical reset (walk or stretching)",
        "Optimize sleep hygiene tonight (no screens 1hr before bed)",
        "Prioritize nutritionally dense fuel to stabilize glucose levels"
    ],
    Cognitive: [
        "Externalize mental load to a trusted task list or journal",
        "Switch to single-tasking mode: close all unrelated tabs",
        "Reduce interface input and environmental stimuli"
    ],
    Emotional: [
        "Practice physiological sigh pattern: double inhale, long exhale",
        "Connect with a primary support contact for a brief check-in",
        "Spend 10 minutes journaling for emotional processing"
    ],
    Financial: [
        "Review and prune non-essential recurring subscription load",
        "Temporarily pause discretionary spending for 48 hours",
        "Verify automated savings and debt reduction protocols"
    ]
};

/**
 * Mapping of life domains to primary corrective actions.
 */
export const DOMAIN_ACTION_MAP: Record<keyof DomainScores, string> = {
    Time: "Re-calibrate Schedule",
    Energy: "Execute Energy Reset",
    Cognitive: "Reduce Cognitive Load",
    Emotional: "Regulate Responding",
    Financial: "Verify Resource Baseline"
};

/**
 * Generates targeted recommendations based on weakest domains and burnout risk.
 * 
 * @param scores Current scores for each life stability domain
 * @param burnoutRisk Optional categorical risk level
 * @returns An array of string recommendations
 */
export const getRecommendations = (
    scores: DomainScores,
    burnoutRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
): string[] => {
    // Priority 1: Burnout Mitigation
    if (burnoutRisk === 'HIGH') {
        return [
            "CRITICAL: Immediate 50% reduction in elective cognitive commitments",
            "MANDATORY REST: Minimum 8 hours of sleep required for biological reset",
            "LOAD SHEDDING: Delay all deadlines by 48-72 hours until stability recovers"
        ];
    }

    // Priority 2: Domain-specific recovery
    const entries = Object.entries(scores) as [keyof DomainScores, number][];
    const weakestEntry = entries.reduce((min, current) =>
        current[1] < min[1] ? current : min
        , entries[0]);

    const weakestDomain = weakestEntry[0];

    // Add medium burnout context if applicable
    const baseRecommendations = RECOMMENDATION_MAP[weakestDomain] || [];

    if (burnoutRisk === 'MEDIUM') {
        return ["Warning: Burnout buffer is thin. " + baseRecommendations[0], ...baseRecommendations.slice(1)];
    }

    return baseRecommendations;
};

/**
 * Returns the primary corrective action for a specific domain.
 * 
 * @param domain The life domain key
 * @returns A string representing the primary action
 */
export const getDomainAction = (domain: keyof DomainScores): string => {
    return DOMAIN_ACTION_MAP[domain] || "Maintain Baseline";
};
