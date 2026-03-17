export interface HealthData {
    heartRate: number;
    sleepHours: number;
    activityLevel: number; // 0-100
    steps: number;
    lastSync: string;
}

export const fitbitService = {
    connect: async (): Promise<boolean> => {
        // Simulate OAuth / Connection delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
    },

    fetchData: async (): Promise<HealthData> => {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    heartRate: Math.floor(Math.random() * (85 - 60 + 1)) + 60,
                    sleepHours: Number((Math.random() * (8.5 - 6.0) + 6.0).toFixed(1)),
                    activityLevel: Math.floor(Math.random() * 100),
                    steps: Math.floor(Math.random() * 12000),
                    lastSync: new Date().toISOString(),
                });
            }, 1500);
        });
    },

    disconnect: async (): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 500);
        });
    }
};
