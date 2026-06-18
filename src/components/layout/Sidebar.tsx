import { NavLink } from 'react-router-dom';
import { HiHome, HiCurrencyDollar, HiCreditCard } from 'react-icons/hi2';
import { cn } from '@/lib/utils';

const Sidebar = () => {
    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: HiHome },
        { name: 'Incomes', path: '/income', icon: HiCurrencyDollar },
        { name: 'Expenses', path: '/expense', icon: HiCreditCard },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-blue-600">Track</span>It
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                            isActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <link.icon className="w-5 h-5" />
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-400 text-center">
                    © 2024 Expense Tracker
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
