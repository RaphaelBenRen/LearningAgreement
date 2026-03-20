-- ===========================================
-- Migration : Table universities
-- Les étudiants choisissent une université dans un sélecteur
-- La ville et le pays se remplissent automatiquement
-- ===========================================

-- 1. Créer la table universities
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'Europe', -- 'Europe' ou 'Hors Europe'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(name, city, country)
);

-- Index pour la recherche rapide
CREATE INDEX idx_universities_name ON universities USING gin (to_tsvector('simple', name));
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_universities_city ON universities(city);
CREATE INDEX idx_universities_region ON universities(region);

-- 2. Activer RLS
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- Tous les utilisateurs authentifiés peuvent lire les universités
CREATE POLICY "Authenticated users can view universities"
  ON universities FOR SELECT
  TO authenticated
  USING (true);

-- 3. Insérer toutes les universités
-- =================== EUROPE ===================

-- Allemagne
INSERT INTO universities (name, city, country, region) VALUES
  ('RWTH Aachen University', 'Aix-la-Chapelle', 'Allemagne', 'Europe'),
  ('Technische Universität Braunschweig', 'Braunschweig', 'Allemagne', 'Europe'),
  ('Technische Universität Dortmund', 'Dortmund', 'Allemagne', 'Europe'),
  ('Heidelberg University', 'Heidelberg', 'Allemagne', 'Europe'),
  ('University of Stuttgart', 'Stuttgart', 'Allemagne', 'Europe');

-- Autriche
INSERT INTO universities (name, city, country, region) VALUES
  ('Management Center Innsbruck', 'Innsbruck', 'Autriche', 'Europe');

-- Belgique
INSERT INTO universities (name, city, country, region) VALUES
  ('Haute École de la Province de Liège (HEPL)', 'Seraing/Liège', 'Belgique', 'Europe'),
  ('ECAM (Haute École ICHEC-ECAM-ISFSC)', 'Bruxelles', 'Belgique', 'Europe'),
  ('KU Leuven', 'Leuven', 'Belgique', 'Europe');

-- Bulgarie
INSERT INTO universities (name, city, country, region) VALUES
  ('Sofia University', 'Sofia', 'Bulgarie', 'Europe');

-- Croatie
INSERT INTO universities (name, city, country, region) VALUES
  ('Algebra University College', 'Zagreb', 'Croatie', 'Europe');

-- Danemark
INSERT INTO universities (name, city, country, region) VALUES
  ('Aalborg University (campus Copenhagen)', 'Copenhague', 'Danemark', 'Europe'),
  ('University of Southern Denmark (SDU)', 'Odense', 'Danemark', 'Europe');

-- Espagne
INSERT INTO universities (name, city, country, region) VALUES
  ('Universidad de Castilla-La Mancha', 'Ciudad Real', 'Espagne', 'Europe'),
  ('UPC - Facultad de Informática de Barcelona', 'Barcelone', 'Espagne', 'Europe'),
  ('Universidad Politécnica de Madrid (ETSIT)', 'Madrid', 'Espagne', 'Europe'),
  ('Universidad de Málaga', 'Málaga', 'Espagne', 'Europe');

-- Estonie
INSERT INTO universities (name, city, country, region) VALUES
  ('Tallinn University of Technology (TalTech)', 'Tallinn', 'Estonie', 'Europe'),
  ('University of Tartu', 'Tartu', 'Estonie', 'Europe');

-- Finlande
INSERT INTO universities (name, city, country, region) VALUES
  ('Lappeenranta University of Technology (LUT)', 'Lappeenranta', 'Finlande', 'Europe'),
  ('Seinäjoki University of Applied Sciences (SeAMK)', 'Seinäjoki', 'Finlande', 'Europe');

-- Hongrie
INSERT INTO universities (name, city, country, region) VALUES
  ('Budapest University of Technology and Economics (BME)', 'Budapest', 'Hongrie', 'Europe'),
  ('University of Debrecen', 'Debrecen', 'Hongrie', 'Europe'),
  ('University of Pécs', 'Pécs', 'Hongrie', 'Europe');

-- Italie
INSERT INTO universities (name, city, country, region) VALUES
  ('Politecnico di Torino', 'Turin', 'Italie', 'Europe'),
  ('University of Verona', 'Vérone', 'Italie', 'Europe'),
  ('University of Trento', 'Trente', 'Italie', 'Europe');

-- Lettonie
INSERT INTO universities (name, city, country, region) VALUES
  ('Riga Technical University', 'Riga', 'Lettonie', 'Europe');

-- Liechtenstein
INSERT INTO universities (name, city, country, region) VALUES
  ('University of Liechtenstein', 'Vaduz', 'Liechtenstein', 'Europe');

-- Lituanie
INSERT INTO universities (name, city, country, region) VALUES
  ('Kaunas University of Technology (KTU)', 'Kaunas', 'Lituanie', 'Europe'),
  ('Vilnius Gediminas Technical University (VilniusTech)', 'Vilnius', 'Lituanie', 'Europe');

-- Malte
INSERT INTO universities (name, city, country, region) VALUES
  ('University of Malta', 'Msida', 'Malte', 'Europe');

-- Norvège
INSERT INTO universities (name, city, country, region) VALUES
  ('University of Oslo', 'Oslo', 'Norvège', 'Europe'),
  ('Norwegian University of Science and Technology (NTNU)', 'Trondheim', 'Norvège', 'Europe'),
  ('Norwegian University of Life Sciences (NMBU)', 'Ås', 'Norvège', 'Europe');

-- Pays-Bas
INSERT INTO universities (name, city, country, region) VALUES
  ('Radboud University', 'Nijmegen', 'Pays-Bas', 'Europe'),
  ('Rotterdam University of Applied Sciences', 'Rotterdam', 'Pays-Bas', 'Europe');

-- Pologne
INSERT INTO universities (name, city, country, region) VALUES
  ('AGH University of Science & Technology', 'Cracovie', 'Pologne', 'Europe'),
  ('Warsaw University of Technology', 'Varsovie', 'Pologne', 'Europe'),
  ('Gdańsk University of Technology', 'Gdańsk', 'Pologne', 'Europe'),
  ('Poznań University of Technology', 'Poznań', 'Pologne', 'Europe');

-- Portugal
INSERT INTO universities (name, city, country, region) VALUES
  ('Universidade do Porto', 'Porto', 'Portugal', 'Europe'),
  ('Instituto Politécnico de Gestão e Tecnologia (IPGT)', 'Vila Nova de Gaia', 'Portugal', 'Europe'),
  ('Faculdade de Ciências da Universidade de Lisboa', 'Lisbonne', 'Portugal', 'Europe');

-- République tchèque
INSERT INTO universities (name, city, country, region) VALUES
  ('Czech Technical University', 'Prague', 'République tchèque', 'Europe'),
  ('Tomas Bata University in Zlín', 'Zlín', 'République tchèque', 'Europe'),
  ('Technical University of Ostrava (VSB)', 'Ostrava', 'République tchèque', 'Europe');

-- Roumanie
INSERT INTO universities (name, city, country, region) VALUES
  ('Universitatea Politehnica din București', 'Bucarest', 'Roumanie', 'Europe'),
  ('Transilvania University of Brașov', 'Brașov', 'Roumanie', 'Europe');

-- Royaume-Uni
INSERT INTO universities (name, city, country, region) VALUES
  ('Omnes Education London (OELS)', 'Londres', 'Royaume-Uni', 'Europe');

-- Slovaquie
INSERT INTO universities (name, city, country, region) VALUES
  ('Comenius University', 'Bratislava', 'Slovaquie', 'Europe'),
  ('Slovak University of Technology', 'Bratislava', 'Slovaquie', 'Europe'),
  ('Technical University of Košice', 'Košice', 'Slovaquie', 'Europe');

-- Slovénie
INSERT INTO universities (name, city, country, region) VALUES
  ('University of Ljubljana', 'Ljubljana', 'Slovénie', 'Europe');

-- Suède
INSERT INTO universities (name, city, country, region) VALUES
  ('Mälardalen University', 'Västerås', 'Suède', 'Europe'),
  ('Stockholm University', 'Stockholm (Kista)', 'Suède', 'Europe'),
  ('Linnaeus University', 'Växjö', 'Suède', 'Europe'),
  ('Umeå University', 'Umeå', 'Suède', 'Europe');

-- Turquie
INSERT INTO universities (name, city, country, region) VALUES
  ('Médipol University', 'Istanbul', 'Turquie', 'Europe');

-- =================== HORS EUROPE ===================

INSERT INTO universities (name, city, country, region) VALUES
  ('Stellenbosch University', 'Stellenbosch', 'Afrique du Sud', 'Hors Europe'),
  ('King Abdullah University of Science and Technology (KAUST)', 'Thuwal', 'Arabie Saoudite', 'Hors Europe'),
  ('Universidad Argentina de la Empresa (UADE)', 'Buenos Aires', 'Argentine', 'Hors Europe'),
  ('University of Technology Sydney (UTS)', 'Sydney', 'Australie', 'Hors Europe'),
  ('University of Newcastle (UON)', 'Newcastle', 'Australie', 'Hors Europe'),
  ('Pontificia Universidade Católica do Paraná (PUCPR)', 'Curitiba', 'Brésil', 'Hors Europe'),
  ('École de Technologie Supérieure (ÉTS)', 'Montréal', 'Canada', 'Hors Europe'),
  ('Université Laval', 'Québec', 'Canada', 'Hors Europe'),
  ('Nanjing University of Aeronautics and Astronautics (NUAA)', 'Nanjing', 'Chine', 'Hors Europe'),
  ('Escuela Colombiana de Ingeniería Julio Garavito', 'Bogotá', 'Colombie', 'Hors Europe'),
  ('Inha University', 'Incheon', 'Corée du Sud', 'Hors Europe'),
  ('Myongji University', 'Yongin', 'Corée du Sud', 'Hors Europe'),
  ('Sungkyunkwan University (SKKU)', 'Suwon', 'Corée du Sud', 'Hors Europe'),
  ('Pusan National University (PNU)', 'Busan', 'Corée du Sud', 'Hors Europe'),
  ('Sejong University', 'Séoul', 'Corée du Sud', 'Hors Europe'),
  ('Universidad Latina de Costa Rica', 'San José', 'Costa Rica', 'Hors Europe'),
  ('UC San Diego Extended Studies', 'San Diego', 'États-Unis', 'Hors Europe'),
  ('California State University Long Beach (CSULB)', 'Long Beach', 'États-Unis', 'Hors Europe'),
  ('Boston University Metropolitan College', 'Boston', 'États-Unis', 'Hors Europe'),
  ('San Francisco State University', 'San Francisco', 'États-Unis', 'Hors Europe'),
  ('UCLA Extension', 'Los Angeles', 'États-Unis', 'Hors Europe'),
  ('ITESO', 'Tlaquepaque (Guadalajara)', 'Mexique', 'Hors Europe'),
  ('Universidad de las Américas Puebla (UDLAP)', 'Puebla', 'Mexique', 'Hors Europe'),
  ('Universidad de Piura (UDEP)', 'Piura / Lima', 'Pérou', 'Hors Europe'),
  ('Ateneo de Manila University', 'Quezon City (Manille)', 'Philippines', 'Hors Europe'),
  ('National Taiwan University of Science and Technology (NTUST/TaiwanTech)', 'Taipei', 'Taïwan', 'Hors Europe'),
  ('National Central University (NCU)', 'Taoyuan', 'Taïwan', 'Hors Europe'),
  ('National Sun Yat-sen University (NSYSU)', 'Kaohsiung', 'Taïwan', 'Hors Europe'),
  ('King Mongkut''s University of Technology Thonburi (KMUTT)', 'Bangkok', 'Thaïlande', 'Hors Europe');

-- 4. Ajouter la colonne university_id à applications
ALTER TABLE applications ADD COLUMN university_id UUID REFERENCES universities(id);

-- 5. Migrer les données existantes (correspondance par nom d'université)
UPDATE applications a
SET university_id = u.id
FROM universities u
WHERE LOWER(TRIM(a.university_name)) = LOWER(TRIM(u.name));

-- Pour les applications qui n'ont pas trouvé de correspondance exacte,
-- tenter une correspondance partielle (le nom de l'uni contient le texte saisi)
UPDATE applications a
SET university_id = u.id
FROM universities u
WHERE a.university_id IS NULL
  AND (
    LOWER(TRIM(a.university_name)) LIKE '%' || LOWER(TRIM(u.name)) || '%'
    OR LOWER(TRIM(u.name)) LIKE '%' || LOWER(TRIM(a.university_name)) || '%'
  );

-- 6. Vérifier s'il reste des applications sans correspondance
-- (À exécuter manuellement pour vérifier avant de rendre la colonne NOT NULL)
-- SELECT id, university_name, university_city, university_country
-- FROM applications WHERE university_id IS NULL;

-- 7. Une fois que toutes les applications ont un university_id,
-- rendre la colonne NOT NULL et supprimer les anciennes colonnes
-- IMPORTANT : Exécuter ces commandes SEULEMENT après avoir vérifié
-- qu'il n'y a plus de university_id NULL (étape 6)

-- ALTER TABLE applications ALTER COLUMN university_id SET NOT NULL;
-- ALTER TABLE applications DROP COLUMN university_name;
-- ALTER TABLE applications DROP COLUMN university_city;
-- ALTER TABLE applications DROP COLUMN university_country;

-- 8. Créer un index sur university_id
CREATE INDEX idx_applications_university ON applications(university_id);

-- 9. Vue utilitaire pour récupérer les applications avec les infos université
CREATE OR REPLACE VIEW applications_with_university AS
SELECT
  a.*,
  u.name AS uni_name,
  u.city AS uni_city,
  u.country AS uni_country,
  u.region AS uni_region
FROM applications a
LEFT JOIN universities u ON a.university_id = u.id;

-- 10. Fonction de recherche d'universités (pour le sélecteur côté frontend)
CREATE OR REPLACE FUNCTION search_universities(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  city TEXT,
  country TEXT,
  region TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.name, u.city, u.country, u.region
  FROM universities u
  WHERE
    u.name ILIKE '%' || search_term || '%'
    OR u.city ILIKE '%' || search_term || '%'
    OR u.country ILIKE '%' || search_term || '%'
  ORDER BY
    -- Priorité : correspondance en début de nom > contient le terme
    CASE WHEN u.name ILIKE search_term || '%' THEN 0 ELSE 1 END,
    u.country,
    u.city,
    u.name
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;
