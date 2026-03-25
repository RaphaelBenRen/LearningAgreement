-- ===========================================
-- ÉTAPE 2 : Créer les comptes profs directement
-- et les associer à leurs majeures
-- ===========================================

-- 1. Remplacer l'ancien compte respo@edu.ece.fr par Isna KIMBEMBE
UPDATE auth.users SET
  email = 'ikimbembe@omnesintervenant.com',
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{full_name}',
    '"Isna KIMBEMBE"'
  )
WHERE email = 'respo@edu.ece.fr';

UPDATE profiles SET
  full_name = 'Isna KIMBEMBE',
  email = 'ikimbembe@omnesintervenant.com',
  role = 'major_head'
WHERE email = 'respo@edu.ece.fr';

-- 2. Créer les comptes auth + profils pour les autres profs
-- (Isna est déjà en base via le remplacement ci-dessus)

-- Zouina ALLANIC
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'zallanic@ece.fr', crypt('TemporaryPass123!', gen_salt('bf')), now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{"full_name":"Zouina ALLANIC"}')
ON CONFLICT DO NOTHING;

-- Hanen OCHI
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'hochi@ece.fr', crypt('TemporaryPass123!', gen_salt('bf')), now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{"full_name":"Hanen OCHI"}')
ON CONFLICT DO NOTHING;

-- Olivier BUARD
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'obuard@ece.fr', crypt('TemporaryPass123!', gen_salt('bf')), now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{"full_name":"Olivier BUARD"}')
ON CONFLICT DO NOTHING;

-- Hassan SOUBRA
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'hsoubra@ece.fr', crypt('TemporaryPass123!', gen_salt('bf')), now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{"full_name":"Hassan SOUBRA"}')
ON CONFLICT DO NOTHING;

-- Alma SANTA RITA
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'asantarita@ece.fr', crypt('TemporaryPass123!', gen_salt('bf')), now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{"full_name":"Alma SANTA RITA"}')
ON CONFLICT DO NOTHING;

-- Duc PHAM HI
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'duc.pham-hi@ece.fr', crypt('TemporaryPass123!', gen_salt('bf')), now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{"full_name":"Duc PHAM HI"}')
ON CONFLICT DO NOTHING;

-- Frédéric RAVAUT
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'frederic.ravaut@ece.fr', crypt('TemporaryPass123!', gen_salt('bf')), now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{"full_name":"Frédéric RAVAUT"}')
ON CONFLICT DO NOTHING;

-- Olivier CHESNAIS
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'olivier.chesnais@ece.fr', crypt('TemporaryPass123!', gen_salt('bf')), now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{"full_name":"Olivier CHESNAIS"}')
ON CONFLICT DO NOTHING;

-- 3. Mettre à jour les profils (le trigger handle_new_user les a créés en tant que 'student')
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

-- 4. Associer chaque prof à sa/ses majeure(s) via profile_majors

-- Zouina ALLANIC → Cloud + Cybersécurité
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

-- Hassan SOUBRA → DTI
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

-- 5. Mettre à jour le major_id principal sur chaque prof
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
