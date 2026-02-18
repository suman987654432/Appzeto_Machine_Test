import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { items, totalAmount } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="container mx-auto mt-10 p-6 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul>
                        {items.map((item) => (
                            <li key={item.productId} className="flex justify-between items-center mb-4 border-b pb-2">
                                <div className="flex items-center">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4 rounded" />
                                    <div>
                                        <h3 className="font-bold">{item.name}</h3>
                                        <p>${item.price} x {item.quantity}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => dispatch(removeFromCart(item.productId))}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</h2>
                        <button
                            onClick={handleCheckout}
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                        >
                            Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
