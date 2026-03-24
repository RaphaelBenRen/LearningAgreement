-- ===========================================
-- Migration : Ajout du statut modification_requested
-- Permet à l'étudiant de demander une modification
-- de son LA après validation finale
-- ===========================================

-- 1. Ajouter la valeur à l'enum
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'modification_requested';

-- 2. Mettre à jour la policy de mise à jour des applications
-- pour permettre la transition validated_final -> modification_requested par l'étudiant
-- et conserver les transitions existantes (draft/revision -> submitted)
DROP POLICY IF EXISTS "Students can update their draft applications" ON applications;
DROP POLICY IF EXISTS "Students can update own applications" ON applications;
CREATE POLICY "Students can update own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id AND status IN ('draft', 'revision', 'modification_requested', 'validated_final'))
  WITH CHECK (auth.uid() = student_id AND status IN ('draft', 'revision', 'submitted', 'modification_requested'));
