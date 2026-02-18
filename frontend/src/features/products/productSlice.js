import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from './productAPI';

const initialState = {
    products: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Create new product
export const create = createAsyncThunk('products/create', async (productData, thunkAPI) => {
    try {
        console.log('ProductSlice: Creating product with data:', productData);
        const token = thunkAPI.getState().auth.user.token;
        const result = await productService.createProduct(productData, token);
        console.log('ProductSlice: Product created successfully:', result);
        return result;
    } catch (error) {
        console.error('ProductSlice: Product creation failed:', error);
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get products
export const getProducts = createAsyncThunk('products/getAll', async (_, thunkAPI) => {
    try {
        return await productService.getProducts();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update product
export const updateProduct = createAsyncThunk('products/update', async (productData, thunkAPI) => {
    try {
        return await productService.updateProduct(productData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete product
export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
    try {
        return await productService.deleteProduct(id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(create.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(create.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products.push(action.payload);
            })
            .addCase(create.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = state.products.filter((product) => product._id !== action.meta.arg);
            });
    },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
