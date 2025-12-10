import React, { useEffect, useState } from "react"
import styles from "./login.module.css"
import { apiLogin, apiLogout } from "../../api/api"
import { useNavigate } from "react-router-dom"

type UserProfile = {
	name?: string
	email?: string
	picture?: string
	phone_number?: string
	birthdate?: string
	gender?: string
}

export default function Login() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [user, setUser] = useState<UserProfile | null>(() => {
		try {
			const raw = localStorage.getItem("userProfile")
			return raw ? JSON.parse(raw) : null
		} catch {
			return null
		}
	})

	const navigate = useNavigate()

	useEffect(() => {
		try {
			const raw = localStorage.getItem("userProfile")
			if (raw) setUser(JSON.parse(raw))
		} catch {}
	}, [])

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		if (!email || !password) {
			setError("Email and password required")
			return
		}
		setLoading(true)
		try {
			const data = await apiLogin({ email, password })
			const profile: UserProfile = {
				name: data.name,
				email: data.email,
				picture: data.picture,
				phone_number: data.phone_number,
				birthdate: data.birthdate,
				gender: data.gender
			}
			localStorage.setItem("userProfile", JSON.stringify(profile))
			setUser(profile)
			navigate("/dashboard")
		} catch (err: any) {
			setError(err?.error || err?.message || "Login failed")
		} finally {
			setLoading(false)
		}
	}

	async function handleLogout() {
		setLoading(true)
		try {
			await apiLogout()
		} catch {
		} finally {
			localStorage.removeItem("userProfile")
			setUser(null)
			setLoading(false)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h2 className={styles.title}>Welcome back</h2>
				<p className={styles.subtitle}>Sign in to continue to your account</p>

				<form className={styles.form} onSubmit={handleLogin}>
					<label className={styles.label}>
						Email
						<input className={styles.input} type='email' value={email} onChange={e => setEmail(e.target.value)} />
					</label>
					<label className={styles.label}>
						Password
						<input
							className={styles.input}
							type='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</label>

					<div className={styles.actions}>
						<button className={styles.buttonPrimary} type='submit' disabled={loading}>
							{loading ? "Signing in..." : "Sign in"}
						</button>

						<button
							className={styles.buttonGhost}
							type='button'
							onClick={() => navigate("/register")}
							disabled={loading}
						>
							Create account
						</button>
					</div>

					{error && <div className={styles.error}>{error}</div>}
				</form>
			</div>
		</div>
	)
}
