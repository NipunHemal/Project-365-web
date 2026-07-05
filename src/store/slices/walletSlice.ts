import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';
import { WalletState, Wallet, CreateWalletDto, CreateTransferDto, ApiResponse } from '@/types';

const initialState: WalletState = {
    wallets: [],
    netWorth: 0,
    isLoading: false,
    error: null,
};

export const fetchWallets = createAsyncThunk(
    'wallet/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<{ wallets: Wallet[]; netWorth: number }>>('/wallet/all');
            const data = response.data.data!;
            return {
                wallets: data.wallets.map((w) => ({ ...w, balance: Number(w.balance) })),
                netWorth: Number(data.netWorth),
            };
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch wallets');
        }
    }
);

export const createWallet = createAsyncThunk(
    'wallet/create',
    async (data: CreateWalletDto, { dispatch, rejectWithValue }) => {
        try {
            await api.post<ApiResponse<{ wallet: Wallet }>>('/wallet', data);
            // Refetch so every balance/net-worth figure stays consistent.
            dispatch(fetchWallets());
            return true;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to create wallet');
        }
    }
);

export const deleteWallet = createAsyncThunk(
    'wallet/delete',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`/wallet/${id}`);
            dispatch(fetchWallets());
            return id;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to delete wallet');
        }
    }
);

export const createTransfer = createAsyncThunk(
    'wallet/transfer',
    async (data: CreateTransferDto, { dispatch, rejectWithValue }) => {
        try {
            await api.post('/transfer', data);
            // Balances on both wallets change — refetch.
            dispatch(fetchWallets());
            return true;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to complete transfer');
        }
    }
);

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWallets.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWallets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wallets = action.payload.wallets;
                state.netWorth = action.payload.netWorth;
            })
            .addCase(fetchWallets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // create / delete / transfer share loading + error handling;
            // the actual data refresh happens via the dispatched fetchWallets.
            .addCase(createWallet.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(deleteWallet.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(createTransfer.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = walletSlice.actions;
export default walletSlice.reducer;
