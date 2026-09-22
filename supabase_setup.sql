-- Ejecuta este script en Supabase: Dashboard → SQL Editor → New query → Run

create table respuestas (
  id uuid primary key default gen_random_uuid(),
  nombre text,
  empresa text,
  email text,
  overall_score numeric,
  overall_level text,
  theme_scores jsonb,
  answers jsonb,
  created_at timestamptz default now()
);

-- Row Level Security: cualquiera puede GUARDAR una respuesta (insert) o completarla
-- luego con sus puntajes (update), pero NADIE puede leer (select) las respuestas de
-- otros desde la app pública. Tú sí las ves todas desde el Table Editor de Supabase,
-- con tu propia sesión de administrador (esa vista no pasa por estas políticas).
-- El id es un UUID no adivinable, así que nadie puede "actualizar" el registro de otra
-- persona sin conocer su id exacto.
alter table respuestas enable row level security;

create policy "cualquiera puede guardar una respuesta" on respuestas
  for insert
  with check (true);

create policy "cualquiera puede completar su propia respuesta con los puntajes" on respuestas
  for update
  using (true)
  with check (true);

-- Nota: no se crea política de "select", así que la lectura pública queda bloqueada
-- por defecto. Para ver los leads, entra a Supabase → Table Editor → respuestas.
