import { useEffect, useState } from "react";
import { getProducts } from "../api/products";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const latest = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const handleShare = (p) => {
    const url = `https://www.ma-quality-products.online/product/${p._id}`;

    const message = `Check this watch 👇

${p.name}
₹${p.price}

${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`
    );
  };

  return (
    <div className="space-y-6">

      {/* 🔥 WELCOME */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your store & share products quickly.
        </p>
      </div>

      {/* 📊 STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Products</p>
          <h2 className="text-3xl font-bold">
            {products.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Latest Added</p>
          <h2 className="text-xl font-semibold">
            {products[0]?.name || "—"}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Selling Mode</p>
          <h2 className="text-green-600 font-semibold">
            WhatsApp Orders
          </h2>
        </div>
      </div>

      {/* 🚀 QUICK ACTIONS */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-semibold mb-3">
          Quick Actions
        </h3>

        <div className="flex gap-3 flex-wrap">
          <a
            href="/dashboard/products"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Manage Products
          </a>

          <a
            href="/"
            target="_blank"
            className="bg-black text-white px-4 py-2 rounded"
          >
            View Store
          </a>
        </div>
      </div>

      {/* 🔥 QUICK SHARE (VERY POWERFUL) */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-semibold mb-4">
          Quick Share Products
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {latest.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg p-3"
            >
              <img
                src={p.images?.[0]}
                className="h-32 w-full object-cover rounded"
              />

              <h4 className="mt-2 text-sm font-medium">
                {p.name}
              </h4>

              <p className="text-yellow-600 font-semibold">
                ₹{p.price}
              </p>

              <button
                onClick={() => handleShare(p)}
                className="mt-2 w-full bg-green-500 text-white py-1 rounded"
              >
                Share on WhatsApp
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🆕 RECENT PRODUCTS */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-semibold mb-4">
          Recently Added
        </h3>

        <div className="space-y-3">
          {products.slice(0, 5).map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between border-b pb-2"
            >
              <span>{p.name}</span>
              <span className="text-gray-500">
                ₹{p.price}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}