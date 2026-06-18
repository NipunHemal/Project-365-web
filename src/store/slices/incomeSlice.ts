import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';
import { IncomeState, CreateIncomeDto, Income, ApiResponse } from '@/types';

const initialState: IncomeState = {
    incomes: [],
    isLoading: false,
    error: null,
};

export const fetchIncomes = createAsyncThunk(
    'income/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<{ incomes: Income[] }>>('/income/all');
            return response.data.data!.incomes;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch incomes');
        }
    }
);

export const createIncome = createAsyncThunk(
    'income/create',
    async (data: CreateIncomeDto, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<{ income: Income }>>('/income', data);
            return response.data.data!.income;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to create income');
        }
    }
);

export const deleteIncome = createAsyncThunk(
    'income/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/income/${id}`);
            return id;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to delete income');
        }
    }
);

const incomeSlice = createSlice({
    name: 'income',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all incomes
            .addCase(fetchIncomes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchIncomes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.incomes = action.payload;
            })
            .addCase(fetchIncomes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create income
            .addCase(createIncome.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createIncome.fulfilled, (state, action) => {
                state.isLoading = false;
                state.incomes.unshift(action.payload);
            })
            .addCase(createIncome.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete income
            .addCase(deleteIncome.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteIncome.fulfilled, (state, action) => {
                state.isLoading = false;
                state.incomes = state.incomes.filter((income) => income.id !== action.payload);
            })
            .addCase(deleteIncome.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = incomeSlice.actions;
export default incomeSlice.reducer;
