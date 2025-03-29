import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkflowList from './pages/WorkflowList';
import WorkflowBuilder from './pages/WorkflowBuilder';
import ExecutionHistory from './pages/ExecutionHistory';
import ExecutionDetail from './pages/ExecutionDetail';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#e2e8f0',
              border: '1px solid #2d2d5e',
            },
          }}
        />
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/workflows" element={<ProtectedRoute><WorkflowList /></ProtectedRoute>} />
          <Route path="/workflows/new" element={<ProtectedRoute><WorkflowBuilder /></ProtectedRoute>} />
          <Route path="/workflows/:id" element={<ProtectedRoute><WorkflowBuilder /></ProtectedRoute>} />
          <Route path="/executions" element={<ProtectedRoute><ExecutionHistory /></ProtectedRoute>} />
          <Route path="/executions/:id" element={<ProtectedRoute><ExecutionDetail /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
