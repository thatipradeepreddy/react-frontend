import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())

	return {
		plugins: [react()],
		define: {
			"import.meta.env.VITE_API_BASE_URL": JSON.stringify(env.VITE_API_BASE_URL),
			"import.meta.env.VITE_WS_BASE_URL": JSON.stringify(env.VITE_WS_BASE_URL),
			"import.meta.env.VITE_MAX_PROFILE_IMAGE_BYTES": JSON.stringify(env.VITE_MAX_PROFILE_IMAGE_BYTES)
		}
	}
})
