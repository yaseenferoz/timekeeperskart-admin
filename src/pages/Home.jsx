export default function Home() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-md">
        <p className="text-gray-500">Products</p>
        <h2 className="text-2xl font-semibold">7</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow hover:shadow-md">
        <p className="text-gray-500">Revenue</p>
        <h2 className="text-2xl font-semibold">₹45,000</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow hover:shadow-md">
        <p className="text-gray-500">Orders</p>
        <h2 className="text-2xl font-semibold">12</h2>
      </div>
    </div>
  );
}