const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');

dotenv.config();

const checkOrders = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const users = await User.find({});
        console.log('\n=== USERS ===');
        users.forEach(u => console.log(`Name: ${u.name} | Email: ${u.email} | Role: ${u.role} | ID: ${u._id}`));

        const orders = await Order.find({}).populate('buyerId', 'name email');
        console.log('\n=== ORDERS ===');
        if (orders.length === 0) {
            console.log('No orders found in database.');
        } else {
            orders.forEach(o => {
                const buyerName = o.buyerId ? o.buyerId.name : 'Unknown User';
                const buyerEmail = o.buyerId ? o.buyerId.email : 'Unknown Email';
                const buyerId = o.buyerId ? o.buyerId._id : o.buyerId; // in case populate failed

                console.log(`Order ID: ${o._id}`);
                console.log(`  Buyer: ${buyerName} (${buyerEmail})`);
                console.log(`  Buyer ID: ${buyerId}`);
                console.log(`  Total Amount: ${o.totalAmount}`);
                console.log(`  Status: ${o.status}`);
                console.log(`  Created At: ${o.createdAt}`);
                console.log('---');
            });
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkOrders();
