const WS_BASE = import.meta.env.VITE_WS_BASE_URL as string

export type PlayerSocketMessage = {
	answer?: string
	error?: string
}

export function createPlayerSocket(): WebSocket {
	const socket = new WebSocket(WS_BASE)
	return socket
}
