import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function Orders() {
  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const userIdFromURL = queryParams.get("user_id");
  const [userId, setUserId] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async (id) => {
     try {
    const res = await axios.get(
      `http://127.0.0.1:5000/orders?user_id=${id}`
    );
    setOrders(res.data);
  } catch (err) {
    alert("Error fetching orders");
  }
  };
  useEffect(() => {
  if (userIdFromURL) {
    setUserId(userIdFromURL); // optional (fills input box)
    fetchOrders(userIdFromURL);
  }
}, [userIdFromURL]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛒 Your Orders</h2>

      {/* INPUT BOX */}
      <div style={styles.searchBox}>
        <input
          style={styles.input}
          placeholder="Enter User ID..."
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button style={styles.button} onClick={fetchOrders}>
          Fetch Orders
        </button>
      </div>

      {/* ORDERS DISPLAY */}
      <div style={styles.grid}>
        {orders.length === 0 ? (
          <div style={styles.noResults}>🚫 No orders found</div>
        ) : (
          orders.map((o) => (
            <div key={o.id} style={styles.card}>
              <div style={styles.cardTop}></div>
              <h3>Order #{o.id}</h3>
              <p><b>User ID:</b> {o.user_id}</p>
              <p><b>Product :</b> {o.product_name}</p>
              <p><b>Quantity:</b> {o.quantity}</p>
              <p style={styles.price}>₹{o.total_price}</p>
              <p style={styles.date}>{o.created_at}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #eef2f3, #dfe9f3)",
    minHeight: "100vh",
    padding: "30px",
  },

  title: {
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: "20px",
  },

  searchBox: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },

  input: {
    padding: "10px",
    width: "300px",
    borderRadius: "20px",
    border: "1px solid #ccc",
  },

  button: {
    marginLeft: "10px",
    padding: "10px 15px",
    background: "linear-gradient(45deg, #2C3E50, #3498DB)",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
    transition: "0.3s",
  },

  cardTop: {
    height: "5px",
    background: "linear-gradient(90deg, #3498DB, #1ABC9C)",
    marginBottom: "10px",
    borderRadius: "10px",
  },

  price: {
    color: "#1ABC9C",
    fontWeight: "bold",
  },

  date: {
    fontSize: "12px",
    color: "#888",
  },

  noResults: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    fontSize: "20px",
    color: "#7f8c8d",
  },
};

export default Orders;