-- Run before and after 2026-06-22_single_feeds_foundation.sql.
-- Target database: jz-local.

SELECT 'post_list' AS table_name, count(*) AS row_count FROM public.post_list
UNION ALL
SELECT 'feeds', count(*) FROM public.feeds
UNION ALL
SELECT 'text_post', count(*) FROM public.text_post
UNION ALL
SELECT 'link_post', count(*) FROM public.link_post
UNION ALL
SELECT 'feed_list', count(*) FROM public.feed_list
ORDER BY table_name;

SELECT
  feed_type,
  count(*) AS row_count
FROM public.feeds
GROUP BY feed_type
ORDER BY feed_type;

SELECT
  count(*) FILTER (WHERE feeds.post_id IS NULL) AS null_post_id,
  count(*) FILTER (WHERE feeds.feed_type IS NULL) AS null_feed_type,
  count(*) FILTER (WHERE feeds.from_sub_feed IS NULL) AS null_from_sub_feed,
  count(*) FILTER (WHERE feeds.created_at IS NULL) AS null_created_at,
  count(*) FILTER (WHERE feeds.updated_at IS NULL) AS null_updated_at
FROM public.feeds;

SELECT count(*) AS feeds_without_post
FROM public.feeds
LEFT JOIN public.post_list ON post_list.id = feeds.post_id
WHERE feeds.post_id IS NOT NULL
  AND post_list.id IS NULL;

SELECT count(*) AS post_without_feed
FROM public.post_list
LEFT JOIN public.feeds
  ON feeds.post_id = post_list.id
 AND feeds.feed_type = post_list.location
WHERE feeds.id IS NULL;

SELECT 'post_list' AS source_table, count(*) AS rows_without_feed_list_match
FROM public.post_list
LEFT JOIN public.feed_list ON feed_list.name = post_list.location
WHERE post_list.location IS NOT NULL
  AND feed_list.name IS NULL
UNION ALL
SELECT 'text_post', count(*)
FROM public.text_post
LEFT JOIN public.feed_list ON feed_list.name = text_post.location
WHERE text_post.location IS NOT NULL
  AND feed_list.name IS NULL
UNION ALL
SELECT 'link_post', count(*)
FROM public.link_post
LEFT JOIN public.feed_list ON feed_list.name = link_post.location
WHERE link_post.location IS NOT NULL
  AND feed_list.name IS NULL
ORDER BY source_table;

SELECT
  feed_type,
  post_id,
  count(*) AS duplicate_count
FROM public.feeds
GROUP BY feed_type, post_id
HAVING count(*) > 1
ORDER BY duplicate_count DESC, feed_type, post_id;

SELECT
  event_object_table,
  trigger_name,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('post_list', 'text_post', 'link_post')
ORDER BY event_object_table, trigger_name;

SELECT
  conrelid::regclass::text AS constraint_table,
  conname,
  convalidated
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
  AND conname IN (
    'post_list_location_fkey',
    'text_post_location_id_fkey',
    'link_post_location_id_fkey',
    'feeds_post_id_fkey',
    'feeds_feed_type_post_id_unique'
  )
ORDER BY constraint_table, conname;

SELECT
  conrelid::regclass::text AS legacy_constraint_table,
  conname,
  convalidated
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
  AND conname IN (
    'text_post_location_fkey',
    'link_post_location_fkey'
  )
ORDER BY legacy_constraint_table, conname;

SELECT
  conrelid::regclass::text AS constraint_table,
  conname,
  contype,
  convalidated
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
  AND conrelid IN (
    'public.feeds'::regclass,
    'public.post_list'::regclass,
    'public.text_post'::regclass,
    'public.link_post'::regclass
  )
ORDER BY constraint_table, conname;
