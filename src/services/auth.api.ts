import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "../api/api"
import type {
	ConfirmRequest,
	ConfirmResponse,
	ForgotRequest,
	ForgotResponse,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	ResetRequest,
	ResetResponse
} from "../types/auth.types"

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithReauth,

	endpoints: builder => ({
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: body => ({
				url: "/auth/login",
				method: "POST",
				body
			})
		}),

		forgotPassword: builder.mutation<ForgotResponse, ForgotRequest>({
			query: body => ({
				url: "/auth/forgot-password",
				method: "POST",
				body
			})
		}),

		confirmForgotPassword: builder.mutation<ResetResponse, ResetRequest>({
			query: body => ({
				url: "/auth/confirm-forgot-password",
				method: "POST",
				body
			})
		}),

		register: builder.mutation<RegisterResponse, RegisterRequest>({
			query: body => ({
				url: "/auth/register",
				method: "POST",
				body
			})
		}),

		confirmRegister: builder.mutation<ConfirmResponse, ConfirmRequest>({
			query: ({ email, code }) => ({
				url: "/auth/confirm",
				method: "POST",
				body: { email, code }
			})
		}),
        
		logout: builder.mutation<void, void>({
			query: () => ({
				url: "/auth/logout",
				method: "POST"
			})
		})
	})
})

export const {
	useLoginMutation,
	useForgotPasswordMutation,
	useConfirmForgotPasswordMutation,
	useRegisterMutation,
	useConfirmRegisterMutation
} = authApi
