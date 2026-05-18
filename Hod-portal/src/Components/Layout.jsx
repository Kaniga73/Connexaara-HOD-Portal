import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../Styles/Layout.css";
import { logout } from "../api/authService";

export default function Layout() {
  const handleLogout = () => {
    logout(); // clears accessToken + user from localStorage
    window.location.href = "/"; // hard redirect — clears all component state
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
