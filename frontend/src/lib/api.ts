import axios from 'axios';
import Cookies from 'js-cookie';
import type {
  SimulationParams,
  SimulationResult,
  AuthTokens,
  User,
  LoginPayload,
  RegisterPayload,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth interceptor ─────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('access_token');
      if (typeof window !== 'undefined') window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (payload: LoginPayload): Promise<AuthTokens> => {
    const form = new URLSearchParams();
    form.append('username', payload.email);
    form.append('password', payload.password);
    const res = await api.post<AuthTokens>('/api/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    Cookies.set('access_token', res.data.accessToken, { expires: 1 });
    return res.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthTokens> => {
    const res = await api.post<AuthTokens>('/api/auth/register', payload);
    Cookies.set('access_token', res.data.accessToken, { expires: 1 });
    return res.data;
  },

  me: async (): Promise<User> => {
    const res = await api.get<User>('/api/auth/me');
    return res.data;
  },

  logout: () => {
    Cookies.remove('access_token');
    window.location.href = '/auth/login';
  },
};

// ─── Simulation ───────────────────────────────────────────────────────────────
export const simulationAPI = {
  run: async (
    params: SimulationParams,
    iterations = 2000
  ): Promise<SimulationResult> => {
    const res = await api.post<SimulationResult>('/api/simulation/run', {
      params,
      iterations,
    });
    return res.data;
  },

  scenarios: async () => {
    const res = await api.get('/api/simulation/scenarios');
    return res.data;
  },

  save: async (name: string, params: SimulationParams, result: SimulationResult) => {
    const res = await api.post('/api/simulation/save', { name, params, result });
    return res.data;
  },

  list: async () => {
    const res = await api.get('/api/simulation/list');
    return res.data;
  },
};

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reportsAPI = {
  generate: async (simulationId: number) => {
    const res = await api.post(
      '/api/reports/generate',
      { simulation_id: simulationId },
      { responseType: 'blob' }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `medsim-report-${simulationId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default api;
