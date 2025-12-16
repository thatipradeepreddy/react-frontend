const API_BASE = import.meta.env.VITE_API_BASE_URL as string

export async function fetchWithAuth(input: string, init: RequestInit = {}): Promise<Response> {
	const response = await fetch(`${API_BASE}${input}`, {
		...init,
		credentials: "include"
	})

	if (response.status !== 401) {
		return response
	}

	const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
		method: "POST",
		credentials: "include"
	})

	if (!refreshRes.ok) {
		window.location.replace("/")
		throw new Error("Session expired")
	}

	return fetch(`${API_BASE}${input}`, {
		...init,
		credentials: "include"
	})
}
