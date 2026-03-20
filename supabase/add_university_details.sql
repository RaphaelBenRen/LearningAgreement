-- ===========================================
-- Migration : Détails pratiques des universités
-- Langue, durée, logement, budget, visa, santé, bourse, supplément
-- ===========================================

ALTER TABLE universities ADD COLUMN IF NOT EXISTS teaching_language TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS semester_dates TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS housing_info TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS monthly_budget TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS visa_info TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS health_info TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS erasmus_plus BOOLEAN DEFAULT TRUE;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS supplement_fee TEXT DEFAULT '0€';
ALTER TABLE universities ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- =================== EUROPE ===================

-- ALLEMAGNE
UPDATE universities SET
  teaching_language = 'Allemand (quelques cours en anglais)',
  semester_dates = 'Début octobre → fin janvier',
  housing_info = 'Pas de résidence univ., chercher 2-3 mois avant via housing@rwth-aachen.de',
  monthly_budget = '~960€ (logement 700€, nourriture 200-300€, transport 50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM + assurance privée recommandée',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'RWTH Aachen University';

UPDATE universities SET
  teaching_language = 'Allemand, Anglais',
  semester_dates = '12 oct. 2026 → 31 mars 2027',
  housing_info = 'Résidences Studierendenwerk, priorité mais non garanti (390-480€/mois)',
  monthly_budget = '~800€ (logement 500€, nourriture 250€, transport inclus)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '365€'
WHERE name = 'Technische Universität Braunschweig';

UPDATE universities SET
  teaching_language = 'Allemand, Anglais',
  semester_dates = 'Début octobre → mars (cours intensif allemand en septembre)',
  housing_info = 'Réservation via Studierendenwerk Dortmund (~400€/mois)',
  monthly_budget = '~750-850€ (logement 400€, nourriture 200-300€, transport 50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Technische Universität Dortmund';

UPDATE universities SET
  teaching_language = 'Allemand, Anglais',
  semester_dates = 'Début octobre → mars',
  housing_info = 'Service logement univ. (~400€/mois)',
  monthly_budget = '~1000€ (logement 400€, nourriture 200-300€, transport 50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Heidelberg University';

UPDATE universities SET
  teaching_language = 'Allemand, Anglais',
  semester_dates = 'Début octobre → mars',
  housing_info = 'Priorité dortoir Studierendenwerk via International Bureau (~400€/mois), caution requise',
  monthly_budget = '~1000€ (logement 400€, nourriture 200-300€, transport 50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'University of Stuttgart';

-- AUTRICHE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Septembre → février',
  housing_info = 'Pas de résidence propre, réserver dès la nomination | frais admin 50€',
  monthly_budget = '~1370-2000€ (logement 300€, nourriture 200-300€, transport 50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Management Center Innsbruck';

-- BELGIQUE
UPDATE universities SET
  teaching_language = 'Français',
  semester_dates = 'Mi-septembre → fin janvier',
  housing_info = 'Maison Erasmus HEPL, 31 chambres individuelles avec sanitaires privatifs (~350-450€/mois)',
  monthly_budget = '~800-950€ (logement 350-450€, nourriture 200-250€, transport 30-50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Haute École de la Province de Liège%';

UPDATE universities SET
  teaching_language = 'Français, Anglais',
  semester_dates = 'Mi-septembre → mi-février',
  housing_info = 'Pas de résidence propre, kots via ple.mykot.be / brukot.be / kots.be (~350-450€/mois)',
  monthly_budget = '~800-950€ (logement 350-450€, nourriture 200-250€, transport 30-50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'ECAM%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = '14 sept. 2026 → 30 janv. 2027 (rattrapages mi-août/début sept. 2027)',
  housing_info = 'Résidences univ. ou privé, non garanti (~300-500€/mois)',
  monthly_budget = '~800€ (logement 500€, nourriture 200€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'KU Leuven';

-- BULGARIE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin septembre → début février',
  housing_info = 'Pas de résidence pour étudiants UE, via flatio.com (~200-300€/mois)',
  monthly_budget = '~625€ (logement 200-300€, nourriture 150-200€, transport 25-40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Sofia University';

-- CROATIE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin septembre → mi-février',
  housing_info = 'Pas de résidence, agences recommandées (Edudom, Home In Zagreb) — coloc 200-300€/mois, studio 400-600€/mois',
  monthly_budget = '2500-5000€ total sur le semestre',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Algebra University College';

-- DANEMARK
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → fin janvier',
  housing_info = 'Via AAU (~500-800€/mois, 3200-4700 DKK)',
  monthly_budget = '~800-1100€ (logement 500-800€, nourriture 200-300€, transport 50-80€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Aalborg University%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → fin janvier (rattrapages jusqu''au 28 fév.)',
  housing_info = 'Garanti si candidature avant 1er mai — housing@sdu.dk',
  monthly_budget = '~800-950€ (logement 500€, nourriture 300€, transport 50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'University of Southern Denmark%';

-- ESPAGNE
UPDATE universities SET
  teaching_language = 'Espagnol',
  semester_dates = 'Septembre → janvier',
  housing_info = 'Résidences univ. ou privé (~280-500€/mois), non garanti',
  monthly_budget = '~950€ (logement 300-450€, nourriture 180-250€, transport 10-30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Universidad de Castilla-La Mancha';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Septembre → février',
  housing_info = 'Pas de logement fourni, coloc ~550-750€/mois',
  monthly_budget = '~1200€ (logement 550-750€, nourriture 250-350€, transport 25-40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'UPC%Barcelona%';

UPDATE universities SET
  teaching_language = 'Espagnol ou Anglais',
  semester_dates = 'Septembre → janvier',
  housing_info = 'Pas de logement fourni, coloc ~550-750€/mois',
  monthly_budget = '~1200€ (logement 550-750€, nourriture 250-350€, transport 25-40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Universidad Politécnica de Madrid%';

UPDATE universities SET
  teaching_language = 'Espagnol',
  semester_dates = 'Fin septembre → mi-janvier',
  housing_info = 'Colocation principalement (~300-450€/mois), forte demande en septembre',
  monthly_budget = '~900€ (logement 300-450€, nourriture 250-350€, transport 25-40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Universidad de Málaga';

-- ESTONIE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début septembre → fin janvier',
  housing_info = 'Résidences Academic Hostel ~146-396€/mois',
  monthly_budget = '~800€ (logement 450€, nourriture 300€, transport 40€)',
  visa_info = 'Non requis (UE), enregistrement local si >90 jours',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Tallinn University of Technology%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début septembre → fin janvier',
  housing_info = 'Dortoirs univ. ~160€/mois (chambre partagée), privé 400-700€/mois',
  monthly_budget = '~700€ (logement 400€, nourriture 300€, transport 20€)',
  visa_info = 'Non requis (UE), enregistrement local si >90 jours',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'University of Tartu';

-- FINLANDE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → mi-décembre',
  housing_info = 'Via LOAS — chambre partagée ~270€/mois, studio 344-410€/mois',
  monthly_budget = '~900€ (logement 400-500€, nourriture 300€, transport 60€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Lappeenranta%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → mi-décembre',
  housing_info = 'Via Sevas Kodit — coloc ~270-350€/mois, studio ~450€/mois',
  monthly_budget = '~900€ (logement 300-500€, nourriture 300€, transport 60€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Seinäjoki%';

-- HONGRIE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Septembre → janvier',
  housing_info = 'Pas de résidence univ., via ESN BME ou alberlet.hu — 450-700€/mois',
  monthly_budget = '~900-1000€ (logement 450-700€, nourriture 250€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Budapest University%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début septembre → fin janvier',
  housing_info = 'Résidences univ. premier arrivé premier servi ~100€/mois ; privé ~400€/mois',
  monthly_budget = '~700€ (logement 100-400€, nourriture 200€, transport 20€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'University of Debrecen';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début septembre → fin janvier',
  housing_info = 'Résidences univ. ~230€/mois ; privé via studenthousing.hu',
  monthly_budget = '~700€ (logement 230-400€, nourriture 250€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'University of Pécs';

-- ITALIE
UPDATE universities SET
  teaching_language = 'Anglais et Italien',
  semester_dates = 'Fin septembre → fin février',
  housing_info = 'Résidences EDISU Piemonte ~360-480€/mois ; privé ~300-900€/mois',
  monthly_budget = '~900-1000€ (logement 450-900€, nourriture 250€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Politecnico di Torino';

UPDATE universities SET
  teaching_language = 'Anglais et Italien',
  semester_dates = 'Mi-septembre → mi-février',
  housing_info = 'Résidences ESU Verona (places limitées) ou privé (~400-500€/mois)',
  monthly_budget = '~900-1000€ (logement 400-500€, nourriture 450€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'University of Verona';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-septembre → mi-février',
  housing_info = 'Marché privé via Opera Universitaria (~250-350€/mois)',
  monthly_budget = '~700€ (logement 250-350€, nourriture 250€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'University of Trento';

-- LETTONIE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → fin janvier',
  housing_info = 'Résidences RTU — dépôt 200€ + 3 mois à l''avance 660€ (chambre double)',
  monthly_budget = '~600€ (logement 150-300€, nourriture 150€, transport 20€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Riga Technical University';

-- LIECHTENSTEIN
UPDATE universities SET
  teaching_language = 'Anglais et Allemand',
  semester_dates = 'Fin août → fin janvier',
  housing_info = 'Quelques chambres en résidence (très limitées) ; marché privé très restreint et cher',
  monthly_budget = '~1100€ (logement 400-600€, nourriture 350€, transport 80€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'University of Liechtenstein';

-- LITUANIE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → fin janvier',
  housing_info = 'Résidences univ. individuelle ~195-300€/mois, double ~110-254€/mois ; privé 200-340€/mois',
  monthly_budget = '~600€ (logement 150-350€, nourriture 200€, transport 20€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Kaunas University%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → fin janvier (rattrapages début février)',
  housing_info = 'Résidences campus Saulėtekio ~220-260€/mois ; privé ~400-600€/mois',
  monthly_budget = '~700€ (logement 220-600€, nourriture 200€, transport 10€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Vilnius Gediminas%';

-- MALTE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Septembre → février',
  housing_info = 'Résidence Campus Hub recommandée ~350-450€/mois ; privé ~450-650€/mois',
  monthly_budget = '~900€ (logement 350-650€, nourriture 250€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'University of Malta';

-- NORVÈGE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-août → fin décembre',
  housing_info = 'Via SiO Housing — ~470-770€/mois',
  monthly_budget = '~1100€ (logement 500-800€, nourriture 300€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'University of Oslo';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-août → fin décembre',
  housing_info = 'Via Sit (~390-650€), non garanti ; privé 500-800€',
  monthly_budget = '~1100€ (logement 400-800€, nourriture 300€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Norwegian University of Science%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début août → fin décembre',
  housing_info = 'Via SiÅs (~390-600€), non garanti — postuler dès le 15 mars',
  monthly_budget = '~1100€ (logement 400-700€, nourriture 300€, transport 50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Norwegian University of Life%';

-- PAYS-BAS
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → fin janvier',
  housing_info = 'Pas de résidence propre, assistance si demande avant 1er mai — ~500-1000€/mois',
  monthly_budget = '~1100€ (logement 500-1000€, nourriture 250€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Radboud University';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → début février',
  housing_info = '~220 chambres via SSH (475-715€/mois), premier arrivé premier servi',
  monthly_budget = '~1200€ (logement 500-1000€, nourriture 250€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Rotterdam University of Applied Sciences';

-- POLOGNE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début octobre → mi-février (rattrapages fin février)',
  housing_info = 'Résidences univ. ~100-200€/mois (non garanti) ; privé ~250-450€/mois',
  monthly_budget = '~600€ (logement 100-450€, nourriture 200€, transport 20€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'AGH University%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin septembre → fin février',
  housing_info = 'Résidences SSPW ~250-450€/mois ; privé ~300-600€/mois',
  monthly_budget = '~800€ (logement 250-600€, nourriture 250€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Warsaw University of Technology';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin septembre → fin février',
  housing_info = 'Résidences univ. ~120-250€/mois (non garanti) ; privé ~300-550€/mois',
  monthly_budget = '~700€ (logement 150-550€, nourriture 200€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Gdańsk University of Technology';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin septembre → fin février',
  housing_info = 'Résidences univ. ~150-250€/mois (non garanti) ; privé ~300-550€/mois',
  monthly_budget = '~700€ (logement 150-550€, nourriture 250€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Poznań University of Technology';

-- PORTUGAL
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-septembre → mi-février',
  housing_info = 'Résidences SASUP ~200-350€/mois (places limitées) ; privé ~350-600€/mois',
  monthly_budget = '~900€ (logement 200-800€, nourriture 200€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Universidade do Porto';

UPDATE universities SET
  teaching_language = 'Portugais et Anglais',
  semester_dates = 'Fin septembre → début février',
  housing_info = 'Aucune résidence propre, recherche autonome (Odalys Campus, Micampus, Uniplaces…)',
  monthly_budget = '~900€ (logement 200-800€, nourriture 200€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Instituto Politécnico%';

UPDATE universities SET
  teaching_language = 'Portugais (quelques cours en anglais en 5e année)',
  semester_dates = 'Mi-septembre → mi-février',
  housing_info = 'Résidences SASULisboa ~200-350€/mois (non garanti) ; privé ~350-650€/mois',
  monthly_budget = '~950€ (logement 350-650€, nourriture 250€, transport 50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Faculdade de Ciências%';

-- RÉPUBLIQUE TCHÈQUE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-septembre → début février',
  housing_info = 'Résidences univ. ~150-300€/mois (bonnes chances si dossier dans les délais) ; privé ~350-600€/mois',
  monthly_budget = '~800€ (logement 150-600€, nourriture 200€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Czech Technical University';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-septembre → début février',
  housing_info = 'Résidence U12 ~170-290€/mois via portail ISKAM ; privé ~320-480€/mois',
  monthly_budget = '~700€ (logement 150-500€, nourriture 200€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Tomas Bata%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-septembre → mi-février',
  housing_info = 'Résidences univ. ~150-300€/mois ; privé ~250-550€/mois',
  monthly_budget = '~700€ (logement 150-550€, nourriture 200€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Technical University of Ostrava%';

-- ROUMANIE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin septembre → fin janvier (rattrapages en février)',
  housing_info = 'Résidences univ. ~150-300€/mois ; privé ~250-550€/mois',
  monthly_budget = '~700€ (logement 100-650€, nourriture 250€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Universitatea Politehnica%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin septembre → mi-février (rattrapages en septembre)',
  housing_info = 'Résidences univ. doubles/quadruples ~150€/mois ; privé coloc ~250-350€/mois',
  monthly_budget = '~700€ (logement 150-450€, nourriture 250€, transport 20€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name LIKE 'Transilvania University%';

-- ROYAUME-UNI
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début septembre → mi-décembre',
  housing_info = 'Pas de logement campus, accompagnement par référente logement — loyers zones 2-3 (~1000-1600€/mois)',
  monthly_budget = '~1600€ (logement 1000-1600€, nourriture 300€, transport 150€)',
  visa_info = 'ETA obligatoire pour ressortissants européens',
  health_info = 'Assurance privée recommandée',
  erasmus_plus = FALSE,
  supplement_fee = '0€',
  additional_notes = 'Programme fixe défini en amont, pas de Learning Agreement à gérer'
WHERE name LIKE 'Omnes Education London%';

-- SLOVAQUIE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-septembre → mi-février',
  housing_info = 'Résidences en travaux 2025-2026, places très limitées — privilégier logement privé (~200-400€/mois)',
  monthly_budget = '~700€ (logement 200-400€, nourriture 220€, transport 35€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Comenius University';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = '1er septembre → mi-février',
  housing_info = 'Résidences univ. ~70-100€/mois (chambre double/triple, places limitées) ; privé ~200-400€/mois',
  monthly_budget = '~700€ (logement 100-400€, nourriture 220€, transport 35€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Slovak University of Technology';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-septembre → mi-février',
  housing_info = 'Résidences univ. ~90-150€/mois (chambre partagée) ; privé coloc ~200-400€/mois',
  monthly_budget = '~600€ (logement 90-400€, nourriture 220€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Technical University of Košice';

-- SLOVÉNIE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = '1er octobre → mi-février',
  housing_info = 'Résidences Študentski dom Ljubljana ~200-300€/mois ; privé coloc ~300-700€/mois',
  monthly_budget = '~800€ (logement 200-700€, nourriture 230€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'University of Ljubljana';

-- SUÈDE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → fin janvier',
  housing_info = 'Via bostadvasteras.se — ~350-500€/mois (places limitées)',
  monthly_budget = '~1000€ (logement 350-800€, nourriture 300€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Mälardalen University';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → fin janvier',
  housing_info = 'Résidences univ. ~400-900€/mois (places limitées) ; privé ~600-1200€/mois',
  monthly_budget = '~1200€ (logement 700-1200€, nourriture 300€, transport 50€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Stockholm University';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → fin janvier',
  housing_info = 'Recherche autonome via housing guide (inexchange@lnu.se) — coloc ~400-600€/mois',
  monthly_budget = '~1000€ (logement 400-900€, nourriture 270€, transport 40€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Linnaeus University';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → fin janvier',
  housing_info = 'Via Bostaden et Balticgruppen ~300-500€/mois ; privé ~350-800€/mois',
  monthly_budget = '~1000€ (logement 300-800€, nourriture 270€, transport 30€)',
  visa_info = 'Non requis (UE)',
  health_info = 'CEAM',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Umeå University';

-- TURQUIE
UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-septembre → fin janvier',
  housing_info = 'Dortoirs sur campus ~300-450€/mois ; privé coloc ~350-550€/mois',
  monthly_budget = '~900€ (logement 300-900€, nourriture 250€, transport 40€)',
  visa_info = 'Pas de visa pour séjour Erasmus (passeport requis), puis Student Residence Permit sur place',
  health_info = 'Assurance privée obligatoire (pas CEAM)',
  erasmus_plus = TRUE,
  supplement_fee = '0€'
WHERE name = 'Médipol University';

-- =================== HORS EUROPE ===================

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Février → août (4 à 6 mois, flexible)',
  housing_info = 'Résidences univ. sur demande (interhouse@sun.ac.za), non garanti — ~280-430€/mois',
  monthly_budget = '~550-700€ (logement 280-430€, nourriture 245€)',
  visa_info = 'Visa étudiant si séjour >90 jours (délai 3-4 mois)',
  health_info = 'Assurance sud-africaine obligatoire',
  erasmus_plus = FALSE,
  supplement_fee = 'Frais inscription ~300€',
  additional_notes = 'Séjour de recherche S10 — Trouver soi-même un superviseur académique avant de candidater'
WHERE name = 'Stellenbosch University';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Flexible selon projet',
  housing_info = 'Pris en charge par KAUST (appartements/villas meublés)',
  monthly_budget = '~1400€ — entièrement couvert par la bourse VSRP',
  visa_info = 'Visa étudiant',
  health_info = 'Assurance obligatoire pour visa',
  erasmus_plus = FALSE,
  supplement_fee = '0€',
  additional_notes = 'Séjour de recherche S10 — VSRP : 1000 USD/mois + logement + vols AR | Moyenne requise 14/20 en S7'
WHERE name LIKE 'King Abdullah University%';

UPDATE universities SET
  teaching_language = 'Espagnol',
  semester_dates = 'Première semaine août → fin décembre',
  housing_info = 'Pas de logement univ. — Homestay, Baires Aparts, Airbnb (~350-400€/mois)',
  monthly_budget = '~600€ (logement 350-400€, nourriture 135-200€, transport 14-25€)',
  visa_info = 'Visa Transitoire Études non formelles (~150€), consulat argentin',
  health_info = 'Assurance MEDICUS de l''UADE obligatoire',
  erasmus_plus = FALSE,
  supplement_fee = '0€',
  additional_notes = 'Coût semestre estimé : ~6200€'
WHERE name LIKE 'Universidad Argentina%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin juillet → décembre',
  housing_info = 'Résidence Yura Mudang sur campus ou privé ~1200€/mois',
  monthly_budget = '~8000€ total semestre (logement 1200€/mois, visa ~900€)',
  visa_info = 'Student Visa subclass 500, coût ~900€',
  health_info = 'OSHC obligatoire (~300 AUD)',
  erasmus_plus = FALSE,
  supplement_fee = 'À virer directement à l''ECE'
WHERE name LIKE 'University of Technology Sydney%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début octobre → fin janvier',
  housing_info = '9 résidences sur campus (220-500 AUD/semaine) ; hors campus ~1200€/mois',
  monthly_budget = '~8000€ total semestre',
  visa_info = 'Student Visa subclass 500, coût 2000 AUD, délai 1-2 mois',
  health_info = 'OSHC obligatoire (~500 AUD/semestre)',
  erasmus_plus = FALSE,
  supplement_fee = '6500€'
WHERE name LIKE 'University of Newcastle%';

UPDATE universities SET
  teaching_language = 'Portugais',
  semester_dates = 'Fin juillet → début décembre',
  housing_info = 'Pas de campus housing, accompagnement PUCPR (~140-260€/mois)',
  monthly_budget = '~3000€ total semestre',
  visa_info = 'VITEM IV, enregistrement police fédérale sous 30 jours (~110€)',
  health_info = 'Assurance obligatoire couvrant COVID-19 + vaccination fièvre jaune recommandée',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'Pontificia Universidade%';

UPDATE universities SET
  teaching_language = 'Français',
  semester_dates = 'Début septembre → mi-décembre',
  housing_info = 'Résidences sur campus (très demandées) ou privé coloc 300€/mois, appart jusqu''à 1200€/mois',
  monthly_budget = '~6000€ semestre (nourriture 500-700€/mois, transport 65-70€/mois)',
  visa_info = 'Visa de résident temporaire (VRT) ou AVE',
  health_info = 'Obligatoire — possibilité affiliation RAMQ pour Français',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'École de Technologie Supérieure%';

UPDATE universities SET
  teaching_language = 'Français',
  semester_dates = '31 août → 11 décembre 2026',
  housing_info = 'Résidences sur campus (~260€/mois) ou privé jusqu''à 800€/mois',
  monthly_budget = '~4000-5500€ semestre',
  visa_info = 'Pas de CAQ ni permis d''étude pour séjour <6 mois — VRT ou AVE suffisant',
  health_info = 'Français → entente France/Québec, démarche CPAM avant départ',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name = 'Université Laval';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début octobre → fin janvier',
  housing_info = 'Logements universitaires meublés avec salle de bain privée (~450-600€/mois)',
  monthly_budget = '~600-800€ (logement 450-600€, nourriture 100-150€, transport 15€)',
  visa_info = 'Visa F (études <6 mois) — billet AR + certificat de bonne santé requis',
  health_info = 'Assurance obligatoire, affiliation en France avant le départ',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'Nanjing University%';

UPDATE universities SET
  teaching_language = 'Espagnol',
  semester_dates = 'Début août → mi-décembre',
  housing_info = 'Pas de résidence — liste hébergements recommandés (~185-300€/mois coloc)',
  monthly_budget = '~540-800€ (logement 185-300€, nourriture 275-415€, transport 70€)',
  visa_info = 'Français <180 jours → passeport + lettre d''admission suffisent',
  health_info = 'Assurance internationale obligatoire',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'Escuela Colombiana%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → mi-décembre',
  housing_info = 'Résidence sur campus ~880-930€/semestre ; hors campus ~510-560€/semestre',
  monthly_budget = '~436-671€ (nourriture 134-235€, transport 34-67€)',
  visa_info = 'Visa étudiant D-2',
  health_info = 'Assurance privée Inha obligatoire',
  erasmus_plus = FALSE,
  supplement_fee = '0€',
  additional_notes = 'Justifier solvabilité financière 5500 USD minimum'
WHERE name = 'Inha University';

UPDATE universities SET
  teaching_language = 'Anglais, Coréen',
  semester_dates = 'Fin août → mi-décembre',
  housing_info = 'Résidence campus Yongin, chambres 4 personnes + plan repas obligatoire',
  monthly_budget = '~600€ — budget semestre ~4000€',
  visa_info = 'Visa étudiant D-2',
  health_info = 'NHIS automatique',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name = 'Myongji University';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → mi-décembre',
  housing_info = 'Dortoir garanti sur campus Suwon — 1300 USD/semestre (chambre double)',
  monthly_budget = '~3000€ semestre (nourriture 120-235€/mois, transport 35-45€/mois)',
  visa_info = 'Visa étudiant D-2',
  health_info = 'NHIS automatique (~60 USD/mois) + assurance privée recommandée',
  erasmus_plus = FALSE,
  supplement_fee = '0€',
  additional_notes = 'Justifier solvabilité financière 4000 USD'
WHERE name LIKE 'Sungkyunkwan%';

UPDATE universities SET
  teaching_language = 'Anglais, Coréen',
  semester_dates = 'Début septembre → fin décembre',
  housing_info = 'Résidence univ. 1200-1600 USD/semestre repas inclus ; hors campus ~350 000 KRW/mois',
  monthly_budget = '~1800-2500€ semestre (repas inclus dans logement)',
  visa_info = 'Visa étudiant D-2 + justifier ~2750€ de fonds',
  health_info = 'NHIS automatique',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'Pusan National%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → mi-décembre',
  housing_info = 'Dortoirs univ. 217 800-261 800 KRW/mois ; hors campus ~500€/mois',
  monthly_budget = '~2800-3000€ semestre (nourriture 300€/mois, transport 45€/mois)',
  visa_info = 'Visa étudiant D-2, coût 54€ + frais service 60€',
  health_info = 'Assurance privée obligatoire + NHIS avec carte de résident',
  erasmus_plus = FALSE,
  supplement_fee = '0€',
  additional_notes = 'Justifier solvabilité financière ~3750€'
WHERE name = 'Sejong University';

UPDATE universities SET
  teaching_language = 'Espagnol',
  semester_dates = 'Début septembre → fin décembre',
  housing_info = 'Campus Residencias ou recommandations RI (~500-750 USD/mois)',
  monthly_budget = '~6000€ semestre (logement 350-750€/mois, nourriture 150-200€/mois)',
  visa_info = 'Visa étudiant nécessaire — contacter ambassade Costa Rica',
  health_info = 'Assurance internationale obligatoire (>50 000 USD de couverture)',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'Universidad Latina de Costa Rica%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin septembre → mi-décembre',
  housing_info = 'Pas de logement garanti — appartements meublés ou homestay (~900-1500€/mois)',
  monthly_budget = '~1300€ minimum (logement 900-1500€, nourriture 300€, transport 100€)',
  visa_info = 'Visa étudiant F-1 (185$)',
  health_info = 'Affiliation automatique assurance univ.',
  erasmus_plus = FALSE,
  supplement_fee = '8490€'
WHERE name = 'UC San Diego Extended Studies';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-août → mi-décembre 2026',
  housing_info = '3 résidences sur campus (Beachside, Hillside, Parkside) très demandées',
  monthly_budget = '~12 000$ semestre (logement 800-1500$/mois, nourriture 250-400€/mois)',
  visa_info = 'Visa F-1 + SEVIS 350$',
  health_info = 'Assurance univ. obligatoire ~775$ (jcbins.com uniquement)',
  erasmus_plus = FALSE,
  supplement_fee = '6000€',
  additional_notes = 'Aucune autre assurance acceptée'
WHERE name LIKE 'California State University Long Beach%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début septembre → fin décembre',
  housing_info = 'Dortoir sur campus non garanti ou hôtels partenaires (~1000-1500€/mois)',
  monthly_budget = '~1500€ minimum (logement 1000-1500€, nourriture 400€, transport 100€)',
  visa_info = 'Visa F-1 (185$)',
  health_info = 'Boston University SHIP automatique (~700$)',
  erasmus_plus = FALSE,
  supplement_fee = '17 000€'
WHERE name = 'Boston University Metropolitan College';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Mi-août → fin décembre',
  housing_info = 'Logement sur campus garanti (sous réserve des délais) — ~1500-2000 USD/mois',
  monthly_budget = '~2200€ (logement 1400-1900€, nourriture 500€, transport 90€)',
  visa_info = 'Visa J-1',
  health_info = 'Assurance SFSU obligatoire avant arrivée (aucune autre acceptée)',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name = 'San Francisco State University';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Septembre → décembre',
  housing_info = 'Hors campus uniquement — appartements meublés ou homestay à Westwood (~1300-1800€/mois)',
  monthly_budget = '~1800€ (logement 1300-1800€, nourriture 350€, transport 80€)',
  visa_info = 'Visa F-1 (185$)',
  health_info = 'Assurance conforme UCLA Extension obligatoire',
  erasmus_plus = FALSE,
  supplement_fee = '4800€'
WHERE name = 'UCLA Extension';

UPDATE universities SET
  teaching_language = 'Espagnol',
  semester_dates = 'Mi-août → début décembre',
  housing_info = 'Réseau d''accueil ITESO ou familles d''accueil — coloc ~120-270€/mois, appart ~260-500€/mois',
  monthly_budget = '~2500-3000€ semestre total',
  visa_info = 'Pas requis si séjour <180 jours pour Français',
  health_info = 'Assurance internationale obligatoire (frais médicaux + rapatriement)',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name = 'ITESO';

UPDATE universities SET
  teaching_language = 'Espagnol (quelques cours en anglais)',
  semester_dates = 'Début août → mi-décembre',
  housing_info = '4 résidences sécurisées sur campus (~1500-2300€/semestre, paiement avant arrivée)',
  monthly_budget = '~900€ (logement 300-460€, nourriture 400€, transport 30€)',
  visa_info = 'Pas requis si séjour <180 jours pour Français',
  health_info = 'Assurance obligatoire (COVID-19 + rapatriement), preuve requise avant arrivée',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'Universidad de las Américas%';

UPDATE universities SET
  teaching_language = 'Espagnol',
  semester_dates = '11 août → 15 décembre',
  housing_info = 'Pas de résidence univ., accompagnement UDEP International (~300-450€/mois)',
  monthly_budget = '~600-800€ (logement 300-450€, nourriture 250€, transport 60€)',
  visa_info = 'Visa étudiant requis (coordonné par UDEP International)',
  health_info = 'Assurance internationale obligatoire (frais médicaux + rapatriement)',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'Universidad de Piura%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début août → mi-décembre',
  housing_info = 'Résidences univ. internationales (sous réserve) + options hors campus (~300-450€/mois)',
  monthly_budget = '~700-900€ (logement 300-450€, nourriture 300€, transport 60€)',
  visa_info = 'Visa touristique + Special Study Permit pour séjour <6 mois',
  health_info = 'Assurance internationale obligatoire',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name = 'Ateneo de Manila University';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début septembre → fin décembre',
  housing_info = 'Pas de résidence univ. — liste de contacts transmise après admission (~200-450€/mois)',
  monthly_budget = '~600-800€ (logement 200-450€, nourriture 300€, transport 40€)',
  visa_info = 'Visa visiteur requis (via BOCA, après lettre d''acceptation)',
  health_info = 'Assurance internationale obligatoire',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'National Taiwan University of Science%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Fin août → mi-décembre',
  housing_info = 'Résidences univ. ~180-520€/semestre (places limitées) ; hors campus ~100-230€/mois',
  monthly_budget = '~700-800€ (logement 150-500€, nourriture 200€, transport 30€)',
  visa_info = 'Visa visiteur requis (via BOCA)',
  health_info = 'Assurance internationale obligatoire',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'National Central University%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début septembre → fin décembre',
  housing_info = 'Résidences univ. sur campus (non garanti) + options hors campus',
  monthly_budget = '~700-800€ (logement 400€, nourriture 250€, transport 30€)',
  visa_info = 'Visa visiteur requis (via BOCA)',
  health_info = 'Assurance internationale obligatoire + NSYSU Student Group Insurance (~15€)',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'National Sun Yat-sen%';

UPDATE universities SET
  teaching_language = 'Anglais',
  semester_dates = 'Début août → mi-décembre',
  housing_info = 'Sur campus KMUTT Heliconia House (~500 USD/mois) ; hors campus ~200 USD/mois',
  monthly_budget = '~300€ (logement 200-500€, nourriture 200€, transport 15-30€)',
  visa_info = 'Visa étudiant Non-Immigrant ED — valable 90 jours, renouvelable',
  health_info = 'Assurance voyage internationale obligatoire souscrite dans le pays d''origine',
  erasmus_plus = FALSE,
  supplement_fee = '0€'
WHERE name LIKE 'King Mongkut%';
