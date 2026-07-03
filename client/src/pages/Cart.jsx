import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItem, placeOrder } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    getCart(user.userId)
      .then((res) => setCart(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleRemove = async (cartItemId) => {
    await removeFromCart(cartItemId);
    setCart(cart.filter((item) => item.id !== cartItemId));
  };

  const handleQuantityChange = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    await updateCartItem(cartItemId, quantity);
    setCart(cart.map((item) => item.id === cartItemId ? { ...item, quantity } : item));
  };

  const handlePlaceOrder = async () => {
    try {
      await placeOrder(user.userId);
      alert("Order placed successfully!");
      setCart([]);
      navigate("/orders");
    } catch {
      alert("Failed to place order.");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) return <p style={{ padding: "2rem" }}>Loading cart...</p>;

  return (
    <div style={styles.container}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. <span style={styles.link} onClick={() => navigate("/")}>Shop now!</span></p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.info}>
                <h3 style={styles.name}>{item.product.name}</h3>
                <p style={styles.price}>₹{item.product.price.toLocaleString()}</p>
              </div>
              <div style={styles.controls}>
                <button style={styles.qtyBtn} onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>−</button>
                <span style={styles.qty}>{item.quantity}</span>
                <button style={styles.qtyBtn} onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                <button style={styles.removeBtn} onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
              <p style={styles.subtotal}>₹{(item.product.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
          <div style={styles.footer}>
            <h3>Total: ₹{total.toLocaleString()}</h3>
            <button style={styles.orderBtn} onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "2rem", maxWidth: "800px", margin: "0 auto" },
  card: { display: "flex", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "white", padding: "1rem", borderRadius: "8px",
    marginBottom: "1rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  info: { flex: 1 },
  name: { margin: "0 0 0.25rem" },
  price: { color: "#718096", margin: 0 },
  controls: { display: "flex", alignItems: "center", gap: "0.5rem" },
  qtyBtn: { width: "30px", height: "30px", border: "1px solid #e2e8f0",
    borderRadius: "4px", cursor: "pointer", fontSize: "1rem" },
  qty: { minWidth: "30px", textAlign: "center", fontWeight: "bold" },
  removeBtn: { backgroundColor: "#e53e3e", color: "white", border: "none",
    padding: "0.4rem 0.75rem", borderRadius: "4px", cursor: "pointer" },
  subtotal: { fontWeight: "bold", minWidth: "100px", textAlign: "right" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "white", padding: "1rem", borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  orderBtn: { backgroundColor: "#1a1a2e", color: "white", border: "none",
    padding: "0.75rem 2rem", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" },
  link: { color: "#4299e1", cursor: "pointer" },
};

export default Cart;