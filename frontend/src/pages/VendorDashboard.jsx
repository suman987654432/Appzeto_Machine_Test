import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getVendorOrders, updateOrderStatus } from '../features/orders/orderSlice';
import { getProducts, create, updateProduct, deleteProduct } from '../features/products/productSlice';
import Sidebar from '../components/Sidebar';

const VendorDashboard = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('products');
    const { orders } = useSelector((state) => state.orders);
    const { products, isLoading, isError, message } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);


    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        image: '',
        category: ''
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
       
        
        if (activeTab === 'orders') {
            dispatch(getVendorOrders());
        } else {
            dispatch(getProducts());
        }
    }, [dispatch, activeTab]);

    const handleSuccess = () => {
        dispatch(getProducts()); // Refresh products after create/update
        setFormData({ name: '', price: '', stock: '', image: '', category: '' });
        setEditId(null);
    };

    const handleCreateOrUpdate = (e) => {
        e.preventDefault();
        console.log('VendorDashboard: Creating/Updating product:', formData);
        
        if (editId) {
            dispatch(updateProduct({ _id: editId, ...formData })).then(() => handleSuccess());
        } else {
            dispatch(create(formData)).then(() => handleSuccess());
        }
    };

    const handleEditClick = (product) => {
        console.log('VendorDashboard: Editing product:', product);
        setEditId(product._id);
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            image: product.image,
            category: product.category
        });
        window.scrollTo(0, 0);
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            console.log('VendorDashboard: Deleting product:', id);
            dispatch(deleteProduct(id)).then(() => {
                dispatch(getProducts()); // Refresh products after delete
            });
        }
    };

  
  

    const handleCancelEdit = () => {
        handleSuccess();
    };

    const handleStatusChange = (orderId, newStatus) => {
        dispatch(updateOrderStatus({ orderId, status: newStatus }));
    };

    return (
        <div className="flex">
            <Sidebar role="vendor" activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 p-10 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>
                
              

                {activeTab === 'products' && (
                    <div>
                        <div className="bg-white p-6 rounded shadow mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{editId ? 'Edit Product' : 'Add New Product'}</h2>
                                {editId && <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700">Cancel Edit</button>}
                            </div>
                            <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Product Name" className="border p-2 rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                <input type="number" placeholder="Price" className="border p-2 rounded" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                <input type="number" placeholder="Stock" className="border p-2 rounded" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                                <input type="text" placeholder="Image URL" className="border p-2 rounded" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} required />
                                <input type="text" placeholder="Category" className="border p-2 rounded" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 md:col-span-2">
                                    {editId ? 'Update Product' : 'Add Product'}
                                </button>
                            </form>
                        </div>

                        {/* Products List */}
                        <div className="overflow-x-auto bg-white rounded shadow">
                            <div className="px-6 py-3 bg-gray-50 border-b">
                                <h3 className="text-lg font-semibold">My Products</h3>
                                <p className="text-sm text-gray-600">
                                    {isLoading ? 'Loading...' : 
                                     isError ? `Error: ${message}` :
                                     `${products.filter((product) => 
                                        (product.user && product.user === user?._id) ||
                                        (user?.vendorId && product.vendorId === user.vendorId) ||
                                        (product.vendorId === user?._id)
                                    ).length} product(s) found`}
                                </p>
                            </div>
                            
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2">Loading products...</p>
                                </div>
                            ) : isError ? (
                                <div className="text-center py-12">
                                    <p className="text-red-600">Error: {message}</p>
                                    <button 
                                        onClick={() => dispatch(getProducts())}
                                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                            <th className="py-3 px-6 text-left">Image</th>
                                            <th className="py-3 px-6 text-left">Name</th>
                                            <th className="py-3 px-6 text-left">Price</th>
                                            <th className="py-3 px-6 text-left">Stock</th>
                                            <th className="py-3 px-6 text-left">Category</th>
                                            <th className="py-3 px-6 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm font-light">
                                        {products.filter((product) => {
                                            // Check if product belongs to logged-in vendor
                                            const isOwner = (product.user && product.user === user?._id) ||
                                                           (user?.vendorId && product.vendorId === user.vendorId) ||
                                                           (product.vendorId === user?._id);
                                            
                                            console.log('Product ownership check:', {
                                                productId: product._id,
                                                productName: product.name,
                                                productUser: product.user,
                                                productVendorId: product.vendorId,
                                                currentUserId: user?._id,
                                                currentUserVendorId: user?.vendorId,
                                                isOwner
                                            });
                                            
                                            return isOwner;
                                        }).length > 0 ? (
                                            products.filter((product) => {
                                                // Check if product belongs to logged-in vendor
                                                return (product.user && product.user === user?._id) ||
                                                       (user?.vendorId && product.vendorId === user.vendorId) ||
                                                       (product.vendorId === user?._id);
                                            }).map((product) => (
                                                <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-100">
                                                    <td className="py-3 px-6 text-left">
                                                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-full border border-gray-200" />
                                                    </td>
                                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                                        <span className="font-medium">{product.name}</span>
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        ${product.price}
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {product.stock}
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {product.category}
                                                    </td>
                                                    <td className="py-3 px-6 text-center">
                                                        <div className="flex item-center justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleEditClick(product)}
                                                                className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                                                                title="Edit"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(product._id)}
                                                                className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                                                                title="Delete"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                                    <div>
                                                        <p className="text-lg mb-2">No products found</p>
                                                        <p className="text-sm">Add your first product using the form above</p>
                                                        <p className="text-xs mt-2 text-gray-400">
                                                            Debug: Total products in system: {products.length}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white p-4 rounded shadow border-l-4 border-green-500">
                                <div className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
                                    <span className="font-bold">Order #{order._id.substring(0, 8)}...</span>
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-semibold">Status:</label>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`border rounded px-2 py-1 text-sm ${order.status === 'Pending' ? 'text-yellow-600' :
                                                order.status === 'Shipped' ? 'text-blue-600' :
                                                    order.status === 'Delivered' ? 'text-green-600' : ''
                                                }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    {order.products.map((p, idx) => (
                                        <div key={idx} className="ml-4 text-sm flex justify-between">
                                            <span>Product ID: {p.productId} - Qty: {p.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorDashboard;
