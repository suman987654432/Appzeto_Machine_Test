import API from '../../utils/axiosInstance';

const createProduct = async (productData) => {
    try {
        console.log('ProductAPI: Creating product with data:', productData);
        const response = await API.post('/products', productData);
        console.log('ProductAPI: Product created, response:', response.data);
        return response.data;
    } catch (error) {
        console.error('ProductAPI: Error creating product:', error.response?.data || error.message);
        throw error;
    }
};

const getProducts = async () => {
    try {
        console.log('ProductAPI: Fetching all products...');
        const response = await API.get('/products');
        console.log('ProductAPI: Products fetched:', response.data.length, 'products');
        return response.data;
    } catch (error) {
        console.error('ProductAPI: Error fetching products:', error.response?.data || error.message);
        throw error;
    }
};

const updateProduct = async (productData) => {
    const response = await API.put(`/products/${productData._id}`, productData);
    return response.data;
};

const deleteProduct = async (productId) => {
    const response = await API.delete(`/products/${productId}`);
    return response.data;
};

const productService = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
};

export default productService;
