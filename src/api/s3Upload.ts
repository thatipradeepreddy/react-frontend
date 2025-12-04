import axios from "axios"

export async function requestPresign(
	apiBase: string,
	token: string | null,
	filename: string,
	contentType: string,
	contentLength?: number
) {
	const res = await fetch(`${apiBase}/s3/presign`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {})
		},
		body: JSON.stringify({ filename, contentType, contentLength })
	})
	if (!res.ok) throw await res.json()
	return res.json()
}

export async function uploadToS3WithProgress(
	uploadUrl: string,
	file: File,
	onProgress?: (percentage: number) => void,
	signal?: AbortSignal
) {
	await axios.put(uploadUrl, file, {
		headers: {
			"Content-Type": file.type
		},
		withCredentials: false,

		onUploadProgress: progressEvent => {
			if (!progressEvent.total) return
			const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
			if (onProgress) onProgress(percent)
		},
		signal
	})
	return true
}

export async function requestPresignedGet(apiBase: string, token: string | null, key: string) {
	const res = await fetch(`${apiBase}/s3/presign-download`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {})
		},
		body: JSON.stringify({ key })
	})
	if (!res.ok) throw await res.json()
	return res.json()
}
