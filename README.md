# Evaluación de Madurez — Arkitekt

Encuesta de 16 preguntas para prospectos, con puntaje de madurez y recomendaciones
por tema. Las respuestas (y el correo, si el prospecto lo deja) quedan guardadas en
Supabase — tú las consultas desde el Table Editor, nadie más puede leerlas.

Mismo montaje que la herramienta anterior: **GitHub** (guarda el código) →
**Vercel** (lo publica como página web) → **Supabase** (guarda los datos).
Como ya tienes cuentas en los tres, este despliegue es más corto que el anterior.

---

## 1. Crear un nuevo proyecto en Supabase

Puede ser un proyecto nuevo (recomendado, para mantenerlo separado de la otra
herramienta) o una tabla nueva dentro del mismo proyecto que ya tienes — como prefieras.

1. En [supabase.com](https://supabase.com), dale a **New project** (o usa uno existente).
2. **SQL Editor → New query** → pega el contenido de `supabase_setup.sql` → **Run**.
3. **Project Settings → API** (o **Data API**, según la versión) → copia:
   - **Project URL** → sin el `/rest/v1/` al final
   - La llave **publishable** (`sb_publishable_...`) o **anon public**, según cuál te muestre

## 2. Crear un nuevo repositorio en GitHub

1. En GitHub, **New repository** → nómbralo, por ejemplo, `arkitekt-encuesta-madurez`.
2. En la página que aparece, dale a **uploading an existing file**.
3. Arrastra **todo el contenido** de esta carpeta (incluyendo la carpeta `src` completa).
4. **Commit changes**.

## 3. Importar en Vercel

1. **Add New → Project** → busca tu nuevo repositorio → **Import**.
2. Abre **Environment Variables** y agrega:
   - `VITE_SUPABASE_URL` → tu Project URL
   - `VITE_SUPABASE_ANON_KEY` → tu llave publishable/anon
3. **Deploy**. En 1-2 minutos tienes tu link, ej. `arkitekt-encuesta.vercel.app`.
4. (Opcional) Conecta tu dominio propio en **Settings → Domains**.

## Cómo ver los leads que van llegando

Supabase → tu proyecto → **Table Editor** → tabla `respuestas`. Ahí ves cada
evaluación completada, con su puntaje, nivel, y el correo si lo dejaron.

## Notas

- Nombre, empresa y correo se piden **al inicio**, antes de la primera pregunta —
  así el lead queda guardado en Supabase desde ese momento, aunque la persona
  abandone la encuesta a la mitad. Al terminar, esa misma fila se completa con
  sus puntajes y respuestas.
- La app solo puede **guardar** o **completar su propia fila** en Supabase, nunca
  **leer** — así ningún prospecto puede ver las respuestas o correos de otro. Tú sí
  ves todo desde el Table Editor, porque esa vista usa tu sesión de administrador,
  no las reglas públicas.
- Igual que la otra herramienta: nada de esto vive en los servidores de Claude o
  Anthropic — el código está en GitHub, la página en Vercel, y los datos en Supabase.
