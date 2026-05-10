'use client'

import { AlertTriangle } from 'lucide-react'

interface Props {
  nombre: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteModal({ nombre, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-sm animate-[slideUp_0.3s_ease-out] text-center p-8"
        style={{ background: '#161616', border: '1px solid #242424', borderRadius: '16px' }}>

        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: '#f8717115' }}>
          <AlertTriangle size={22} style={{ color: '#f87171' }} />
        </div>

        <h3 className="text-white font-semibold text-base mb-2">¿Eliminar cliente?</h3>
        <p className="text-sm mb-6" style={{ color: '#666' }}>
          Vas a eliminar a <strong className="text-white">{nombre}</strong>. Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-[0.98]"
            style={{ background: '#f87171', color: '#000' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#ef4444')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f87171')}
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}