'use client'

import { Cliente } from '@/types'
import { Pencil, Trash2, Phone } from 'lucide-react'

const statusConfig = {
  activo: { label: 'Activo', bg: '#3ECF8E15', text: '#3ECF8E', dot: '#3ECF8E' },
  inactivo: { label: 'Inactivo', bg: '#f8717115', text: '#f87171', dot: '#f87171' },
  pendiente: { label: 'Pendiente', bg: '#F59E0B15', text: '#F59E0B', dot: '#F59E0B' },
}

interface Props {
  cliente: Cliente
  index: number
  onEdit: () => void
  onDelete: () => void
}

export default function ClienteRow({ cliente: c, index, onEdit, onDelete }: Props) {
  const st = statusConfig[c.status] || statusConfig.pendiente

  return (
    <tr
      className="group transition-colors"
      style={{
        borderBottom: '1px solid #1A1A1A',
        animationDelay: `${index * 30}ms`,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#141414')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Nombre */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs"
            style={{ background: '#1E1E1E', color: '#3ECF8E' }}>
            {c.nombre.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-white text-sm">{c.nombre}</span>
        </div>
      </td>

      {/* Cédula */}
      <td className="px-5 py-4">
        <span className="font-mono text-xs px-2 py-1 rounded" style={{ color: '#999', background: '#1A1A1A' }}>
          {c.cedula}
        </span>
      </td>

      {/* Teléfono */}
      <td className="px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#ccc' }}>
            <Phone size={12} style={{ color: '#555' }} />
            {c.telefono}
          </div>
          {c.telefono2 && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#555' }}>
              <Phone size={11} style={{ color: '#333' }} />
              {c.telefono2}
            </div>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: st.bg, color: st.text }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.dot }} />
          {st.label}
        </span>
      </td>

      {/* Indicación */}
      <td className="px-5 py-4 max-w-[200px]">
        <p className="text-sm truncate" style={{ color: '#777' }} title={c.indicacion}>
          {c.indicacion || '—'}
        </p>
      </td>

      {/* Acciones */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#555' }}
            title="Editar"
            onMouseEnter={e => (e.currentTarget.style.color = '#3ECF8E', e.currentTarget.style.background = '#3ECF8E15')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555', e.currentTarget.style.background = 'transparent')}>
            <Pencil size={15} />
          </button>
          <button onClick={onDelete}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#555' }}
            title="Eliminar"
            onMouseEnter={e => (e.currentTarget.style.color = '#f87171', e.currentTarget.style.background = '#f8717115')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555', e.currentTarget.style.background = 'transparent')}>
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}