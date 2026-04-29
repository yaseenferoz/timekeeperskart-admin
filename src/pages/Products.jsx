import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../api/products";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

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

  const navigate = useNavigate();

  const load = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    await deleteProduct(confirmId);
    setConfirmId(null);
    load();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    images.forEach((img) => formData.append("images", img));

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

    load();
  };

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold">Products</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          + Add Product
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white rounded-xl p-3 shadow">
            <img
              src={p.images?.[0]}
              className="h-40 w-full object-cover rounded"
            />
            <h4 className="mt-2">{p.name}</h4>
            <p className="text-blue-600">₹{p.price}</p>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => navigate(`/dashboard/products/${p._id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View
              </button>

              <div className="flex gap-3">
                <FaEdit onClick={() => setEditProduct(p)} />
                <FaTrash onClick={() => setConfirmId(p._id)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-xl p-5 max-h-[90vh] overflow-y-auto">

            <h3 className="text-lg font-semibold mb-4 text-center">
              Add Product
            </h3>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

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
                className="border p-2 rounded md:col-span-2"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="mt-4">
              <label className="border-2 border-dashed p-4 w-full text-center rounded cursor-pointer block">
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setImages((prev) => [...prev, ...files]);
                  }}
                />
              </label>

              {/* PREVIEW */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img
                        src={URL.createObjectURL(img)}
                        className="w-full h-full object-cover rounded"
                      />

                      <button
                        onClick={() =>
                          setImages(images.filter((_, i) => i !== index))
                        }
                        className="absolute top-0 right-0 bg-black text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col md:flex-row gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Add Product
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}