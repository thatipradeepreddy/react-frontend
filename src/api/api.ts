const BASE = (import.meta.env.VITE_API_BASE_URL as string) || ""

export type RegisterRequest = {
	name: string
	email: string
	password: string
	phoneNumber?: string
	birthdate?: string
	gender?: string
	picture?: string
}

export type LoginRequest = {
	email: string
	password: string
}

export async function apiRegister(body: RegisterRequest) {
	const res = await fetch(`${BASE}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	})
	const data = await res.json().catch(() => ({ error: "Invalid response" }))
	if (!res.ok) throw data
	return data
}

export async function apiConfirm(email: string, code: string) {
	const res = await fetch(`${BASE}/auth/confirm`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, code })
	})
	const data = await res.json().catch(() => ({ error: "Invalid response" }))
	if (!res.ok) throw data
	return data
}

export async function apiLogin(body: LoginRequest) {
	const res = await fetch(`${BASE}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
		// credentials: "include"
	})
	const data = await res.json().catch(() => ({ error: "Invalid response" }))
	if (!res.ok) throw data
	return data
}

export async function apiLogout() {
	const res = await fetch(`${BASE}/auth/logout`, {
		method: "POST",
		credentials: "include"
	})
	const data = await res.json().catch(() => ({}))
	return data
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
	const res = await fetch(`${BASE}${input}`, {
		...init,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(init && init.headers ? (init.headers as any) : {})
		}
	})
	const data = await res.json().catch(() => ({}))
	if (!res.ok) throw data
	return data
}
