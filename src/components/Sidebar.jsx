import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
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
    <>
      {/* OVERLAY (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-[#0f172a] text-white z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-gray-700 text-lg font-bold">
          MA Quality
        </div>

        {/* MENU */}
        <div className="p-4 space-y-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;

            return (
              <div
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                className={`px-4 py-2 rounded-lg cursor-pointer transition ${
                  active
                    ? "bg-yellow-400 text-black font-semibold"
                    : "hover:bg-gray-800"
                }`}
              >
                {item.name}
              </div>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}