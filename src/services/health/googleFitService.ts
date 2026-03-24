import axios from 'axios';

const GOOGLE_FIT_API_URL = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";

const getTimeRange = (days: number = 7) => {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(endTime.getDate() - days);

    return {
        startTimeMillis: startTime.getTime(),
        endTimeMillis: endTime.getTime()
    };
};

export const fetchGoogleFitData = async () => {
    const accessToken = localStorage.getItem("google_fit_access_token");

    if (!accessToken) {
        throw new Error("No Google Fit access token found. Please connect your health app first.");
    }

    const { startTimeMillis, endTimeMillis } = getTimeRange();

    const aggregateRequest = {
        aggregateBy: [
            {
                dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            },
            {
                dataSourceId: "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm"
            },
            {
                dataSourceId: "derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments"
            }
        ],
        bucketByTime: { durationMillis: 86400000 }, // Daily buckets
        startTimeMillis,
        endTimeMillis
    };

    try {
        const response = await axios.post(GOOGLE_FIT_API_URL, aggregateRequest, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        return formatGoogleFitData(response.data);
    } catch (error: any) {
        if (error.response?.status === 401) {
            localStorage.removeItem("google_fit_access_token");
        }
        throw error;
    }
};

const formatGoogleFitData = (data: any) => {
    return data.bucket.map((bucket: any) => {
        const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];

        let steps = 0;
        let heartRateAvg = 0;
        let activeMinutes = 0;

        bucket.dataset.forEach((dataset: any) => {
            if (dataset.dataSourceId.includes("step_count")) {
                steps = dataset.point.reduce((acc: number, point: any) => acc + (point.value[0].intVal || 0), 0);
            } else if (dataset.dataSourceId.includes("heart_rate")) {
                const heartRates = dataset.point.map((point: any) => point.value[0].fpVal || 0);
                if (heartRates.length > 0) {
                    heartRateAvg = heartRates.reduce((acc: number, val: number) => acc + val, 0) / heartRates.length;
                }
            } else if (dataset.dataSourceId.includes("activity.segment")) {
                activeMinutes = dataset.point.reduce((acc: number, point: any) => {
                    const duration = (parseInt(point.endTimeNanos) - parseInt(point.startTimeNanos)) / 1000000000 / 60;
                    return acc + (point.value[0].intVal !== 3 ? duration : 0); // Exclude "still" activity (type 3)
                }, 0);
            }
        });

        return {
            date,
            steps,
            heartRateAverage: Math.round(heartRateAvg),
            activeMinutes: Math.round(activeMinutes)
        };
    });
};
