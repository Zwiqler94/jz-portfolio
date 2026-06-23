-- Foundation migration for the unified feeds architecture.
-- Target database: jz-local.
-- Rollout order: local -> Neon development -> Neon production.
-- Run 2026-06-22_single_feeds_foundation_checks.sql before and after this file.

BEGIN;

CREATE EXTENSION IF NOT EXISTS citext;

ALTER TABLE public.link_post
  DROP CONSTRAINT IF EXISTS link_post_location_id_fkey;

ALTER TABLE public.link_post
  DROP CONSTRAINT IF EXISTS link_post_location_fkey;

ALTER TABLE public.text_post
  DROP CONSTRAINT IF EXISTS text_post_location_id_fkey;

ALTER TABLE public.text_post
  DROP CONSTRAINT IF EXISTS text_post_location_fkey;

ALTER TABLE public.post_list
  DROP CONSTRAINT IF EXISTS post_list_location_fkey;

ALTER TABLE public.feed_list
  ALTER COLUMN name TYPE citext USING name::citext;

ALTER TABLE public.post_list
  ALTER COLUMN location TYPE citext USING location::citext;

ALTER TABLE public.text_post
  ALTER COLUMN location TYPE citext USING location::citext;

ALTER TABLE public.link_post
  ALTER COLUMN location TYPE citext USING location::citext;

ALTER TABLE public.post_list
  ADD CONSTRAINT post_list_location_fkey
  FOREIGN KEY (location)
  REFERENCES public.feed_list(name)
  ON UPDATE CASCADE
  NOT VALID;

ALTER TABLE public.text_post
  ADD CONSTRAINT text_post_location_id_fkey
  FOREIGN KEY (location)
  REFERENCES public.feed_list(name)
  ON UPDATE CASCADE
  NOT VALID;

ALTER TABLE public.link_post
  ADD CONSTRAINT link_post_location_id_fkey
  FOREIGN KEY (location)
  REFERENCES public.feed_list(name)
  ON UPDATE CASCADE
  NOT VALID;

ALTER TABLE public.post_list VALIDATE CONSTRAINT post_list_location_fkey;
ALTER TABLE public.text_post VALIDATE CONSTRAINT text_post_location_id_fkey;
ALTER TABLE public.link_post VALIDATE CONSTRAINT link_post_location_id_fkey;

DELETE FROM public.feeds AS feeds
WHERE feeds.post_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM public.post_list
    WHERE post_list.id = feeds.post_id
  );

WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY feed_type, post_id
      ORDER BY created_at NULLS LAST, id
    ) AS duplicate_rank
  FROM public.feeds
  WHERE feed_type IS NOT NULL
    AND post_id IS NOT NULL
)
DELETE FROM public.feeds
USING ranked
WHERE feeds.id = ranked.id
  AND ranked.duplicate_rank > 1;

UPDATE public.feeds
SET from_sub_feed = false
WHERE from_sub_feed IS NULL;

UPDATE public.feeds AS feeds
SET
  created_at = COALESCE(feeds.created_at, post_list.created_at, CURRENT_TIMESTAMP),
  updated_at = COALESCE(feeds.updated_at, post_list.updated_at, CURRENT_TIMESTAMP)
FROM public.post_list
WHERE feeds.post_id = post_list.id
  AND (feeds.created_at IS NULL OR feeds.updated_at IS NULL);

INSERT INTO public.feeds (
  feed_type,
  post_id,
  from_sub_feed,
  created_at,
  updated_at
)
SELECT
  post_list.location,
  post_list.id,
  false,
  COALESCE(post_list.created_at, CURRENT_TIMESTAMP),
  COALESCE(post_list.updated_at, CURRENT_TIMESTAMP)
FROM public.post_list
WHERE post_list.location IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM public.feeds
    WHERE feeds.feed_type = post_list.location
      AND feeds.post_id = post_list.id
  );

ALTER TABLE public.feeds
  ALTER COLUMN feed_type SET NOT NULL,
  ALTER COLUMN post_id SET NOT NULL,
  ALTER COLUMN from_sub_feed SET DEFAULT false,
  ALTER COLUMN from_sub_feed SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE public.feeds
  DROP CONSTRAINT IF EXISTS feeds_post_id_fkey;

ALTER TABLE public.feeds
  ADD CONSTRAINT feeds_post_id_fkey
  FOREIGN KEY (post_id)
  REFERENCES public.post_list(id)
  ON DELETE CASCADE
  NOT VALID;

ALTER TABLE public.feeds VALIDATE CONSTRAINT feeds_post_id_fkey;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'feeds_feed_type_post_id_unique'
      AND conrelid = 'public.feeds'::regclass
  ) THEN
    ALTER TABLE public.feeds
      ADD CONSTRAINT feeds_feed_type_post_id_unique UNIQUE (feed_type, post_id);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'text_post_post_list_id_unique'
      AND conrelid = 'public.text_post'::regclass
  ) THEN
    ALTER TABLE public.text_post
      ADD CONSTRAINT text_post_post_list_id_unique UNIQUE (post_list_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'link_post_post_list_id_unique'
      AND conrelid = 'public.link_post'::regclass
  ) THEN
    ALTER TABLE public.link_post
      ADD CONSTRAINT link_post_post_list_id_unique UNIQUE (post_list_id);
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS idx_feeds_feed_type_created_at
  ON public.feeds (feed_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feeds_post_id
  ON public.feeds (post_id);

CREATE OR REPLACE FUNCTION public.set_post_list_hash() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.post_hash IS NULL THEN
    NEW.post_hash := public.hash_post(
      NEW.location,
      NEW.type,
      NEW.status,
      NEW.content
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_post_list_hash ON public.post_list;
DROP TRIGGER IF EXISTS add_post_id ON public.post_list;
DROP TRIGGER IF EXISTS add_post_list_id ON public.post_list;

CREATE TRIGGER set_post_list_hash
  BEFORE INSERT ON public.post_list
  FOR EACH ROW
  EXECUTE FUNCTION public.set_post_list_hash();

CREATE OR REPLACE FUNCTION public.add_to_post_type_lists() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'text' THEN
    INSERT INTO public.text_post (
      post_list_id,
      title,
      post_hash,
      content,
      status,
      location
    ) VALUES (
      NEW.id,
      NEW.title,
      NEW.post_hash,
      NEW.content,
      NEW.status,
      NEW.location
    )
    ON CONFLICT (post_list_id) DO NOTHING;
  END IF;

  IF NEW.type = 'link' THEN
    INSERT INTO public.link_post (
      post_list_id,
      uri,
      title,
      content,
      post_hash,
      status,
      location
    ) VALUES (
      NEW.id,
      public.get_uri_from_content(NEW.content),
      NEW.title,
      NEW.content,
      NEW.post_hash,
      NEW.status,
      NEW.location
    )
    ON CONFLICT (post_list_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS add_to_post_type_lists ON public.post_list;

CREATE TRIGGER add_to_post_type_lists
  AFTER INSERT ON public.post_list
  FOR EACH ROW
  EXECUTE FUNCTION public.add_to_post_type_lists();

CREATE OR REPLACE FUNCTION public.add_to_feeds() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.feeds (
    feed_type,
    post_id,
    from_sub_feed,
    created_at,
    updated_at
  ) VALUES (
    NEW.location,
    NEW.id,
    false,
    COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
    COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
  )
  ON CONFLICT (feed_type, post_id) DO UPDATE
  SET updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS add_to_main_feed ON public.post_list;
DROP TRIGGER IF EXISTS add_to_feeds ON public.post_list;

CREATE TRIGGER add_to_feeds
  AFTER INSERT ON public.post_list
  FOR EACH ROW
  EXECUTE FUNCTION public.add_to_feeds();

DROP TRIGGER IF EXISTS add_to_post_list ON public.text_post;
DROP TRIGGER IF EXISTS add_to_post_list ON public.link_post;

COMMIT;
