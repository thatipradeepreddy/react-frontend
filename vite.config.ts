import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())

	return {
		plugins: [react()],
		define: {
			"import.meta.env.VITE_API_BASE_URL": JSON.stringify(env.VITE_API_BASE_URL),
			"import.meta.env.VITE_AWS_REGION": JSON.stringify(env.VITE_AWS_REGION),
			"import.meta.env.VITE_USER_PROFILE_IMAGE_S3": JSON.stringify(env.VITE_USER_PROFILE_IMAGE_S3),
			"import.meta.env.VITE_S3_SIGNED_URL_EXPIRES_SECONDS": JSON.stringify(env.VITE_S3_SIGNED_URL_EXPIRES_SECONDS),
			"import.meta.env.VITE_MAX_PROFILE_IMAGE_BYTES": JSON.stringify(env.VITE_MAX_PROFILE_IMAGE_BYTES)
		}
	}
})
