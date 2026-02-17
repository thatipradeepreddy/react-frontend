export type LoginRequest = { email: string; password: string }

export interface LoginResponseProps {
	name: string
	email: string
	picture: string
	phone_number: string
	birthdate: string
	gender: string
}

export type LoginResponse = Partial<LoginResponseProps>

export type ForgotRequest = { email: string }
export type ForgotResponse = { message: string }

export type ResetRequest = { email: string; code: string; newPassword: string }
export type ResetResponse = { message: string }

export type RegisterRequest = {
	name: string
	email: string
	password: string
	phoneNumber?: string
	birthdate?: string
	gender?: string
	picture?: string
}

export type RegisterResponse = { message: string }

export type ConfirmRequest = { email: string; code: string }
export type ConfirmResponse = { message: string }
