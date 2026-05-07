import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not load orders');
      }
    };
    load();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ color: '#2C3E50' }}>Orders</h2>
        <p style={styles.note}>Order access is protected with object-level authorization to prevent IDOR.</p>
        {error && <p style={styles.error}>{error}</p>}
        {orders.map((order) => (
          <div key={order.id} style={styles.item}>
            <div>
              <strong>Order #{order.id}</strong>
              <div>{order.product_name}</div>
            </div>
            <Link to={`/order/${order.id}`} style={styles.linkButton}>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24 },
  card: { background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 8px 28px rgba(44,62,80,0.08)' },
  note: { color: '#5d6d7e' },
  error: { color: '#b03a2e' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eef2f6', borderRadius: 10, padding: 14, marginBottom: 10 },
  linkButton: { background: '#2C3E50', color: '#fff', padding: '8px 12px', borderRadius: 8 }
};
