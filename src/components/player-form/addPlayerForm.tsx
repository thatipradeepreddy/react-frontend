import React, { type FormEvent } from "react"
import type { PlayerRole, BattingStyle, BowlingStyle, CreatePlayerPayload } from "../../types/player.types"
import styles from "./player.module.css"

type Props = {
	formData: CreatePlayerPayload
	roles: PlayerRole[]
	battingStyles: BattingStyle[]
	bowlingStyles: BowlingStyle[]
	submitting: boolean
	error: string | null
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
	onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onSubmit: (e: FormEvent) => void
}

const AddPlayerForm: React.FC<Props> = ({
	formData,
	roles,
	battingStyles,
	bowlingStyles,
	submitting,
	error,
	onChange,
	onNumberChange,
	onImageChange,
	onSubmit
}) => {
	return (
		<section className={styles.sectionCard}>
			<div className={styles.sectionHeader}>
				<h2 className={styles.sectionTitle}>Add Player</h2>
				<p className={styles.sectionSubtitle}>Fill in the details to create a new player</p>
			</div>

			<form onSubmit={onSubmit} className={styles.form}>
				<div className={styles.rowTwo}>
					<label className={styles.fieldLabel}>
						Name
						<input name='name' value={formData.name} onChange={onChange} required className={styles.input} />
					</label>

					<label className={styles.fieldLabel}>
						Village
						<input name='village' value={formData.village} onChange={onChange} required className={styles.input} />
					</label>
				</div>

				<div className={styles.rowThree}>
					<label className={styles.fieldLabel}>
						Role
						<select name='role' value={formData.role} onChange={onChange} className={styles.select}>
							{roles.map(r => (
								<option key={r} value={r}>
									{r}
								</option>
							))}
						</select>
					</label>

					<label className={styles.fieldLabel}>
						Batting Style
						<select name='battingStyle' value={formData.battingStyle} onChange={onChange} className={styles.select}>
							{battingStyles.map(b => (
								<option key={b} value={b}>
									{b}
								</option>
							))}
						</select>
					</label>

					<label className={styles.fieldLabel}>
						Bowling Style
						<select name='bowlingStyle' value={formData.bowlingStyle} onChange={onChange} className={styles.select}>
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
							onChange={onNumberChange}
							className={styles.input}
						/>
					</label>

					<label className={styles.fieldLabel}>
						Matches
						<input
							name='matches'
							type='number'
							value={formData.matches ?? ""}
							onChange={onNumberChange}
							className={styles.input}
						/>
					</label>

					<label className={styles.fieldLabel}>
						Runs
						<input
							name='runs'
							type='number'
							value={formData.runs ?? ""}
							onChange={onNumberChange}
							className={styles.input}
						/>
					</label>

					<label className={styles.fieldLabel}>
						Wickets
						<input
							name='wickets'
							type='number'
							value={formData.wickets ?? ""}
							onChange={onNumberChange}
							className={styles.input}
						/>
					</label>
				</div>

				<div className={styles.imageActiveRow}>
					<label className={`${styles.fieldLabel} ${styles.fileLabel}`}>
						Profile Image
						<input type='file' accept='image/*' onChange={onImageChange} className={styles.fileInput} />
					</label>

					<label className={styles.checkboxLabel}>
						<input type='checkbox' name='isActive' checked={!!formData.isActive} onChange={onChange} />
						<span>Active</span>
					</label>
				</div>

				<button type='submit' disabled={submitting} className={styles.primaryButton}>
					{submitting ? "Saving..." : "Create Player"}
				</button>

				{error && <p className={styles.errorText}>{error}</p>}
			</form>
		</section>
	)
}

export default AddPlayerForm
