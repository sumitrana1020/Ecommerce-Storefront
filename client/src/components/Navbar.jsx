import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        🛒 <span style={styles.brandText}>ShopNow</span>
      </Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Products</Link>
        {user ? (
          <>
            <Link to="/cart" style={styles.link}>🛍️ Cart</Link>
            <Link to="/orders" style={styles.link}>📦 Orders</Link>
            {user.role === "ADMIN" && (
              <Link to="/admin" style={styles.adminLink}>⚙️ Admin</Link>
            )}
            <span style={styles.username}>Hi, {user.name}!</span>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1rem 3rem", backgroundColor: "#0f0f1a",
    borderBottom: "1px solid #2d2d44",
    position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 2px 20px rgba(0,0,0,0.3)"
  },
  brand: { display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" },
  brandText: { color: "white", fontSize: "1.4rem", fontWeight: "700", letterSpacing: "-0.5px" },
  links: { display: "flex", alignItems: "center", gap: "1.5rem" },
  link: { color: "#a0aec0", textDecoration: "none", fontSize: "0.95rem",
    fontWeight: "500", transition: "color 0.2s" },
  adminLink: { color: "#fbd38d", textDecoration: "none", fontWeight: "600", fontSize: "0.95rem" },
  username: { color: "#68d391", fontSize: "0.9rem", fontWeight: "500" },
  button: {
    backgroundColor: "transparent", color: "#fc8181", border: "1px solid #fc8181",
    padding: "0.4rem 1rem", borderRadius: "6px", cursor: "pointer",
    fontSize: "0.9rem", fontWeight: "500"
  },
  registerBtn: {
    backgroundColor: "#6c63ff", color: "white", padding: "0.4rem 1.2rem",
    borderRadius: "6px", fontSize: "0.9rem", fontWeight: "600",
    textDecoration: "none"
  },
};

export default Navbar;