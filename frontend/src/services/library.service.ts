import api from './api';
import type { Track } from '../types/track';

/**
 * Service pour gérer la bibliothèque client.
 * Récupère les tracks achetées par l'utilisateur connecté.
 */

/**
 * Récupère la liste des tracks achetées par l'utilisateur.
 * @returns Promise contenant la liste des Track
 */
export const getPurchasedTracks = async (): Promise<Track[]> => {
  try {
    const response = await api.get<Track[]>('/library');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la bibliothèque :', error);
    throw error;
  }
};
