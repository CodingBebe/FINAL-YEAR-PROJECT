import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Risk related API calls
export const riskApi = {
  // Register a new risk
  registerRisk: async (riskData: {
    title: string;
    description: string;
    causes: string;
    consequences: string;
  }) => {
    try {
      const response = await api.post('/risks', riskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all risks
  getAllRisks: async () => {
    try {
      const response = await api.get('/risks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single risk by ID
  getRiskById: async (id: string) => {
    try {
      const response = await api.get(`/risks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api; 