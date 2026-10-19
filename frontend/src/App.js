import { BrowserRouter, Routes, Route } from "react-router-dom";
import Assignment from "./pages/Assignment";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Inventory from "./pages/Inventory";
import Tickets from "./pages/Tickets";
import Profile from "./pages/Profile";

import Sidebar from "./components/SideBar";
import Navbar from "./components/Navbar";
import Chatbot from "./Chatbot";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <div className="main-layout">
                <Sidebar />
                <div className="page-content">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/assignments" element={<Assignment />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                  </Routes>
                </div>
              </div>
            </>
          }
        />
 </Routes>
</BrowserRouter>
  );
}
export default App;