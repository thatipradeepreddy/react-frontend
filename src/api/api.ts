const BASE = import.meta.env.VITE_API_BASE_URL as string

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
	const data = await res.json()
	if (!res.ok) throw data
	return data
}

export async function apiConfirm(email: string, code: string) {
	const res = await fetch(`${BASE}/auth/confirm`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, code })
	})
	const data = await res.json()
	if (!res.ok) throw data
	return data
}

export async function apiLogin(body: LoginRequest) {
	const res = await fetch(`${BASE}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	})

	const data = await res.json()
	if (!res.ok) throw data

	localStorage.setItem("accessToken", data.AccessToken)
	localStorage.setItem("refreshToken", data.RefreshToken)

	localStorage.setItem("cognitoUsername", data.username)

	return data
}

export async function apiLogout() {
	localStorage.clear()
	return true
}

export const apiForgotPassword = async (payload: { email: string }) => {
	const res = await fetch("/forgot-password", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	})

	const data = await res.json()
	if (!res.ok) throw data
	return data
}

export const apiConfirmForgotPassword = async (payload: { email: string; code: string; newPassword: string }) => {
	const res = await fetch("/confirm-forgot-password", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	})

	const data = await res.json()
	if (!res.ok) throw data
	return data
}
