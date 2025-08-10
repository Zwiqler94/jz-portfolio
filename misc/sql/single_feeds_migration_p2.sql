-- CREATE EXTENSION IF NOT EXISTS citext;



-- ALTER TABLE public.post_list
-- ALTER COLUMN location TYPE citext USING location::citext;

-- ALTER TABLE public.text_post
-- ALTER COLUMN location TYPE citext USING location::citext;

-- ALTER TABLE public.link_post
-- ALTER COLUMN location TYPE citext USING location::citext;



-- ALTER TABLE public.post_list DROP CONSTRAINT IF EXISTS post_list_location_fkey;

-- ALTER TABLE public.post_list
-- ADD CONSTRAINT post_list_location_fkey
-- FOREIGN KEY (location) REFERENCES public.feed_list(name)
-- ON UPDATE CASCADE;

-- SELECT name, status FROM public.feed_list;

-- INSERT INTO public.feed_list (name, status)
-- VALUES ('main', 'live')
-- ON CONFLICT (name) DO NOTHING;


ALTER TABLE public.feed_list
ALTER COLUMN name TYPE citext USING name::citext;

ALTER TABLE public.post_list
ALTER COLUMN location TYPE citext USING location::citext;


ALTER TABLE public.post_list DROP CONSTRAINT IF EXISTS post_list_location_fkey;

ALTER TABLE public.post_list
ADD CONSTRAINT post_list_location_fkey
FOREIGN KEY (location) REFERENCES public.feed_list(name)
ON UPDATE CASCADE;

ALTER TABLE public.text_post
ADD CONSTRAINT text_post_post_list_id_unique UNIQUE (post_list_id);

ALTER TABLE public.link_post
ADD CONSTRAINT link_post_post_list_id_unique UNIQUE (post_list_id);




INSERT INTO public.post_list (location, type, content, title, status)
VALUES ('main', 'text', '<p>This is a test post.</p>', 'Test Post Title', 'posted');
