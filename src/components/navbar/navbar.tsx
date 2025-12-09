import { AppBar, Toolbar, IconButton, Avatar, Typography, Box, Menu, MenuItem, Badge, Divider } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface NavbarProps {
	toggleSidebar: () => void
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const navigate = useNavigate()

	// const userEmail = localStorage.getItem("userEmail") || "Unknown User"
	const userRole = localStorage.getItem("userRole")
	const userDetails = localStorage.getItem("userData")
	const userName = userDetails ? JSON.parse(userDetails).name : "User"

	const getUserNameFull = (name: string) => {
		if (!name || name.trim().length === 0) return "Unknown User"

		// Convert to lowercase and capitalize each word
		const formattedName = name
			.trim()
			.toLowerCase()
			.split(/\s+/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ")

		// Apply length restriction (15 characters)
		return formattedName.length > 15 ? `${formattedName.slice(0, 15)}...` : formattedName
	}

	const getUserName = (name: string) => {
		if (!name || name.trim().length === 0) return "Unknown User"

		const firstName = name
			.trim()
			.split(/\s+/)[0]
			.toLowerCase()
			.replace(/^\w/, c => c.toUpperCase())

		return firstName
	}

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
	}

	const handleLogout = () => {
		setAnchorEl(null)

		localStorage.clear()
		// sessionStorage.clear();
		// Cookie.remove("jwt_token");
		navigate("/", { replace: true })
	}

	const getUserRole = (userRole: string | null) => {
		if (!userRole) return "Unknown Role"
	}

	const user = JSON.parse(localStorage.getItem("userProfile") || "{}")

	return (
		<AppBar position='fixed' sx={{ bgcolor: "white", boxShadow: "none", zIndex: 1200 }}>
			<Toolbar sx={{ justifyContent: "space-between", px: 3, minHeight: "55px" }}>
				{/* Left side */}
				<Box display='flex' alignItems='center' gap={2}>
					<IconButton onClick={toggleSidebar}>
						<MenuIcon sx={{ color: "#000" }} />
					</IconButton>

					Create Your Team
				</Box>

				{/* Right side */}
				<Box display='flex' alignItems='center' gap={2}>
					<IconButton>
						<SearchIcon sx={{ color: "#0D0B52" }} />
					</IconButton>

					{/* Profile Section */}
					<Box display='flex' alignItems='center' gap={1} sx={{ cursor: "pointer" }} onClick={handleProfileMenuOpen}>
						{/* Avatar with green dot */}
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
							<Avatar alt='UserProfile' sx={{ width: 32, height: 32 }} src='/images/profileimage.png'></Avatar>
						</Badge>

						<Box textAlign='left'>
							<Typography fontSize={14} color='#0D0B52'>
								{getUserNameFull(userName)}
							</Typography>
							<Typography fontSize={12} color='text.secondary'>
								{getUserRole(userRole)}
							</Typography>
						</Box>
					</Box>

					{/* Dropdown icon */}
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

				{/* Profile Menu */}
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
					<MenuItem>Profile</MenuItem>
					<Divider />
					<MenuItem onClick={handleLogout}>Logout</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	)
}

export default Navbar
