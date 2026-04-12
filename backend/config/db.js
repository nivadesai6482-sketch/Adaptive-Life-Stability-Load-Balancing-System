const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('⏳ Connecting to MongoDB Atlas...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000, // Increase to 30s
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ STAGE 1: Database Connection Failed.`);
        console.error(`Error Details: ${error.message}`);
        
        if (error.message.includes('SSL routines') || error.message.includes('alert number 80')) {
          console.error('\n📢 CAUSE DETECTED: IP Whitelist Rejection.');
          console.error('Action Required: Please whitelist your IP in MongoDB Atlas Dashboard.');
        } else if (error.message.includes('ECONNREFUSED')) {
          console.error('\n📢 CAUSE DETECTED: DNS/SRV Resolution blocked or Host unreachable.');
        }
        
        console.log('\nContinuing in limited mode (Database unavailable)...');
        // process.exit(1); // Do not exit, keep server up for health checks
    }
};

module.exports = connectDB;
