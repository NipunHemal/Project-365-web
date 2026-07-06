import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface FinancialOverviewProps {
    data: {
        name: string;
        amount: number;
    }[];
}

const FinancialOverview = ({ data }: FinancialOverviewProps) => {
    return (
        <Card className="h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Financial Overview</h3>
            <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `Rs ${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number | undefined) => [formatCurrency(value ?? 0), 'Amount']}
                        />
                        <Bar dataKey="amount" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default FinancialOverview;
