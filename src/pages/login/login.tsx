import React, { useState } from "react"
import styles from "./login.module.css"
import { useNavigate } from "react-router-dom"
import { useLoginMutation, useForgotPasswordMutation, useConfirmForgotPasswordMutation } from "../../services/auth.api"
import { authInitialDefault, type AuthFormState, type Mode, type UserProfile } from "../../types/login.types"

export default function Login() {
	const [form, setForm] = useState<AuthFormState>(authInitialDefault)

	const navigate = useNavigate()

	const [login, { isLoading: loggingIn }] = useLoginMutation()
	const [forgotPassword, { isLoading: sendingOtp }] = useForgotPasswordMutation()
	const [confirmForgotPassword, { isLoading: resetting }] = useConfirmForgotPasswordMutation()

	const loading = loggingIn || sendingOtp || resetting

	const showTempMessage = (setter: React.Dispatch<React.SetStateAction<string | null>>, message: string) => {
		setter(message)
		setTimeout(() => setter(null), 3000)
	}

	const updateField = (field: keyof AuthFormState, value: string | null | Mode) => {
		setForm(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		updateField("error", null)

		if (!form.email || !form.password) {
			updateField("error", "Email and password required")
			return
		}

		try {
			const data = await login({ email: form.email, password: form.password }).unwrap()

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
			updateField("error", err?.data?.message || err?.message || "Login failed")
		}
	}

	const handleForgot = async (e: React.FormEvent) => {
		e.preventDefault()
		updateField("error", null)

		if (!form.email) {
			updateField("error", "Email required")
			return
		}

		try {
			const res = await forgotPassword({ email: form.email }).unwrap()
			updateField("success", res.message)
			updateField("mode", "reset")
		} catch (err: any) {
			updateField("error", err?.data?.message || err?.message || "Failed to send OTP")
		}
	}

	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault()
		updateField("error", null)

		if (!form.email || !form.code || !form.password) {
			updateField("error", "All fields are required")
			return
		}

		try {
			const res = await confirmForgotPassword({
				email: form.email,
				code: form.code,
				newPassword: form.password
			}).unwrap()

			updateField("success", res.message)
			updateField("mode", "login")
			updateField("password", "")
			updateField("code", "")
		} catch (err: any) {
			updateField("error", err?.data?.message || err?.message || "Password reset failed")
		}
	}

	return (
		<div className={styles.container}>
			{form.mode === "login" && (
				<div className={styles.card}>
					<h2 className={styles.title}>Welcome back</h2>
					<p className={styles.subtitle}>Sign in to continue to your account</p>

					<form className={styles.form} onSubmit={handleLogin}>
						<label className={styles.label}>
							Email
							<input
								className={styles.input}
								type='email'
								value={form.email}
								onChange={e => updateField("email", e.target.value)}
							/>
						</label>
						<label className={styles.label}>
							Password
							<input
								className={styles.input}
								type='password'
								value={form.password}
								onChange={e => updateField("password", e.target.value)}
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

						{form.error && <div className={styles.error}>{form.error}</div>}
					</form>

					{form.mode === "login" && (
						<button type='button' className={styles.link} onClick={() => updateField("mode", "forgot")}>
							Forgot password?
						</button>
					)}
				</div>
			)}
			{form.mode !== "login" && (
				<div className={styles.card}>
					<h2 className={styles.title}>Forgot Password</h2>
					<p className={styles.subtitle}>Enter your email to receive a password reset code</p>
					<form className={styles.form} onSubmit={form.mode === "forgot" ? handleForgot : handleReset}>
						<label className={styles.label}>
							Email
							<input
								className={styles.input}
								type='email'
								value={form.email}
								onChange={e => updateField("email", e.target.value)}
							/>
						</label>

						{form.mode === "reset" && (
							<>
								<label className={styles.label}>
									OTP
									<input
										className={styles.input}
										value={form.code}
										onChange={e => updateField("code", e.target.value)}
									/>
								</label>

								<label className={styles.label}>
									New Password
									<input
										className={styles.input}
										type='password'
										value={form.password}
										onChange={e => updateField("password", e.target.value)}
									/>
								</label>
							</>
						)}

						<div className={styles.actions}>
							<button className={styles.buttonPrimary} type='submit' disabled={loading}>
								{form.mode === "forgot" ? "Send OTP" : "Reset password"}
							</button>

							<button type='button' className={styles.buttonGhost} onClick={() => updateField("mode", "login")}>
								Back to login
							</button>
						</div>

						{form.error && <div className={styles.error}>{form.error}</div>}
						{form.success && <div className={styles.success}>{form.success}</div>}
					</form>
				</div>
			)}
		</div>
	)
}
