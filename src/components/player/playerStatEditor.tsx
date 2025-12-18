import { useState } from "react"
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
					type='number'
					placeholder='Matches'
					className={styles.input}
					onChange={e => setBatting((b: any) => ({ ...b, matches: Number(e.target.value) }))}
				/>
				<input
					type='number'
					placeholder='Innings'
					className={styles.input}
					onChange={e => setBatting((b: any) => ({ ...b, innings: Number(e.target.value) }))}
				/>
			</div>

			<div className={styles.rowTwo}>
				<input
					type='number'
					placeholder='Runs'
					className={styles.input}
					onChange={e => setBatting((b: any) => ({ ...b, runs: Number(e.target.value) }))}
				/>
				<input
					type='number'
					placeholder='Highest Score'
					className={styles.input}
					onChange={e => setBatting((b: any) => ({ ...b, highest: Number(e.target.value) }))}
				/>
			</div>

			<div className={styles.rowTwo}>
				<input
					type='number'
					placeholder='Average'
					className={styles.input}
					onChange={e => setBatting((b: any) => ({ ...b, average: Number(e.target.value) }))}
				/>
				<input
					type='number'
					placeholder='Strike Rate'
					className={styles.input}
					onChange={e => setBatting((b: any) => ({ ...b, strikeRate: Number(e.target.value) }))}
				/>
			</div>

			<div className={styles.rowTwo}>
				<input
					type='number'
					placeholder='50s'
					className={styles.input}
					onChange={e => setBatting((b: any) => ({ ...b, fifties: Number(e.target.value) }))}
				/>
				<input
					type='number'
					placeholder='100s'
					className={styles.input}
					onChange={e => setBatting((b: any) => ({ ...b, hundreds: Number(e.target.value) }))}
				/>
			</div>

			<hr className={styles.divider} />

			<h3 className={styles.subTitle}>Bowling</h3>

			<div className={styles.rowTwo}>
				<input
					type='number'
					placeholder='Matches'
					className={styles.input}
					onChange={e => setBowling((b: any) => ({ ...b, matches: Number(e.target.value) }))}
				/>
				<input
					type='number'
					placeholder='Innings'
					className={styles.input}
					onChange={e => setBowling((b: any) => ({ ...b, innings: Number(e.target.value) }))}
				/>
			</div>

			<div className={styles.rowTwo}>
				<input
					type='number'
					placeholder='Wickets'
					className={styles.input}
					onChange={e => setBowling((b: any) => ({ ...b, wickets: Number(e.target.value) }))}
				/>
				<input
					type='number'
					placeholder='Best Figures (e.g. 5/32)'
					className={styles.input}
					onChange={e => setBowling((b: any) => ({ ...b, bestFigures: e.target.value }))}
				/>
			</div>

			<div className={styles.rowTwo}>
				<input
					type='number'
					placeholder='Average'
					className={styles.input}
					onChange={e => setBowling((b: any) => ({ ...b, average: Number(e.target.value) }))}
				/>
				<input
					type='number'
					placeholder='Economy'
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
