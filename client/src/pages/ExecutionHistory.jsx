import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExecutions } from '../services/api';
import toast from 'react-hot-toast';

const ExecutionHistory = () => {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getExecutions();
        setExecutions(res.data.data);
      } catch (err) {
        toast.error('Failed to load executions');
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
        <div className="loading-screen"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Execution History</h1>
          <p className="subtitle">Track your workflow execution results</p>
        </div>
      </div>

      {executions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚡</div>
          <h3>No executions yet</h3>
          <p>Execute a workflow to see results here</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Workflow</th>
                <th>Status</th>
                <th>Started</th>
                <th>Completed</th>
                <th>Retries</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((ex) => (
                <tr key={ex._id}>
                  <td className="workflow-name-cell">{ex.workflowId?.name || 'Deleted Workflow'}</td>
                  <td><span className={`status-badge ${getStatusClass(ex.status)}`}>{ex.status}</span></td>
                  <td>{ex.startedAt ? new Date(ex.startedAt).toLocaleString() : '—'}</td>
                  <td>{ex.completedAt ? new Date(ex.completedAt).toLocaleString() : '—'}</td>
                  <td>{ex.retryCount || 0}</td>
                  <td><Link to={`/executions/${ex._id}`} className="btn-link">View Logs</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExecutionHistory;
