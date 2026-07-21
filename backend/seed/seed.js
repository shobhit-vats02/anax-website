/* One-off script: node seed/seed.js
   Wipes and repopulates content collections + creates the admin account
   (from ADMIN_DEFAULT_PASSWORD, default "anaxcode") if it doesn't exist yet. */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const seedDatabase = require('./seedData');

(async () => {
    await connectDB();
    await seedDatabase();
    console.log('Database seeded successfully.');
    await mongoose.connection.close();
    process.exit(0);
})();
