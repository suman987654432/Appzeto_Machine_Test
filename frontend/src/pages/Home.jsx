import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';

const Home = () => {
    const dispatch = useDispatch();
    const { products, isLoading, isError, message } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    // Check if user is buyer (can use shopping features)
    const isBuyer = user?.role === 'buyer' || !user;

    if (isLoading) return (
        <div className="container mx-auto mt-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Loading products...</p>
        </div>
    );
    
    if (isError) return (
        <div className="container mx-auto mt-10">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Error: {message}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">All Products</h1>
                <span className="text-sm text-gray-600">Total: {products.length} products</span>
            </div>
            
            {products.length > 0 ? (
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr className="text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Image</th>
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Price</th>
                                    <th className="py-3 px-6 text-left">Stock</th>
                                    <th className="py-3 px-6 text-left">Category</th>
                                    {isBuyer && <th className="py-3 px-6 text-center">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {products.map((product) => (
                                    <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left">
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-200" 
                                            />
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <span className="font-semibold text-green-600">${product.price}</span>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                product.stock > 10 ? 'bg-green-100 text-green-800' : 
                                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <span className="text-gray-700">{product.category}</span>
                                        </td>
                                        {isBuyer && (
                                            <td className="py-3 px-6 text-center">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                                                        product.stock > 0 
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                    disabled={product.stock <= 0}
                                                >
                                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">No products found</div>
                    <p className="text-gray-400 mt-2">Check back later for new products!</p>
                </div>
            )}
        </div>
    );
};

export default Home;
