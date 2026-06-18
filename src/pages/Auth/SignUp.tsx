import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register, clearError } from '@/store/slices/authSlice';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlinePhoto } from 'react-icons/hi2';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileUrl, setProfileUrl] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(clearError());

        const result = await dispatch(register({
            fullName,
            email,
            password,
            profileUrl: profileUrl || undefined
        }));

        if (register.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                <p className="text-gray-500 mt-2">Join us to start tracking your expenses</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                        {error}
                    </div>
                )}

                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    leftIcon={<HiOutlineUser className="w-5 h-5" />}
                    required
                />

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
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<HiOutlineLockClosed className="w-5 h-5" />}
                    minLength={6}
                    required
                />

                <Input
                    label="Profile Image URL (Optional)"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    leftIcon={<HiOutlinePhoto className="w-5 h-5" />}
                />

                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                >
                    Create Account
                </Button>
            </form>

            <div className="mt-8 text-center text-sm">
                <span className="text-gray-500">Already have an account? </span>
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    );
};

export default SignUp;
