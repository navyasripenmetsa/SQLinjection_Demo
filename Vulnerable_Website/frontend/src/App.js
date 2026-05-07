import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";


function AppContent() {
  const location = useLocation();

  // ❌ Hide navbar on login & register
  const hideNavbar = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {/* 🔝 NAVBAR (only after login) */}
      {!hideNavbar && (
        <div style={{ padding: "10px", background: "#eee" }}>
          <Link to="/search">
            <button>Home</button>
          </Link>

          <Link to="/profile" style={{ float: "right" }}>
            <button>👤 Profile</button>
          </Link>
        </div>
      )}

      {/* 📄 ROUTES */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
