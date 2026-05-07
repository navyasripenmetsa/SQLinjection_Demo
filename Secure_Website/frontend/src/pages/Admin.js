import { useEffect, useState } from 'react';
import api from '../api';

export default function Admin() {
  const [data, setData] = useState({ message: '', logs: [], reviews: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/reviews');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not load admin data');
      }
    };
    load();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ color: '#2C3E50' }}>Admin Panel</h2>
        <p style={styles.info}>This secure admin panel safely reviews stored comments without reusing them in dynamic SQL.</p>
        {error && <p style={styles.error}>{error}</p>}
        {data.message && <p style={styles.success}>{data.message}</p>}
        <div style={styles.logBox}>
          {data.logs.map((log, index) => <p key={index}>• {log}</p>)}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24 },
  card: { background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 8px 28px rgba(44,62,80,0.08)' },
  info: { color: '#5d6d7e' },
  success: { color: '#1e8449' },
  error: { color: '#b03a2e' },
  logBox: { marginTop: 18, background: '#eef2f6', padding: 16, borderRadius: 12 }
};
