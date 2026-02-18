const Vendor = require('../models/Vendor.js');
const Order = require('../models/Order.js');

// @desc    Get all vendors (for admin/public?)
// @route   GET /api/admin/vendors
// @access  Private/Admin
const getVendors = async (req, res) => {
    const vendors = await Vendor.find({}).populate('userId', 'name email');
    res.json(vendors);
};

// @desc    Approve or reject vendor - status
// @route   PUT /api/admin/vendors/:id
// @access  Private/Admin
const updateVendorStatus = async (req, res) => {
    const { status } = req.body; // approved, rejected
    const vendor = await Vendor.findById(req.params.id);

    if (vendor) {
        vendor.status = status;
        const updatedVendor = await vendor.save();
        res.json(updatedVendor);
    } else {
        res.status(404).json({ message: 'Vendor not found' });
    }
};

// @desc    Get total revenue and commission
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    const orders = await Order.find({}); // Fetch all orders

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalCommission = orders.reduce((acc, order) => acc + order.adminCommission, 0); // 10%
    const vendorEarnings = orders.reduce((acc, order) => acc + order.vendorAmount, 0); // 90%

    res.json({
        totalOrders: orders.length,
        totalRevenue,
        totalCommission, // Admin earnings
        vendorEarnings
    });
};

module.exports = {
    getVendors,
    updateVendorStatus,
    getAdminStats
};
