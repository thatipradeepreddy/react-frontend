import { refreshSession } from "./refreshSession"

const API_BASE = import.meta.env.VITE_API_BASE_URL as string

export async function fetchWithAuth(input: string, init: RequestInit = {}): Promise<Response> {
	const accessToken = localStorage.getItem("accessToken")

	const headers = new Headers(init.headers || {})
	if (accessToken) {
		headers.set("Authorization", `Bearer ${accessToken}`)
	}

	const response = await fetch(`${API_BASE}${input}`, {
		...init,
		headers
	})

	if (response.status !== 401) {
		return response
	}

	return tryRefreshAndRetry(input, init)
}

async function tryRefreshAndRetry(input: string, init: RequestInit): Promise<Response> {
	try {
		const newToken = await refreshSession()

		const headers = new Headers(init.headers || {})
		headers.set("Authorization", `Bearer ${newToken}`)

		return fetch(`${API_BASE}${input}`, {
			...init,
			headers
		})
	} catch (err) {
		console.warn("Session expired, logging out")

		localStorage.removeItem("accessToken")
		localStorage.removeItem("refreshToken")
		localStorage.removeItem("cognitoUsername")

		window.location.replace("/")
		throw err
	}
}
