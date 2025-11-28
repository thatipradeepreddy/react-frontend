import Navbar from "../components/navbar/navbar"
import Sidebar from "../components/sidebar/sidebar"
import styles from "./appLayout.module.css"
import { Outlet } from "react-router-dom"

export default function AppLayout() {
	return (
		<div className={styles.layout}>
			<Navbar />
			<div className={styles.contentWrapper}>
				<Sidebar />
				<main className={styles.mainContent}>
					<Outlet />
				</main>
			</div>
		</div>
	)
}
