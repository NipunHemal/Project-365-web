import { useEffect, useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchExpenses, createExpense, deleteExpense, downloadExpensePDF } from '@/store/slices/expenseSlice';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineArrowTrendingDown,
    HiOutlineShoppingBag,
    HiOutlineTag,
    HiOutlineDocumentArrowDown
} from 'react-icons/hi2';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Loader from '@/components/ui/Loader';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar,
} from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];
const EXPENSE_ICONS = ['🛒', '🍔', '🚗', '🏠', '💡', '📱', '🎬', '✈️', '🏥', '📚', '👕', '🎮'];

const Expense = () => {
    const dispatch = useAppDispatch();
    const { expenses, isLoading, error } = useAppSelector((state) => state.expense);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        icon: '🛒',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        dispatch(fetchExpenses());
    }, [dispatch]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(formData.amount);

        if (isNaN(amount) || amount <= 0) {
            // Handle invalid amount (optional: set error state)
            return;
        }

        const result = await dispatch(createExpense({
            icon: formData.icon,
            category: formData.category,
            amount: amount,
            date: formData.date,
        }));
        if (createExpense.fulfilled.match(result)) {
            setDialogOpen(false);
            setFormData({ icon: '🛒', category: '', amount: '', date: new Date().toISOString().split('T')[0] });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            dispatch(deleteExpense(id));
        }
    };

    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const avgExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;

    const chartData = [...expenses]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((expense) => ({
            date: new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: expense.amount,
        }));

    const expenseByCategory = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const pieChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

    const monthlyData = expenses.reduce((acc, expense) => {
        const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const barChartData = Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }));

    const topCategories = Object.entries(expenseByCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    if (isLoading && expenses.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
                    <p className="text-gray-500 mt-1">Track and manage your spending</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => dispatch(downloadExpensePDF())}>
                        <HiOutlineDocumentArrowDown className="mr-2 h-5 w-5" />
                        Download
                    </Button>
                    <Button onClick={() => setDialogOpen(true)} className="bg-rose-600 hover:bg-rose-700">
                        <HiOutlinePlus className="mr-2 h-5 w-5" />
                        Add Expense
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-xl">{error}</div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                        <h3 className="text-2xl font-bold text-rose-600 mt-1">{formatCurrency(totalExpense)}</h3>
                        <p className="text-xs text-gray-400 mt-1">{expenses.length} transactions</p>
                    </div>
                    <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                        <HiOutlineArrowTrendingDown className="h-6 w-6" />
                    </div>
                </Card>

                <Card className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Average Expense</p>
                        <h3 className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(avgExpense)}</h3>
                        <p className="text-xs text-gray-400 mt-1">Per transaction</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                        <HiOutlineShoppingBag className="h-6 w-6" />
                    </div>
                </Card>

                <Card className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Categories</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{Object.keys(expenseByCategory).length}</h3>
                        <p className="text-xs text-gray-400 mt-1">Spending categories</p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                        <HiOutlineTag className="h-6 w-6" />
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Expense Trend</h3>
                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs ${value}`} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value: number | undefined) => [formatCurrency(value || 0), 'Amount']} />
                                <Area type="monotone" dataKey="amount" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Expenses by Category</h3>
                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                                    {pieChartData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value: number | undefined) => formatCurrency(value || 0)} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Breakdown */}
                <Card>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Breakdown</h3>
                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs ${value}`} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value: number | undefined) => formatCurrency(value || 0)} />
                                <Bar dataKey="amount" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Categories */}
                <Card>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Top Spending Categories</h3>
                    <div className="space-y-6">
                        {topCategories.length > 0 ? (
                            topCategories.map(([category, amount], index) => (
                                <div key={category} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">{category}</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${(amount / totalExpense) * 100}%`,
                                                backgroundColor: COLORS[index % COLORS.length],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-40 text-gray-400">No data</div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Expense List */}
            <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-6">All Expenses</h3>
                <div className="space-y-4">
                    {expenses.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No expense transactions yet</p>
                    ) : (
                        expenses.map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                                        {expense.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{expense.category}</p>
                                        <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-lg text-rose-600">-{formatCurrency(expense.amount)}</span>
                                    <Button variant="ghost" className="text-gray-400 hover:text-red-500 p-2" onClick={() => handleDelete(expense.id)}>
                                        <HiOutlineTrash className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Modal
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title="Add New Expense"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Select Icon</label>
                        <div className="grid grid-cols-5 gap-3">
                            {EXPENSE_ICONS.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon })}
                                    className={`text-2xl p-3 rounded-xl transition-all ${formData.icon === icon
                                        ? 'bg-rose-100 ring-2 ring-rose-500 scale-110'
                                        : 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
                                        }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Category"
                        placeholder="e.g., Food, Transport"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    />

                    <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                    />

                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading} className="bg-rose-600 hover:bg-rose-700">
                            Add Expense
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Expense;
