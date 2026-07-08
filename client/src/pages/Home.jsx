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
    if (category !== "All") result = result.filter((p) => p.category === category);
    if (search.trim() !== "") result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()));
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

  if (loading) return (
    <div style={styles.loadingContainer}>
      <p style={styles.loadingText}>Loading products...</p>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find What You Love</h1>
        <p style={styles.heroSubtitle}>Shop the latest products at unbeatable prices</p>
        <input
          style={styles.heroSearch}
          type="text"
          placeholder="🔍  Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={styles.container}>
        {/* Category Filter */}
        <div style={styles.categoryRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              style={{
                ...styles.catBtn,
                backgroundColor: category === cat ? "#6c63ff" : "white",
                color: category === cat ? "white" : "#4a5568",
                borderColor: category === cat ? "#6c63ff" : "#e2e8f0",
              }}
              onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p style={styles.resultsText}>
          Showing <strong>{filtered.length}</strong> products
          {category !== "All" && ` in ${category}`}
          {search && ` for "${search}"`}
        </p>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🔍</p>
            <p style={styles.emptyText}>No products found.</p>
            <button style={styles.clearBtn} onClick={() => { setSearch(""); setCategory("All"); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((product) => (
              <div key={product.id} style={styles.card}
                onClick={() => navigate(`/product/${product.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={styles.imageBox}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={styles.image}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <span style={{ fontSize: "4rem" }}>🛍️</span>
                  )}
                </div>
                <div style={styles.cardBody}>
                  <span style={styles.categoryTag}>{product.category}</span>
                  <h3 style={styles.name}>{product.name}</h3>
                  <p style={styles.description}>{product.description}</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.price}>₹{product.price.toLocaleString()}</span>
                    <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                      {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                    </span>
                  </div>
                  <button style={styles.addBtn} onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product.id);
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: { display: "flex", justifyContent: "center", padding: "5rem" },
  loadingText: { color: "#718096", fontSize: "1.1rem" },
  hero: {
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 50%, #0f0f1a 100%)",
    padding: "4rem 2rem", textAlign: "center",
  },
  heroTitle: { color: "white", fontSize: "2.5rem", fontWeight: "700",
    marginBottom: "0.75rem", letterSpacing: "-1px" },
  heroSubtitle: { color: "#a0aec0", fontSize: "1.1rem", marginBottom: "2rem" },
  heroSearch: {
    width: "100%", maxWidth: "500px", padding: "1rem 1.5rem",
    fontSize: "1rem", border: "none", borderRadius: "50px",
    outline: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  container: { padding: "2rem 3rem" },
  categoryRow: { display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" },
  catBtn: {
    padding: "0.5rem 1.25rem", border: "1px solid", borderRadius: "50px",
    cursor: "pointer", fontSize: "0.9rem", fontWeight: "500", transition: "all 0.2s"
  },
  resultsText: { color: "#718096", fontSize: "0.9rem", marginBottom: "1.5rem" },
  emptyState: { textAlign: "center", padding: "4rem" },
  emptyIcon: { fontSize: "3rem", marginBottom: "1rem" },
  emptyText: { color: "#718096", fontSize: "1.1rem", marginBottom: "1rem" },
  clearBtn: { backgroundColor: "#6c63ff", color: "white", border: "none",
    padding: "0.6rem 1.5rem", borderRadius: "6px", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" },
  card: {
    backgroundColor: "white", borderRadius: "12px", overflow: "hidden",
    cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },
  imageBox: {
    backgroundColor: "#f7f8fc", height: "180px",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden"
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  cardBody: { padding: "1.25rem" },
  categoryTag: { backgroundColor: "#ebf4ff", color: "#4299e1",
    padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "600" },
  name: { fontSize: "1rem", fontWeight: "600", margin: "0.5rem 0 0.25rem", color: "#1a1a2e" },
  description: { color: "#718096", fontSize: "0.85rem", marginBottom: "0.75rem",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cardFooter: { display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "1rem" },
  price: { fontSize: "1.2rem", fontWeight: "700", color: "#1a1a2e" },
  inStock: { color: "#48bb78", fontSize: "0.8rem", fontWeight: "500" },
  outOfStock: { color: "#e53e3e", fontSize: "0.8rem", fontWeight: "500" },
  addBtn: {
    width: "100%", padding: "0.65rem", backgroundColor: "#6c63ff",
    color: "white", border: "none", borderRadius: "8px",
    cursor: "pointer", fontSize: "0.95rem", fontWeight: "600",
  },
};

export default Home;