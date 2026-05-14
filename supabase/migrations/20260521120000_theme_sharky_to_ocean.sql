-- Rename legacy theme id (no more "sharky" in stored theme_id).
UPDATE public.teams SET theme_id = 'ocean_aqua' WHERE theme_id = 'sharky_aqua';
