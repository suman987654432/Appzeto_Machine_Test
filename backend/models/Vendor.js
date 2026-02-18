const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true, // A user can imply one vendor profile
    },
    shopName: {
        type: String,
        required: [true, 'Please add a shop name'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a shop description']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);
