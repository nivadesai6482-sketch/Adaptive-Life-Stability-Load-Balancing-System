import { DomainScores } from './stabilityCalculator';

/**
 * Mapping of life domains to targeted recommendations.
 */
export const RECOMMENDATION_MAP: Record<keyof DomainScores, string[]> = {
    Time: [
        "Maybe look for some quiet moments in your schedule today?",
        "How about setting aside an hour for what's most important to you?",
        "Is there one small thing you could move to tomorrow to breathe a bit easier?"
    ],
    Energy: [
        "A little stretch or a short walk might feel really nice right now.",
        "How about a cozy evening with no screens before you head to bed?",
        "Treat yourself to a nourishing snack or a glass of water—you deserve it."
    ],
    Cognitive: [
        "Writing down what's on your mind can help it feel a bit lighter.",
        "Maybe try focusing on just one thing at a time for a little while?",
        "A little bit of quiet or some soft music might help your mind rest."
    ],
    Emotional: [
        "Try a few deep, slow breaths—just for you.",
        "Maybe reach out to a friend for a quick, warm check-in?",
        "Spending a few minutes writing down how you feel can be so helpful."
    ],
    Financial: [
        "It might feel good to check on any small recurring costs you don't need.",
        "How about a 'no-spend' day just to feel a bit more in control?",
        "A quick look at your savings might give you some peace of mind."
    ]
};

/**
 * Mapping of life domains to primary corrective actions.
 */
export const DOMAIN_ACTION_MAP: Record<keyof DomainScores, string> = {
    Time: "Find some time",
    Energy: "Restore your energy",
    Cognitive: "Rest your mind",
    Emotional: "Gentle self-care",
    Financial: "Check your balance"
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
            "It might be a good idea to clear about half of your elective tasks today.",
            "You really need some deep rest—try to get a full, peaceful night's sleep.",
            "Maybe give yourself a 'grace period' for your deadlines over the next few days."
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
