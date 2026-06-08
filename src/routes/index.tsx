import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import SignUp from '../pages/Auth/SignUp'
import Home from '../pages/Dashboard/Home'
import Income from '../pages/Dashboard/Income'
import Expense from '../pages/Dashboard/Expense'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
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
])

export default router
