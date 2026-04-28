import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../api/products";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    gender: "",
    movement: "",
    style: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    await deleteProduct(confirmId);
    setConfirmId(null);
    load();
  };

  // ---------------- EDIT ----------------
  const handleEditChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    Object.keys(editProduct).forEach((key) => {
      if (editProduct[key]) formData.append(key, editProduct[key]);
    });

    await updateProduct(editProduct._id, formData);

    setEditProduct(null);
    load();
  };

  // ---------------- ADD ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    images.forEach((img) => formData.append("images", img));
    if (video) formData.append("video", video);

    await createProduct(formData);

    setShowModal(false);
    setForm({
      name: "",
      brand: "",
      price: "",
      gender: "",
      movement: "",
      style: "",
      description: "",
    });
    setImages([]);
    setVideo(null);

    load();
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-3 group"
          >
            <img
              src={p.images?.[0]}
              alt=""
              className="h-40 w-full object-cover rounded-lg group-hover:scale-105 transition"
            />

            <h4 className="mt-3 font-medium text-gray-800">{p.name}</h4>
            <p className="text-blue-600 font-semibold">₹{p.price}</p>

            {/* ACTION ICONS */}
            <div className="flex justify-end gap-4 mt-3 text-gray-600 text-lg">
              <FaEye
                className="cursor-pointer hover:text-blue-600"
                onClick={() =>
                  navigate(`/dashboard/products/${p._id}`)
                }
              />

              <FaEdit
                className="cursor-pointer hover:text-green-600"
                onClick={() => setEditProduct(p)}
              />

              <FaTrash
                className="cursor-pointer hover:text-red-600"
                onClick={() => setConfirmId(p._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Delete Product
            </h3>
            <p className="text-gray-500 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-xl">
            <h3 className="text-lg font-semibold mb-4">
              Edit Product
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <input name="name" value={editProduct.name} onChange={handleEditChange} className="border p-2 rounded" />
              <input name="price" value={editProduct.price} onChange={handleEditChange} className="border p-2 rounded" />
              <input name="brand" value={editProduct.brand} onChange={handleEditChange} className="border p-2 rounded" />
              <input name="gender" value={editProduct.gender} onChange={handleEditChange} className="border p-2 rounded" />

              <textarea
                name="description"
                value={editProduct.description}
                onChange={handleEditChange}
                className="border p-2 rounded col-span-2"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setEditProduct(null)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>

              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-xl">
            <h3 className="text-lg font-semibold mb-4">
              Add Product
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 rounded" />
              <input name="price" placeholder="Price" onChange={handleChange} className="border p-2 rounded" />
              <input name="brand" placeholder="Brand" onChange={handleChange} className="border p-2 rounded" />
              <input name="gender" placeholder="Gender" onChange={handleChange} className="border p-2 rounded" />
              <input name="movement" placeholder="Movement" onChange={handleChange} className="border p-2 rounded" />
              <input name="style" placeholder="Style" onChange={handleChange} className="border p-2 rounded" />

              <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
                className="border p-2 rounded col-span-2"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <label className="border-2 border-dashed p-3 flex-1 text-center rounded cursor-pointer">
                Upload Images
                <input type="file" hidden multiple onChange={(e)=>setImages([...e.target.files])}/>
              </label>

              <label className="border-2 border-dashed p-3 flex-1 text-center rounded cursor-pointer">
                Upload Video
                <input type="file" hidden onChange={(e)=>setVideo(e.target.files[0])}/>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>

              <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded">
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}