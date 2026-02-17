import { configureStore } from "@reduxjs/toolkit"
import { playersApi } from "../services/player.api"
import { authApi } from "../services/auth.api"

export const store = configureStore({
	reducer: {
		[playersApi.reducerPath]: playersApi.reducer,
		[authApi.reducerPath]: authApi.reducer
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(playersApi.middleware).concat(authApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
