import { AppBar, Toolbar, IconButton, Avatar, Typography, Box, Menu, MenuItem, Badge, Divider } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ProfileDialog } from "../profile/profileDialog"
import { apiLogout } from "../../api/api"

interface NavbarProps {
	toggleSidebar: () => void
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [profileOpen, setProfileOpen] = useState(false)

	const navigate = useNavigate()

	const userRole = localStorage.getItem("userRole")

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
	}

	const handleLogout = () => {
		setAnchorEl(null)

		apiLogout().finally(() => {
			localStorage.clear()
			navigate("/", { replace: true })
		})
	}

	const getUserRole = (userRole: string | null) => {
		if (!userRole) return "Unknown Role"
	}
	const user = JSON.parse(localStorage.getItem("userProfile") || "{}")

	return (
		<AppBar position='fixed' sx={{ bgcolor: "white", boxShadow: "none", zIndex: 1200, position: "absolute" }}>
			<Toolbar sx={{ justifyContent: "space-between", px: 3, minHeight: "55px" }}>
				<Box display='flex' alignItems='center' gap={2}>
					<IconButton onClick={toggleSidebar}>
						<MenuIcon sx={{ color: "#000" }} />
					</IconButton>
					Create Your Team
				</Box>

				<Box display='flex' alignItems='center' gap={2}>
					<IconButton>
						<SearchIcon sx={{ color: "#0D0B52" }} />
					</IconButton>

					<Box display='flex' alignItems='center' gap={1} sx={{ cursor: "pointer" }} onClick={handleProfileMenuOpen}>
						<Badge
							overlap='circular'
							anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
							variant='dot'
							sx={{
								"& .MuiBadge-badge": {
									backgroundColor: "#2ECC71",
									color: "#2ECC71",
									boxShadow: "0 0 0 2px white"
								}
							}}
						>
							<Avatar alt='UserProfile' sx={{ width: 32, height: 32 }} src={user.picture}></Avatar>
						</Badge>

						<Box textAlign='left'>
							<Typography fontSize={14} color='#0D0B52'>
								{user.name}
							</Typography>
							<Typography fontSize={12} color='text.secondary'>
								{getUserRole(userRole)}
							</Typography>
						</Box>
					</Box>

					<IconButton onClick={handleProfileMenuOpen}>
						<Box
							component='span'
							sx={{
								width: 0,
								height: 0,
								borderLeft: "6px solid transparent",
								borderRight: "6px solid transparent",
								borderTop: "6px solid #0D0B52"
							}}
						/>
					</IconButton>
				</Box>

				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleMenuClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right"
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "right"
					}}
				>
					<MenuItem
						onClick={() => {
							setProfileOpen(true)
							handleMenuClose()
						}}
					>
						Profile
					</MenuItem>

					<Divider />
					<MenuItem onClick={handleLogout}>Logout</MenuItem>
				</Menu>
			</Toolbar>

			<ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} user={user} onLogout={handleLogout} />
		</AppBar>
	)
}

export default Navbar
