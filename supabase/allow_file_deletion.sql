-- Policy to allow users to delete their own files
-- This is necessary so students can remove a wrong PDF before submitting,
-- or so admins can remove a file they uploaded by mistake.

CREATE POLICY "Users can delete their own files"
  ON public.files FOR DELETE
  USING (auth.uid() = uploader_id);
