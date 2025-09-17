import { api } from '@/shared/services/api';

export interface Pago {
  _id: string;
  ventaId: string;
  monto: number;
  fechaPago: string;
  metodoPago: 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque';
  estado: 'pendiente' | 'completado' | 'cancelado';
  observaciones?: string;
  referencia?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VentaPago {
  _id: string;
  codigoVenta: string;
  valor_total: number;
  estado: 'vigente' | 'anulada';
  pagos: Pago[];
}

export const pagosService = {
  list: async () => {
    const resp = await api.get<any>('/api/pagos', { timeout: 15000 });
    return Array.isArray(resp) ? resp as Pago[] : (resp?.data as Pago[] | undefined) || [];
  },
  get: (id: string) => api.get<Pago>(`/api/pagos/${id}`, { timeout: 15000 }),
  create: (pago: Omit<Pago, '_id' | 'createdAt' | 'updatedAt'>) => api.post<Pago>('/api/pagos', pago, { timeout: 20000 }),
  update: (id: string, pago: Partial<Pago>) => api.put<Pago>(`/api/pagos/${id}`, pago, { timeout: 20000 }),
  delete: (id: string) => api.delete<{ success: boolean }>(`/api/pagos/${id}`, { timeout: 15000 }),

  // Métodos específicos para reportes
  getPagosCompletados: async () => {
    const pagos = await pagosService.list();
    return pagos.filter(pago => pago.estado === 'completado');
  },
  
  getPagosPendientes: async () => {
    const pagos = await pagosService.list();
    return pagos.filter(pago => pago.estado === 'pendiente');
  },
  
  getTotalPagos: async () => {
    const pagos = await pagosService.list();
    const pagosCompletados = pagos.filter(pago => pago.estado === 'completado');
    return pagosCompletados.reduce((total, pago) => total + pago.monto, 0);
  },

  // Obtener pagos por venta
  getPagosByVenta: async (ventaId: string) => {
    const pagos = await pagosService.list();
    return pagos.filter(pago => pago.ventaId === ventaId);
  }
};
