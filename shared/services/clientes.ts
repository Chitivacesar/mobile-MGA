import { api } from '@/shared/services/api';

export interface Cliente {
  _id: string;
  nombre: string;
  apellido: string;
  tipo_de_documento?: string;
  documento?: string;
  correo?: string;
  telefono?: string;
}

export const clientesService = {
  list: () => api.get<Cliente[]>('/clientes'),
  get: (id: string) => api.get<Cliente>(`/clientes/${id}`),
  create: (cliente: Omit<Cliente, '_id'>) => api.post<Cliente>('/clientes', cliente),
  update: (id: string, cliente: Partial<Cliente>) => api.put<Cliente>(`/clientes/${id}`, cliente),
  delete: (id: string) => api.delete<{ success: boolean }>(`/clientes/${id}`),
};


