import React, { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/admin/reviews"
      );

      setMessage(res.data.message);
      setLogs(res.data.logs || []);
      setUsers(res.data.users || []);
    } catch (err) {
      alert("Error fetching admin data");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Panel</h2>

      <div style={styles.infoBox}>
        Processing latest reviews...
      </div>

      {message && (
        <div style={styles.successBox}>
          {message}
        </div>
      )}

      {/* 🔍 USERS TABLE */}
      <div style={styles.tableBox}>
        <h3>Users Status</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Last Processed</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{u.last_processed || "Not processed"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Logs */}
      <div style={styles.logBox}>
        {logs.map((log, i) => (
          <p key={i}>• {log}</p>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#F5F5F5",
    minHeight: "100vh",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: "20px",
  },
  infoBox: {
    background: "#e3f2fd",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
    marginBottom: "20px",
  },
  successBox: {
    background: "#e8f5e9",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
  },
  tableBox: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    margin: "20px auto",
    width: "80%",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  logBox: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "20px",
    width: "400px",
    margin: "20px auto",
  },
};

export default Admin;