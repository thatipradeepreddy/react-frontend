import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { BaseQueryFn } from "@reduxjs/toolkit/query"
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"

const API_BASE = import.meta.env.VITE_API_BASE_URL as string

const baseQuery = fetchBaseQuery({
	baseUrl: API_BASE,
	credentials: "include"
})

let isRefreshing = false
let refreshPromise: Promise<Response> | null = null

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
	args,
	api,
	extraOptions
) => {
	let result = await baseQuery(args, api, extraOptions)

	if (result.error?.status !== 401) {
		return result
	}

	if (!isRefreshing) {
		isRefreshing = true
		refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
			method: "POST",
			credentials: "include"
		})
	}

	try {
		const refreshResult = await refreshPromise

		isRefreshing = false
		refreshPromise = null

		if (!refreshResult || !refreshResult.ok) {
			window.location.replace("/")
			return result
		}

		result = await baseQuery(args, api, extraOptions)
		return result
	} catch (err) {
		isRefreshing = false
		refreshPromise = null
		window.location.replace("/")
		return result
	}
}
