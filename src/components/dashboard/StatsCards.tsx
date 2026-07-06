import { HiBanknotes, HiCurrencyDollar, HiCreditCard } from 'react-icons/hi2';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface StatsCardsProps {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    incomeLast60Days?: number;
    expenseLast30Days?: number;
}

const StatsCards = ({ totalBalance, totalIncome, totalExpense }: StatsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-linear-to-br from-blue-600 to-blue-700 text-white border-none shadow-blue-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <HiBanknotes className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm font-medium">Total Balance</p>
                        <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalBalance)}</h3>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <HiCurrencyDollar className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Income</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalIncome)}</h3>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                        <HiCreditCard className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalExpense)}</h3>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default StatsCards;
