import axios from 'axios';
import API from '../../utils/axiosInstance';

const createOrder = async (orderData) => {
    try {
        console.log('OrderAPI: Creating order with data:', orderData);
        const response = await API.post('/orders', orderData);
        console.log('OrderAPI: Order created, response:', response.data);
        return response.data;
    } catch (error) {
        console.error('OrderAPI: Error creating order:', error.response?.data || error.message);
        throw error;
    }
};

const getMyOrders = async () => {
    try {
        console.log('Frontend: Calling getMyOrders API...');
        const token = localStorage.getItem('token');
        console.log('Frontend: Token exists:', !!token);
        
        const response = await API.get('/orders/myorders');
        console.log('Frontend: Orders response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Frontend: Error fetching orders:', error.response?.data || error.message);
        throw error;
    }
};

const getVendorOrders = async () => {
    const response = await API.get('/orders/vendororders');
    return response.data;
};

const updateOrderStatus = async ({ orderId, status }) => {
    const response = await API.put(`/orders/${orderId}/status`, { status });
    return response.data;
};


const orderService = {
    createOrder,
    getMyOrders,
    getVendorOrders,
    updateOrderStatus
};

export default orderService;
