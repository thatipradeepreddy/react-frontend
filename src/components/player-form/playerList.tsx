import React from "react"
import type { PlayerResponse } from "../../types/player.types"
import styles from "./player.module.css"

type Props = {
	players: PlayerResponse[]
	loading: boolean
	onOpen: (player: PlayerResponse) => void
	onDelete: (id: string) => void
}

const PlayersList: React.FC<Props> = ({ players, loading, onOpen, onDelete }) => {
	return (
		<section className={styles.sectionCard}>
			<div className={styles.sectionHeader}>
				<h2 className={styles.playersTitle}>Players</h2>
				<p className={styles.sectionSubtitle}>Overview of all players in your squad</p>
			</div>

			{loading && <p className={styles.helperText}>Loading...</p>}

			{!loading && players.length === 0 && <p className={styles.helperText}>No players yet.</p>}

			<div className={styles.playersGrid}>
				{players.map(p => (
					<div key={p.id} className={styles.playerCard} onClick={() => onOpen(p)} style={{ cursor: "pointer" }}>
						{p.imageUrl && <img src={p.imageUrl} alt={p.name} className={styles.playerImage} />}

						<div className={styles.playerHeader}>
							<div className={styles.playerNameRole}>
								<div className={styles.playerName}>{p.name}</div>
								<span className={styles.rolePill}>{p.role}</span>
							</div>
							<div className={styles.playerMetaMuted}>Village: {p.village}</div>
						</div>

						<div className={styles.playerStatsRow}>
							{p.runs !== undefined && (
								<div className={styles.statItem}>
									<span className={styles.statLabel}>Runs</span>
									<span className={styles.statValue}>{p.runs}</span>
								</div>
							)}

							{p.wickets !== undefined && (
								<div className={styles.statItem}>
									<span className={styles.statLabel}>Wickets</span>
									<span className={styles.statValue}>{p.wickets}</span>
								</div>
							)}

							<div className={styles.statItem}>
								<span className={styles.statLabel}>Active</span>
								<span className={p.isActive ? styles.activeTag : styles.inactiveTag}>
									{p.isActive ? "Yes" : "No"}
								</span>
							</div>
						</div>

						<button
							onClick={e => {
								e.stopPropagation()
								onDelete(p.id)
							}}
							className={styles.deleteButton}
						>
							Delete
						</button>
					</div>
				))}
			</div>
		</section>
	)
}

export default PlayersList
