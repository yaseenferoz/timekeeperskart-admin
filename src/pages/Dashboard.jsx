import Sidebar from "../components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={layout}>
      <Sidebar />

      <div style={main}>
        <div style={header}>
          <span>Admin Panel</span>

          <button style={logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div style={content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const layout = {
  display: "flex",
  height: "100vh",
};

const main = {
  flex: 1,
  background: "#f3f4f6",
  display: "flex",
  flexDirection: "column",
};

const header = {
  height: "60px",
  background: "#fff",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  fontWeight: "600",
};

const logoutBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const content = {
  padding: "20px",
};