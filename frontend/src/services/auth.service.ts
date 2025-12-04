import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

export const authService = {
  // Fonction d'inscription
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Fonction de connexion (on la prépare pour après)
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Utilitaire pour déconnecter (supprimer le token)
  logout: () => {
    localStorage.removeItem('token');
  }
};