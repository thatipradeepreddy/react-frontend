import React, { type FormEvent, useState } from "react"
import type { PlayerRole, BattingStyle, BowlingStyle, CreatePlayerPayload, PlayerResponse } from "../../types/player.types"
import styles from "./player.module.css"
import Drawer from "@mui/material/Drawer"
import { Box, CircularProgress } from "@mui/material"
import PlayerStatsEditor from "../../components/player/playerStatEditor"
import AddPlayerForm from "../../components/player-form/addPlayerForm"
import PlayersList from "../../components/player-form/playerList"
import { useGetPlayersQuery, useCreatePlayerMutation, useDeletePlayerMutation } from "../../services/player.api"
import { createPlayerImageUploadUrl, uploadPlayerImageToS3 } from "../../api/player"

const roles: PlayerRole[] = ["BATSMAN", "BOWLER", "ALL_ROUNDER", "WICKET_KEEPER"]
const battingStyles: BattingStyle[] = ["RIGHT_HAND", "LEFT_HAND", "NONE"]
const bowlingStyles: BowlingStyle[] = [
	"RIGHT_ARM_FAST",
	"RIGHT_ARM_MEDIUM",
	"RIGHT_ARM_OFF_SPIN",
	"RIGHT_ARM_LEG_SPIN",
	"LEFT_ARM_FAST",
	"LEFT_ARM_MEDIUM",
	"LEFT_ARM_ORTHODOX",
	"LEFT_ARM_WRIST_SPIN",
	"NONE"
]

const initialForm: CreatePlayerPayload = {
	name: "",
	village: "",
	role: "BATSMAN",
	battingStyle: "RIGHT_HAND",
	bowlingStyle: "NONE",
	isActive: true
}

export function PlayersPage() {
	const { data: players = [], isLoading, isFetching, isError, error } = useGetPlayersQuery()
	const [createPlayerApi, { isLoading: isCreating }] = useCreatePlayerMutation()
	const [deletePlayerApi, { isLoading: isDeleting }] = useDeletePlayerMutation()

	const [formData, setFormData] = useState<CreatePlayerPayload>(initialForm)
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [selectedPlayer, setSelectedPlayer] = useState<PlayerResponse | null>(null)
	const [drawerOpen, setDrawerOpen] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type, checked } = e.target as HTMLInputElement
		setFormData(prev => ({
			...prev,
			[name]: type === "checkbox" ? checked : value
		}))
	}

	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value === "" ? undefined : Number(value)
		}))
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setImageFile(e.target.files?.[0] || null)
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		const player = await createPlayerApi(formData).unwrap()

		if (imageFile) {
			const { uploadUrl } = await createPlayerImageUploadUrl(player.id, imageFile.name, imageFile.type)

			await uploadPlayerImageToS3(uploadUrl, imageFile)
		}

		setFormData(initialForm)
		setImageFile(null)
	}

	const handleDelete = async (id: string) => {
		if (!window.confirm("Delete this player?")) return
		await deletePlayerApi(id)
	}

	const openDrawer = (player: PlayerResponse) => {
		setSelectedPlayer(player)
		setDrawerOpen(true)
	}

	const closeDrawer = () => {
		setDrawerOpen(false)
		setSelectedPlayer(null)
	}

	const renderHeader = () => (
		<div className={styles.pageHeader}>
			<h1 className={styles.pageTitle}>Cricket Players</h1>
			<p className={styles.pageSubtitle}>Total Players: {players.length}</p>
		</div>
	)

	const renderAddPlayerForm = () => (
		<AddPlayerForm
			formData={formData}
			roles={roles}
			battingStyles={battingStyles}
			bowlingStyles={bowlingStyles}
			submitting={isCreating}
			error={null}
			onChange={handleChange}
			onNumberChange={handleNumberChange}
			onImageChange={handleImageChange}
			onSubmit={handleSubmit}
		/>
	)

	const renderPlayersList = () => (
		<PlayersList players={players} loading={isLoading} onOpen={openDrawer} onDelete={handleDelete} />
	)

	const renderDrawer = () => (
		<Drawer
			anchor='right'
			open={drawerOpen}
			onClose={closeDrawer}
			PaperProps={{
				sx: { width: 420, p: 3, backgroundColor: "#f9fafb" }
			}}
		>
			{selectedPlayer && (
				<PlayerStatsEditor
					player={selectedPlayer}
					onClose={closeDrawer}
					onUpdated={function (): void {
						throw new Error("Function not implemented.")
					}}
				/>
			)}
		</Drawer>
	)

	return (
		<>
			{(isLoading || isFetching || isCreating || isDeleting) && (
				<Box
					sx={{
						position: "fixed",
						inset: 0,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "rgba(255,255,255,0.6)",
						zIndex: 1300
					}}
				>
					<CircularProgress />
				</Box>
			)}

			<div className={styles.page}>
				{renderHeader()}
				{isError && <p className={styles.errorText}>{(error as Error)?.message || "Failed to load players"}</p>}
				{renderAddPlayerForm()}
				{renderPlayersList()}
				{renderDrawer()}
			</div>
		</>
	)
}
