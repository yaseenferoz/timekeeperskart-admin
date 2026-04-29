import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../api/products";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false); // ✅ NEW

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

  // DELETE
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(confirmId);
      toast.success("Product deleted 🗑️");
      setConfirmId(null);
      load();
    } catch {
      toast.error("Delete failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ADD
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      images.forEach((img) => formData.append("images", img));

      await createProduct(formData);

      toast.success("Product added ✅");

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
    } catch {
      toast.error("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(editProduct).forEach((key) => {
        if (editProduct[key]) formData.append(key, editProduct[key]);
      });

      await updateProduct(editProduct._id, formData);

      toast.success("Updated successfully ✏️");

      setEditProduct(null);
      load();
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={p.images?.[0]}
              className="h-40 w-full object-cover rounded-lg"
            />

            <h4 className="mt-3 font-medium">{p.name}</h4>
            <p className="text-blue-600 font-semibold">₹{p.price}</p>

            <div className="flex justify-between items-center mt-4">

              {/* VIEW */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/dashboard/products/${p._id}`);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
              >
                View
              </button>

              {/* ICONS */}
              <div className="flex gap-2">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditProduct(p);
                  }}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200"
                >
                  <FaEdit className="text-blue-600 text-sm" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmId(p._id);
                  }}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                >
                  <FaTrash className="text-red-600 text-sm" />
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow text-center">
            <h3 className="text-lg font-semibold mb-2">
              Delete Product
            </h3>

            <p className="text-gray-500 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">

            <h3 className="text-lg font-semibold mb-4">
              Edit Product
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <input value={editProduct.name} onChange={(e)=>setEditProduct({...editProduct,name:e.target.value})} className="border p-2 rounded" />
              <input value={editProduct.price} onChange={(e)=>setEditProduct({...editProduct,price:e.target.value})} className="border p-2 rounded" />
              <input value={editProduct.brand} onChange={(e)=>setEditProduct({...editProduct,brand:e.target.value})} className="border p-2 rounded" />
              <input value={editProduct.gender} onChange={(e)=>setEditProduct({...editProduct,gender:e.target.value})} className="border p-2 rounded" />

              <textarea value={editProduct.description} onChange={(e)=>setEditProduct({...editProduct,description:e.target.value})} className="border p-2 rounded col-span-1 sm:col-span-2" />

            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={()=>setEditProduct(null)} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancel</button>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">

            <h3 className="text-lg font-semibold mb-4">
              Add Product
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 rounded" />
              <input name="price" placeholder="Price" onChange={handleChange} className="border p-2 rounded" />

              <input name="brand" placeholder="Brand" onChange={handleChange} className="border p-2 rounded" />
              <input name="gender" placeholder="Gender" onChange={handleChange} className="border p-2 rounded" />

              <input name="movement" placeholder="Movement" onChange={handleChange} className="border p-2 rounded" />
              <input name="style" placeholder="Style" onChange={handleChange} className="border p-2 rounded" />

              <textarea name="description" placeholder="Description" onChange={handleChange} className="border p-2 rounded col-span-1 sm:col-span-2" />

            </div>

            <input type="file" multiple className="mt-4" onChange={(e)=>setImages([...e.target.files])} />

            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancel</button>

              <button
                onClick={handleAdd}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {loading ? "Uploading..." : "Add Product"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}