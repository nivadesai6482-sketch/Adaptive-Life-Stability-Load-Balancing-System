const mongoose = require('mongoose');
const dotenv = require('dotenv');
const StabilityScore = require('./models/StabilityScore');
const Task = require('./models/Task');

// Load env vars
dotenv.config();

// Connect to DB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeder...');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        // 1. Wipe current collections
        await StabilityScore.deleteMany();
        await Task.deleteMany();
        console.log('🗑️  Existing Data Wiped');

        // 2. Generate 14 days of Historical Stability Scores
        const scores = [];
        const today = new Date();
        
        // Base values to simulate a "stressful week" curve
        // Start high -> dip mid-week -> recover slightly
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

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - (14 - i));
            
            const point = curve[i];
            
            // Calculate artificial LSI (average)
            const lsi = Math.round((point.t + point.e + point.c + point.em + point.f) / 5);

            scores.push({
                timeScore: point.t,
                energyScore: point.e,
                cognitiveScore: point.c,
                emotionalScore: point.em,
                financialScore: point.f,
                lifeStabilityIndex: lsi,
                createdAt: date
            });
        }

        // Add today's live score (borderline Warning)
        scores.push({
            timeScore: 72,
            energyScore: 75,
            cognitiveScore: 70,
            emotionalScore: 75,
            financialScore: 75,
            lifeStabilityIndex: 73,
            createdAt: today
        });

        await StabilityScore.insertMany(scores);
        console.log(`📈 Simulated ${scores.length} days of Historical Stability Data`);

        // 3. Generate Overloading Task List
        const demoTasks = [
            {
                title: "Finalize Quarterly Tax Filings",
                priority: "high",
                deadline: new Date(today.getTime() + (1 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Tomorrow
                status: "todo"
            },
            {
                title: "Renew Primary Server TLS Certificates",
                priority: "high",
                deadline: new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // In 2 days
                status: "todo"
            },
            {
                title: "Draft Q3 Engineering Hiring Plan",
                priority: "medium",
                deadline: new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // In 3 days
                status: "in-progress"
            },
            {
                title: "Review Frontend Architecture PR #442",
                priority: "medium",
                deadline: new Date(today.getTime() + (4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                status: "todo"
            },
            {
                title: "Analyze AWS Billing Spikes for February",
                priority: "medium",
                deadline: new Date(today.getTime() + (5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                status: "todo"
            },
            {
                title: "Schedule Dentist Checkup",
                priority: "low",
                deadline: new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                status: "todo"
            },
            {
                title: "Renew Subscriptions Auto-pay list",
                priority: "low",
                deadline: new Date(today.getTime() + (20 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                status: "todo"
            },
            // Add a completed task that shouldn't impact load balancers
            {
                title: "Conduct Weekly 1:1s with Design Team",
                priority: "high",
                deadline: new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Yesterday
                status: "completed"
            }
        ];

        await Task.insertMany(demoTasks);
        console.log(`📋 Inserted ${demoTasks.length} Active System Tasks`);

        console.log('✅ DEMO DATA SEEDING COMPLETE');
        process.exit();
    } catch (error) {
        console.error(`❌ Seeding Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}

// Function to just wipe data
const destroyData = async () => {
    try {
        await connectDB();
        await StabilityScore.deleteMany();
        await Task.deleteMany();
        console.log('🗑️  Data completely wiped');
        process.exit();
    } catch (error) {
        console.error(`${error.message}`);
        process.exit(1);
    }
};
