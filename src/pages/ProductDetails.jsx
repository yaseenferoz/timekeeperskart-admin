import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../api/products";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getProduct(id);
    setProduct(res.data);
    setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    images.forEach((img) => formData.append("images", img));

    await updateProduct(id, formData);

    setEditMode(false);
    setImages([]);
    load();
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* IMAGES */}
      <div className="grid grid-cols-2 gap-2">
        {product.images?.map((img, i) => (
          <img
            key={i}
            src={img}
            className="rounded h-40 w-full object-cover"
          />
        ))}
      </div>

      {/* DETAILS */}
      <div className="bg-white p-4 rounded-xl shadow">

        {editMode ? (
          <>
            <h2 className="font-semibold mb-3">Edit Product</h2>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="border p-2 rounded col-span-2"
              />
            </div>

            {/* ✅ ONLY IMAGE UPLOAD */}
            <div className="mt-4">
              <label className="border-2 border-dashed p-3 w-full text-center rounded cursor-pointer block">
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) =>
                    setImages([...e.target.files])
                  }
                />
              </label>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-blue-600 font-semibold">
              ₹{product.price}
            </p>

            <p><b>Brand:</b> {product.brand}</p>
            <p><b>Gender:</b> {product.gender}</p>
            <p className="mt-2">{product.description}</p>

            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit Product
            </button>
          </>
        )}

      </div>
    </div>
  );
}