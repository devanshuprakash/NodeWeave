import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getWorkflow, createWorkflow, updateWorkflow } from '../services/api';
import toast from 'react-hot-toast';

const nodeTypes = [
  { type: 'document_upload', label: '📄 Document Upload', color: '#3b82f6' },
  { type: 'ai_processing', label: '🤖 AI Processing', color: '#8b5cf6' },
  { type: 'conditional', label: '🔀 Conditional', color: '#f59e0b' },
  { type: 'email', label: '📧 Email', color: '#10b981' },
  { type: 'log', label: '📋 Log', color: '#6b7280' },
];

const WorkflowBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [workflowName, setWorkflowName] = useState('');
  const [workflowDesc, setWorkflowDesc] = useState('');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchWorkflow = async () => {
        try {
          const res = await getWorkflow(id);
          const { workflow, nodes: dbNodes, edges: dbEdges } = res.data.data;
          setWorkflowName(workflow.name);
          setWorkflowDesc(workflow.description || '');

          // Convert DB nodes to React Flow format
          const flowNodes = dbNodes.map((n) => ({
            id: n._id,
            position: n.position || { x: Math.random() * 400, y: Math.random() * 400 },
            data: { label: n.label, type: n.type, config: n.config },
            style: {
              background: nodeTypes.find((nt) => nt.type === n.type)?.color || '#6b7280',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 20px',
              border: '2px solid rgba(255,255,255,0.2)',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            },
          }));

          const flowEdges = dbEdges.map((e) => ({
            id: e._id,
            source: e.source,
            target: e.target,
            label: e.label || '',
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 },
          }));

          setNodes(flowNodes);
          setEdges(flowEdges);
        } catch (err) {
          toast.error('Failed to load workflow');
          navigate('/workflows');
        } finally {
          setLoading(false);
        }
      };
      fetchWorkflow();
    }
  }, [id, isEditing, navigate]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }, eds));
  }, []);

  const addNode = (type) => {
    const nodeType = nodeTypes.find((n) => n.type === type);
    const newNode = {
      id: `node_${Date.now()}`,
      position: { x: 250 + Math.random() * 200, y: 100 + nodes.length * 120 },
      data: { label: nodeType.label, type, config: {} },
      style: {
        background: nodeType.color,
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 20px',
        border: '2px solid rgba(255,255,255,0.2)',
        fontSize: '13px',
        fontWeight: 600,
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = async () => {
    if (!workflowName.trim()) {
      return toast.error('Workflow name is required');
    }
    if (nodes.length === 0) {
      return toast.error('Add at least one node');
    }

    setSaving(true);
    try {
      // Convert React Flow nodes/edges to DB format
      const dbNodes = nodes.map((n, i) => ({
        tempId: n.id,
        type: n.data.type,
        label: n.data.label,
        config: n.data.config || {},
        position: n.position,
      }));

      const dbEdges = edges.map((e) => ({
        source: e.source,
        target: e.target,
        label: e.label || '',
      }));

      const payload = {
        name: workflowName,
        description: workflowDesc,
        nodes: dbNodes,
        edges: dbEdges,
      };

      if (isEditing) {
        await updateWorkflow(id, payload);
        toast.success('Workflow updated!');
      } else {
        await createWorkflow(payload);
        toast.success('Workflow created!');
        navigate('/workflows');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-screen"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="builder-page">
      <div className="builder-sidebar">
        <h3>Workflow Details</h3>
        <div className="form-group">
          <label>Name</label>
          <input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="My Workflow"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={workflowDesc}
            onChange={(e) => setWorkflowDesc(e.target.value)}
            placeholder="What does this workflow do?"
            rows={3}
          />
        </div>

        <h3>Add Nodes</h3>
        <div className="node-palette">
          {nodeTypes.map((nt) => (
            <button
              key={nt.type}
              className="palette-node"
              style={{ borderLeft: `4px solid ${nt.color}` }}
              onClick={() => addNode(nt.type)}
            >
              {nt.label}
            </button>
          ))}
        </div>

        {selectedNode && (
          <div className="node-config">
            <h3>Node Config</h3>
            <p className="config-type">{selectedNode.data.label}</p>
            <p className="config-id">ID: {selectedNode.id}</p>
          </div>
        )}

        <div className="builder-actions">
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Update Workflow' : 'Save Workflow'}
          </button>
          <button onClick={() => navigate('/workflows')} className="btn-secondary">Cancel</button>
        </div>
      </div>

      <div className="builder-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          style={{ backgroundColor: '#0f0f23' }}
        >
          <Background color="#1e1e3f" gap={20} />
          <Controls />
          <MiniMap
            style={{ background: '#1a1a2e' }}
            nodeColor={(n) => n.style?.background || '#6366f1'}
          />
          <Panel position="top-right">
            <div className="canvas-info">
              {nodes.length} nodes • {edges.length} edges
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
