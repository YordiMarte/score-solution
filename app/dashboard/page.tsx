'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Cliente } from '@/types'
import {
  Search, Plus, LogOut, TrendingUp, Users,
  CheckCircle2, Clock, XCircle, RefreshCw
} from 'lucide-react'
import ClienteModal from './components/ClienteModal'
import ClienteRow from './components/ClienteRow'
import DeleteModal from './components/DeleteModal'

export default function DashboardPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtered, setFiltered] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCliente, setEditCliente] = useState<Cliente | null>(null)
  const [deleteCliente, setDeleteCliente] = useState<Cliente | null>(null)
  const [userEmail, setUserEmail] = useState('')

  const fetchClientes = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setClientes(data)
      setFiltered(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      setUserEmail(session.user.email || '')
      fetchClientes()
    })
  }, [router, fetchClientes])

  useEffect(() => {
    const q = search.toLowerCase().trim()
    if (!q) { setFiltered(clientes); return }
    setFiltered(clientes.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.cedula.toLowerCase().includes(q) ||
      c.telefono.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q) ||
      c.indicacion.toLowerCase().includes(q)
    ))
  }, [search, clientes])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSaved = () => {
    setModalOpen(false)
    setEditCliente(null)
    fetchClientes()
  }

  const handleEdit = (c: Cliente) => {
    setEditCliente(c)
    setModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteCliente) return
    await supabase.from('clientes').delete().eq('id', deleteCliente.id)
    setDeleteCliente(null)
    fetchClientes()
  }

  const stats = {
    total: clientes.length,
    activos: clientes.filter(c => c.status === 'activo').length,
    pendientes: clientes.filter(c => c.status === 'pendiente').length,
    inactivos: clientes.filter(c => c.status === 'inactivo').length,
  }

  return (
    <div className="min-h-screen" style={{ background: '#0F0F0F' }}>
      {/* TOP NAV */}
      <nav className="border-b sticky top-0 z-40" style={{
        background: 'rgba(15,15,15,0.9)',
        borderColor: '#1E1E1E',
        backdropFilter: 'blur(12px)'
      }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#3ECF8E' }}>
              <TrendingUp size={15} color="#000" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-white text-base tracking-tight">Score Solution</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: '#555' }}>{userEmail}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: '#888', border: '1px solid #242424' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#f87171', e.currentTarget.style.color = '#f87171')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#242424', e.currentTarget.style.color = '#888')}
            >
              <LogOut size={13} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Clientes', value: stats.total, icon: Users, color: '#3ECF8E' },
            { label: 'Activos', value: stats.activos, icon: CheckCircle2, color: '#3ECF8E' },
            { label: 'Pendientes', value: stats.pendientes, icon: Clock, color: '#F59E0B' },
            { label: 'Inactivos', value: stats.inactivos, icon: XCircle, color: '#f87171' },
          ].map((s, i) => (
            <div key={i} className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}15` }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#555' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH + ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#555' }} />
            <input
              type="text"
              placeholder="Buscar por nombre, cédula, teléfono, status..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={fetchClientes} className="btn-secondary px-3" title="Actualizar">
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => { setEditCliente(null); setModalOpen(true) }}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={16} />
              Nuevo Cliente
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #1E1E1E', background: '#111' }}>
                  {['Nombre', 'Cédula', 'Teléfono', 'Status', 'Indicación', 'Acciones'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider"
                      style={{ color: '#555' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none" style={{ color: '#3ECF8E' }}>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2"/>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        <span style={{ color: '#444', fontSize: '0.85rem' }}>Cargando clientes...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2">
                        <Users size={32} style={{ color: '#2A2A2A' }} />
                        <p style={{ color: '#444', fontSize: '0.9rem' }}>
                          {search ? 'No se encontraron resultados' : 'No hay clientes registrados'}
                        </p>
                        {!search && (
                          <button onClick={() => { setEditCliente(null); setModalOpen(true) }}
                            className="mt-2 text-xs px-3 py-1.5 rounded-lg transition-colors"
                            style={{ color: '#3ECF8E', border: '1px solid #3ECF8E22' }}>
                            + Agregar primer cliente
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <ClienteRow
                      key={c.id}
                      cliente={c}
                      index={i}
                      onEdit={() => handleEdit(c)}
                      onDelete={() => setDeleteCliente(c)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-5 py-3 flex items-center justify-between border-t" style={{ borderColor: '#1E1E1E' }}>
              <span className="text-xs" style={{ color: '#444' }}>
                {filtered.length} de {clientes.length} clientes
              </span>
              {search && (
                <button onClick={() => setSearch('')} className="text-xs transition-colors"
                  style={{ color: '#555' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#3ECF8E')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                  Limpiar búsqueda
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {modalOpen && (
        <ClienteModal
          cliente={editCliente}
          onClose={() => { setModalOpen(false); setEditCliente(null) }}
          onSaved={handleSaved}
        />
      )}
      {deleteCliente && (
        <DeleteModal
          nombre={deleteCliente.nombre}
          onConfirm={handleDelete}
          onCancel={() => setDeleteCliente(null)}
        />
      )}
    </div>
  )
}