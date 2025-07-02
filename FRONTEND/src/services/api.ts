import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api',
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

  // Get a single risk by riskId
  getRiskById: async (riskId: string) => {
    try {
      const response = await api.get(`/risks/${riskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get risks for the logged-in champion
  getChampionRisks: async () => {
    try {
      const response = await api.get('/risks/champion');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new submission
  createSubmission: async (submissionData: any) => {
    try {
      const response = await api.post('/submissions', submissionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all submissions
  getAllSubmissions: async () => {
    const response = await api.get('/submissions');
    return response.data;
  },

  // Committee Dashboard Analytics
  getSeverityDistribution: async () => {
    const response = await api.get('/submissions/analytics/severity-distribution');
    return response.data;
  },
  getRiskTrends: async () => {
    const response = await api.get('/submissions/analytics/risk-trends');
    return response.data;
  },
  getUnitRiskBreakdown: async () => {
    const response = await api.get('/submissions/analytics/unit-breakdown');
    return response.data;
  },
  getQuarterlyRiskBreakdown: async () => {
    const response = await api.get('/submissions/analytics/quarterly-breakdown');
    return response.data;
  },
};

export default api; 