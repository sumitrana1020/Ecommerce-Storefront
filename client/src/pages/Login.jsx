import { useState } from "react";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      login({ name: res.data.name, userId: res.data.userId, role: res.data.role }, res.data.token);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="email" placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} type="password" placeholder="Password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button style={styles.button} onClick={handleSubmit}>Login</button>
        <p style={styles.text}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" },
  card: { backgroundColor: "white", padding: "2rem", borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" },
  title: { marginBottom: "1.5rem", textAlign: "center" },
  input: { display: "block", width: "100%", padding: "0.75rem", marginBottom: "1rem",
    border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "1rem", boxSizing: "border-box" },
  button: { width: "100%", padding: "0.75rem", backgroundColor: "#1a1a2e",
    color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" },
  error: { color: "#e53e3e", marginBottom: "1rem", textAlign: "center" },
  text: { textAlign: "center", marginTop: "1rem" },
};

export default Login;