const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            vendorId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Vendor'
            }
        }
    ],
    totalAmount: {
        type: Number, // Sum of product prices * quantities
        required: true
    },
    adminCommission: {
        type: Number, // 10% of totalAmount
        required: true
    },
    vendorAmount: {
        type: Number, // 90% of totalAmount (distributed amongst vendors, stored per order line or just total here if 1 vendor/order or if multiple, simplified for now)
        required: true
    },
    status: { // e.g., Pending, Processing, Shipped, Delivered
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
