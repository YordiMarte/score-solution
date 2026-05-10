export interface Cliente {
  id: string
  nombre: string
  cedula: string
  telefono: string
  telefono2?: string
  status: 'activo' | 'inactivo' | 'pendiente'
  indicacion: string
  created_at: string
  updated_at: string
}

export type ClienteStatus = 'activo' | 'inactivo' | 'pendiente'