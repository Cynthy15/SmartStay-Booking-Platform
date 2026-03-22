// If user is not logged in, redirects to /login

import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function ProtectedRoute({ children }) {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    // Save where the user was trying to go so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
