import React, { useState, useRef } from "react"
import styles from "./register.module.css"
import { apiRegister, apiConfirm } from "../../api/api"
import { requestRegisterImagePresign, uploadToS3WithProgress } from "../../api/s3Upload"
import axios from "axios"

type FormState = {
	name: string
	email: string
	password: string
	phoneNumber: string
	birthdate: string
	gender: string
	picture: string
}

export default function Register() {
	const [form, setForm] = useState<FormState>({
		name: "",
		email: "",
		password: "",
		phoneNumber: "",
		birthdate: "",
		gender: "",
		picture: ""
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [showConfirm, setShowConfirm] = useState(false)
	const [code, setCode] = useState("")
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [confirmError, setConfirmError] = useState<string | null>(null)
	const [uploadProgress, setUploadProgress] = useState<number>(0)
	const [uploading, setUploading] = useState<boolean>(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const abortRef = useRef<AbortController | null>(null)
	const MAX_BYTES = Number(import.meta.env.VITE_MAX_PROFILE_IMAGE_BYTES || 1048576)

	const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setSuccess(null)

		if (!form.name || !form.email || !form.password) {
			setError("Name, email and password are required.")
			return
		}

		if (!form.picture) {
			setError("Please upload a profile picture before registering.")
			return
		}

		setLoading(true)
		try {
			await apiRegister({
				name: form.name,
				email: form.email,
				password: form.password,
				phoneNumber: form.phoneNumber || undefined,
				birthdate: form.birthdate || undefined,
				gender: form.gender || undefined,
				picture: form.picture
			})

			setSuccess("Signup initiated. Check your email or phone for the verification code.")
			setShowConfirm(true)
		} catch (err: any) {
			setError(err?.error || err?.message || "Registration failed")
		} finally {
			setLoading(false)
		}
	}

	const handleConfirm = async (e: React.FormEvent) => {
		e.preventDefault()
		setConfirmError(null)
		if (!code) {
			setConfirmError("Please enter the verification code.")
			return
		}
		setConfirmLoading(true)
		try {
			await apiConfirm(form.email, code)
			setSuccess("Account confirmed. You can now log in.")
			setShowConfirm(false)
		} catch (err: any) {
			setConfirmError(err?.error || err?.message || "Confirmation failed")
		} finally {
			setConfirmLoading(false)
		}
	}

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!form.email) {
			setUploadError("Please enter your email before uploading a profile picture.")
			return
		}

		if (!file.type.startsWith("image/")) {
			setUploadError("Only image files are allowed.")
			return
		}

		if (file.size > MAX_BYTES) {
			setUploadError(`File too large. Max ${Math.round(MAX_BYTES / 1024)} KB allowed.`)
			return
		}

		setUploadError(null)
		setUploading(true)
		setUploadProgress(0)

		const localUrl = URL.createObjectURL(file)
		setPreviewUrl(localUrl)

		const abort = new AbortController()
		abortRef.current = abort

		try {
			const BASE = import.meta.env.VITE_API_BASE_URL as string

			const { uploadUrl, key } = await requestRegisterImagePresign(BASE, form.email, file.name, file.type)

			await uploadToS3WithProgress(uploadUrl, file, percent => setUploadProgress(percent), abort.signal)

			update("picture", key)

			setUploadProgress(100)
			setSuccess("Profile image uploaded")
		} catch (err: any) {
			if (axios.isCancel && axios.isCancel(err)) {
				setUploadError("Upload cancelled.")
			} else if (err?.name === "CanceledError") {
				setUploadError("Upload cancelled.")
			} else {
				console.error(err)
				setUploadError(err?.error || err?.message || "Upload failed")
			}
		} finally {
			setUploading(false)
			abortRef.current = null
		}
	}

	const cancelUpload = () => {
		if (abortRef.current) abortRef.current.abort()
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Register</h2>
			<form className={styles.form} onSubmit={handleSubmit}>
				<label className={styles.label}>
					Full name
					<input className={styles.input} value={form.name} onChange={e => update("name", e.target.value)} />
				</label>
				<label className={styles.label}>
					Email
					<input
						className={styles.input}
						type='email'
						value={form.email}
						onChange={e => update("email", e.target.value)}
					/>
				</label>
				<label className={styles.label}>
					Password
					<input
						className={styles.input}
						type='password'
						value={form.password}
						onChange={e => update("password", e.target.value)}
					/>
				</label>
				<label className={styles.label}>
					Phone number
					<input
						className={styles.input}
						value={form.phoneNumber}
						onChange={e => update("phoneNumber", e.target.value)}
						placeholder='+919...'
					/>
				</label>
				<label className={styles.label}>
					Birthdate
					<input
						className={styles.input}
						type='date'
						value={form.birthdate}
						onChange={e => update("birthdate", e.target.value)}
					/>
				</label>
				<label className={styles.label}>
					Gender
					<select className={styles.input} value={form.gender} onChange={e => update("gender", e.target.value)}>
						<option value=''>Select</option>
						<option value='male'>Male</option>
						<option value='female'>Female</option>
						<option value='other'>Other</option>
					</select>
				</label>

				<label className={styles.label}>
					Profile picture
					<input className={styles.input} type='file' accept='image/*' onChange={handleFileUpload} />
				</label>

				{previewUrl && (
					<div style={{ marginTop: 8 }}>
						<img src={previewUrl} alt='preview' style={{ maxWidth: 120, borderRadius: 8 }} />
					</div>
				)}

				{uploading && (
					<div className={styles.progressWrapper}>
						<div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
						<span>{uploadProgress}%</span>
						<button type='button' onClick={cancelUpload} style={{ marginLeft: 8 }}>
							Cancel
						</button>
					</div>
				)}

				{uploadError && <div className={styles.error}>{uploadError}</div>}

				<div className={styles.actions}>
					<button className={styles.button} type='submit' disabled={loading}>
						{loading ? "Registering..." : "Register"}
					</button>
				</div>

				{error && <div className={styles.error}>{error}</div>}
				{success && <div className={styles.success}>{success}</div>}
			</form>

			{showConfirm && (
				<div className={styles.confirm}>
					<h3>Confirm account</h3>
					<p>
						Enter the code sent to <strong>{form.email}</strong>
					</p>
					<form onSubmit={handleConfirm}>
						<input
							className={styles.input}
							value={code}
							onChange={e => setCode(e.target.value)}
							placeholder='123456'
						/>
						<div className={styles.actions}>
							<button className={styles.button} type='submit' disabled={confirmLoading}>
								{confirmLoading ? "Verifying..." : "Verify"}
							</button>
						</div>
						{confirmError && <div className={styles.error}>{confirmError}</div>}
					</form>
				</div>
			)}
		</div>
	)
}
