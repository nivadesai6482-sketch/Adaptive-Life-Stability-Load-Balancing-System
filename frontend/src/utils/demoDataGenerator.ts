import { Task } from '../store/taskStore';
import { API_ENDPOINTS } from '../config/apiConfig';

/**
 * Utility to generate and inject realistic demographic data into the system
 * Useful for demonstrating load balancing and trend projection capabilities.
 */

const getAuthToken = () => localStorage.getItem('token');

export const generateDemoTasks = async () => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required to inject demo data");

    const today = new Date();

    const demoTasks = [
        {
            title: "Finalize Quarterly Tax Filings",
            priority: "high",
            deadline: new Date(today.getTime() + (1 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Tomorrow
        },
        {
            title: "Renew Primary Server TLS Certificates",
            priority: "high",
            deadline: new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // In 2 days
        },
        {
            title: "Draft Q3 Engineering Hiring Plan",
            priority: "medium",
            deadline: new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // In 3 days
        },
        {
            title: "Review Frontend Architecture PR #442",
            priority: "medium",
            deadline: new Date(today.getTime() + (4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        },
        {
            title: "Analyze AWS Billing Spikes for February",
            priority: "medium",
            deadline: new Date(today.getTime() + (5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        },
        {
            title: "Schedule Dentist Checkup",
            priority: "low",
            deadline: new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        },
        {
            title: "Renew Subscriptions Auto-pay list",
            priority: "low",
            deadline: new Date(today.getTime() + (20 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        }
    ];

    console.log("Injecting Demo Tasks...");
    for (const task of demoTasks) {
        try {
            const res = await fetch(API_ENDPOINTS.TASKS.BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...task, status: 'todo' })
            });
            if (!res.ok) console.error("Failed to inject task", await res.text());
        } catch (e) {
            console.error("Network error during task injection", e);
        }
    }
    console.log("Demo Tasks Injection Complete.");
};

export const generateDemoStabilityScores = async () => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required to inject demo data");

    const today = new Date();

    // Simulate a 14-day historical curve (High -> Low -> Medium recovery)
    const curve = [
        { t: 85, e: 90, c: 80, em: 85, f: 90 }, // 14 days ago (Optimal)
        { t: 82, e: 85, c: 78, em: 82, f: 88 }, // 13 days ago
        { t: 78, e: 80, c: 75, em: 75, f: 85 }, // 12 days ago
        { t: 75, e: 70, c: 70, em: 70, f: 85 }, // 11 days ago
        { t: 70, e: 65, c: 60, em: 65, f: 80 }, // 10 days ago (Strain building)
        { t: 65, e: 55, c: 50, em: 60, f: 80 }, // 9 days ago
        { t: 55, e: 45, c: 45, em: 50, f: 75 }, // 8 days ago (Warning State)
        { t: 45, e: 35, c: 40, em: 45, f: 70 }, // 7 days ago (CRITICAL DIP)
        { t: 40, e: 40, c: 42, em: 50, f: 70 }, // 6 days ago
        { t: 50, e: 55, c: 55, em: 60, f: 70 }, // 5 days ago (Recovery protocol initiated)
        { t: 55, e: 60, c: 60, em: 65, f: 75 }, // 4 days ago
        { t: 60, e: 68, c: 65, em: 70, f: 75 }, // 3 days ago
        { t: 65, e: 72, c: 70, em: 72, f: 75 }, // 2 days ago
        { t: 70, e: 75, c: 72, em: 75, f: 75 }  // Yesterday
    ];

    console.log("Injecting Demo Historical Stability Scores...");
    // Hack: We can't officially set historical dates via the standard UI POST method 
    // unless the backend allows overriding createdAt. Assuming backend might ignore it 
    // or we just inject the values repeatedly (which will unfortunately stamp them with today's date).
    // Let's attempt to send them anyway. If the backend schema overrides createdAt to Date.now, 
    // they will just stack on today. 
    // Note: For a true functional frontend demo without a customized backend seed route, 
    // we just iterate and post.

    for (let i = 0; i < curve.length; i++) {
        const point = curve[i];

        // Calculate artificial LSI (average)
        const lsi = Math.round((point.t + point.e + point.c + point.em + point.f) / 5);

        const payload = {
            timeScore: point.t,
            energyScore: point.e,
            cognitiveScore: point.c,
            emotionalScore: point.em,
            financialScore: point.f,
            lifeStabilityIndex: lsi
        };

        try {
            const res = await fetch(API_ENDPOINTS.STABILITY.BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) console.error("Failed to inject score", await res.text());
        } catch (e) {
            console.error("Network error during score injection", e);
        }
    }

    console.log("Demo Scores Injection Complete.");
};
