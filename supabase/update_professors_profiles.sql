-- ===========================================
-- ÉTAPE 2 : Exécuter APRÈS avoir créé les comptes
-- via Supabase Dashboard > Authentication > Users > Invite user
--
-- Comptes à créer (Invite user pour chacun) :
--   1. zallanic@ece.fr              (Zouina ALLANIC)
--   2. ikimbembe@omnesintervenant.com (Isna KIMBEMBE)
--   3. hochi@ece.fr                 (Hanen OCHI)
--   4. obuard@ece.fr                (Olivier BUARD)
--   5. hsoubra@ece.fr               (Hassan SOUBRA)
--   6. asantarita@ece.fr            (Alma SANTA RITA)
--   7. duc.pham-hi@ece.fr           (Duc PHAM HI)
--   8. frederic.ravaut@ece.fr       (Frédéric RAVAUT)
--   9. olivier.chesnais@ece.fr      (Olivier CHESNAIS)
--
-- OU si respo@edu.ece.fr existe déjà, on le remplace par Isna
-- ===========================================

-- 1. Remplacer l'ancien compte respo@edu.ece.fr par Isna KIMBEMBE
UPDATE profiles SET
  full_name = 'Isna KIMBEMBE',
  email = 'ikimbembe@omnesintervenant.com',
  role = 'major_head'
WHERE email = 'respo@edu.ece.fr';

-- Mettre aussi à jour dans auth.users
UPDATE auth.users SET
  email = 'ikimbembe@omnesintervenant.com',
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{full_name}',
    '"Isna KIMBEMBE"'
  )
WHERE email = 'respo@edu.ece.fr';

-- 2. Mettre à jour les profils des profs (role + nom)
-- Exécuter APRÈS avoir invité les utilisateurs via le dashboard
UPDATE profiles SET role = 'major_head', full_name = 'Zouina ALLANIC'
WHERE email = 'zallanic@ece.fr';

UPDATE profiles SET role = 'major_head', full_name = 'Isna KIMBEMBE'
WHERE email = 'ikimbembe@omnesintervenant.com';

UPDATE profiles SET role = 'major_head', full_name = 'Hanen OCHI'
WHERE email = 'hochi@ece.fr';

UPDATE profiles SET role = 'major_head', full_name = 'Olivier BUARD'
WHERE email = 'obuard@ece.fr';

UPDATE profiles SET role = 'major_head', full_name = 'Hassan SOUBRA'
WHERE email = 'hsoubra@ece.fr';

UPDATE profiles SET role = 'major_head', full_name = 'Alma SANTA RITA'
WHERE email = 'asantarita@ece.fr';

UPDATE profiles SET role = 'major_head', full_name = 'Duc PHAM HI'
WHERE email = 'duc.pham-hi@ece.fr';

UPDATE profiles SET role = 'major_head', full_name = 'Frédéric RAVAUT'
WHERE email = 'frederic.ravaut@ece.fr';

UPDATE profiles SET role = 'major_head', full_name = 'Olivier CHESNAIS'
WHERE email = 'olivier.chesnais@ece.fr';

-- 3. Associer chaque prof à sa/ses majeure(s) via profile_majors
-- Zouina ALLANIC → Cloud Engineering + Cybersécurité
INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'zallanic@ece.fr' AND m.code = 'CLOUD'
ON CONFLICT DO NOTHING;

INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'zallanic@ece.fr' AND m.code = 'CYBER'
ON CONFLICT DO NOTHING;

-- Isna KIMBEMBE → CREATE
INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'ikimbembe@omnesintervenant.com' AND m.code = 'CREATE'
ON CONFLICT DO NOTHING;

-- Hanen OCHI → Data & IA
INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'hochi@ece.fr' AND m.code = 'DATA'
ON CONFLICT DO NOTHING;

-- Olivier BUARD → Défense & Technologie
INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'obuard@ece.fr' AND m.code = 'DEF'
ON CONFLICT DO NOTHING;

-- Hassan SOUBRA → Digital Transformation & Innovation
INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'hsoubra@ece.fr' AND m.code = 'DTI'
ON CONFLICT DO NOTHING;

-- Alma SANTA RITA → Energie & Environnement + Systèmes d'Energie Nucléaire
INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'asantarita@ece.fr' AND m.code = 'EE'
ON CONFLICT DO NOTHING;

INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'asantarita@ece.fr' AND m.code = 'SEN'
ON CONFLICT DO NOTHING;

-- Duc PHAM HI → Finance & Ingénierie quantitative
INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'duc.pham-hi@ece.fr' AND m.code = 'FIQ'
ON CONFLICT DO NOTHING;

-- Frédéric RAVAUT → Santé & Technologie
INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'frederic.ravaut@ece.fr' AND m.code = 'ST'
ON CONFLICT DO NOTHING;

-- Olivier CHESNAIS → Systèmes Embarqués + Véhicule Connecté & Autonome
INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'olivier.chesnais@ece.fr' AND m.code = 'SE'
ON CONFLICT DO NOTHING;

INSERT INTO profile_majors (profile_id, major_id)
SELECT p.id, m.id FROM profiles p, majors m
WHERE p.email = 'olivier.chesnais@ece.fr' AND m.code = 'VCA'
ON CONFLICT DO NOTHING;

-- 4. Mettre aussi à jour le major_id principal de chaque prof (premier majeur)
UPDATE profiles SET major_id = (SELECT id FROM majors WHERE code = 'CLOUD')
WHERE email = 'zallanic@ece.fr';

UPDATE profiles SET major_id = (SELECT id FROM majors WHERE code = 'CREATE')
WHERE email = 'ikimbembe@omnesintervenant.com';

UPDATE profiles SET major_id = (SELECT id FROM majors WHERE code = 'DATA')
WHERE email = 'hochi@ece.fr';

UPDATE profiles SET major_id = (SELECT id FROM majors WHERE code = 'DEF')
WHERE email = 'obuard@ece.fr';

UPDATE profiles SET major_id = (SELECT id FROM majors WHERE code = 'DTI')
WHERE email = 'hsoubra@ece.fr';

UPDATE profiles SET major_id = (SELECT id FROM majors WHERE code = 'EE')
WHERE email = 'asantarita@ece.fr';

UPDATE profiles SET major_id = (SELECT id FROM majors WHERE code = 'FIQ')
WHERE email = 'duc.pham-hi@ece.fr';

UPDATE profiles SET major_id = (SELECT id FROM majors WHERE code = 'ST')
WHERE email = 'frederic.ravaut@ece.fr';

UPDATE profiles SET major_id = (SELECT id FROM majors WHERE code = 'SE')
WHERE email = 'olivier.chesnais@ece.fr';
