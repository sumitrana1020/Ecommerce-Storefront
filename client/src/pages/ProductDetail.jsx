import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, addToCart } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      await addToCart({ userId: user.userId, productId: product.id, quantity });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      alert("Failed to add to cart.");
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;
  if (!product) return <p style={{ padding: "2rem" }}>Product not found.</p>;

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate("/")}>← Back to Products</button>
      <div style={styles.card}>
        <div style={styles.imageBox}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={styles.image}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <span style={{ fontSize: "8rem" }}>🛍️</span>
          )}
        </div>
        <div style={styles.details}>
          <p style={styles.category}>{product.category}</p>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.description}>{product.description}</p>
          <h2 style={styles.price}>₹{product.price.toLocaleString()}</h2>
          <p style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
            {product.stock > 0 ? `✅ In Stock (${product.stock} available)` : "❌ Out of Stock"}
          </p>

          <div style={styles.qtyRow}>
            <span>Quantity:</span>
            <button style={styles.qtyBtn}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
            <span style={styles.qtyNum}>{quantity}</span>
            <button style={styles.qtyBtn}
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
          </div>

          <button
            style={{ ...styles.addBtn, backgroundColor: added ? "#48bb78" : "#6c63ff" }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}>
            {added ? "✅ Added to Cart!" : "Add to Cart"}
          </button>

          <button style={styles.cartBtn} onClick={() => navigate("/cart")}>
            Go to Cart →
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "2rem", maxWidth: "900px", margin: "0 auto" },
  back: { background: "none", border: "none", color: "#6c63ff",
    cursor: "pointer", fontSize: "1rem", marginBottom: "1.5rem", padding: 0 },
  card: { display: "flex", gap: "2rem", backgroundColor: "white",
    borderRadius: "12px", padding: "2rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  imageBox: {
    minWidth: "280px", height: "280px", backgroundColor: "#f7f8fc",
    borderRadius: "8px", display: "flex", alignItems: "center",
    justifyContent: "center", overflow: "hidden"
  },
  image: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" },
  details: { flex: 1 },
  category: { color: "#6c63ff", fontSize: "0.85rem", marginBottom: "0.5rem",
    textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" },
  name: { fontSize: "1.8rem", margin: "0 0 1rem", color: "#1a1a2e" },
  description: { color: "#4a5568", marginBottom: "1rem", lineHeight: "1.6" },
  price: { color: "#1a1a2e", fontSize: "2rem", margin: "0 0 0.5rem", fontWeight: "700" },
  inStock: { color: "#48bb78", marginBottom: "1.5rem" },
  outOfStock: { color: "#e53e3e", marginBottom: "1.5rem" },
  qtyRow: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" },
  qtyBtn: { width: "35px", height: "35px", border: "1px solid #e2e8f0",
    borderRadius: "4px", cursor: "pointer", fontSize: "1.2rem" },
  qtyNum: { fontSize: "1.2rem", fontWeight: "bold", minWidth: "30px", textAlign: "center" },
  addBtn: { width: "100%", padding: "0.85rem", color: "white", border: "none",
    borderRadius: "8px", fontSize: "1rem", cursor: "pointer",
    marginBottom: "0.75rem", transition: "background-color 0.3s" },
  cartBtn: { width: "100%", padding: "0.85rem", backgroundColor: "white",
    color: "#6c63ff", border: "2px solid #6c63ff", borderRadius: "8px",
    fontSize: "1rem", cursor: "pointer" },
};

export default ProductDetail;