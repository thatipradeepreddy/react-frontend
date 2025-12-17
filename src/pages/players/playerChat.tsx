import { useEffect, useRef, useState } from "react"
import styles from "./playerChat.module.css"
import { createPlayerSocket } from "../../utils/playerSocket"

type ChatMessage = {
	from: "user" | "ai"
	text: string
}

export default function PlayerAIChat() {
	const [question, setQuestion] = useState("")
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [loading, setLoading] = useState(false)
	const [socketReady, setSocketReady] = useState(false)

	const socketRef = useRef<WebSocket | null>(null)

	useEffect(() => {
		const socket = createPlayerSocket()

		socket.onopen = () => {
			setSocketReady(true)
		}

		socket.onmessage = e => {
			const data = JSON.parse(e.data)
			if (data.answer) {
				setMessages(prev => [...prev, { from: "ai", text: data.answer }])
				setLoading(false)
			}
		}

		socket.onerror = () => {
			setLoading(false)
		}

		socket.onclose = () => {
			setSocketReady(false)
		}

		socketRef.current = socket

		return () => {
			socket.close()
		}
	}, [])

	const askAI = () => {
		if (!question.trim() || !socketRef.current || !socketReady || loading) {
			return
		}

		setMessages(prev => [...prev, { from: "user", text: question }])
		setLoading(true)

		socketRef.current.send(
			JSON.stringify({
				prompt: question
			})
		)

		setQuestion("")
	}

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h2 className={styles.title}>Player AI Analyst</h2>
				<p className={styles.subtitle}>Ask anything about player performance, strengths or role</p>

				<div className={styles.chatBox}>
					{messages.map((m, i) => (
						<div key={i} className={`${styles.message} ${m.from === "user" ? styles.userMessage : styles.aiMessage}`}>
							{m.text}
						</div>
					))}

					{loading && <div className={styles.typing}>AI is analyzing…</div>}
				</div>

				<div className={styles.form}>
					<input
						className={styles.input}
						placeholder={socketReady ? "Ask about this player…" : "Connecting…"}
						value={question}
						onChange={e => setQuestion(e.target.value)}
						disabled={!socketReady || loading}
						onKeyDown={e => e.key === "Enter" && askAI()}
					/>

					<button className={styles.buttonPrimary} onClick={askAI} disabled={!socketReady || loading}>
						Ask AI
					</button>
				</div>
			</div>
		</div>
	)
}
