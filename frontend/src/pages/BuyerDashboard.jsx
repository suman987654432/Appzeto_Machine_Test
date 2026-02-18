import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyOrders, reset } from '../features/orders/orderSlice';
import { getProducts } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';

const BuyerDashboard = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('orders');

    const { orders, isLoading: ordersLoading, isError: ordersError, message: ordersMessage } = useSelector((state) => state.orders);
    const { products, isLoading: productsLoading, isError: productsError, message: productsMessage } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // Always fetch orders when component mounts
        console.log('BuyerDashboard: Component mounted, fetching data...');
        console.log('BuyerDashboard: Current user from Redux:', user);
        console.log('BuyerDashboard: User role:', user?.role);
        console.log('BuyerDashboard: User ID:', user?._id);
        
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');

        console.log('BuyerDashboard: Current user from localStorage:', localUser);
        console.log('BuyerDashboard: Token exists:', !!token);

        dispatch(reset());
        dispatch(getMyOrders());

        // Fetch products for browsing
        dispatch(getProducts());
    }, [dispatch, user]);

    // Refetch orders when component becomes visible
    useEffect(() => {
        const handleFocus = () => {
            console.log('BuyerDashboard: Window focused, refetching orders...');
            dispatch(getMyOrders());
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [dispatch]);

    // Also refetch when activeTab changes to orders
    useEffect(() => {
        if (activeTab === 'orders') {
            console.log('BuyerDashboard: Switched to orders tab, refetching...');
            dispatch(getMyOrders());
        }
    }, [activeTab, dispatch]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        alert(`${product.name} added to cart!`);
    };

    const refreshData = () => {
        if (activeTab === 'orders') {
            console.log('BuyerDashboard: Refreshing orders...');
            dispatch(getMyOrders());
        } else {
            console.log('BuyerDashboard: Refreshing products...');
            dispatch(getProducts());
        }
    };

   
 

    const currentLoading = activeTab === 'orders' ? ordersLoading : productsLoading;
    const currentError = activeTab === 'orders' ? ordersError : productsError;
    const currentMessage = activeTab === 'orders' ? ordersMessage : productsMessage;

    if (currentLoading) return (
        <div className="container mx-auto mt-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Loading {activeTab === 'orders' ? 'your orders' : 'products'}...</p>
        </div>
    );

    if (currentError) return (
        <div className="container mx-auto mt-10">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Error:</strong> {currentMessage}
            </div>
            <button
                onClick={refreshData}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="container mx-auto mt-10">
            {/* Welcome Section */}
           

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`py-2 px-6 text-sm font-medium border-b-2 ${activeTab === 'orders'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            My Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`py-2 px-6 text-sm font-medium border-b-2 ${activeTab === 'products'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Browse Products
                        </button>
                    </nav>
                    <div className="space-x-2">
                        <button 
                            onClick={refreshData} 
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Refresh
                        </button>
                       
                      
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* My Orders Tab */}
                    {activeTab === 'orders' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">My Orders</h2>
                                    <p className="text-gray-600 text-sm">Track and manage your order history</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            console.log('BuyerDashboard: Manual refresh button clicked');
                                            dispatch(getMyOrders());
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                                    >
                                        Refresh Orders
                                    </button>
                                </div>
                            </div>

                            {/* Debug Section for Orders */}
                          

                            {orders && orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order._id} className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-lg">Order #{order._id.substring(0, 8)}</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-600 font-semibold">Total: <span className="text-green-600">${order.totalAmount}</span></p>
                                                    <p className="text-gray-500 text-sm">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm mb-2">Items Ordered:</h4>
                                                    {order.products && order.products.map((p, idx) => (
                                                        <div key={idx} className="flex items-center space-x-3 mb-2">
                                                            {p.productId ? (
                                                                <>
                                                                    <img
                                                                        src={p.productId.image}
                                                                        alt={p.productId.name}
                                                                        className="w-10 h-10 object-cover rounded border border-gray-200"
                                                                    />
                                                                    <div className="text-sm">
                                                                        <p className="font-medium text-gray-800">{p.productId.name}</p>
                                                                        <p className="text-gray-500">Qty: {p.quantity}</p>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400 italic text-sm">Product Unavailable</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg mb-2">No orders found</div>
                                    <p className="text-gray-400">Start shopping to see your orders here!</p>
                                    <button
                                        onClick={() => setActiveTab('products')}
                                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Browse Products Tab */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">Browse Products</h2>
                                    <p className="text-gray-600 text-sm">Discover and add products to your cart</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-500">{products.length} products available</span>
                                    <button
                                        onClick={() => dispatch(getProducts())}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {products.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <div key={product._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                                <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                                                    <span className={`text-sm px-2 py-1 rounded ${product.stock > 10 ? 'bg-green-100 text-green-800' :
                                                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className={`w-full py-2 px-4 rounded font-medium transition-colors ${product.stock > 0
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    disabled={product.stock <= 0}
                                                >
                                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg">No products available</div>
                                    <p className="text-gray-400 mt-2">Check back later for new products!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;
