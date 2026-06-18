import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface CategoryPieChartProps {
    data: {
        name: string;
        value: number;
    }[];
}

const COLORS = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CategoryPieChart = ({ data }: CategoryPieChartProps) => {
    return (
        <Card className="h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Expenses by Category</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                            formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default CategoryPieChart;
