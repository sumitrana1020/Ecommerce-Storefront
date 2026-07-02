import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setError("Registration failed. Email may already be in use.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <input style={styles.input} type="text" placeholder="Full Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input style={styles.input} type="email" placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} type="password" placeholder="Password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button style={styles.button} onClick={handleSubmit}>Register</button>
        <p style={styles.text}>Already have an account? <Link to="/login">Login</Link></p>
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
  success: { color: "#48bb78", marginBottom: "1rem", textAlign: "center" },
  text: { textAlign: "center", marginTop: "1rem" },
};

export default Register;