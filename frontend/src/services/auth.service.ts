import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

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

  // Récupérer les informations de l'utilisateur connecté
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  // Utilitaire pour déconnecter (supprimer le token)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};