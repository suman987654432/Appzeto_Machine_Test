import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminAPI';

const initialState = {
    vendors: [],
    stats: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const getVendors = createAsyncThunk('admin/getVendors', async (_, thunkAPI) => {
    try {
        return await adminService.getVendors();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const updateVendorStatus = createAsyncThunk('admin/updateVendorStatus', async (data, thunkAPI) => {
    try {
        return await adminService.updateVendorStatus(data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const getStats = createAsyncThunk('admin/getStats', async (_, thunkAPI) => {
    try {
        return await adminService.getStats();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});


export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVendors.fulfilled, (state, action) => {
                state.vendors = action.payload;
            })
            .addCase(getStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
            .addCase(updateVendorStatus.fulfilled, (state, action) => {
                const index = state.vendors.findIndex(v => v._id === action.payload._id);
                if (index !== -1) {
                    state.vendors[index] = action.payload;
                }
            });
    },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
