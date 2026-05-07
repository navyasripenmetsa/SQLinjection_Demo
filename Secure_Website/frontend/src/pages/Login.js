import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const res = await api.post('/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', String(res.data.user_id));
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      navigate('/search');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Secure Login</h2>
        <p style={styles.subtitle}>Protected against SQL injection using parameterized queries and password hashing.</p>
        <input style={styles.input} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} onClick={handleLogin}>Login</button>
        <button style={styles.secondary} onClick={() => navigate('/register')}>Create Account</button>
        <div style={styles.demoBox}>
          <div><strong>Demo accounts</strong></div>
          <div>admin / Password@123</div>
          <div>user1 / Password@123</div>
          <div>user2 / Password@123</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F5F5F5' },
  card: { width: 380, background: '#FFFFFF', borderRadius: 16, padding: 28, boxShadow: '0 8px 28px rgba(44,62,80,0.12)' },
  title: { margin: 0, color: '#2C3E50' },
  subtitle: { color: '#5d6d7e', fontSize: 14, lineHeight: 1.5 },
  input: { width: '100%', padding: 12, marginTop: 12, borderRadius: 8, border: '1px solid #c7d0d9' },
  button: { width: '100%', padding: 12, marginTop: 14, border: 'none', borderRadius: 8, background: '#2C3E50', color: '#fff', cursor: 'pointer' },
  secondary: { width: '100%', padding: 12, marginTop: 10, border: 'none', borderRadius: 8, background: '#95A5A6', color: '#fff', cursor: 'pointer' },
  error: { color: '#b03a2e', fontSize: 14 },
  demoBox: { marginTop: 18, padding: 12, borderRadius: 8, background: '#eef2f6', color: '#2d2d2d', fontSize: 14 }
};
