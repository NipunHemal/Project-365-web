import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';
import { DashboardState, DashboardData, ApiResponse } from '@/types';

const initialState: DashboardState = {
    data: null,
    isLoading: false,
    error: null,
};

export const fetchDashboard = createAsyncThunk(
    'dashboard/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<DashboardData>>('/dashboard');
            return response.data.data!;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
