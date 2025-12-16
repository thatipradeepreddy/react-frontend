import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
	const raw = localStorage.getItem("userProfile")
	const isLoggedIn = !!raw

	return isLoggedIn ? <Outlet /> : <Navigate to='/' replace />
}
