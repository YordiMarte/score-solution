# Score Solution

Sistema de gestión de clientes — privado.

## Stack
- **Frontend:** Next.js 14 + Tailwind CSS
- **Auth & DB:** Supabase
- **Deploy:** Vercel

## Setup local

1. Clona el repo
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de variables:
   ```bash
   cp .env.example .env.local
   ```
4. Llena `.env.local` con tus claves de Supabase
5. Crea la tabla en Supabase (ver abajo)
6. Corre el proyecto:
   ```bash
   npm run dev
   ```

## Tabla en Supabase

Ejecuta este SQL en **Supabase → SQL Editor**:

```sql
create table clientes (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  cedula text not null,
  telefono text not null,
  telefono2 text,
  status text not null default 'activo' check (status in ('activo', 'inactivo', 'pendiente')),
  indicacion text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habilitar RLS
alter table clientes enable row level security;

-- Solo usuarios autenticados pueden acceder
create policy "Solo usuarios autenticados" on clientes
  for all using (auth.role() = 'authenticated');
```

## Deploy en Vercel

1. Push a GitHub
2. Importa en Vercel
3. Agrega las variables de entorno en Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy ✅