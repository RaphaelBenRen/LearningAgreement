-- ===========================================
-- ÉTAPE 1 : Exécuter CE BLOC EN PREMIER
-- Mise à jour des majeures + table de liaison
-- ===========================================

-- Table de liaison pour associer un responsable à plusieurs majeures
CREATE TABLE IF NOT EXISTS profile_majors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  major_id UUID REFERENCES majors(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(profile_id, major_id)
);

ALTER TABLE profile_majors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view profile_majors"
  ON profile_majors FOR SELECT
  TO authenticated
  USING (true);

-- Supprimer les anciennes majeures
-- D'abord, dissocier TOUS les profils (étudiants inclus) des anciennes majeures
UPDATE profiles SET major_id = NULL;

-- Supprimer les anciennes majeures
DELETE FROM majors;

-- Insérer les vraies majeures
INSERT INTO majors (name, code) VALUES
  ('Cloud Engineering', 'CLOUD'),
  ('Conceptions et Réalisations Appliquées aux Technologies Emergentes', 'CREATE'),
  ('Cybersécurité', 'CYBER'),
  ('Data & IA', 'DATA'),
  ('Défense & Technologie', 'DEF'),
  ('Digital Transformation & Innovation', 'DTI'),
  ('Energie & Environnement', 'EE'),
  ('Finance & Ingénierie quantitative', 'FIQ'),
  ('Santé & Technologie', 'ST'),
  ('Systèmes d''Energie Nucléaire', 'SEN'),
  ('Systèmes Embarqués', 'SE'),
  ('Véhicule Connecté & Autonome', 'VCA');
