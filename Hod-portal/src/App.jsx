import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/login";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Staffs from "./Pages/Staffs";
import Od from "./Pages/Od";
import Batches from "./Pages/Batches";
import Events from "./Pages/Event";
import Profile from "./Pages/Profile";
import Hackathon from "./Pages/Hackathon";

/**
 * ProtectedRoute — redirects to "/" if no accessToken is in localStorage.
 * Wraps any route that requires authentication.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const userRaw = localStorage.getItem("user");
  let user = null;

  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch (e) {
    // ignore parse error
  }

  // Check token and role
  if (!token || !user || user.role !== "HOD") {
    // If they have invalid credentials, clear them out
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected — all nested routes require a valid token */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home"      element={<Home />} />
          <Route path="/staffs"    element={<Staffs />} />
          <Route path="/ods"       element={<Od />} />
          <Route path="/batches"   element={<Batches />} />
          <Route path="/hackathon" element={<Hackathon />} />
          <Route path="/events"    element={<Events />} />
          <Route path="/profile"   element={<Profile />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
