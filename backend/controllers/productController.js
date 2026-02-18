const Product = require('../models/Product.js');
const Vendor = require('../models/Vendor.js');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        console.log('=== getProducts Controller ===');
        console.log('Request user:', req.user ? {
            id: req.user._id,
            role: req.user.role,
            name: req.user.name
        } : 'No user (public request)');

        const products = await Product.find({});
        console.log('Total products found:', products.length);
        
        if (req.user && req.user.role === 'vendor') {
            const vendor = await Vendor.findOne({ userId: req.user._id });
            console.log('Vendor info for filtering:', vendor);
            
            const vendorProducts = products.filter(p => 
                p.vendorId?.toString() === vendor?._id?.toString() || 
                p.user?.toString() === req.user._id.toString()
            );
            console.log('Vendor products count:', vendorProducts.length);
            console.log('Vendor products:', vendorProducts.map(p => ({
                id: p._id,
                name: p.name,
                vendorId: p.vendorId,
                user: p.user
            })));
        }

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = async (req, res) => {
    try {
        console.log('=== createProduct Controller ===');
        console.log('User:', req.user);
        console.log('User ID:', req.user._id);
        console.log('User role:', req.user.role);

        const vendor = await Vendor.findOne({ userId: req.user._id });
        console.log('Vendor found:', vendor);

        if (!vendor) {
            console.log('No vendor profile found for user:', req.user._id);
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        console.log('Vendor status:', vendor.status);
        if (vendor.status !== 'approved') {
            console.log('Vendor not approved:', vendor.status);
            return res.status(403).json({ message: 'Vendor account not approved by admin.' });
        }

        const { name, price, stock, image, category } = req.body;
        console.log('Product data to create:', { name, price, stock, image, category });

        const product = new Product({
            vendorId: vendor._id,
            name,
            price,
            stock,
            image,
            category,
            user: req.user._id
        });

        console.log('Product object before save:', {
            vendorId: vendor._id,
            name,
            price,
            stock,
            image,
            category,
            user: req.user._id
        });

        const createdProduct = await product.save();
        console.log('Product created successfully:', {
            id: createdProduct._id,
            name: createdProduct.name,
            vendorId: createdProduct.vendorId,
            user: createdProduct.user
        });

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor
const updateProduct = async (req, res) => {
    const { name, price, stock, image, category } = req.body;

    const product = await Product.findById(req.params.id);
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (product) {
        // Check ownership
        if (product.vendorId.toString() !== vendor._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this product' });
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.image = image || product.image;
        product.category = category || product.category;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (product) {
        if (product.vendorId.toString() !== vendor._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this product' });
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
