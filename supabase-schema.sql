-- ══════════════════════════════════════════════════════════
-- IAparaseniors — Esquema de Base de Datos (Supabase)
-- Versión Idempotente (Segura para re-ejecutar)
-- ══════════════════════════════════════════════════════════

-- 1. TABLAS (CREACIÓN SI NO EXISTEN)

CREATE TABLE IF NOT EXISTS authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  cargo TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content_type TEXT DEFAULT 'documento',
  summary TEXT,
  file_url TEXT,
  youtube_url TEXT,
  image_url TEXT,
  author_id UUID REFERENCES authors(id),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  event_type TEXT DEFAULT 'taller',
  image_url TEXT,
  registration_open BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supporters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  consent BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SEGURIDAD: Row Level Security (RLS)
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS (ELIMINAR SI EXISTEN Y RE-CREAR)
-- Lectura pública para elementos publicados
DROP POLICY IF EXISTS "Lectura publica authors" ON authors;
CREATE POLICY "Lectura publica authors" ON authors FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Lectura publica contents" ON contents;
CREATE POLICY "Lectura publica contents" ON contents FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Lectura publica events" ON events;
CREATE POLICY "Lectura publica events" ON events FOR SELECT USING (published = true);

-- Inserción pública para formularios
DROP POLICY IF EXISTS "Insertar event_registrations" ON event_registrations;
CREATE POLICY "Insertar event_registrations" ON event_registrations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Insertar supporters" ON supporters;
CREATE POLICY "Insertar supporters" ON supporters FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Insertar mensajes" ON contact_messages;
CREATE POLICY "Insertar mensajes" ON contact_messages FOR INSERT WITH CHECK (true);

-- Acceso total Admin (Authenticated)
DROP POLICY IF EXISTS "Admin ALL Authors" ON authors;
CREATE POLICY "Admin ALL Authors" ON authors TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin ALL Contents" ON contents;
CREATE POLICY "Admin ALL Contents" ON contents TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin ALL Events" ON events;
CREATE POLICY "Admin ALL Events" ON events TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin ALL Registrations" ON event_registrations;
CREATE POLICY "Admin ALL Registrations" ON event_registrations TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin ALL Supporters" ON supporters;
CREATE POLICY "Admin ALL Supporters" ON supporters TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin ALL Messages" ON contact_messages;
CREATE POLICY "Admin ALL Messages" ON contact_messages TO authenticated USING (true) WITH CHECK (true);
