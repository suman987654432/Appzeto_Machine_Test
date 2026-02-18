import { Link } from 'react-router-dom';

const Sidebar = ({ role, activeTab, setActiveTab }) => {
    return (
        <div className="w-64 bg-white h-screen shadow-md hidden md:block">
            <div className="p-6">
                <h2 className="text-xl font-bold">{role === 'admin' ? 'Admin Panel' : 'Vendor Panel'}</h2>
            </div>
            <nav className="mt-6">
                {role === 'vendor' && (
                    <>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full text-left py-2 px-6 ${activeTab === 'products' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full text-left py-2 px-6 ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Orders
                        </button>
                    </>
                )}
                {role === 'admin' && (
                    <>
                        <button
                            onClick={() => setActiveTab('vendors')}
                            className={`w-full text-left py-2 px-6 ${activeTab === 'vendors' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Vendors
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`w-full text-left py-2 px-6 ${activeTab === 'stats' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Statistics
                        </button>
                    </>
                )}
            </nav>
        </div>
    );
};

export default Sidebar;
