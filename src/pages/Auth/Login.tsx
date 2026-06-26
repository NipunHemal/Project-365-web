import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, clearError } from '@/store/slices/authSlice';
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(clearError());

        const result = await dispatch(login({ email, password }));
        if (login.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                        {error}
                    </div>
                )}

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<HiOutlineEnvelope className="w-5 h-5" />}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<HiOutlineLockClosed className="w-5 h-5" />}
                    required
                />

                <Button
                    type="button"
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2 mb-4"
                    onClick={() => {
                        window.location.href = `${import.meta.env.VITE_SERVER_URL || 'http://localhost:8080/api'}/auth/google`;
                    }}
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Sign in with Google
                </Button>

                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                >
                    Sign In
                </Button>
            </form>

            <div className="mt-8 text-center text-sm">
                <span className="text-gray-500">Don't have an account? </span>
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Sign up
                </Link>
            </div>
        </div>
    );
};

export default Login;
