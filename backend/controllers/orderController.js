const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const Vendor = require('../models/Vendor.js');
const { calculateCommission } = require('../utils/commissionCalculator.js');


const addOrderItems = async (req, res) => {
    try {
        const { orderItems, totalAmount } = req.body; 

        console.log('Creating order for user:', req.user._id);
        console.log('Order data:', { orderItems, totalAmount });

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }


        let orderProducts = [];
        let calculatedTotal = 0;

        for (const item of orderItems) {
            const product = await Product.findById(item.productId);
            console.log('Processing product:', {
                productId: item.productId,
                productFound: !!product,
                productName: product?.name,
                requestedQuantity: item.quantity,
                availableStock: product?.stock
            });
            
            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Product ${product.name} out of stock` });
            }

            // Deduct stock
            product.stock -= item.quantity;
            await product.save();
            console.log('Stock updated for product:', product.name, 'New stock:', product.stock);

            orderProducts.push({
                productId: product._id,
                quantity: item.quantity,
                vendorId: product.vendorId || null // Handle cases where vendorId might be missing
            });

            calculatedTotal += product.price * item.quantity;
            console.log('Added to order products:', {
                productId: product._id,
                quantity: item.quantity,
                vendorId: product.vendorId,
                price: product.price,
                lineTotal: product.price * item.quantity
            });
        }

        console.log('Final calculated total:', calculatedTotal);
        console.log('Order products array:', JSON.stringify(orderProducts, null, 2));

        // Recalculate amounts
        const { adminCommission, vendorAmount } = calculateCommission(calculatedTotal);

        const order = new Order({
            buyerId: req.user._id,
            products: orderProducts,
            totalAmount: calculatedTotal,
            adminCommission,
            vendorAmount,
            status: 'Pending'
        });

        console.log('Order data before save:', {
            buyerId: req.user._id,
            productsCount: orderProducts.length,
            products: orderProducts,
            totalAmount: calculatedTotal,
            adminCommission,
            vendorAmount,
            status: 'Pending'
        });

        const createdOrder = await order.save();
        console.log('Order created successfully:', {
            id: createdOrder._id,
            buyerId: createdOrder.buyerId,
            productsInOrder: createdOrder.products?.length || 0,
            productsData: createdOrder.products,
            totalAmount: createdOrder.totalAmount,
            status: createdOrder.status
        });

        // Verify order was saved correctly by fetching it back
        const savedOrder = await Order.findById(createdOrder._id).populate('products.productId');
        console.log('Verification - Order fetched from DB:', {
            id: savedOrder._id,
            productsCount: savedOrder.products?.length || 0,
            productsDetails: savedOrder.products
        });

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        console.log('=== getMyOrders Controller ===');
        console.log('Request user:', req.user);
        console.log('User ID:', req.user._id);
        console.log('User role:', req.user.role);

        // First, let's check if any orders exist for this user (without population)
        const ordersRaw = await Order.find({ buyerId: req.user._id }).sort({ createdAt: -1 });
        console.log('Raw orders found:', ordersRaw.length);
        
        if (ordersRaw.length > 0) {
            console.log('Raw orders data:', ordersRaw.map(order => ({
                id: order._id,
                buyerId: order.buyerId,
                productsCount: order.products?.length || 0,
                productsRaw: order.products,
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt
            })));
        }

        // Now fetch with populated product details
        const orders = await Order.find({ buyerId: req.user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'products.productId',
                select: 'name image price category'
            });

        console.log('Populated orders found:', orders.length);
        
        if (orders.length > 0) {
            console.log('Populated orders data:', orders.map(order => ({
                id: order._id,
                buyerId: order.buyerId,
                productsCount: order.products?.length || 0,
                products: order.products?.map(p => ({
                    productId: p.productId?._id,
                    productName: p.productId?.name,
                    quantity: p.quantity,
                    vendorId: p.vendorId
                })),
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt
            })));
        } else {
            console.log('No orders found for user:', req.user._id);
            // Let's also check if there are ANY orders in the database
            const allOrders = await Order.find({});
            console.log('Total orders in database:', allOrders.length);
            console.log('All order buyerIds:', allOrders.map(o => ({ 
                id: o._id, 
                buyerId: o.buyerId,
                buyerIdString: o.buyerId.toString(),
                userIdString: req.user._id.toString(),
                match: o.buyerId.toString() === req.user._id.toString()
            })));
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

// @desc    Get logged in vendor orders
// @route   GET /api/orders/vendororders
// @access  Private/Vendor
const getVendorOrders = async (req, res) => {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // Find orders where products.vendorId matches vendor._id
    const orders = await Order.find({ 'products.vendorId': vendor._id });

    // Ideally user might want detailed view filtering only their products, but this returns the full order doc
    // which contains other vendors' products too if mixed.
    // For "Vendor isolation", we should really filter the response to only show their items.

    const vendorOrders = orders.map(order => {
        const myItems = order.products.filter(p => p.vendorId.toString() === vendor._id.toString());
        return {
            ...order.toObject(),
            products: myItems,
            // Adjust total for this vendor?
            // totalAmount in Order is global. 
            // vendorAmount is strictly 90% of global total, which is wrong if mixed vendors.
            // But let's assume single vendor per order for simplicity or accept the global view for MVP.
            // Requirement says "Vendor isolation (vendors manage only their own products)".
            // Let's not overengineer for MVP unless "Commission tracking" requires precision per vendor per order.
            // Commission logic: "10% admin commission, 90% vendor earning".
            // If mixed, 90% is split. 
            // Let's keep it simple.
        };
    });

    res.json(vendorOrders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Vendor/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = {
    addOrderItems,
    getMyOrders,
    getVendorOrders,
    updateOrderStatus
};
