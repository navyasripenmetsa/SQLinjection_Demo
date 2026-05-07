import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const userId = localStorage.getItem("user_id");

  const [user, setUser] = useState({
    username: "",
    email: "",
    role: ""
  });

  const [newUsername, setNewUsername] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/profile/${userId}`
      );
      setUser(res.data);
      setNewUsername(res.data.username);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId) fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/update-profile", {
        user_id: userId,
        username: newUsername
      });

      alert("Username updated!");
      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 Profile</h2>

        <p><b>Email:</b> {user.email}</p>
        <p>
          <b>Role:</b>
          <span style={{
            color: user.role === "admin" ? "#27ae60" : "#2c3e50",
            fontWeight: "bold",
            marginLeft: "5px"
          }}>
            {user.role}
          </span>
        </p>

        <p><b>Username:</b></p>
        <input
          style={styles.input}
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />

        <button style={styles.button} onClick={handleUpdate}>
          Update Username
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298, #ffffff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    width: "350px",
    boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
  },

  title: {
    marginBottom: "20px",
    color: "#1e3c72",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginTop: "10px",
    marginBottom: "15px",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "linear-gradient(45deg, #1e3c72, #2a5298)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Profile;
  