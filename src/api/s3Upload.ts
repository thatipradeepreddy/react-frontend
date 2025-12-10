import axios from "axios"

export async function requestRegisterImagePresign(apiBase: string, email: string, fileName: string, contentType: string) {
	const res = await fetch(`${apiBase}/auth/register/image-url`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ email, fileName, contentType })
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
		onUploadProgress: progressEvent => {
			if (!progressEvent.total) return
			const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
			if (onProgress) onProgress(percent)
		},
		signal
	})

	return true
}
