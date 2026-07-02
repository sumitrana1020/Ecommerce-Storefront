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
      <Link to="/" style={styles.brand}>🛒 ShopNow</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Products</Link>
        {user ? (
          <>
            <Link to="/cart" style={styles.link}>Cart</Link>
            <Link to="/orders" style={styles.link}>Orders</Link>
            <span style={styles.username}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1rem 2rem", backgroundColor: "#1a1a2e", color: "white" },
  brand: { color: "white", textDecoration: "none", fontSize: "1.5rem", fontWeight: "bold" },
  links: { display: "flex", alignItems: "center", gap: "1.5rem" },
  link: { color: "white", textDecoration: "none" },
  username: { color: "#a0aec0" },
  button: { backgroundColor: "#e53e3e", color: "white", border: "none",
    padding: "0.4rem 1rem", borderRadius: "4px", cursor: "pointer" },
};

export default Navbar;