import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Home from './pages/dashboard/Home';
import Income from './pages/dashboard/Income';
import Expense from './pages/dashboard/Expense';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/signup',
                element: <SignUp />,
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: '/dashboard',
                        element: <Home />,
                    },
                    {
                        path: '/income',
                        element: <Income />,
                    },
                    {
                        path: '/expense',
                        element: <Expense />,
                    },
                ],
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
