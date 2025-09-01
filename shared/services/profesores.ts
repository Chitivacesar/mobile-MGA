import { api } from '@/shared/services/api';

export interface Profesor {
  _id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento?: string;
  identificacion?: string;
  telefono?: string;
  correo?: string;
}

export const profesoresService = {
  list: () => api.get<Profesor[]>('/profesores'),
  get: (id: string) => api.get<Profesor>(`/profesores/${id}`),
  create: (profesor: Omit<Profesor, '_id'>) => api.post<Profesor>('/profesores', profesor),
  update: (id: string, profesor: Partial<Profesor>) => api.put<Profesor>(`/profesores/${id}`, profesor),
  delete: (id: string) => api.delete<{ success: boolean }>(`/profesores/${id}`),
};


