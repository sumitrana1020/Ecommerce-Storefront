import { useEffect, useState, useMemo } from "react";
import { getProducts, addToCart } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }
    if (search.trim() !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [search, category, products]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const handleAddToCart = async (productId) => {
    if (!user) { navigate("/login"); return; }
    try {
      await addToCart({ userId: user.userId, productId, quantity: 1 });
      alert("Added to cart!");
    } catch {
      alert("Failed to add to cart.");
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading products...</p>;

  return (
    <div style={styles.container}>
      <h2>All Products</h2>
      <div style={styles.toolbar}>
        <input
          style={styles.search}
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat}
              style={{ ...styles.catBtn,
                backgroundColor: category === cat ? "#1a1a2e" : "white",
                color: category === cat ? "white" : "#1a1a2e" }}
              onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={styles.grid}>
          {filtered.map((product) => (
            <div key={product.id} style={styles.card}
              onClick={() => navigate(`/product/${product.id}`)}>
              <div style={styles.image}>🛍️</div>
              <h3 style={styles.name}>{product.name}</h3>
              <p style={styles.category}>{product.category}</p>
              <p style={styles.price}>₹{product.price.toLocaleString()}</p>
              <p style={styles.stock}>Stock: {product.stock}</p>
              <button style={styles.addBtn} onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product.id);
              }}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "2rem" },
  toolbar: { display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" },
  search: { padding: "0.75rem 1rem", fontSize: "1rem", border: "1px solid #e2e8f0",
    borderRadius: "8px", width: "100%", maxWidth: "400px", boxSizing: "border-box" },
  categories: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  catBtn: { padding: "0.4rem 1rem", border: "1px solid #1a1a2e", borderRadius: "20px",
    cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" },
  card: { border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1rem",
    cursor: "pointer", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  image: { fontSize: "3rem", textAlign: "center", marginBottom: "0.5rem" },
  name: { margin: "0 0 0.25rem", fontSize: "1rem" },
  category: { color: "#718096", fontSize: "0.85rem", margin: "0 0 0.5rem" },
  price: { color: "#2d3748", fontWeight: "bold", margin: "0 0 0.25rem" },
  stock: { color: "#48bb78", fontSize: "0.85rem", margin: 0 },
  addBtn: { width: "100%", padding: "0.5rem", backgroundColor: "#1a1a2e",
    color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "0.5rem" },
};

export default Home;