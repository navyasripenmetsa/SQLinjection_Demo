import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // ✅ ADDED

function Search() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  // 🔍 SEARCH PRODUCTS
  const searchProducts = async () => {
  try {
    setProducts([]);        // 🔥 CLEAR OLD RESULTS
    setSearched(false);     // 🔥 RESET STATE

    const res = await axios.get(
      `http://127.0.0.1:5000/search?query=${encodeURIComponent(query)}`
    );

    console.log(res.data);  // 🔍 DEBUG

    setProducts(res.data);
    setSearched(true);

  } catch (err) {
    alert("Error fetching products");
  }
};

  // 📥 LOAD REVIEWS
  const loadReviews = async (productId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/reviews?product_id=${productId}`
      );
      setReviews([...res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  // 🎯 SELECT PRODUCT
  const handleSelect = (product) => {
    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null);
      return;
    }
    setSelectedProduct(product);
    loadReviews(product.id);
  };

  // ✍ ADD REVIEW
  const addReview = async () => {
    const user_id = localStorage.getItem("user_id");

    if (!selectedProduct) {
      alert("Click 'Add Review' first");
      return;
    }

    if (!comment.trim()) {
      alert("Review cannot be empty");
      return;
    }

    if (!user_id) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/review", {
        user_id: user_id,
        product_id: selectedProduct.id,
        comment: comment,
      });

      setComment("");
      await loadReviews(selectedProduct.id);
    } catch (err) {
      console.log(err);
      alert("Error adding review");
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.profileIcon}>
      <Link to="/profile">
      <button style={styles.profileButton}>
      👤 ({localStorage.getItem("role") || "user"})
      </button>
      </Link>
      </div>

      <h2 style={styles.title}>🛍️ Explore Products</h2>

      {/* 🔥 ADMIN BUTTON */}
      {localStorage.getItem("role") === "admin" && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            style={styles.button}
            onClick={() => (window.location.href = "/admin")}
          >
            Go to Admin Panel
          </button>
        </div>
      )}

      {/* 🛒 ORDERS BUTTON (ONLY FOR USERS) */}
{localStorage.getItem("role") !== "admin" && (
  <div style={{ textAlign: "center", marginBottom: "20px" }}>
    <button
      style={styles.button}
      onClick={() => navigate(`/orders?user_id=${localStorage.getItem("user_id")}`)}
    >
      🛒 Orders
    </button>
  </div>
)}

      {/* SEARCH */}
      <div style={styles.searchBox}>
        <input
          style={styles.input}
          placeholder="Search anything..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button style={styles.button} onClick={searchProducts}>
          Search
        </button>
      </div>

      {/* PRODUCTS */}
      <div style={styles.grid}>
        {!searched ? null : products.length === 0 ? (
          <div style={styles.noResults}>🚫 No products found</div>
        ) : (
          products.map((product) => (
            <div key={product.id}>
              <div
                style={styles.card}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div style={styles.cardTop}></div>

                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p style={styles.price}>₹{product.price}</p>

                <div style={styles.buttonGroup}>
                  <button
                    style={styles.smallButton}
                    onClick={() => handleSelect(product)}
                  >
                    👁 View Reviews
                  </button>

                  <button
                    style={styles.smallButtonSecondary}
                    onClick={() => handleSelect(product)}
                  >
                    ✍ Add Review
                  </button>
                </div>
              </div>

              {selectedProduct?.id === product.id && (
                <div style={styles.reviewBox}>
                  <h4>⭐ Reviews</h4>

                  {reviews.length === 0 ? (
                    <p>No reviews yet</p>
                  ) : (
                    reviews.map((r, index) => (
                      <div key={r.id || index} style={styles.reviewCard}>
                        <div style={styles.reviewHeader}>
                          <span style={styles.userIcon}>👤</span>
                          <span style={styles.username}>{r.username}</span>
                        </div>

                        <p style={styles.reviewText}>{r.comment}</p>
                      </div>
                    ))
                  )}

                  <input
                    style={styles.input}
                    placeholder="Write a review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <button style={styles.button} onClick={addReview}>
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative", // ✅ REQUIRED
    background: "linear-gradient(135deg, #eef2f3, #dfe9f3)",
    minHeight: "100vh",
    padding: "30px",
  },

  profileIcon: {
    position: "absolute",
    top: "20px",
    right: "20px",
  },

  profileButton: {
    padding: "10px",
    borderRadius: "50%",
    border: "none",
    background: "#2C3E50",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
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
    marginTop: "10px",
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
    cursor: "pointer",
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

  reviewBox: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "10px",
    boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
  },

  reviewItem: {
    background: "#f4f4f4",
    padding: "5px",
    borderRadius: "5px",
    margin: "5px 0",
  },

  noResults: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    fontSize: "20px",
    color: "#7f8c8d",
  },

  reviewCard: {
    background: "#ffffff",
    padding: "10px",
    borderRadius: "10px",
    margin: "10px 0",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
  },

  reviewHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },

  userIcon: {
    marginRight: "6px",
  },

  username: {
    fontWeight: "bold",
    color: "#2C3E50",
  },

  reviewText: {
    color: "#555",
    fontSize: "14px",
  },

  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },

  smallButton: {
    flex: 1,
    marginRight: "5px",
    padding: "8px",
    background: "#2C3E50",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "12px",
  },

  smallButtonSecondary: {
    flex: 1,
    marginLeft: "5px",
    padding: "8px",
    background: "#1ABC9C",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default Search;
