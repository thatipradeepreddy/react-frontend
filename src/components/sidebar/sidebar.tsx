import { Link } from "react-router-dom"
import styles from "./sidebar.module.css"

export default function Sidebar() {
	return (
		<aside className={styles.sidebar}>
			<Link to='/dashboard'>Dashboard</Link>
		</aside>
	)
}
