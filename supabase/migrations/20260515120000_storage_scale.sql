-- One Supabase project, many teams: logos/images in Storage (not separate DBs or deployments).
-- Path convention: team-assets/{team_id}/{filename}
-- Bucket allowlist: images only — host video on YouTube, Vimeo, Mux, etc., not in Storage.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-assets',
  'team-assets',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']::text[]
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

COMMENT ON TABLE public.teams IS
  'Tenant root: teams.id is the canonical team key; child tables use team_id. Multi-tenant single project (500+ teams); logos in Storage team-assets/{team_id}/; subscription_status for public RLS.';
