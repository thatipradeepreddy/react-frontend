import React, { useState } from "react"
import styles from "./login.module.css"
import { apiConfirmForgotPassword, apiForgotPassword, apiLogin } from "../../api/api"
import { useNavigate } from "react-router-dom"

type UserProfile = {
	name?: string
	email?: string
	picture?: string
	phone_number?: string
	birthdate?: string
	gender?: string
}

type Mode = "login" | "forgot" | "reset"

export default function Login() {
	const [mode, setMode] = useState<Mode>("login")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [code, setCode] = useState("")
	const [success, setSuccess] = useState<string | null>(null)

	const navigate = useNavigate()

	const showTempMessage = (setter: React.Dispatch<React.SetStateAction<string | null>>, message: string) => {
		setter(message)
		setTimeout(() => setter(null), 3000)
	}

	const handleLogin = async (e: React.FormEvent) => {
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
			navigate("/players")
		} catch (err: any) {
			showTempMessage(setError, err?.error || err?.message || "Login failed")
		} finally {
			setLoading(false)
		}
	}

	const handleForgot = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!email) {
			setError("Email required")
			return
		}

		setLoading(true)
		try {
			const res = await apiForgotPassword({ email })
			showTempMessage(setSuccess, res.message)
			setMode("reset")
		} catch (err: any) {
			showTempMessage(setError, err?.error || err?.message || "Failed to send OTP")
		} finally {
			setLoading(false)
		}
	}

	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!email || !code || !password) {
			setError("All fields are required")
			return
		}

		try {
			const res = await apiConfirmForgotPassword({
				email,
				code,
				newPassword: password
			})

			showTempMessage(setSuccess, res.message)
			setMode("login")
			setPassword("")
			setCode("")
		} catch (err: any) {
			showTempMessage(setError, err?.error || err?.message || "Password reset failed")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={styles.container}>
			{mode === "login" && (
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

					{mode === "login" && (
						<button type='button' className={styles.link} onClick={() => setMode("forgot")}>
							Forgot password?
						</button>
					)}
				</div>
			)}
			{mode !== "login" && (
				<div className={styles.card}>
					<h2 className={styles.title}>Forgot Password</h2>
					<p className={styles.subtitle}>Enter your email to receive a password reset code</p>
					<form className={styles.form} onSubmit={mode === "forgot" ? handleForgot : handleReset}>
						<label className={styles.label}>
							Email
							<input className={styles.input} type='email' value={email} onChange={e => setEmail(e.target.value)} />
						</label>

						{mode === "reset" && (
							<>
								<label className={styles.label}>
									OTP
									<input className={styles.input} value={code} onChange={e => setCode(e.target.value)} />
								</label>

								<label className={styles.label}>
									New Password
									<input
										className={styles.input}
										type='password'
										value={password}
										onChange={e => setPassword(e.target.value)}
									/>
								</label>
							</>
						)}

						<div className={styles.actions}>
							<button className={styles.buttonPrimary} type='submit' disabled={loading}>
								{mode === "forgot" ? "Send OTP" : "Reset password"}
							</button>

							<button type='button' className={styles.buttonGhost} onClick={() => setMode("login")}>
								Back to login
							</button>
						</div>

						{error && <div className={styles.error}>{error}</div>}
						{success && <div className={styles.success}>{success}</div>}
					</form>
				</div>
			)}
		</div>
	)
}
