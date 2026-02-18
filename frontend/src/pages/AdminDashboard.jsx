import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getVendors, updateVendorStatus, getStats } from '../features/admin/adminSlice';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('vendors');
    const { vendors, stats } = useSelector((state) => state.admin);

    useEffect(() => {
        if (activeTab === 'vendors') {
            dispatch(getVendors());
        } else {
            dispatch(getStats());
        }
    }, [dispatch, activeTab]);

    const handleStatusUpdate = (id, status) => {
        dispatch(updateVendorStatus({ id, status }));
    };

    return (
        <div className="flex">
            <Sidebar role="admin" activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 p-10 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

                {activeTab === 'vendors' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow rounded">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Shop Name</th>
                                    <th className="py-3 px-6 text-left">Owner</th>
                                    <th className="py-3 px-6 text-center">Status</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {vendors.map((vendor) => (
                                    <tr key={vendor._id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            <span className="font-medium">{vendor.shopName}</span>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {vendor.userId ? vendor.userId.name : 'Unknown'}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <span className={`bg-${vendor.status === 'approved' ? 'green' : vendor.status === 'rejected' ? 'red' : 'yellow'}-200 text-${vendor.status === 'approved' ? 'green' : vendor.status === 'rejected' ? 'red' : 'yellow'}-600 py-1 px-3 rounded-full text-xs`}>
                                                {vendor.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {vendor.status === 'pending' && (
                                                <div className="flex item-center justify-center space-x-2">
                                                    <button onClick={() => handleStatusUpdate(vendor._id, 'approved')} className="transform hover:text-green-500 hover:scale-110">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(vendor._id, 'rejected')} className="transform hover:text-red-500 hover:scale-110">
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {vendor.status === 'approved' && (
                                                <button onClick={() => handleStatusUpdate(vendor._id, 'rejected')} className="text-red-500 hover:text-red-700">Reject</button>
                                            )}
                                            {vendor.status === 'rejected' && (
                                                <button onClick={() => handleStatusUpdate(vendor._id, 'approved')} className="text-green-500 hover:text-green-700">Approve</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'stats' && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
                            <h3 className="text-gray-500 text-sm uppercase">Total Orders</h3>
                            <p className="text-3xl font-bold">{stats.totalOrders}</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow border-t-4 border-green-500">
                            <h3 className="text-gray-500 text-sm uppercase">Total Revenue</h3>
                            <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
                            <h3 className="text-gray-500 text-sm uppercase">Admin Commission</h3>
                            <p className="text-3xl font-bold">${stats.totalCommission.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500">
                            <h3 className="text-gray-500 text-sm uppercase">Vendor Earnings</h3>
                            <p className="text-3xl font-bold">${stats.vendorEarnings.toFixed(2)}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
