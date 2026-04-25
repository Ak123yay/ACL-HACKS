import { useAuth } from "../context/AuthContext"

export default function TestAuth() {
  const { user, profile } = useAuth()

  console.log("AUTH USER:", user)
  console.log("PROFILE:", profile)

  return (
    <div style={{ padding: "20px" }}>
      <h2>Auth Test</h2>

      <p>User: {user ? "Logged in" : "NULL (not logged in)"}</p>
      <p>Email: {user?.email || "none"}</p>
    </div>
  )
}