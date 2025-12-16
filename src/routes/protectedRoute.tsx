import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../utils/useAuth"

export default function ProtectedRoute() {
	const { loading, isAuthenticated } = useAuth()

	if (loading) return null
	if (!isAuthenticated) return <Navigate to='/' replace />

	return <Outlet />
}
