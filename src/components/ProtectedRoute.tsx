import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  // Check if user is authenticated (you can replace this with your auth logic)
  const isAuthenticated = localStorage.getItem('token')

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
