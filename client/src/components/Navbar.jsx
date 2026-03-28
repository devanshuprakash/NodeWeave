import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">
          <span className="brand-icon">◆</span>
          <span className="brand-text">NodeWeave</span>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/dashboard" className={isActive('/dashboard')}>
          Dashboard
        </Link>
        <Link to="/workflows" className={isActive('/workflows')}>
          Workflows
        </Link>
        <Link to="/executions" className={isActive('/executions')}>
          Executions
        </Link>
        {user.role === 'admin' && (
          <Link to="/admin" className={isActive('/admin')}>
            Admin
          </Link>
        )}
      </div>
      <div className="nav-user">
        <span className="user-badge">{user.role}</span>
        <span className="user-name">{user.name}</span>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

