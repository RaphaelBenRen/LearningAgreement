-- ===========================================
-- Schéma de base de données Learning Agreement
-- À exécuter dans l'éditeur SQL de Supabase
-- ===========================================

-- Extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- Types ENUM
-- ===========================================

CREATE TYPE user_role AS ENUM ('student', 'major_head', 'international');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'revision', 'validated_major', 'validated_final', 'rejected');
CREATE TYPE course_level AS ENUM ('M1', 'M2');

-- ===========================================
-- Tables
-- ===========================================

-- Majeures
CREATE TABLE majors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL
);

-- Années scolaires
CREATE TABLE academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year TEXT NOT NULL UNIQUE,
  is_current BOOLEAN DEFAULT FALSE
);

-- Profils utilisateurs (extension de auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  major_id UUID REFERENCES majors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Dossiers Learning Agreement
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  major_head_id UUID REFERENCES profiles(id) NOT NULL,
  academic_year_id UUID REFERENCES academic_years(id) NOT NULL,
  status application_status DEFAULT 'draft',
  university_name TEXT NOT NULL,
  university_city TEXT NOT NULL,
  university_country TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(student_id, academic_year_id)
);

-- Cours du Learning Agreement
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  language TEXT NOT NULL,
  description TEXT NOT NULL,
  web_link TEXT NOT NULL,
  level course_level NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  local_credits INTEGER,
  ects INTEGER NOT NULL,
  choice_reason TEXT NOT NULL,
  is_validated BOOLEAN DEFAULT NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Messages de discussion
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Fichiers attachés
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES messages(id),
  uploader_id UUID REFERENCES profiles(id) NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ===========================================
-- Index pour les performances
-- ===========================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_major ON profiles(major_id);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_major_head ON applications(major_head_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_academic_year ON applications(academic_year_id);
CREATE INDEX idx_courses_application ON courses(application_id);
CREATE INDEX idx_messages_application ON messages(application_id);
CREATE INDEX idx_files_application ON files(application_id);

-- ===========================================
-- Trigger pour updated_at
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Politiques pour PROFILES
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view profiles needed for applications"
  ON profiles FOR SELECT
  USING (
    role IN ('major_head', 'international')
    OR id IN (
      SELECT student_id FROM applications WHERE major_head_id = auth.uid()
      UNION
      SELECT major_head_id FROM applications WHERE student_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Politiques pour MAJORS (lecture pour tous les authentifiés)
CREATE POLICY "Authenticated users can view majors"
  ON majors FOR SELECT
  TO authenticated
  USING (true);

-- Politiques pour ACADEMIC_YEARS (lecture pour tous les authentifiés)
CREATE POLICY "Authenticated users can view academic years"
  ON academic_years FOR SELECT
  TO authenticated
  USING (true);

-- Politiques pour APPLICATIONS
CREATE POLICY "Students can view their own applications"
  ON applications FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Major heads can view applications of their students"
  ON applications FOR SELECT
  USING (auth.uid() = major_head_id);

CREATE POLICY "International can view all applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'international'
    )
  );

CREATE POLICY "Students can create applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their draft applications"
  ON applications FOR UPDATE
  USING (auth.uid() = student_id AND status IN ('draft', 'revision'));

CREATE POLICY "Major heads can update applications they manage"
  ON applications FOR UPDATE
  USING (auth.uid() = major_head_id);

CREATE POLICY "International can update all applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'international'
    )
  );

-- Politiques pour COURSES
CREATE POLICY "Users can view courses of accessible applications"
  ON courses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id
      AND (
        a.student_id = auth.uid()
        OR a.major_head_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'international')
      )
    )
  );

CREATE POLICY "Students can manage courses of their applications"
  ON courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id
      AND a.student_id = auth.uid()
      AND a.status IN ('draft', 'revision')
    )
  );

CREATE POLICY "Major heads can update course validation"
  ON courses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id
      AND a.major_head_id = auth.uid()
    )
  );

-- Politiques pour MESSAGES
CREATE POLICY "Users can view messages of accessible applications"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id
      AND (
        a.student_id = auth.uid()
        OR a.major_head_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'international')
      )
    )
  );

CREATE POLICY "Users can send messages to accessible applications"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id
      AND (
        a.student_id = auth.uid()
        OR a.major_head_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'international')
      )
    )
  );

-- Politiques pour FILES
CREATE POLICY "Users can view files of accessible applications"
  ON files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id
      AND (
        a.student_id = auth.uid()
        OR a.major_head_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'international')
      )
    )
  );

CREATE POLICY "Users can upload files to accessible applications"
  ON files FOR INSERT
  WITH CHECK (
    auth.uid() = uploader_id
    AND EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id
      AND (
        a.student_id = auth.uid()
        OR a.major_head_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'international')
      )
    )
  );

-- ===========================================
-- Fonction pour créer un profil automatiquement
-- ===========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'),
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- Données initiales
-- ===========================================

-- Majeures
INSERT INTO majors (name, code) VALUES
  ('Informatique', 'INFO'),
  ('Électronique', 'ELEC'),
  ('Systèmes Embarqués', 'SE'),
  ('Énergie', 'NRJ'),
  ('Santé', 'SANTE'),
  ('Finance', 'FIN'),
  ('Data & IA', 'DATA'),
  ('Cybersécurité', 'CYBER'),
  ('Robotique', 'ROBO'),
  ('Télécommunications', 'TELECOM');

-- Année scolaire courante
INSERT INTO academic_years (year, is_current) VALUES
  ('2024-2025', TRUE),
  ('2025-2026', FALSE);

-- ===========================================
-- Storage bucket pour les fichiers
-- ===========================================

-- À exécuter dans la section Storage de Supabase :
-- 1. Créer un bucket "learning-agreements"
-- 2. Le configurer comme privé
-- 3. Ajouter les politiques suivantes :

-- Note: Les politiques Storage doivent être créées via l'interface Supabase
-- ou via l'API, pas via SQL direct.
