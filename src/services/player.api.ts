import { createApi } from "@reduxjs/toolkit/query/react"
import type { PlayerResponse, CreatePlayerPayload } from "../types/player.types"
import { baseQueryWithReauth } from "../api/api"

export const playersApi = createApi({
	reducerPath: "playersApi",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Players"],

	endpoints: builder => ({
		getPlayers: builder.query<PlayerResponse[], void>({
			query: () => "/players",
			providesTags: ["Players"]
		}),

		createPlayer: builder.mutation<PlayerResponse, CreatePlayerPayload>({
			query: payload => ({
				url: "/players",
				method: "POST",
				body: payload
			}),
			invalidatesTags: ["Players"]
		}),

		deletePlayer: builder.mutation<void, string>({
			query: playerId => ({
				url: `/players/${playerId}`,
				method: "DELETE"
			}),
			invalidatesTags: ["Players"]
		}),

		updatePlayerStats: builder.mutation<void, { playerId: string; payload: { format: string; stats: any } }>({
			query: ({ playerId, payload }) => ({
				url: `/players/${playerId}/stats`,
				method: "PUT",
				body: payload
			}),
			invalidatesTags: ["Players"]
		})
	})
})

export const { useGetPlayersQuery, useCreatePlayerMutation, useDeletePlayerMutation, useUpdatePlayerStatsMutation } = playersApi
