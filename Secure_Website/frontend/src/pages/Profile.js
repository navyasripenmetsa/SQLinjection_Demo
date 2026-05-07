import { useEffect, useState } from 'react';
import api from '../api';

export default function Profile() {
  const userId = localStorage.getItem('user_id');
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '' });
  const [message, setMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/${userId}`);
      setUser(res.data);
      setForm({ username: res.data.username, email: res.data.email });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await api.post('/update-profile', { user_id: Number(userId), ...form });
      setMessage(res.data.message);
      fetchProfile();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ color: '#2C3E50' }}>Profile</h2>
        {user && (
          <>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Last Processed:</strong> {user.last_processed ? String(user.last_processed) : 'N/A'}</p>
            <input style={styles.input} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input style={styles.input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <p style={styles.note}>Role updates are intentionally blocked here to prevent privilege escalation.</p>
            <button style={styles.button} onClick={handleUpdate}>Update Profile</button>
          </>
        )}
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: 420, background: '#FFFFFF', borderRadius: 16, padding: 28, boxShadow: '0 8px 28px rgba(44,62,80,0.08)' },
  input: { width: '100%', padding: 12, marginTop: 12, borderRadius: 8, border: '1px solid #c7d0d9' },
  button: { width: '100%', padding: 12, marginTop: 16, border: 'none', borderRadius: 8, background: '#2C3E50', color: '#fff', cursor: 'pointer' },
  note: { fontSize: 13, color: '#5d6d7e' },
  message: { color: '#2C3E50' }
};
