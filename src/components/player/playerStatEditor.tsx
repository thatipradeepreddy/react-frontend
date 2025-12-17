import React, { useState } from "react"
import styles from "./playerStats.module.css"
import type { MatchFormat, PlayerResponse } from "../../types/player.types"
import { updatePlayerStats } from "../../api/player"

interface Props {
	player: PlayerResponse
	onClose: () => void
	onUpdated: () => void
}

const formats: MatchFormat[] = ["ODI", "TEST", "T20I", "IPL"]

export default function PlayerStatsEditor({ player, onClose, onUpdated }: Props) {
	const [format, setFormat] = useState<MatchFormat>("ODI")
	const [batting, setBatting] = useState<any>({})
	const [bowling, setBowling] = useState<any>({})
	const [saving, setSaving] = useState(false)

	const save = async () => {
		try {
			setSaving(true)
			await updatePlayerStats(player.id, {
				format,
				stats: {
					...(Object.keys(batting).length ? { batting } : {}),
					...(Object.keys(bowling).length ? { bowling } : {})
				}
			})
			onUpdated()
			onClose()
		} finally {
			setSaving(false)
		}
	}

	return (
		<div>
			<h2 className={styles.sectionTitle}>{player.name}</h2>
			<p className={styles.helperText}>
				{player.role} • {player.village}
			</p>

			<label className={styles.fieldLabel}>
				Format
				<select value={format} onChange={e => setFormat(e.target.value as MatchFormat)} className={styles.select}>
					{formats.map(f => (
						<option key={f} value={f}>
							{f}
						</option>
					))}
				</select>
			</label>

			<hr className={styles.divider} />

			<h3 className={styles.subTitle}>Batting</h3>

			<div className={styles.rowTwo}>
				<input
					placeholder='Runs'
					type='number'
					className={styles.input}
					onChange={e => setBatting((b: any) => ({ ...b, runs: Number(e.target.value) }))}
				/>
				<input
					placeholder='Average'
					type='number'
					className={styles.input}
					onChange={e => setBatting((b: any) => ({ ...b, average: Number(e.target.value) }))}
				/>
			</div>

			<h3 className={styles.subTitle}>Bowling</h3>

			<div className={styles.rowTwo}>
				<input
					placeholder='Wickets'
					type='number'
					className={styles.input}
					onChange={e => setBowling((b: any) => ({ ...b, wickets: Number(e.target.value) }))}
				/>
				<input
					placeholder='Economy'
					type='number'
					className={styles.input}
					onChange={e => setBowling((b: any) => ({ ...b, economy: Number(e.target.value) }))}
				/>
			</div>

			<div className={styles.drawerActions}>
				<button onClick={onClose} className={styles.secondaryButton}>
					Cancel
				</button>
				<button onClick={save} disabled={saving} className={styles.primaryButton}>
					{saving ? "Saving..." : "Save Stats"}
				</button>
			</div>
		</div>
	)
}
