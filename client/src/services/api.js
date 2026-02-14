import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Workflows
export const getWorkflows = () => API.get('/workflows');
export const getWorkflow = (id) => API.get(`/workflows/${id}`);
export const createWorkflow = (data) => API.post('/workflows', data);
export const updateWorkflow = (id, data) => API.put(`/workflows/${id}`, data);
export const deleteWorkflow = (id) => API.delete(`/workflows/${id}`);

// Executions
export const executeWorkflow = (workflowId) => API.post(`/executions/${workflowId}/execute`);
export const getExecutions = () => API.get('/executions');
export const getExecution = (id) => API.get(`/executions/${id}`);
export const getExecutionLogs = (id) => API.get(`/executions/${id}/logs`);

export default API;
