import API from '../../utils/axiosInstance';

const getVendors = async () => {
    const response = await API.get('/admin/vendors');
    return response.data;
};

const updateVendorStatus = async ({ id, status }) => {
    const response = await API.put(`/admin/vendors/${id}`, { status });
    return response.data;
};

const getStats = async () => {
    const response = await API.get('/admin/stats');
    return response.data;
};

const adminService = {
    getVendors,
    updateVendorStatus,
    getStats,
};

export default adminService;
