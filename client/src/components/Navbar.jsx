import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">◈</span>
          Shop<span className="brand-accent">EZ</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Shop</Link>
          {user && !user.isAdmin && <Link to="/profile">My Orders</Link>}
          {user?.isAdmin && <Link to="/admin">Dashboard</Link>}
        </nav>

        <div className="nav-actions">
          {!user?.isAdmin && (
            <Link to="/cart" className="cart-btn" aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 6 5 3H3" />
              </svg>
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
          )}

          {user ? (
            <div className="user-menu">
              <span className="user-greet">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-dark">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
