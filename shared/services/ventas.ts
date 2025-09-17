import { api } from '@/shared/services/api';

export interface Beneficiario {
  _id: string;
  nombre: string;
  apellido: string;
  tipo_de_documento: string;
  numero_de_documento: string;
  telefono: string;
  direccion: string;
  fechaDeNacimiento: string;
  fechaRegistro: string;
  clienteId: string;
  usuario_has_rolId: string;
}

export interface Curso {
  _id: string;
  nombre: string;
  descripcion: string;
  valor_por_hora: number;
  estado: boolean;
}

export interface Matricula {
  _id: string;
  nombre: string;
  valorMatricula: number;
  estado: boolean;
}

export interface Venta {
  _id: string;
  beneficiarioId: Beneficiario;
  matriculaId?: Matricula;
  cursoId?: Curso;
  numero_de_clases?: number;
  ciclo?: number;
  tipo: 'curso' | 'matricula';
  fechaInicio: string;
  fechaFin: string;
  estado: 'vigente' | 'anulada';
  valor_total: number;
  codigoVenta: string;
  createdAt: string;
  updatedAt: string;
  consecutivo: number;
  descuento: number;
  observaciones?: string;
  fechaRegistro: string;
}

export const ventasService = {
  list: () => api.get<Venta[]>('/api/ventas', { timeout: 12000 }),
  get: (id: string) => api.get<Venta>(`/api/ventas/${id}`, { timeout: 12000 }),
  create: (venta: Omit<Venta, '_id'>) => api.post<Venta>('/api/ventas', venta, { timeout: 15000 }),
  update: (id: string, venta: Partial<Venta>) => api.put<Venta>(`/api/ventas/${id}`, venta, { timeout: 15000 }),
  delete: (id: string) => api.delete<{ success: boolean }>(`/api/ventas/${id}`, { timeout: 12000 }),
  
  // Métodos específicos para reportes
  getVentasCursos: async () => {
    const ventas = await ventasService.list();
    return ventas.filter(venta => venta.tipo === 'curso' && venta.estado === 'vigente');
  },
  
  getVentasMatriculas: async () => {
    const ventas = await ventasService.list();
    return ventas.filter(venta => venta.tipo === 'matricula' && venta.estado === 'vigente');
  },
  
  getTotalVentas: async () => {
    const ventas = await ventasService.list();
    const ventasVigentes = ventas.filter(venta => venta.estado === 'vigente');
    return ventasVigentes.reduce((total, venta) => total + venta.valor_total, 0);
  }
};
