export default function Dashboard() {
	const user = JSON.parse(localStorage.getItem("userProfile") || "{}")

	return (
		<div>
			<h1>Welcome, {user?.name}</h1>
			<p>Your email: {user?.email}</p>
		</div>
	)
}
