import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import AppLayout from "./layout/appLayout"
import ProtectedRoute from "./routes/protectedRoute"
import Dashboard from "./pages/dashboard/dashboard"
import Login from "./pages/login/login"
import Register from "./pages/register/register"
import PlayersPage from "./pages/players/players"

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route element={<AppLayout />}>
					<Route element={<ProtectedRoute />}>
						<Route path='/dashboard' element={<Dashboard />} />
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route path='/players' element={<PlayersPage />} />
					</Route>
				</Route>
			</Routes>
		</Router>
	)
}

export default App
