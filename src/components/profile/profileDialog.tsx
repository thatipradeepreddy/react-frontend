import { Dialog, DialogTitle, DialogContent, Avatar, Typography, Box, Divider, Button } from "@mui/material"

interface ProfileDialogProps {
	open: boolean
	onClose: () => void
	user: {
		name?: string
		email?: string
		picture?: string
		phone_number?: string
		birthdate?: string
		gender?: string
	}
	onLogout: () => void
}

export function ProfileDialog({ open, onClose, user, onLogout }: ProfileDialogProps) {
	return (
		<Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
			<DialogTitle>Profile</DialogTitle>

			<DialogContent>
				<Box display='flex' flexDirection='column' alignItems='center' gap={1}>
					<Avatar src={user.picture} sx={{ width: 72, height: 72 }} />
					<Typography variant='h6'>{user.name}</Typography>
					<Typography variant='body2' color='text.secondary'>
						{user.email}
					</Typography>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box display='flex' flexDirection='column' gap={1}>
					<Typography variant='body2'>
						<strong>Phone:</strong> {user.phone_number || "—"}
					</Typography>
					<Typography variant='body2'>
						<strong>DOB:</strong> {user.birthdate || "—"}
					</Typography>
					<Typography variant='body2'>
						<strong>Gender:</strong> {user.gender || "—"}
					</Typography>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Button variant='contained' color='error' fullWidth onClick={onLogout}>
					Logout
				</Button>
			</DialogContent>
		</Dialog>
	)
}
