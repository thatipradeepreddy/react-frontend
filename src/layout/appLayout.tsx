import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import { useState } from "react"
import styles from "./appLayout.module.css"
import Navbar from "../components/navbar/navbar"
import SideBar from "../components/sidebar/sidebar"

const Layout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const toggleSidebar = () => {
		setSidebarOpen(prev => !prev)
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
			<Navbar toggleSidebar={toggleSidebar} />
			<SideBar open={sidebarOpen} toggleSidebar={toggleSidebar} />
			<Box
				component='main'
				className={styles.scrollHidden}
				sx={{
					mt: { xs: "56px", sm: "64px" },
					flexGrow: 1,
					overflowY: "auto",
					pl: 2,
					py: 2
				}}
			>
				<Outlet />
			</Box>
		</Box>
	)
}

export default Layout
