import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from './orderAPI';

const initialState = {
    orders: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const createOrder = createAsyncThunk('orders/create', async (orderData, thunkAPI) => {
    try {
        console.log('OrderSlice: Creating order with data:', orderData);
        const result = await orderService.createOrder(orderData);
        console.log('OrderSlice: Order created successfully:', result);
        return result;
    } catch (error) {
        console.error('OrderSlice: Order creation failed:', error);
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getMyOrders = createAsyncThunk('orders/getMyOrders', async (_, thunkAPI) => {
    try {
        console.log('OrderSlice: Calling getMyOrders...');
        const result = await orderService.getMyOrders();
        console.log('OrderSlice: getMyOrders result:', result);
        return result;
    } catch (error) {
        console.error('OrderSlice: getMyOrders error:', error);
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getVendorOrders = createAsyncThunk('orders/getVendorOrders', async (_, thunkAPI) => {
    try {
        return await orderService.getVendorOrders();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async (data, thunkAPI) => {
    try {
        return await orderService.updateOrderStatus(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                console.log('OrderSlice: createOrder.pending');
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                console.log('OrderSlice: createOrder.fulfilled', action.payload);
                state.isLoading = false;
                state.isSuccess = true;
                // Add the new order to the beginning of the orders array
                state.orders.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                console.log('OrderSlice: createOrder.rejected', action.payload);
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMyOrders.pending, (state) => {
                console.log('OrderSlice: getMyOrders.pending');
                state.isLoading = true;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                console.log('OrderSlice: getMyOrders.fulfilled', action.payload);
                state.isLoading = false;
                state.isSuccess = true;
                state.orders = action.payload;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                console.log('OrderSlice: getMyOrders.rejected', action.payload);
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getVendorOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getVendorOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders = action.payload;
            })
            .addCase(getVendorOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            });
    },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;
