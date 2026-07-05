// User types
export interface User {
  id: string;
  fullName: string;
  email: string;
  profileUrl: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  profileUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token?: string;
  };
}

// Income types
export interface Income {
  id: string;
  userId: string;
  walletId?: string;
  icon: string;
  source: string;
  amount: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IncomeState {
  incomes: Income[];
  isLoading: boolean;
  error: string | null;
}

export interface CreateIncomeDto {
  walletId: string;
  icon: string;
  source: string;
  amount: number;
  date: string;
}

// Expense types
export interface Expense {
  id: string;
  userId: string;
  walletId?: string;
  icon: string;
  category: string;
  amount: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

export interface CreateExpenseDto {
  walletId: string;
  icon: string;
  category: string;
  amount: number;
  date: string;
}

// Wallet types
export interface Wallet {
  id: string;
  name: string;
  type: 'cash' | 'bank';
  icon: string;
  openingBalance: number;
  currency: string;
  balance: number;
}

export interface WalletState {
  wallets: Wallet[];
  netWorth: number;
  isLoading: boolean;
  error: string | null;
}

export interface CreateWalletDto {
  name: string;
  type: 'cash' | 'bank';
  icon: string;
  openingBalance: number;
}

export interface Transfer {
  id: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface CreateTransferDto {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  date: string;
  note?: string;
}

// Dashboard types
export interface TransactionItem {
  id: string;
  type: 'income' | 'expense';
  icon: string;
  source?: string;
  category?: string;
  amount: number;
  date: string;
}

export interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  last30DaysExpenses: {
    total: number;
    transactions: TransactionItem[];
  };
  last60DaysIncome: {
    total: number;
    transactions: TransactionItem[];
  };
  recentTransactions: TransactionItem[];
}

export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
