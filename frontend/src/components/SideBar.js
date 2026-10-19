import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Asset Management</h2>
      <nav>
        <Link className="sidebar-link"  to="/dashboard">Dashboard</Link>
        <br/>
        <Link  className="sidebar-link" to="/assets">Assets</Link>
        <br />
        <Link className="sidebar-link"  to="/inventory">Inventory</Link>
        <br/>
        <Link className="sidebar-link"  to="/tickets">Tickets</Link>
        <br/>
        <Link className="sidebar-link" to="/assignments">Assignments</Link>
   <br />
        <Link className="sidebar-link"  to="/profile">Profile</Link>
        <br/>
        <Link className="sidebar-link" to="/chatbot">AI Chatbot</Link>

      </nav>
    </div>
  );
}
export default Sidebar