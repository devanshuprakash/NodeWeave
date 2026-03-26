import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkflows, getExecutions } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    workflows: 0,
    executions: 0,
    completed: 0,
    failed: 0,
  });
  const [recentExecutions, setRecentExecutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wfRes, exRes] = await Promise.all([getWorkflows(), getExecutions()]);
        const workflows = wfRes.data.data;
        const executions = exRes.data.data;

        setStats({
          workflows: workflows.length,
          executions: executions.length,
          completed: executions.filter((e) => e.status === 'COMPLETED').length,
          failed: executions.filter((e) => e.status === 'FAILED').length,
        });
        setRecentExecutions(executions.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusClass = (status) => {
    const map = {
      COMPLETED: 'status-success',
      RUNNING: 'status-running',
      QUEUED: 'status-queued',
      FAILED: 'status-failed',
      CREATED: 'status-created',
      RETRIED: 'status-retried',
    };
    return map[status] || '';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-screen"><div className="spinner"></div><p>Loading dashboard...</p></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name} 👋</h1>
          <p className="subtitle">Here's your workflow automation overview</p>
        </div>
        <Link to="/workflows" className="btn-primary">+ New Workflow</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>📐</div>
          <div className="stat-info">
            <h3>{stats.workflows}</h3>
            <p>Total Workflows</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>⚡</div>
          <div className="stat-info">
            <h3>{stats.executions}</h3>
            <p>Total Executions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>✅</div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>❌</div>
          <div className="stat-info">
            <h3>{stats.failed}</h3>
            <p>Failed</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Recent Executions</h2>
        {recentExecutions.length === 0 ? (
          <div className="empty-state">
            <p>No executions yet. Create a workflow and run it!</p>
            <Link to="/workflows" className="btn-secondary">Create Workflow</Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Workflow</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentExecutions.map((ex) => (
                  <tr key={ex._id}>
                    <td>{ex.workflowId?.name || 'Unknown'}</td>
                    <td><span className={`status-badge ${getStatusClass(ex.status)}`}>{ex.status}</span></td>
                    <td>{new Date(ex.createdAt).toLocaleString()}</td>
                    <td><Link to={`/executions/${ex._id}`} className="btn-link">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

