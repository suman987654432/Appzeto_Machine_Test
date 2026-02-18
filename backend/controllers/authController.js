const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Vendor = require('../models/Vendor.js');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


const registerUser = async (req, res) => {
    const { name, email, password, role, shopName, description } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please include all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password, 
        role: role || 'buyer' // Default to buyer if not specified or invalid? Enforce enum in model
    });

    if (user) {
        // If vendor, create vendor profile
        let vendorInfo = null;
        if (role === 'vendor') {
            if (!shopName || !description) {
                
                await User.findByIdAndDelete(user._id); // Rollback
                return res.status(400).json({ message: 'Please include shop name and description for vendor' });
            }
            vendorInfo = await Vendor.create({
                userId: user._id,
                shopName,
                description,
                status: 'pending' // Admin must approve
            });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            vendorId: role === 'vendor' && vendorInfo ? vendorInfo._id : null,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Fetch vendor info if user is a vendor
        let vendorId = null;
        if (user.role === 'vendor') {
            const vendor = await Vendor.findOne({ userId: user._id });
            if (vendor) vendorId = vendor._id;
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            vendorId: vendorId,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const getMe = async (req, res) => {
    let vendorId = null;
    if (req.user.role === 'vendor') {
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (vendor) vendorId = vendor._id;
    }

    const user = {
        _id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        vendorId: vendorId
    };
    res.status(200).json(user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
