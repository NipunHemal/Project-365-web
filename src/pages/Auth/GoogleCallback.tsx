import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { getProfile, setToken } from '@/store/slices/authSlice';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
            navigate('/login?error=' + encodeURIComponent(error));
            return;
        }

        if (token) {
            dispatch(setToken(token));
            // We need to fetch the user profile now that we have the token
            dispatch(getProfile())
                .unwrap()
                .then(() => {
                    navigate('/dashboard');
                })
                .catch(() => {
                    navigate('/login?error=Failed to fetch profile');
                });
        } else {
            navigate('/login?error=No token received');
        }
    }, [location, navigate, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Completing login...</p>
            </div>
        </div>
    );
};

export default GoogleCallback;
