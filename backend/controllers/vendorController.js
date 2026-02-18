const Vendor = require('../models/Vendor.js');


const getVendorProfile = async (req, res) => {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (vendor) {
        res.json(vendor);
    } else {
        res.status(404).json({ message: 'Vendor profile not found' });
    }
};


const updateVendorProfile = async (req, res) => {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (vendor) {
        vendor.shopName = req.body.shopName || vendor.shopName;
        vendor.description = req.body.description || vendor.description;

        const updatedVendor = await vendor.save();
        res.json(updatedVendor);
    } else {
        res.status(404).json({ message: 'Vendor not found' });
    }
};

module.exports = {
    getVendorProfile,
    updateVendorProfile
};
