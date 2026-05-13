import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/login";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Staffs from "./Pages/Staffs";
import Od from "./Pages/Od";
import Batches from "./Pages/Batches";
import Events from "./Pages/Event";
import Profile from "./Pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/staffs" element={<Staffs />} />
          <Route path="/ods" element={<Od />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
