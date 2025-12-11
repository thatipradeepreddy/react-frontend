import type { PlayerResponse, CreatePlayerPayload } from "../types/player.types"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || ""

export async function fetchPlayers(): Promise<PlayerResponse[]> {
	const res = await fetch(`${API_BASE_URL}/api/players`)
	if (!res.ok) throw new Error("Failed to fetch players")
	return res.json()
}

export async function createPlayer(payload: CreatePlayerPayload): Promise<PlayerResponse> {
	const res = await fetch(`${API_BASE_URL}/api/players`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	})

	if (!res.ok) {
		const text = await res.text()
		throw new Error(text || "Failed to create player")
	}

	return res.json()
}

export async function createPlayerImageUploadUrl(
	playerId: string,
	fileName: string,
	contentType: string
): Promise<{ uploadUrl: string; key: string }> {
	const res = await fetch(`${API_BASE_URL}/api/players/${playerId}/image-url`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ fileName, contentType })
	})

	if (!res.ok) {
		const text = await res.text()
		throw new Error(text || "Failed to create upload URL")
	}

	return res.json()
}

export async function uploadPlayerImageToS3(uploadUrl: string, file: File): Promise<void> {
	const res = await fetch(uploadUrl, {
		method: "PUT",
		headers: {
			"Content-Type": file.type
		},
		body: file
	})

	if (!res.ok) {
		const text = await res.text()
		throw new Error(text || "Failed to upload image to S3")
	}
}

export async function deletePlayer(playerId: string): Promise<void> {
	const res = await fetch(`${API_BASE_URL}/api/players/${playerId}`, {
		method: "DELETE"
	})
	if (!res.ok && res.status !== 204) {
		const text = await res.text()
		throw new Error(text || "Failed to delete player")
	}
}
