export type ActivityLevel = 'low' | 'medium' | 'high';

export interface HealthData {
    heartRate: number;
    sleepHours: number;
    activityLevel: ActivityLevel;
    steps: number;
    lastSync: string;
}

export const getHealthData = async (): Promise<HealthData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const activityLevels: ActivityLevel[] = ['low', 'medium', 'high'];

    return {
        heartRate: Math.floor(Math.random() * (110 - 60 + 1)) + 60,
        sleepHours: Number((Math.random() * (9.0 - 4.0) + 4.0).toFixed(1)),
        activityLevel: activityLevels[Math.floor(Math.random() * activityLevels.length)],
        steps: Math.floor(Math.random() * 10000),
        lastSync: new Date().toISOString(),
    };
};

export const fitbitService = {
    connect: async (): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 1500);
        });
    },

    fetchData: getHealthData,

    disconnect: async (): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 500);
        });
    }
};
