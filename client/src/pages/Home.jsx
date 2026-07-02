import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading products...</p>;

  return (
    <div style={styles.container}>
      <h2>All Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}
              onClick={() => navigate(`/product/${product.id}`)}>
              <div style={styles.image}>🛍️</div>
              <h3 style={styles.name}>{product.name}</h3>
              <p style={styles.category}>{product.category}</p>
              <p style={styles.price}>₹{product.price.toLocaleString()}</p>
              <p style={styles.stock}>Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "2rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" },
  card: { border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1rem",
    cursor: "pointer", transition: "transform 0.2s", backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  image: { fontSize: "3rem", textAlign: "center", marginBottom: "0.5rem" },
  name: { margin: "0 0 0.25rem", fontSize: "1rem" },
  category: { color: "#718096", fontSize: "0.85rem", margin: "0 0 0.5rem" },
  price: { color: "#2d3748", fontWeight: "bold", margin: "0 0 0.25rem" },
  stock: { color: "#48bb78", fontSize: "0.85rem", margin: 0 },
};

export default Home;