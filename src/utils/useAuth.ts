import { useEffect, useState } from "react"
import { fetchWithAuth } from "../api/refresh/fetchWithAuth"

export function useAuth() {
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState<any>(null)

	useEffect(() => {
		fetchWithAuth("/auth/me")
			.then(res => {
				if (!res.ok) throw new Error()
				return res.json()
			})
			.then(data => setUser(data.user))
			.catch(() => setUser(null))
			.finally(() => setLoading(false))
	}, [])

	return { user, loading, isAuthenticated: !!user }
}