import { useEffect, useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchIncomes, createIncome, deleteIncome } from '@/store/slices/incomeSlice';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineArrowTrendingUp,
    HiOutlineBanknotes,
    HiOutlineCalendar
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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
const INCOME_ICONS = ['💰', '💵', '💳', '🏦', '💼', '📈', '🎯', '🎁', '💎', '🪙'];

const Income = () => {
    const dispatch = useAppDispatch();
    const { incomes, isLoading, error } = useAppSelector((state) => state.income);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        icon: '💰',
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        dispatch(fetchIncomes());
    }, [dispatch]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const result = await dispatch(createIncome({
            icon: formData.icon,
            source: formData.source,
            amount: parseFloat(formData.amount),
            date: formData.date,
        }));
        if (createIncome.fulfilled.match(result)) {
            setDialogOpen(false);
            setFormData({ icon: '💰', source: '', amount: '', date: new Date().toISOString().split('T')[0] });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this income?')) {
            dispatch(deleteIncome(id));
        }
    };

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const avgIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;

    const chartData = [...incomes]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((income) => ({
            date: new Date(income.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: income.amount,
        }));

    const incomeBySource = incomes.reduce((acc, income) => {
        acc[income.source] = (acc[income.source] || 0) + income.amount;
        return acc;
    }, {} as Record<string, number>);

    const pieChartData = Object.entries(incomeBySource).map(([name, value]) => ({ name, value }));

    const monthlyData = incomes.reduce((acc, income) => {
        const month = new Date(income.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + income.amount;
        return acc;
    }, {} as Record<string, number>);

    const barChartData = Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }));

    if (isLoading && incomes.length === 0) {
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
                    <h1 className="text-2xl font-bold text-gray-900">Income</h1>
                    <p className="text-gray-500 mt-1">Track and manage your income sources</p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    <HiOutlinePlus className="mr-2 h-5 w-5" />
                    Add Income
                </Button>
            </div>

            {error && (
                <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-xl">{error}</div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Income</p>
                        <h3 className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalIncome)}</h3>
                        <p className="text-xs text-gray-400 mt-1">{incomes.length} transactions</p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                        <HiOutlineArrowTrendingUp className="h-6 w-6" />
                    </div>
                </Card>

                <Card className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Average Income</p>
                        <h3 className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(avgIncome)}</h3>
                        <p className="text-xs text-gray-400 mt-1">Per transaction</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                        <HiOutlineBanknotes className="h-6 w-6" />
                    </div>
                </Card>

                <Card className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Income Sources</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{Object.keys(incomeBySource).length}</h3>
                        <p className="text-xs text-gray-400 mt-1">Different sources</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                        <HiOutlineCalendar className="h-6 w-6" />
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Income Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs ${value}`} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value: number) => [formatCurrency(value), 'Amount']} />
                                <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Income by Source</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                                    {pieChartData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value: number) => formatCurrency(value)} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Monthly Breakdown */}
            <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Breakdown</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs ${value}`} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value: number) => formatCurrency(value)} />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Income List */}
            <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-6">All Incomes</h3>
                <div className="space-y-4">
                    {incomes.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No income transactions yet</p>
                    ) : (
                        incomes.map((income) => (
                            <div key={income.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                                        {income.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{income.source}</p>
                                        <p className="text-sm text-gray-500">{formatDate(income.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-lg text-emerald-600">+{formatCurrency(income.amount)}</span>
                                    <Button variant="ghost" className="text-gray-400 hover:text-red-500 p-2" onClick={() => handleDelete(income.id)}>
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
                title="Add New Income"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Select Icon</label>
                        <div className="grid grid-cols-5 gap-3">
                            {INCOME_ICONS.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon })}
                                    className={`text-2xl p-3 rounded-xl transition-all ${formData.icon === icon
                                        ? 'bg-blue-100 ring-2 ring-blue-500 scale-110'
                                        : 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
                                        }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Source"
                        placeholder="e.g., Salary, Freelance"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
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
                        <Button type="submit" isLoading={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                            Add Income
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Income;
