// Ce qu'on envoie pour s'inscrire
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Ce qu'on envoie pour se connecter
export interface LoginRequest {
  email: string;
  password: string;
}

// Informations utilisateur renvoyées par le backend
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  producerId: string | null; // null si l'utilisateur n'est pas producteur
}

// Ce que le backend nous renvoie (le Token + User)
export interface AuthResponse {
  token: string;
  user: User;
}
