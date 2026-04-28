import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Products", path: "/dashboard/products" },
  ];

  return (
    <div style={sidebar}>
      <h2 style={{ marginBottom: "30px" }}>Timekeepers</h2>

      {menu.map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            ...menuItem,
            background:
              location.pathname === item.path ? "#1e293b" : "transparent",
          }}
        >
          {item.name}
        </div>
      ))}

      <div style={logout} onClick={handleLogout}>
        Logout
      </div>
    </div>
  );
}

const sidebar = {
  width: "240px",
  height: "100vh",
  background: "#0f172a",
  color: "#fff",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
};

const menuItem = {
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "10px",
};

const logout = {
  marginTop: "auto",
  padding: "12px",
  background: "#dc2626",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "center",
};