import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboard } from '@/store/slices/dashboardSlice';
import Loader from '@/components/ui/Loader';
import StatsCards from '@/components/dashboard/StatsCards';
import IncomeChart from '@/components/dashboard/IncomeChart';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import FinancialOverview from '@/components/dashboard/FinancialOverview';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

const Home = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboard());
    }, [dispatch]);

    if (isLoading) {
        return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;
    }

    if (error) {
        return (
            <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-xl">
                {error}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12 text-gray-500">
                No data available. Start by adding some income or expenses.
            </div>
        );
    }

    // Process data for charts
    const incomeChartData = data.last60DaysIncome.transactions.map((t) => ({
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: t.amount,
    }));

    const expenseChartData = data.last30DaysExpenses.transactions.map((t) => ({
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: t.amount,
    }));

    const expensesByCategory = data.last30DaysExpenses.transactions.reduce((acc, t) => {
        const category = t.category || 'Other';
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);

    const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
        name,
        value,
    }));

    const balanceData = [
        { name: 'Income', amount: data.totalIncome },
        { name: 'Expenses', amount: data.totalExpense },
        { name: 'Balance', amount: data.totalBalance },
    ];

    return (
        <div className="space-y-6">
            <StatsCards
                totalBalance={data.totalBalance}
                totalIncome={data.totalIncome}
                totalExpense={data.totalExpense}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <IncomeChart data={incomeChartData} />
                <ExpenseChart data={expenseChartData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <CategoryPieChart data={pieChartData} />
                </div>
                <div className="lg:col-span-1">
                    <FinancialOverview data={balanceData} />
                </div>
                <div className="lg:col-span-1">
                    <RecentTransactions transactions={data.recentTransactions} />
                </div>
            </div>
        </div>
    );
};

export default Home;
