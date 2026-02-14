import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">System monitoring and user management</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>👥</div>
          <div className="stat-info">
            <h3>—</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>🏭</div>
          <div className="stat-info">
            <h3>—</h3>
            <p>Active Workers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>📊</div>
          <div className="stat-info">
            <h3>—</h3>
            <p>System Load</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>⚠️</div>
          <div className="stat-info">
            <h3>—</h3>
            <p>Failed Jobs (24h)</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>System Logs</h2>
        <div className="empty-state">
          <p>Admin monitoring features coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
