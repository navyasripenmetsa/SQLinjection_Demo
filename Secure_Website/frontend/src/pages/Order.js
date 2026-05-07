import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function Order() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/order?id=${id}`);
        setOrder(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not load order');
      }
    };
    load();
  }, [id]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ color: '#2C3E50' }}>Order Details</h2>
        {error && <p style={styles.error}>{error}</p>}
        {order && (
          <div>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Product:</strong> {order.product_name}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Total Price:</strong> ₹ {order.total_price}</p>
            <p><strong>Created At:</strong> {String(order.created_at)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24 },
  card: { background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 8px 28px rgba(44,62,80,0.08)' },
  error: { color: '#b03a2e' }
};
