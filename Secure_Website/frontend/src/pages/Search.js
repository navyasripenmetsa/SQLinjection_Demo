import { useState } from 'react';
import api from '../api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  const searchProducts = async () => {
    setError('');
    try {
      const res = await api.get(`/search?query=${encodeURIComponent(query)}`);
      setProducts(res.data);
      setSelectedProduct(null);
      setReviews([]);
    } catch (err) {
      setProducts([]);
      setError(err.response?.data?.error || 'Search failed');
    }
  };

  const loadReviews = async (productId) => {
    const res = await api.get(`/reviews?product_id=${productId}`);
    setReviews(res.data);
  };

  const openProduct = async (product) => {
    setSelectedProduct(product);
    await loadReviews(product.id);
  };

  const addReview = async () => {
    if (!selectedProduct) return;
    try {
      await api.post('/review', { product_id: selectedProduct.id, comment });
      setComment('');
      await loadReviews(selectedProduct.id);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add review');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h2 style={{ margin: 0 }}>Product Search</h2>
        <p style={{ marginTop: 6, color: '#5d6d7e' }}>Protected against blind and time-based SQL injection with input checks and parameterized queries.</p>
        <div style={styles.searchBox}>
          <input style={styles.input} placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button style={styles.button} onClick={searchProducts}>Search</button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            <h3 style={{ color: '#2C3E50' }}>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>₹ {product.price}</strong></p>
            <p>{product.category}</p>
            <button style={styles.button} onClick={() => openProduct(product)}>View Reviews</button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div style={styles.panel}>
          <h3>{selectedProduct.name} Reviews</h3>
          {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              <strong>{review.username}</strong>
              <p>{review.comment}</p>
            </div>
          ))}
          <textarea style={styles.textarea} value={comment} placeholder="Write a review" onChange={(e) => setComment(e.target.value)} />
          <button style={styles.button} onClick={addReview}>Submit Review</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: 24 },
  hero: { background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 8px 28px rgba(44,62,80,0.08)' },
  searchBox: { display: 'flex', gap: 12, marginTop: 12 },
  input: { flex: 1, padding: 12, borderRadius: 8, border: '1px solid #c7d0d9' },
  button: { padding: '12px 16px', border: 'none', borderRadius: 8, background: '#2C3E50', color: '#fff', cursor: 'pointer' },
  error: { color: '#b03a2e' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 24 },
  card: { background: '#FFFFFF', borderRadius: 16, padding: 20, boxShadow: '0 8px 28px rgba(44,62,80,0.08)' },
  panel: { background: '#FFFFFF', borderRadius: 16, padding: 20, boxShadow: '0 8px 28px rgba(44,62,80,0.08)', marginTop: 24 },
  reviewCard: { padding: 12, borderRadius: 10, background: '#eef2f6', marginBottom: 10 },
  textarea: { width: '100%', minHeight: 100, padding: 12, borderRadius: 8, border: '1px solid #c7d0d9', marginBottom: 12 }
};
