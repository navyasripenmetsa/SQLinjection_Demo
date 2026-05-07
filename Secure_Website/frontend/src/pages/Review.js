import { useEffect, useState } from 'react';
import api from '../api';

export default function Review() {
  const [productId, setProductId] = useState('1');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');

  const loadReviews = async () => {
    const res = await api.get(`/reviews?product_id=${productId}`);
    setReviews(res.data);
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const submit = async () => {
    try {
      const res = await api.post('/review', { product_id: Number(productId), comment });
      setMessage(res.data.message);
      setComment('');
      loadReviews();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not submit review');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ color: '#2C3E50' }}>Reviews</h2>
        <p style={styles.note}>Second-order SQL injection is mitigated here because stored input is never executed as SQL later.</p>
        <input style={styles.input} value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="Product ID" />
        <textarea style={styles.textarea} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review" />
        <button style={styles.button} onClick={submit}>Submit Review</button>
        {message && <p>{message}</p>}
        <div style={styles.list}>
          {reviews.map((review) => (
            <div key={review.id} style={styles.item}>
              <strong>{review.username}</strong>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24 },
  card: { background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 8px 28px rgba(44,62,80,0.08)' },
  note: { color: '#5d6d7e' },
  input: { width: '100%', padding: 12, marginTop: 12, borderRadius: 8, border: '1px solid #c7d0d9' },
  textarea: { width: '100%', minHeight: 100, marginTop: 12, padding: 12, borderRadius: 8, border: '1px solid #c7d0d9' },
  button: { padding: '12px 16px', marginTop: 12, border: 'none', borderRadius: 8, background: '#2C3E50', color: '#fff', cursor: 'pointer' },
  list: { marginTop: 20 },
  item: { background: '#eef2f6', borderRadius: 10, padding: 12, marginBottom: 10 }
};
