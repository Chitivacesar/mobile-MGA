import { api } from '@/shared/services/api';

export interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  tipo_de_documento: string;
  documento: string;
  correo: string;
  estado: boolean;
}

export const usersService = {
  list: () => api.get<Usuario[]>('/usuarios'),
  get: (id: string) => api.get<Usuario>(`/usuarios/${id}`),
  create: (usuario: Omit<Usuario, '_id'>) => api.post<Usuario>('/usuarios', usuario),
  update: (id: string, usuario: Partial<Usuario>) => api.put<Usuario>(`/usuarios/${id}`, usuario),
  delete: (id: string) => api.delete<{ success: boolean }>(`/usuarios/${id}`),
};


