export async function refreshSession(): Promise<string> {
	const refreshToken = localStorage.getItem("refreshToken")
	const username = localStorage.getItem("cognitoUsername")

	if (!refreshToken || !username) {
		throw new Error("No refresh session")
	}

	const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refreshToken, username })
	})

	if (!res.ok) {
		throw new Error("Refresh failed")
	}

	const data = await res.json()

	localStorage.setItem("accessToken", data.accessToken)
	localStorage.setItem("idToken", data.idToken)

	return data.accessToken
}
