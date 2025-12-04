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
  
  // Ce que le backend nous renvoie (le Token)
  export interface AuthResponse {
    token: string;
  }