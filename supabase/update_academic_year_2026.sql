-- 1. Reset old current years
UPDATE public.academic_years
SET is_current = FALSE
WHERE is_current = TRUE;

-- 2. Insert or Update 2026-2027 to be current
INSERT INTO public.academic_years (year, is_current)
VALUES ('2026-2027', TRUE)
ON CONFLICT (year) DO UPDATE
SET is_current = TRUE;

-- 3. Update ALL existing applications to 2026-2027
DO $$
DECLARE
  new_year_id UUID;
BEGIN
  -- Get the ID of the new year
  SELECT id INTO new_year_id FROM public.academic_years WHERE year = '2026-2027';

  -- Update all applications
  UPDATE public.applications
  SET academic_year_id = new_year_id;
END $$;
