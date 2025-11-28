import styles from "./navbar.module.css"

export default function Navbar() {
	const user = JSON.parse(localStorage.getItem("userProfile") || "{}")

	return (
		<header className={styles.navbar}>
			<h2>My App</h2>

			<div className={styles.profile}>
				<span>{user?.name}</span>
				{user?.picture && <img src={user.picture} alt='avatar' />}
			</div>
		</header>
	)
}
