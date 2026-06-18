import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';
import { ExpenseState, CreateExpenseDto, Expense, ApiResponse } from '@/types';

const initialState: ExpenseState = {
    expenses: [],
    isLoading: false,
    error: null,
};

export const fetchExpenses = createAsyncThunk(
    'expense/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<{ expenses: Expense[] }>>('/expense/all');
            return response.data.data!.expenses;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch expenses');
        }
    }
);

export const createExpense = createAsyncThunk(
    'expense/create',
    async (data: CreateExpenseDto, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<{ expense: Expense }>>('/expense', data);
            return response.data.data!.expense;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to create expense');
        }
    }
);

export const deleteExpense = createAsyncThunk(
    'expense/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/expense/${id}`);
            return id;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to delete expense');
        }
    }
);

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all expenses
            .addCase(fetchExpenses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.expenses = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create expense
            .addCase(createExpense.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.expenses.unshift(action.payload);
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete expense
            .addCase(deleteExpense.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = expenseSlice.actions;
export default expenseSlice.reducer;
