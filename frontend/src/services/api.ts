import axios from 'axios';

// 1. Création de l'instance Axios avec l'URL de base
const api = axios.create({
  baseURL: 'http://localhost:8081/api', // L'adresse de ton backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Intercepteur : Ajoute automatiquement le Token à chaque requête
api.interceptors.request.use(
  (config) => {
    // On récupère le token stocké dans le navigateur
    const token = localStorage.getItem('token');

    // Si un token existe, on l'ajoute au Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
