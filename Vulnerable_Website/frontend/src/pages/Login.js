import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        username,
        password,
      });

      // ✅ Store user info
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);

      alert("Login Successful");

      // 👉 redirect to search page
      navigate("/search");

    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <input
          style={styles.input}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
        <button 
         style={{ ...styles.button, marginTop: "10px", background: "#95A5A6" }} 
  onClick={() => navigate("/register")}
>
  Register
</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#F5F5F5",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#FFFFFF",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
  },
  title: {
    color: "#2C3E50",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    background: "#2C3E50",
    color: "#fff",
    padding: "10px",
    width: "100%",
    border: "none",
    cursor: "pointer",
  },
};

export default Login;