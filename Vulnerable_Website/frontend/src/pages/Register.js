import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/register", {
        username,
        password,
        email,
      });

      alert("Registered Successfully");

      // 👉 redirect to login
      navigate("/");
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

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

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>

        {/* Back to Login */}
        <button
          style={{ ...styles.button, marginTop: "10px", background: "#95A5A6" }}
          onClick={() => navigate("/")}
        >
          Back to Login
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
    width: "320px",
    textAlign: "center",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    color: "#2C3E50",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    background: "#2C3E50",
    color: "#fff",
    padding: "10px",
    width: "100%",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Register;