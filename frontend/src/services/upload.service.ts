import api from './api';

interface UploadResponse {
  url: string;
}

export const uploadService = {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    // Pour FormData, on doit supprimer le Content-Type pour laisser le navigateur
    // le définir automatiquement avec le boundary
    const { data } = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': undefined,
      },
    });

    return data.url;
  },
};
