import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import { useState } from "react"
import { IconButton } from "@mui/material"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import styles from "./appLayout.module.css"
import Navbar from "../components/navbar/navbar"
import SideBar from "../components/sidebar/sidebar"
import PlayerAIChat from "../components/player-chat/playerChat"

const Layout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [playerChatOpen, setPlayerChatOpen] = useState(false)

	const toggleSidebar = () => {
		setSidebarOpen(prev => !prev)
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
			<Navbar toggleSidebar={toggleSidebar} />
			<SideBar open={sidebarOpen} toggleSidebar={toggleSidebar} />
			<Box
				component='main'
				className={styles.scrollHidden}
				sx={{
					mt: { xs: "56px", sm: "64px" },
					flexGrow: 1,
					overflowY: "auto"
				}}
			>
				<IconButton
					onClick={() => setPlayerChatOpen(true)}
					sx={{
						position: "fixed",
						bottom: 54,
						right: 54,
						zIndex: 1300,
						width: 56,
						height: 56,
						borderRadius: "50%",
						background: "linear-gradient(135deg, #0ea5e9, #0ea5a2)",
						color: "#fff",
						boxShadow: "0 12px 30px rgba(14,165,233,0.35)",
						"&:hover": {
							background: "linear-gradient(135deg, #0284c7, #0891b2)"
						}
					}}
				>
					<ChatBubbleOutlineIcon />
				</IconButton>
				<PlayerAIChat
					open={playerChatOpen}
					onClose={() => setPlayerChatOpen(false)}
					dialogStyles={{ position: "absolute", right: 70, bottom: 70 }}
				/>
				<Outlet />
			</Box>
		</Box>
	)
}

export default Layout
