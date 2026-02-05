-- Allow authenticated users to download the template PDF
-- This assumes the bucket is named 'learning-agreements' and the file is at the root.

CREATE POLICY "Allow downloading template"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'learning-agreements'
  AND name = 'Modele-Learning-Agreement.pdf'
);
