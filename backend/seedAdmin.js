const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        // Wait a small moment for connection to be fully ready if needed, 
        // though connectDB awaits mongoose.connect so it should be fine.

        const adminEmail = 'admin@example.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin user already exists');
        } else {
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: 'adminpassword',
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }

        console.log('Use these credentials to login:');
        console.log('Email: admin@example.com');
        console.log('Password: adminpassword');

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
