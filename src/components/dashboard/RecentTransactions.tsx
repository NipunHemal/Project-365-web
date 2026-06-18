import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import Card from '@/components/ui/Card';
import { TransactionItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
    transactions: TransactionItem[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
    return (
        <Card className="h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h3>
            <div className="space-y-4">
                {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent transactions</p>
                ) : (
                    transactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-xl",
                                    t.type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                )}>
                                    {t.icon || (t.type === 'income' ? <HiTrendingUp /> : <HiTrendingDown />)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{t.source || t.category || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={cn(
                                "font-bold",
                                t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                            )}>
                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default RecentTransactions;
