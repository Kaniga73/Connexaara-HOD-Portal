import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faCalendarDays,
  faUser,
  faRightFromBracket,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import loginlogo from "../assets/loginlogo.png";
import "../Styles/Sidebar.css";

const navItems = [
  { label: "Home", path: "/home", icon: faHome },
  { label: "Staffs", path: "/staffs", icon: faUsers },
  { label: "ODs", path: "/ods", icon: faCalendarDays },
  { label: "Batches", path: "/batches", icon: faCalendarDays },
  { label: "Profile", path: "/profile", icon: faUser },
];

export default function Sidebar({ onLogout, onCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onCollapse) onCollapse(next);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-area">
          <img src={loginlogo} alt="Connexara Logo" className="sidebar-logo-img" />
          {!collapsed && <span className="sidebar-brand">Connexara</span>}
        </div>

        <button
          className="sidebar-collapse-btn"
          onClick={toggle}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {!collapsed && <p className="sidebar-section-label">MENU</p>}

        {navItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`sidebar-item ${isActive(item.path) ? "sidebar-item-active" : ""}`}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            <span className="sidebar-item-icon">
              <FontAwesomeIcon icon={item.icon} />
            </span>
            {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <button className="sidebar-logout-btn" onClick={onLogout} title="Logout">
        <FontAwesomeIcon icon={faRightFromBracket} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
