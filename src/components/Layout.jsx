import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaBox } from "react-icons/fa";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-gray-900 p-4 flex flex-col transform transition duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h1 className="text-white text-xl font-semibold mb-6">
          Ma Quality Products
        </h1>

        <nav className="flex flex-col gap-2 flex-1">
          <button
            onClick={() => {
              navigate("/dashboard");
              setOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive("/dashboard")
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <FaHome /> Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/dashboard/products");
              setOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              location.pathname.includes("/products")
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <FaBox /> Products
          </button>
        </nav>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 shadow flex justify-between items-center">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-xl"
          >
            ☰
          </button>

          <h2 className="font-semibold">Admin Panel</h2>
        </header>

        <main className="p-4 overflow-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}