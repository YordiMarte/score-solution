'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Cliente, ClienteStatus } from '@/types'
import { X, Save, User, CreditCard, Phone, FileText, Activity } from 'lucide-react'

interface Props {
  cliente: Cliente | null
  onClose: () => void
  onSaved: () => void
}

const initialForm = {
  nombre: '',
  cedula: '',
  telefono: '',
  telefono2: '',
  status: 'activo' as ClienteStatus,
  indicacion: '',
}

export default function ClienteModal({ cliente, onClose, onSaved }: Props) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!cliente

  useEffect(() => {
    if (cliente) {
      setForm({
        nombre: cliente.nombre,
        cedula: cliente.cedula,
        telefono: cliente.telefono,
        telefono2: cliente.telefono2 || '',
        status: cliente.status,
        indicacion: cliente.indicacion,
      })
    } else {
      setForm(initialForm)
    }
  }, [cliente])

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.cedula.trim() || !form.telefono.trim()) {
      setError('Nombre, cédula y teléfono son obligatorios.')
      return
    }
    setLoading(true)
    setError('')

    const payload = {
      nombre: form.nombre.trim(),
      cedula: form.cedula.trim(),
      telefono: form.telefono.trim(),
      telefono2: form.telefono2.trim() || null,
      status: form.status,
      indicacion: form.indicacion.trim(),
      updated_at: new Date().toISOString(),
    }

    let error
    if (isEdit) {
      const res = await supabase.from('clientes').update(payload).eq('id', cliente!.id)
      error = res.error
    } else {
      const res = await supabase.from('clientes').insert([payload])
      error = res.error
    }

    if (error) {
      setError('Error al guardar. Intenta de nuevo.')
      setLoading(false)
      return
    }

    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg animate-[slideUp_0.3s_ease-out]"
        style={{ background: '#161616', border: '1px solid #242424', borderRadius: '16px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#1E1E1E' }}>
          <div>
            <h2 className="text-white font-semibold text-base">
              {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#555' }}>
              {isEdit ? 'Modifica los datos del cliente' : 'Completa el formulario para registrar'}
            </p>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#555' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#242424', e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#555')}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: '#888' }}>
              <User size={12} /> Nombre completo *
            </label>
            <input
              className="input-field"
              placeholder="Ej: Juan Pérez García"
              value={form.nombre}
              onChange={e => handleChange('nombre', e.target.value)}
            />
          </div>

          {/* Cédula */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: '#888' }}>
              <CreditCard size={12} /> Cédula *
            </label>
            <input
              className="input-field"
              placeholder="Ej: 001-1234567-8"
              value={form.cedula}
              onChange={e => handleChange('cedula', e.target.value)}
            />
          </div>

          {/* Teléfonos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: '#888' }}>
                <Phone size={12} /> Teléfono principal *
              </label>
              <input
                className="input-field"
                placeholder="809-000-0000"
                value={form.telefono}
                onChange={e => handleChange('telefono', e.target.value)}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: '#888' }}>
                <Phone size={12} /> Teléfono 2
              </label>
              <input
                className="input-field"
                placeholder="Opcional"
                value={form.telefono2}
                onChange={e => handleChange('telefono2', e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: '#888' }}>
              <Activity size={12} /> Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['activo', 'pendiente', 'inactivo'] as ClienteStatus[]).map(s => {
                const colors = {
                  activo: { text: '#3ECF8E', border: '#3ECF8E' },
                  pendiente: { text: '#F59E0B', border: '#F59E0B' },
                  inactivo: { text: '#f87171', border: '#f87171' },
                }
                const isSelected = form.status === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleChange('status', s)}
                    className="py-2 rounded-lg text-xs font-medium capitalize transition-all"
                    style={{
                      border: `1px solid ${isSelected ? colors[s].border : '#242424'}`,
                      color: isSelected ? colors[s].text : '#555',
                      background: isSelected ? `${colors[s].border}10` : 'transparent',
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Indicación */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: '#888' }}>
              <FileText size={12} /> Indicación / Notas
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Escribe cualquier información relevante sobre el cliente..."
              value={form.indicacion}
              onChange={e => handleChange('indicacion', e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm px-4 py-3 rounded-lg border" style={{
              color: '#f87171', background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)'
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              ) : <Save size={15} />}
              {isEdit ? 'Guardar cambios' : 'Registrar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}