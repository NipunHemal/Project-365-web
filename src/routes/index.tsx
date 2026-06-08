import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import SignUp from '../pages/Auth/SignUp'
import Home from '../pages/Dashboard/Home'
import Income from '../pages/Dashboard/Income'
import Expense from '../pages/Dashboard/Expense'
import ProtectedRoute from '../components/ProtectedRoute'
import AuthLayout from '../components/layout/AuthLayout'

const router = createBrowserRouter([
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
        path: '/',
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
])

export default router
