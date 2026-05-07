import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setMessage('');
    try {
      const res = await api.post('/register', form);
      setMessage(res.data.message || 'Registered successfully');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        <input style={styles.input} placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input style={styles.input} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {message && <p style={styles.message}>{message}</p>}
        <button style={styles.button} onClick={handleRegister}>Register</button>
        <button style={styles.secondary} onClick={() => navigate('/')}>Back to Login</button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F5F5F5' },
  card: { width: 380, background: '#FFFFFF', borderRadius: 16, padding: 28, boxShadow: '0 8px 28px rgba(44,62,80,0.12)' },
  title: { margin: 0, color: '#2C3E50' },
  input: { width: '100%', padding: 12, marginTop: 12, borderRadius: 8, border: '1px solid #c7d0d9' },
  button: { width: '100%', padding: 12, marginTop: 14, border: 'none', borderRadius: 8, background: '#2C3E50', color: '#fff', cursor: 'pointer' },
  secondary: { width: '100%', padding: 12, marginTop: 10, border: 'none', borderRadius: 8, background: '#95A5A6', color: '#fff', cursor: 'pointer' },
  message: { color: '#2C3E50', fontSize: 14 }
};
