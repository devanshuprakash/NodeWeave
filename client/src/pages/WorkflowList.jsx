import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWorkflows, deleteWorkflow, executeWorkflow } from '../services/api';
import toast from 'react-hot-toast';

const WorkflowList = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const fetchWorkflows = async () => {
    try {
      const res = await getWorkflows();
      setWorkflows(res.data.data);
    } catch (err) {
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkflows(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this workflow?')) return;
    try {
      await deleteWorkflow(id);
      toast.success('Workflow deleted');
      fetchWorkflows();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleExecute = async (id) => {
    try {
      await executeWorkflow(id);
      toast.success('Workflow execution started!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Execution failed');
    }
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
          <h1>Workflows</h1>
          <p className="subtitle">Design and manage your automation workflows</p>
        </div>
        <button onClick={() => navigate('/workflows/new')} className="btn-primary">+ New Workflow</button>
      </div>

      {workflows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📐</div>
          <h3>No workflows yet</h3>
          <p>Create your first workflow to start automating</p>
          <button onClick={() => navigate('/workflows/new')} className="btn-primary">Create Workflow</button>
        </div>
      ) : (
        <div className="workflow-grid">
          {workflows.map((wf) => (
            <div key={wf._id} className="workflow-card">
              <div className="workflow-card-header">
                <h3>{wf.name}</h3>
                <span className={`status-dot ${wf.isActive ? 'active' : 'inactive'}`}></span>
              </div>
              <p className="workflow-desc">{wf.description || 'No description'}</p>
              <p className="workflow-date">Created: {new Date(wf.createdAt).toLocaleDateString()}</p>
              <div className="workflow-actions">
                <Link to={`/workflows/${wf._id}`} className="btn-small btn-secondary">Edit</Link>
                <button onClick={() => handleExecute(wf._id)} className="btn-small btn-accent">▶ Run</button>
                <button onClick={() => handleDelete(wf._id)} className="btn-small btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowList;
