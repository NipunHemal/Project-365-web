import { NavLink } from 'react-router-dom';
import { HiHome, HiCurrencyDollar, HiCreditCard, HiXMark } from 'react-icons/hi2';
import { cn } from '@/lib/utils';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: HiHome },
        { name: 'Incomes', path: '/income', icon: HiCurrencyDollar },
        { name: 'Expenses', path: '/expense', icon: HiCreditCard },
    ];

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-blue-600">Track</span>It
                </h1>
                <button
                    onClick={onClose}
                    className="p-2 md:hidden text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <HiXMark className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={onClose}
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
                    © 2026 Expense Tracker
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
