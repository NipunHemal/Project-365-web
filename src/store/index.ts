import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import incomeReducer from './slices/incomeSlice';
import expenseReducer from './slices/expenseSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        income: incomeReducer,
        expense: expenseReducer,
        dashboard: dashboardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
