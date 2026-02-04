-- Fix to allow students to submit their application (transition from draft/revision to submitted)
-- The previous policy prevented status updates to 'submitted' because 'submitted' was not in the allowed list of the USING clause,
-- and WITH CHECK defaults to USING if not specified.

DROP POLICY IF EXISTS "Students can update their draft applications" ON public.applications;

CREATE POLICY "Students can update their draft applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = student_id AND status IN ('draft', 'revision'))
  WITH CHECK (auth.uid() = student_id AND status IN ('draft', 'revision', 'submitted'));
