import { Drawer, Divider, ListItemIcon, ListItemText, Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

interface SidebarProps {
	open: boolean
	toggleSidebar: () => void
}

export default function SideBar({ open, toggleSidebar }: SidebarProps) {
	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.clear()

		navigate("/", { replace: true })
	}

	return (
		<Drawer
			variant='temporary'
			open={open}
			onClose={toggleSidebar}
			sx={{
				"& .MuiDrawer-paper": {
					width: 150,
					backgroundColor: "#ffffff",
					boxSizing: "border-box",
					alignItems: "center",
					paddingY: 2
				}
			}}
		>
			<Box
				sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column", height: "100vh", width: "100%" }}
			>
				<Box sx={{ width: "100%", textAlign: "center" }}></Box>

				<Box
					onClick={handleLogout}
					sx={{
						width: "100%",
						textAlign: "center",
						py: 2,
						cursor: "pointer",
						borderTop: "1px solid rgba(255,255,255,0.2)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						"&:hover": {
							color: "#0078D4"
						}
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
						<ListItemIcon sx={{ color: "inherit", minWidth: "unset", mr: 1 }}></ListItemIcon>
						<ListItemText
							primary={
								<Typography fontSize={12} sx={{ fontWeight: "bold" }}>
									Log Out
								</Typography>
							}
							sx={{ m: 0 }}
						/>
					</Box>
				</Box>
			</Box>
		</Drawer>
	)
}
