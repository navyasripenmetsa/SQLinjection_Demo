import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Review from './pages/Review';
import Orders from './pages/Orders';
import Order from './pages/Order';
import Dashboard from './pages/Dashboard';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = location.pathname === '/' || location.pathname === '/register';

  if (hideNavbar) return null;

  const role = localStorage.getItem('role');

  return (
    <div style={styles.navbar}>
      <div style={styles.brand}>Secure E-Commerce</div>
      <div style={styles.links}>
        <Link to="/search">Home</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/review">Reviews</Link>
        <Link to="/profile">Profile</Link>
        {role === 'admin' && <Link to="/admin">Admin</Link>}
        {role === 'admin' && <Link to="/dashboard">Security Dashboard</Link>}
        <button
          style={styles.logout}
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/review" element={<Review />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 24px',
    background: '#2C3E50',
    color: '#FFFFFF',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  brand: {
    fontWeight: 700,
    fontSize: '20px'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  logout: {
    background: '#95A5A6',
    border: 'none',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};
