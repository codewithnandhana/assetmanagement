function Profile() {
  const user = {
    username: "admin",
    first_name: "Nandhana",
    last_name: "User",
    email: "admin@gmail.com",
    role: "Admin",
  }

  return (
    <div className="page-card">
      <h1 className="profile-heading">Profile</h1>
  <div className="profile-info">
      <p>Username: {user.username}</p>
      <p>First Name: {user.first_name}</p>
      <p>Last Name: {user.last_name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
    </div>
  )
}
export default Profile