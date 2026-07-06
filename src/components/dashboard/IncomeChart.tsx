import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface IncomeChartProps {
    data: {
        date: string;
        amount: number;
    }[];
}

const IncomeChart = ({ data }: IncomeChartProps) => {
    return (
        <Card className="h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Income Trend</h3>
            <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="date"
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
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                            formatter={(value: number | undefined) => [formatCurrency(value ?? 0), 'Income']}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default IncomeChart;
