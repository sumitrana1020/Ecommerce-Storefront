import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", category: "", imageUrl: ""
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  
  const fetchProducts = () => {
    getProducts()
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN") { navigate("/"); return; }
    fetchProducts();
  }, [user, navigate]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
    try {
      if (editId) {
        await axios.put(`http://localhost:8080/api/products/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("✅ Product updated!");
      } else {
        await axios.post("http://localhost:8080/api/products", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("✅ Product added!");
      }
      setForm({ name: "", description: "", price: "", stock: "", category: "", imageUrl: "" });
      setEditId(null);
      fetchProducts();
    } catch {
      setMessage("❌ Failed to save product.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      category: product.category || "",
      imageUrl: product.imageUrl || ""
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Product deleted!");
      fetchProducts();
    } catch {
      setMessage("❌ Failed to delete product.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ name: "", description: "", price: "", stock: "", category: "", imageUrl: "" });
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>Admin Panel</h2>

      {/* Form */}
      <div style={styles.formCard}>
        <h3>{editId ? "Edit Product" : "Add New Product"}</h3>
        {message && <p style={styles.message}>{message}</p>}
        <div style={styles.grid2}>
          <input style={styles.input} placeholder="Product Name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input style={styles.input} placeholder="Category"
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input style={styles.input} placeholder="Price (₹)" type="number"
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input style={styles.input} placeholder="Stock" type="number"
            value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <input style={styles.input} placeholder="Image URL (optional)"
            value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <input style={styles.input} placeholder="Description"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div style={styles.btnRow}>
          <button style={styles.saveBtn} onClick={handleSubmit}>
            {editId ? "Update Product" : "Add Product"}
          </button>
          {editId && <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>}
        </div>
      </div>

      {/* Product Table */}
      <div style={styles.tableCard}>
        <h3>All Products ({products.length})</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>{p.id}</td>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{p.category}</td>
                <td style={styles.td}>₹{p.price.toLocaleString()}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "2rem", maxWidth: "1000px", margin: "0 auto", color: "#1a1a2e" },
  formCard: { backgroundColor: "white", padding: "1.5rem", borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "2rem" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" },
  input: { padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "4px",
    fontSize: "1rem", width: "100%", boxSizing: "border-box" },
  btnRow: { display: "flex", gap: "1rem" },
  saveBtn: { padding: "0.75rem 2rem", backgroundColor: "#1a1a2e", color: "white",
    border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" },
  cancelBtn: { padding: "0.75rem 2rem", backgroundColor: "white", color: "#1a1a2e",
    border: "2px solid #1a1a2e", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" },
  message: { marginBottom: "1rem", fontWeight: "bold" },
  tableCard: { backgroundColor: "white", padding: "1.5rem", borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#f7fafc" },
  th: { padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #e2e8f0", fontSize: "0.9rem" },
  tr: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "0.75rem", fontSize: "0.95rem" },
  editBtn: { backgroundColor: "#4299e1", color: "white", border: "none",
    padding: "0.3rem 0.75rem", borderRadius: "4px", cursor: "pointer", marginRight: "0.5rem" },
  deleteBtn: { backgroundColor: "#e53e3e", color: "white", border: "none",
    padding: "0.3rem 0.75rem", borderRadius: "4px", cursor: "pointer" },
};

export default Admin;