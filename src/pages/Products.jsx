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

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    gender: "",
    movement: "",
    style: "",
    description: "",
    category: "", // ✅ NEW (added only)
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
  const { name, value } = e.target;

  if (name === "name") {
    setForm((prev) => ({
      ...prev,
      name: value,
      brand: value, // ✅ auto sync
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleAdd = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

Object.keys(form).forEach((key) => {
  if (form[key] !== "" && form[key] !== undefined) {
    formData.append(key, form[key]);
  }
});

// ✅ IMAGE SIZE VALIDATION (MOBILE FIX)
if (images.length > 0) {
  for (let img of images) {
    if (img.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      setLoading(false);
      return;
    }
  }

  images.forEach((img) => formData.append("images", img));
}

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
        category: "", // reset
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
          <div key={p._id} className="bg-white rounded-xl p-4 shadow">
            <img src={p.images?.[0]} className="h-40 w-full object-cover rounded-lg" />
            <h4 className="mt-3 font-medium">{p.name}</h4>
            <p className="text-blue-600 font-semibold">₹{p.price}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => navigate(`/dashboard/products/${p._id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
              >
                View
              </button>

              <div className="flex gap-2">
                <button onClick={() => setEditProduct(p)} className="p-2 bg-blue-100 rounded-lg">
                  <FaEdit className="text-blue-600 text-sm" />
                </button>

                <button onClick={() => setConfirmId(p._id)} className="p-2 bg-red-100 rounded-lg">
                  <FaTrash className="text-red-600 text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
   {/* ADD MODAL */}
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

    <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">

      <h3 className="text-lg font-semibold mb-4">
        Add Product
      </h3>

      {/* ✅ CATEGORY FIRST */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">Select Category</option>
        <option value="watch">Watch</option>
        <option value="smartwatch">Smartwatch</option>
        <option value="sunglasses">Sunglasses</option>
        <option value="shoes">Shoes</option>
      </select>

      {/* ✅ ONLY SHOW FORM AFTER CATEGORY SELECT */}
      {form.category && (
         <div className="flex flex-col gap-3 md:grid md:grid-cols-2">

          {/* COMMON FIELDS */}
          <input name="name" placeholder="Name" onChange={handleChange} className="border p-3 rounded w-full" />
          <input name="price" placeholder="Price" onChange={handleChange} className="border p-3 rounded w-full" />

          <input
  name="brand"
  value={form.brand}
  placeholder="Brand"
  disabled
  className="border p-2 rounded bg-gray-100 cursor-not-allowed"
/>
          <input name="gender" placeholder="Gender" onChange={handleChange} className="border p-3 rounded w-full" />

          {/* ✅ WATCH ONLY */}
          {form.category === "watch" && (
            <>
              <input name="movement" placeholder="Movement" onChange={handleChange} className="border p-3 rounded w-full" />
              <input name="style" placeholder="Style" onChange={handleChange} className="border p-3 rounded w-full" />
            </>
          )}

          {/* ✅ SMARTWATCH */}
          {form.category === "smartwatch" && (
            <>
              <input name="battery" placeholder="Battery" onChange={handleChange} className="border p-3 rounded w-full" />
              <input name="display" placeholder="Display" onChange={handleChange} className="border p-3 rounded w-full" />
            </>
          )}

          {/* ✅ SUNGLASSES */}
          {form.category === "sunglasses" && (
            <>
              <input name="lens" placeholder="Lens Type" onChange={handleChange} className="border p-3 rounded w-full" />
              <input name="uv" placeholder="UV Protection" onChange={handleChange} className="border p-3 rounded w-full" />
            </>
          )}

          {/* ✅ SHOES */}
          {form.category === "shoes" && (
            <>
              <input name="size" placeholder="Size" onChange={handleChange} className="border p-3 rounded w-full" />
              <input name="material" placeholder="Material" onChange={handleChange} className="border p-3 rounded w-full" />
            </>
          )}

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

        </div>
      )}

      {/* IMAGE UPLOAD */}
{form.category && (
  <>
    <input
      type="file"
      multiple
      className="mt-4"
      onChange={(e) => setImages([...e.target.files])}
    />

    {/* ACTION BUTTONS */}
    <div className="flex gap-3 mt-5">

      {/* CANCEL */}
      <button
        onClick={() => {
          setShowModal(false);
          setForm({
            name: "",
            brand: "",
            price: "",
            gender: "",
            movement: "",
            style: "",
            description: "",
            category: "",
          });
          setImages([]);
        }}
        className="flex-1 bg-gray-200 py-2 rounded-lg"
      >
        Cancel
      </button>

      {/* ADD */}
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
  </>
)}

    </div>
  </div>
)}
{confirmId && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center">

      <h3 className="text-lg font-semibold mb-2">Delete Product</h3>
      <p className="text-gray-500 mb-4">This action cannot be undone.</p>

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
{editProduct && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

    <div className="bg-white w-full max-w-lg p-6 rounded-xl">

      <h3 className="text-lg font-semibold mb-4">Edit Product</h3>

      {/* CATEGORY */}
      <select
        value={editProduct.category}
        onChange={(e) =>
          setEditProduct({ ...editProduct, category: e.target.value })
        }
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">Select Category</option>
        <option value="watch">Watch</option>
        <option value="smartwatch">Smartwatch</option>
        <option value="sunglasses">Sunglasses</option>
        <option value="shoes">Shoes</option>
      </select>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* COMMON */}
        <input
          value={editProduct.name || ""}
          onChange={(e)=>setEditProduct({...editProduct,name:e.target.value})}
          placeholder="Name"
          className="border p-3 rounded w-full"
        />

        <input
          value={editProduct.price || ""}
          onChange={(e)=>setEditProduct({...editProduct,price:e.target.value})}
          placeholder="Price"
          className="border p-3 rounded w-full"
        />

        <input
          value={editProduct.brand || ""}
          onChange={(e)=>setEditProduct({...editProduct,brand:e.target.value})}
          placeholder="Brand"
          className="border p-3 rounded w-full"
        />

        <input
          value={editProduct.gender || ""}
          onChange={(e)=>setEditProduct({...editProduct,gender:e.target.value})}
          placeholder="Gender"
          className="border p-3 rounded w-full"
        />

        {/* WATCH */}
        {editProduct.category === "watch" && (
          <>
            <input
              value={editProduct.movement || ""}
              onChange={(e)=>setEditProduct({...editProduct,movement:e.target.value})}
              placeholder="Movement"
              className="border p-3 rounded w-full"
            />
            <input
              value={editProduct.style || ""}
              onChange={(e)=>setEditProduct({...editProduct,style:e.target.value})}
              placeholder="Style"
              className="border p-3 rounded w-full"
            />
          </>
        )}

        {/* SMARTWATCH */}
        {editProduct.category === "smartwatch" && (
          <>
            <input
              value={editProduct.attributes?.battery || ""}
              onChange={(e)=>setEditProduct({
                ...editProduct,
                attributes: {
                  ...editProduct.attributes,
                  battery: e.target.value
                }
              })}
              placeholder="Battery"
              className="border p-3 rounded w-full"
            />
            <input
              value={editProduct.attributes?.display || ""}
              onChange={(e)=>setEditProduct({
                ...editProduct,
                attributes: {
                  ...editProduct.attributes,
                  display: e.target.value
                }
              })}
              placeholder="Display"
              className="border p-3 rounded w-full"
            />
          </>
        )}

        {/* SUNGLASSES */}
        {editProduct.category === "sunglasses" && (
          <>
            <input
              value={editProduct.attributes?.lens || ""}
              onChange={(e)=>setEditProduct({
                ...editProduct,
                attributes: {
                  ...editProduct.attributes,
                  lens: e.target.value
                }
              })}
              placeholder="Lens"
              className="border p-3 rounded w-full"
            />
            <input
              value={editProduct.attributes?.uv || ""}
              onChange={(e)=>setEditProduct({
                ...editProduct,
                attributes: {
                  ...editProduct.attributes,
                  uv: e.target.value
                }
              })}
              placeholder="UV"
              className="border p-3 rounded w-full"
            />
          </>
        )}

        {/* SHOES */}
        {editProduct.category === "shoes" && (
          <>
            <input
              value={editProduct.attributes?.size || ""}
              onChange={(e)=>setEditProduct({
                ...editProduct,
                attributes: {
                  ...editProduct.attributes,
                  size: e.target.value
                }
              })}
              placeholder="Size"
              className="border p-3 rounded w-full"
            />
            <input
              value={editProduct.attributes?.material || ""}
              onChange={(e)=>setEditProduct({
                ...editProduct,
                attributes: {
                  ...editProduct.attributes,
                  material: e.target.value
                }
              })}
              placeholder="Material"
              className="border p-3 rounded w-full"
            />
          </>
        )}

        <textarea
          value={editProduct.description || ""}
          onChange={(e)=>setEditProduct({...editProduct,description:e.target.value})}
          className="border p-2 rounded col-span-2"
          placeholder="Description"
        />

      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={()=>setEditProduct(null)}
          className="flex-1 bg-gray-200 py-2 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}