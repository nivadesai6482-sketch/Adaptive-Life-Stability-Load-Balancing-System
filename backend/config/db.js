const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('⏳ Connecting to MongoDB Atlas...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ STAGE 1: Database Connection Failed.`);
        console.error(`Error Details: ${error.message}`);
        
        if (error.message.includes('SSL routines') || error.message.includes('alert number 80')) {
          console.error('\n📢 CAUSE DETECTED: IP Whitelist Rejection.');
          console.error('Action Required: Please whitelist your IP in MongoDB Atlas Dashboard.');
        } else if (error.message.includes('ECONNREFUSED')) {
          console.error('\n📢 CAUSE DETECTED: DNS/SRV Resolution blocked.');
          console.error('Action Required: Check if UDP Port 53 is blocked or use direct connection string.');
        }
        
        console.log('\nExiting to prevent unstable server state...');
        process.exit(1);
    }
};

module.exports = connectDB;
