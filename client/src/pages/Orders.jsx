import { useEffect, useState } from "react";
import { getUserOrders, cancelOrder } from "../services/api";
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

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrder(orderId);
      setOrders(orders.map((o) =>
        o.id === orderId ? { ...o, status: "CANCELLED" } : o
      ));
    } catch {
      alert("Failed to cancel order.");
    }
  };

  const statusColor = (status) => {
    const colors = { PENDING: "#ed8936", CONFIRMED: "#4299e1",
      SHIPPED: "#9f7aea", DELIVERED: "#48bb78", CANCELLED: "#e53e3e" };
    return colors[status] || "#718096";
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading orders...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet. <span style={styles.link} onClick={() => navigate("/")}>Start shopping!</span></p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{
            ...styles.card,
            opacity: order.status === "CANCELLED" ? 0.6 : 1
          }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {order.status === "PENDING" && (
                  <button style={styles.cancelBtn} onClick={() => handleCancel(order.id)}>
                    Cancel Order
                  </button>
                )}
                <span style={styles.total}>Total: ₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { padding: "2rem", maxWidth: "700px", margin: "0 auto",
    minHeight: "80vh", color: "#1a1a2e" },
  heading: { color: "#1a1a2e", marginBottom: "1.5rem" },
  card: { backgroundColor: "white", borderRadius: "8px", padding: "1.5rem",
    marginBottom: "1.5rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  header: { display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "1rem" },
  orderId: { margin: 0 },
  status: { color: "white", padding: "0.25rem 0.75rem",
    borderRadius: "20px", fontSize: "0.85rem" },
  items: { borderTop: "1px solid #e2e8f0", paddingTop: "1rem" },
  item: { display: "flex", justifyContent: "space-between",
    padding: "0.4rem 0", color: "#4a5568" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center",
    borderTop: "1px solid #e2e8f0", paddingTop: "1rem", marginTop: "1rem" },
  date: { color: "#718096", fontSize: "0.85rem" },
  total: { fontWeight: "bold", fontSize: "1.1rem" },
  link: { color: "#4299e1", cursor: "pointer" },
  cancelBtn: { backgroundColor: "#e53e3e", color: "white", border: "none",
    padding: "0.4rem 1rem", borderRadius: "4px", cursor: "pointer" },
};

export default Orders;