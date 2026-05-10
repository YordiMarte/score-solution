'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Shield, TrendingUp } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Correo o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0F0F0F' }}>
      {/* LEFT - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#3ECF8E' }}>
            <TrendingUp size={18} color="#000" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">
            Score Solution
          </span>
        </div>

        {/* Form */}
        <div className="max-w-sm w-full mx-auto animate-[slideUp_0.5s_ease-out]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Bienvenido de nuevo
            </h1>
            <p style={{ color: '#666', fontSize: '0.92rem' }}>
              Inicia sesión en tu cuenta
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#bbb' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium" style={{ color: '#bbb' }}>
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#555' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm px-4 py-3 rounded-lg border" style={{
                color: '#f87171',
                background: 'rgba(248,113,113,0.08)',
                borderColor: 'rgba(248,113,113,0.2)'
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : 'Iniciar sesión'}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-6 flex items-center gap-2 text-xs" style={{ color: '#444' }}>
            <Shield size={13} />
            <span>Acceso privado · Solo usuarios autorizados</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs" style={{ color: '#333' }}>
          © 2025 Score Solution. Todos los derechos reservados.
        </div>
      </div>

      {/* RIGHT - Decorative Panel */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-center items-center p-16 relative overflow-hidden"
        style={{ background: '#111', borderLeft: '1px solid #1E1E1E' }}
      >
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] pointer-events-none"
          style={{ background: '#3ECF8E' }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#3ECF8E 1px, transparent 1px), linear-gradient(90deg, #3ECF8E 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {[
              { label: 'Clientes Activos', value: '—', icon: '👥' },
              { label: 'Registros Hoy', value: '—', icon: '📋' },
              { label: 'Status OK', value: '100%', icon: '✅' },
              { label: 'Uptime', value: '99.9%', icon: '⚡' },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl p-4 text-left"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E1E1E' }}
              >
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-white font-bold text-xl">{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: '#555' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-white text-2xl font-bold mb-3 leading-snug">
            Gestión de clientes<br />
            <span style={{ color: '#3ECF8E' }}>simple y eficiente</span>
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
            Registra, busca y administra todos tus clientes desde un solo lugar. Rápido, seguro y siempre disponible.
          </p>
        </div>
      </div>
    </div>
  )
}