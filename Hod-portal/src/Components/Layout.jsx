import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";


export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Frontend-only logout behavior.
    // Clear any local auth state if needed and redirect to login.
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
