import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { HiArrowRightOnRectangle, HiUser } from 'react-icons/hi2';
import Button from '@/components/ui/Button';

const Header = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-xl font-semibold text-gray-800 md:hidden">TrackIt</h2>
            <div className="flex-1"></div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
                        {user?.profileUrl ? (
                            <img src={user.profileUrl} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <HiUser className="w-5 h-5" />
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                        {user?.fullName || 'User'}
                    </span>
                </div>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600"
                    title="Logout"
                >
                    <HiArrowRightOnRectangle className="w-5 h-5" />
                </Button>
            </div>
        </header>
    );
};

export default Header;
