import React, { useEffect, useState, type FormEvent } from "react"
import { fetchPlayers, createPlayer, createPlayerImageUploadUrl, uploadPlayerImageToS3, deletePlayer } from "../../api/player"
import type { PlayerRole, BattingStyle, BowlingStyle, CreatePlayerPayload, PlayerResponse } from "../../types/player.types"
import styles from "./player.module.css"

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

const PlayersPage: React.FC = () => {
	const [players, setPlayers] = useState<PlayerResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [formData, setFormData] = useState<CreatePlayerPayload>(initialForm)
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [submitting, setSubmitting] = useState(false)

	const loadPlayers = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await fetchPlayers()
			setPlayers(data)
		} catch (err: any) {
			setError(err.message || "Failed to load players")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadPlayers()
	}, [])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const target = e.target as HTMLInputElement | HTMLSelectElement
		const { name, value, type } = target
		const checked = (target as HTMLInputElement).checked
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
		const file = e.target.files?.[0] || null
		setImageFile(file)
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		try {
			setSubmitting(true)
			setError(null)

			const created = await createPlayer(formData)

			if (imageFile) {
				const { uploadUrl } = await createPlayerImageUploadUrl(created.id, imageFile.name, imageFile.type)

				await uploadPlayerImageToS3(uploadUrl, imageFile)
			}

			await loadPlayers()

			setFormData(initialForm)
			setImageFile(null)
		} catch (err: any) {
			console.error(err)
			setError(err.message || "Failed to create player")
		} finally {
			setSubmitting(false)
		}
	}

	const handleDelete = async (id: string) => {
		if (!window.confirm("Delete this player?")) return
		try {
			await deletePlayer(id)
			await loadPlayers()
		} catch (err: any) {
			setError(err.message || "Failed to delete player")
		}
	}

	return (
		<div className={styles.page}>
			<h1 className={styles.pageTitle}>Cricket Players</h1>

			<section className={styles.sectionCard}>
				<h2 className={styles.sectionTitle}>Add Player</h2>

				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.rowTwo}>
						<label className={styles.fieldLabel}>
							Name
							<input name='name' value={formData.name} onChange={handleChange} required className={styles.input} />
						</label>

						<label className={styles.fieldLabel}>
							Village
							<input
								name='village'
								value={formData.village}
								onChange={handleChange}
								required
								className={styles.input}
							/>
						</label>
					</div>

					<div className={styles.rowThree}>
						<label className={styles.fieldLabel}>
							Role
							<select name='role' value={formData.role} onChange={handleChange} className={styles.select}>
								{roles.map(r => (
									<option key={r} value={r}>
										{r}
									</option>
								))}
							</select>
						</label>

						<label className={styles.fieldLabel}>
							Batting Style
							<select
								name='battingStyle'
								value={formData.battingStyle}
								onChange={handleChange}
								className={styles.select}
							>
								{battingStyles.map(b => (
									<option key={b} value={b}>
										{b}
									</option>
								))}
							</select>
						</label>

						<label className={styles.fieldLabel}>
							Bowling Style
							<select
								name='bowlingStyle'
								value={formData.bowlingStyle}
								onChange={handleChange}
								className={styles.select}
							>
								{bowlingStyles.map(b => (
									<option key={b} value={b}>
										{b}
									</option>
								))}
							</select>
						</label>
					</div>

					<div className={styles.rowFour}>
						<label className={styles.fieldLabel}>
							Age
							<input
								name='age'
								type='number'
								value={formData.age ?? ""}
								onChange={handleNumberChange}
								className={styles.input}
							/>
						</label>

						<label className={styles.fieldLabel}>
							Matches
							<input
								name='matches'
								type='number'
								value={formData.matches ?? ""}
								onChange={handleNumberChange}
								className={styles.input}
							/>
						</label>

						<label className={styles.fieldLabel}>
							Runs
							<input
								name='runs'
								type='number'
								value={formData.runs ?? ""}
								onChange={handleNumberChange}
								className={styles.input}
							/>
						</label>

						<label className={styles.fieldLabel}>
							Wickets
							<input
								name='wickets'
								type='number'
								value={formData.wickets ?? ""}
								onChange={handleNumberChange}
								className={styles.input}
							/>
						</label>
					</div>

					<div className={styles.imageActiveRow}>
						<label className={`${styles.fieldLabel} ${styles.fileLabel}`}>
							Profile Image
							<input type='file' accept='image/*' onChange={handleImageChange} />
						</label>

						<label className={styles.checkboxLabel}>
							<input type='checkbox' name='isActive' checked={!!formData.isActive} onChange={handleChange} />
							Active
						</label>
					</div>

					<button type='submit' disabled={submitting} className={styles.primaryButton}>
						{submitting ? "Saving..." : "Create Player"}
					</button>

					{error && <p className={styles.errorText}>{error}</p>}
				</form>
			</section>

			<section>
				<h2 className={styles.playersTitle}>Players</h2>
				{loading && <p>Loading...</p>}
				{!loading && players.length === 0 && <p>No players yet.</p>}

				<div className={styles.playersGrid}>
					{players.map(p => (
						<div key={p.id} className={styles.playerCard}>
							{p.imageUrl && <img src={p.imageUrl} alt={p.name} className={styles.playerImage} />}

							<div className={styles.playerMeta}>
								<strong>{p.name}</strong> ({p.role})
							</div>
							<div className={styles.playerMeta}>Village: {p.village}</div>
							{p.runs !== undefined && <div className={styles.playerMeta}>Runs: {p.runs}</div>}
							{p.wickets !== undefined && <div className={styles.playerMeta}>Wkts: {p.wickets}</div>}
							<div className={styles.playerMeta}>Active: {p.isActive ? "Yes" : "No"}</div>

							<button onClick={() => handleDelete(p.id)} className={styles.deleteButton}>
								Delete
							</button>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}

export default PlayersPage
