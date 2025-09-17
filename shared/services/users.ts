import { api } from '@/shared/services/api';

export interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  tipo_de_documento: string;
  documento: string;
  correo: string;
  estado: boolean;
  rol: string;
  createdAt?: string;
  updatedAt?: string;
}

export const usersService = {
  list: () => api.get<{success: boolean, usuarios: Usuario[]}>('/api/usuarios', { timeout: 3000 }),
  get: (id: string) => api.get<Usuario>(`/api/usuarios/${id}`, { timeout: 3000 }),
  create: (usuario: Omit<Usuario, '_id'>) => api.post<Usuario>('/api/usuarios', usuario, { timeout: 5000 }),
  update: (id: string, usuario: Partial<Usuario>) => api.put<Usuario>(`/api/usuarios/${id}`, usuario, { timeout: 5000 }),
  delete: (id: string) => api.delete<{ success: boolean }>(`/api/usuarios/${id}`, { timeout: 3000 }),
};


