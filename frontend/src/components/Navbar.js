import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  return (
    <div className="navbar">
      <h2>Smart Asset & Inventory Management System</h2>

      <p>Admin Panel</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;