import { useState } from 'react';
import { 
    HiOutlineChartPie, 
    HiOutlineBellAlert, 
    HiOutlineArrowPath, 
    HiOutlineSparkles,
    HiOutlineEnvelope,
    HiCheckCircle
} from 'react-icons/hi2';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Budgets = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [activeFeature, setActiveFeature] = useState<number | null>(null);

    const upcomingFeatures = [
        {
            icon: HiOutlineChartPie,
            title: "Category Spending Limits",
            desc: "Define strict or flexible monthly targets for Dining, Utilities, Shopping, and more.",
            status: "In Development",
            progress: 80
        },
        {
            icon: HiOutlineBellAlert,
            title: "Smart Budget Alerts",
            desc: "Get notified immediately when you approach 50%, 80%, and 100% of your limits.",
            status: "Designing",
            progress: 45
        },
        {
            icon: HiOutlineArrowPath,
            title: "Rollover Budgeting",
            desc: "Unspent money is rolled over automatically to the next month to help build savings.",
            status: "Backlog",
            progress: 15
        }
    ];

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <HiOutlineChartPie className="h-8 w-8 text-blue-600 animate-pulse" />
                        Smart Budgets
                    </h1>
                    <p className="text-gray-500 mt-1">Take control of your spending habits with smart limits.</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-sm font-medium">
                    <HiOutlineSparkles className="h-5 w-5 animate-spin" />
                    Feature Under Development
                </div>
            </div>

            {/* Hero / Main Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-500/10">
                <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
                    <HiOutlineChartPie className="w-full h-full transform translate-x-12 translate-y-12" />
                </div>
                <div className="relative z-10 max-w-2xl space-y-4">
                    <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                        Coming Soon
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Transform the way you budget your hard-earned money
                    </h2>
                    <p className="text-blue-100 text-base md:text-lg">
                        We are building a smart, automated budgeting engine integrated directly with your transactions, giving you real-time insight into remaining balances.
                    </p>

                    <div className="pt-4 max-w-md">
                        {subscribed ? (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-2xl">
                                <HiCheckCircle className="h-6 w-6 text-emerald-400 shrink-0" />
                                <span>You will be notified as soon as Budgets goes live!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex gap-2">
                                <div className="relative flex-1">
                                    <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 h-5 w-5" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email to join the beta"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 bg-white/15 border-white/20 text-white placeholder-white/50 focus:border-white focus:ring-white rounded-2xl py-3 w-full"
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-3 rounded-2xl transition-all shadow-md active:scale-95"
                                >
                                    Notify Me
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Feature Roadmap section */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">What we are building</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {upcomingFeatures.map((feature, idx) => {
                        const Icon = feature.icon;
                        const isHovered = activeFeature === idx;
                        return (
                            <Card 
                                key={idx}
                                className={`relative border border-gray-100 hover:border-blue-100 transition-all duration-300 transform cursor-pointer p-6 hover:-translate-y-1 hover:shadow-lg ${
                                    isHovered ? 'ring-2 ring-blue-500/20 bg-blue-50/20' : 'bg-white'
                                }`}
                                onMouseEnter={() => setActiveFeature(idx)}
                                onMouseLeave={() => setActiveFeature(null)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl transition-all duration-300 ${
                                        isHovered ? 'bg-blue-600 text-white scale-110' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                        feature.status === 'In Development' ? 'bg-blue-100 text-blue-800' :
                                        feature.status === 'Designing' ? 'bg-amber-100 text-amber-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {feature.status}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{feature.desc}</p>
                                
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-400 font-semibold">
                                        <span>Progress</span>
                                        <span>{feature.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                                            style={{ width: `${feature.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Interactive Concept Preview */}
            <Card className="bg-white border border-gray-100 p-6 md:p-8 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Preview Interactive Concept</h3>
                    <p className="text-sm text-gray-500">Play with the concept design we are designing for you.</p>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-xl mx-auto space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🍕</span>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Food & Dining Budget</h4>
                                <p className="text-xs text-slate-400">Monthly limit: $400.00</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">On Track</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold text-slate-600">Spent: $240.00</span>
                            <span className="text-slate-400">$160.00 left</span>
                        </div>
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full w-[60%]" />
                        </div>
                    </div>
                    <div className="text-center text-xs text-indigo-600 font-semibold cursor-not-allowed hover:underline">
                        + Custom limits & categories will be fully editable here
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Budgets;
