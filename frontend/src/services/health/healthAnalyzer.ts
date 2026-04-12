import { ActivityLevel } from './fitbitService';

export type EnergyLevel = 'low' | 'medium' | 'high';
export type StressLevel = 'low' | 'medium' | 'high';

/**
 * Calculates a categorical energy score based on sleep duration and activity level.
 * @param sleepHours Number of hours of sleep
 * @param activity Activity level ('low', 'medium', 'high')
 */
export const calculateEnergyScore = (sleepHours: number, activity: ActivityLevel): EnergyLevel => {
    if (sleepHours < 6) return 'low';
    if (sleepHours <= 8) return 'medium';
    return 'high';
};

/**
 * Calculates a categorical stress level based on heart rate.
 * @param heartRate Heart rate in BPM
 */
export const calculateStressLevel = (heartRate: number): StressLevel => {
    if (heartRate > 90) return 'high';
    if (heartRate > 75) return 'medium';
    return 'low';
};
