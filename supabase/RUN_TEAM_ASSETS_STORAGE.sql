-- Run once in Supabase → SQL → New query (fixes "Bucket not found" on image upload).
-- Creates public bucket team-assets + coach RLS + PDF/audio mime types.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-assets',
  'team-assets',
  true,
  5242880,
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/x-wav'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

DROP POLICY IF EXISTS "team_assets_public_read" ON storage.objects;
CREATE POLICY "team_assets_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-assets');

DROP POLICY IF EXISTS "team_assets_coach_insert" ON storage.objects;
CREATE POLICY "team_assets_coach_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'team-assets'
  AND EXISTS (
    SELECT 1 FROM public.team_members m
    WHERE m.user_id = auth.uid()
      AND m.team_id::text = split_part(name, '/', 1)
  )
);

DROP POLICY IF EXISTS "team_assets_coach_update" ON storage.objects;
CREATE POLICY "team_assets_coach_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'team-assets'
  AND EXISTS (
    SELECT 1 FROM public.team_members m
    WHERE m.user_id = auth.uid()
      AND m.team_id::text = split_part(name, '/', 1)
  )
)
WITH CHECK (
  bucket_id = 'team-assets'
  AND EXISTS (
    SELECT 1 FROM public.team_members m
    WHERE m.user_id = auth.uid()
      AND m.team_id::text = split_part(name, '/', 1)
  )
);

DROP POLICY IF EXISTS "team_assets_coach_delete" ON storage.objects;
CREATE POLICY "team_assets_coach_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'team-assets'
  AND EXISTS (
    SELECT 1 FROM public.team_members m
    WHERE m.user_id = auth.uid()
      AND m.team_id::text = split_part(name, '/', 1)
  )
);

-- Verify (should return 1 row):
-- SELECT id, public FROM storage.buckets WHERE id = 'team-assets';
