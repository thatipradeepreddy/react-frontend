import { RouterProvider, createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "./routes/protectedRoute"
import Login from "./pages/login/login"
import Dashboard from "./pages/dashboard/dashboard"
import AppLayout from "./layout/appLayout"
import Register from "./pages/register/register"

const router = createBrowserRouter([
	{ path: "/login", element: <Login /> },
	{ path: "/register", element: <Register /> },
	{
		path: "/",
		element: <ProtectedRoute />,
		children: [
			{
				element: <AppLayout />,
				children: [{ path: "/dashboard", element: <Dashboard /> }]
			}
		]
	}
])

export default function App() {
	return <RouterProvider router={router} />
}
