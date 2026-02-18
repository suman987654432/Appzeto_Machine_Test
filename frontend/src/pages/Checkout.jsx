import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, reset, getMyOrders } from '../features/orders/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import { useEffect } from 'react';

const Checkout = () => {
    const { items, totalAmount } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { isSuccess, isError, message } = useSelector((state) => state.orders);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Checkout: useEffect triggered', { isSuccess, isError, message });
        
        if (isSuccess) {
            console.log('Checkout: Order placed successfully, clearing cart and refreshing orders...');
            alert('Order Placed Successfully!');
            dispatch(clearCart());
            // Fetch updated orders list
            dispatch(getMyOrders());
            // Add a small delay to ensure the order is saved before navigating
            setTimeout(() => {
                console.log('Checkout: Resetting order state and navigating to buyer dashboard...');
                dispatch(reset());
                navigate('/dashboard/buyer');
            }, 1000);
        }
        if (isError) {
            console.log('Checkout: Order placement failed:', message);
            alert(`Error: ${message}`);
            dispatch(reset());
        }
    }, [isSuccess, isError, message, navigate, dispatch]);

    const handlePlaceOrder = () => {
        console.log('Checkout: Placing order with cart items:', items);
        console.log('Checkout: Current user:', user);
        console.log('Checkout: User ID:', user?._id);
        console.log('Checkout: User role:', user?.role);
        
        if (!user || !user._id) {
            alert('User not properly logged in. Please login again.');
            return;
        }
        
        const orderData = {
            orderItems: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            })),
            totalAmount: totalAmount
        };
        
        console.log('Checkout: Order data being sent:', orderData);
        console.log('Checkout: Cart items detail:', items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })));
        
        dispatch(createOrder(orderData));
    };

    if (items.length === 0) {
        return <div className="container mx-auto p-10">Your cart is empty. <button onClick={() => navigate('/')} className="text-blue-500 underline">Go shopping</button></div>;
    }

    return (
        <div className="container mx-auto mt-10 max-w-2xl bg-white p-8 rounded shadow">
            <h1 className="text-3xl font-bold mb-6 border-b pb-4">Checkout</h1>

            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4">
                    <input type="text" placeholder="Full Name" className="border p-2 rounded w-full" defaultValue={user?.name} readOnly />
                    <input type="text" placeholder="Address Line 1" className="border p-2 rounded w-full" />
                    <input type="text" placeholder="City" className="border p-2 rounded w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="State" className="border p-2 rounded w-full" />
                        <input type="text" placeholder="ZIP Code" className="border p-2 rounded w-full" />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Order Summary</h2>
                <ul className="divide-y">
                    {items.map((item) => (
                        <li key={item.productId} className="py-2 flex justify-between">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 border-t pt-4 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 text-white py-3 rounded font-bold text-lg hover:bg-green-700 transition"
            >
                Place Order
            </button>
        </div>
    );
};

export default Checkout;
