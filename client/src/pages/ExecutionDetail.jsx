import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExecution } from '../services/api';
import toast from 'react-hot-toast';

const ExecutionDetail = () => {
  const { id } = useParams();
  const [execution, setExecution] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getExecution(id);
        setExecution(res.data.data.execution);
        setLogs(res.data.data.logs);
      } catch (err) {
        toast.error('Failed to load execution details');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const getStatusClass = (status) => {
    const map = {
      SUCCESS: 'status-success',
      COMPLETED: 'status-success',
      RUNNING: 'status-running',
      PENDING: 'status-queued',
      FAILED: 'status-failed',
      SKIPPED: 'status-created',
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

  if (!execution) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Execution not found</h3>
          <Link to="/executions" className="btn-secondary">Back to Executions</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link to="/executions" className="back-link">← Back to Executions</Link>
          <h1>Execution Details</h1>
          <p className="subtitle">Workflow: {execution.workflowId?.name || 'Unknown'}</p>
        </div>
        <span className={`status-badge large ${getStatusClass(execution.status)}`}>
          {execution.status}
        </span>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <label>Started</label>
          <p>{execution.startedAt ? new Date(execution.startedAt).toLocaleString() : '—'}</p>
        </div>
        <div className="detail-card">
          <label>Completed</label>
          <p>{execution.completedAt ? new Date(execution.completedAt).toLocaleString() : '—'}</p>
        </div>
        <div className="detail-card">
          <label>Duration</label>
          <p>{execution.startedAt && execution.completedAt
            ? `${((new Date(execution.completedAt) - new Date(execution.startedAt)) / 1000).toFixed(2)}s`
            : '—'}</p>
        </div>
        <div className="detail-card">
          <label>Retries</label>
          <p>{execution.retryCount || 0}</p>
        </div>
      </div>

      {execution.error && (
        <div className="error-banner">
          <strong>Error:</strong> {execution.error}
        </div>
      )}

      <div className="section">
        <h2>Node Execution Logs</h2>
        {logs.length === 0 ? (
          <p className="text-muted">No execution logs available</p>
        ) : (
          <div className="timeline">
            {logs.map((log, i) => (
              <div key={log._id} className={`timeline-item ${getStatusClass(log.status)}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="node-label">{log.nodeId?.label || 'Node'}</span>
                    <span className="node-type">{log.nodeId?.type || ''}</span>
                    <span className={`status-badge small ${getStatusClass(log.status)}`}>{log.status}</span>
                  </div>
                  <p className="timeline-message">{log.message}</p>
                  {log.duration > 0 && <span className="timeline-duration">{log.duration}ms</span>}
                  {log.output && (
                    <details className="log-output">
                      <summary>Output</summary>
                      <pre>{JSON.stringify(log.output, null, 2)}</pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionDetail;
