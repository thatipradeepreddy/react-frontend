export interface User {
	name: string
	email: string
	picture: string
	phone_number: string
	birthdate: string
	gender: string
}

export interface AuthFormState {
	mode: Mode
	email: string
	password: string
	code: string
	error: string | null
	success: string | null
}

export const authInitialDefault: AuthFormState = {
	mode: "login",
	email: "",
	password: "",
	code: "",
	error: null,
	success: null
}

export type UserProfile = Partial<User>

export type Mode = "login" | "forgot" | "reset"
