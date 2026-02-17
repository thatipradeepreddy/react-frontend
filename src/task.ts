export type User = {
	id: number
	name: string
	usedata: {
		id: number
		address: {
			street: string
		}
	}
}

export type DeepReadOnly<T> = {
	readonly [K in keyof T]: T[K] extends object ? DeepReadOnly<T[K]> : T[K]
}

export type IsString<T> = T extends string ? true : false
