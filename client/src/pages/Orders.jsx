import { useEffect, useState } from "react";
import { getUserOrders } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    getUserOrders(user.userId)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setOrders(data);
      })
      .catch((err) => {
        console.error(err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const statusColor = (status) => {
    const colors = { PENDING: "#ed8936", CONFIRMED: "#4299e1",
      SHIPPED: "#9f7aea", DELIVERED: "#48bb78", CANCELLED: "#e53e3e" };
    return colors[status] || "#718096";
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading orders...</p>;

  return (
    <div style={styles.container}>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet. <span style={styles.link} onClick={() => navigate("/")}>Start shopping!</span></p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <div style={styles.header}>
              <h3 style={styles.orderId}>Order #{order.id}</h3>
              <span style={{ ...styles.status, backgroundColor: statusColor(order.status) }}>
                {order.status}
              </span>
            </div>
            <div style={styles.items}>
              {order.items.map((item) => (
                <div key={item.id} style={styles.item}>
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={styles.footer}>
              <span style={styles.date}>
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </span>
              <span style={styles.total}>Total: ₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { padding: "2rem", maxWidth: "800px", margin: "0 auto", minHeight: "80vh", color: "#1a1a2e" },
  card: { backgroundColor: "white", borderRadius: "8px", padding: "1.5rem",
    marginBottom: "1.5rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  orderId: { margin: 0 },
  status: { color: "white", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.85rem" },
  items: { borderTop: "1px solid #e2e8f0", paddingTop: "1rem" },
  item: { display: "flex", justifyContent: "space-between", padding: "0.4rem 0", color: "#4a5568" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center",
    borderTop: "1px solid #e2e8f0", paddingTop: "1rem", marginTop: "1rem" },
  date: { color: "#718096", fontSize: "0.85rem" },
  total: { fontWeight: "bold", fontSize: "1.1rem" },
  link: { color: "#4299e1", cursor: "pointer" },
};

export default Orders;