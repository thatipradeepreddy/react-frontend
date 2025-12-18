import { useEffect, useRef, useState } from "react"
import styles from "./playerChat.module.css"
import { createPlayerSocket } from "../../utils/playerSocket"
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SendIcon from "@mui/icons-material/Send"
import { Switch, FormControlLabel } from "@mui/material"

type ChatMessage = {
	from: "user" | "ai"
	text: string
}

interface PlayerChatProps {
	open: boolean
	onClose: () => void
	dialogStyles?: React.CSSProperties
}

export default function PlayerAIChat(props: PlayerChatProps) {
	const [question, setQuestion] = useState("")
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [loading, setLoading] = useState(false)
	const [socketReady, setSocketReady] = useState(false)
	const [enableAIInsights, setEnableAIInsights] = useState(true)

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
				prompt: question,
				enableAIInsights: enableAIInsights
			})
		)

		setQuestion("")
	}

	const renderMessages = () => {
		return (
			<div className={styles.card}>
				<div className={styles.chatBox}>
					{messages.map((m, i) => (
						<div key={i} className={`${styles.message} ${m.from === "user" ? styles.userMessage : styles.aiMessage}`}>
							{m.text}
						</div>
					))}

					{loading && <div className={styles.typing}>AI is analyzing…</div>}
				</div>
			</div>
		)
	}

	const renderDialog = () => {
		return (
			<Dialog
				open={props.open}
				onClose={props.onClose}
				maxWidth='sm'
				fullWidth
				PaperProps={{
					sx: {
						height: "70vh",
						maxHeight: "720px",
						borderRadius: "20px",
						overflow: "hidden",
						...props.dialogStyles
					}
				}}
			>
				<DialogTitle sx={{ p: 1, pl: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<Box>
						<h2 className={styles.title}>Player AI Analyst</h2>
						<p className={styles.subtitle}>Ask anything about player performance, strengths or role</p>
					</Box>
					<IconButton onClick={props.onClose}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<DialogContent sx={{ p: 0 }}>{renderMessages()}</DialogContent>
				<DialogActions sx={{ p: 1 }}>
					<div className={styles.inputWrapper}>
						<textarea
							className={styles.textarea}
							placeholder={enableAIInsights ? "Ask about player performance…" : "Ask anything…"}
							value={question}
							onChange={e => setQuestion(e.target.value)}
							disabled={!socketReady || loading}
							rows={1}
							onKeyDown={e => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault()
									askAI()
								}
							}}
						/>

						<IconButton
							onClick={askAI}
							disabled={!socketReady || loading || !question.trim()}
							sx={{
								p: 0,
								position: "absolute",
								right: -13,
								bottom: 21,
								zIndex: 10
							}}
						>
							<SendIcon
								sx={{
									fontSize: 28,
									color: question.trim() && socketReady && !loading ? "#0ea5a2" : "#9ca3af",
									transition: "color 0.15s ease",
									"&:hover": {
										color: question.trim() && socketReady && !loading ? "#0891b2" : "#9ca3af"
									}
								}}
							/>
						</IconButton>
					</div>

					<FormControlLabel
						control={
							<Switch
								checked={enableAIInsights}
								onChange={e => setEnableAIInsights(e.target.checked)}
								color='primary'
								sx={{ ml: 2 }}
							/>
						}
						label=''
					/>
				</DialogActions>
			</Dialog>
		)
	}

	return <>{renderDialog()}</>
}
