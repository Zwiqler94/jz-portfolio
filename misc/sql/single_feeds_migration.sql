-- -- Speed up lookup by post_id in anime_feed
-- CREATE INDEX idx_anime_feed_post_id ON public.anime_feed (post_id);

-- -- Speed up date-based queries
-- CREATE INDEX idx_anime_feed_created_at ON public.anime_feed (created_at);

-- -- Optimize searches in articles_feed
-- CREATE INDEX idx_articles_feed_list_id ON public.articles_feed (list_id);
-- CREATE INDEX idx_articles_feed_created_at ON public.articles_feed (created_at);

-- CREATE TABLE feeds (
--     id SERIAL PRIMARY KEY,
--     feed_type TEXT NOT NULL, -- e.g., 'anime', 'articles', 'blockchain'
--     list_id INTEGER,
--     post_id INTEGER,
--     from_sub_feed BOOLEAN,
--     created_at TIMESTAMP,
--     updated_at TIMESTAMP
-- );

-- INSERT INTO public.feeds (feed_type, list_id, post_id, from_sub_feed, created_at, updated_at)
-- SELECT 'anime', list_id, post_id, from_sub_feed, created_at, updated_at FROM public.anime_feed;

-- INSERT INTO public.feeds (feed_type, list_id, post_id, from_sub_feed, created_at, updated_at)
-- SELECT 'articles', list_id, post_id, from_sub_feed, created_at, updated_at FROM public.articles_feed;

-- INSERT INTO public.feeds (feed_type, list_id, post_id, from_sub_feed, created_at, updated_at)
-- SELECT 'apple', list_id, post_id, from_sub_feed, created_at, updated_at FROM public.apple_feed;

-- INSERT INTO public.feeds (feed_type, list_id, post_id, from_sub_feed, created_at, updated_at)
-- SELECT 'blockchain', list_id, post_id, from_sub_feed, created_at, updated_at FROM public.blockchain_feed;

-- INSERT INTO public.feeds (feed_type, list_id, post_id, from_sub_feed, created_at, updated_at)
-- SELECT 'main', list_id, post_id, from_sub_feed, created_at, updated_at FROM public.main_feed;

-- INSERT INTO public.feeds (feed_type, list_id, post_id, from_sub_feed, created_at, updated_at)
-- SELECT 'news', list_id, post_id, from_sub_feed, created_at, updated_at FROM public.news_feed;

-- INSERT INTO public.feeds (feed_type, list_id, post_id, from_sub_feed, created_at, updated_at)
-- SELECT 'social', list_id, post_id, from_sub_feed, created_at, updated_at FROM public.social_feed;

-- CREATE INDEX idx_feeds_feed_type ON public.feeds (feed_type);
-- CREATE INDEX idx_feeds_list_id ON public.feeds (list_id);
-- CREATE INDEX idx_feeds_created_at ON public.feeds (created_at DESC);

-- SELECT * FROM public.feeds WHERE feed_type = 'main' AND created_at > NOW() - INTERVAL '38 days';

-- DROP TABLE public.anime_feed;
-- DROP TABLE public.articles_feed;
-- DROP TABLE public.apple_feed;
-- DROP TABLE public.blockchain_feed;
-- DROP TABLE public.main_feed;
-- DROP TABLE public.puppy_feed;
-- DROP TABLE public.news_feed;
-- DROP TABLE public.social_feed;


CREATE OR REPLACE FUNCTION add_to_post_type_lists() RETURNS TRIGGER AS $$
BEGIN 
    -- Insert into `text_post` if type is 'text'
    IF NEW.TYPE = 'text' THEN
        INSERT INTO text_post (
            post_list_id, title, post_hash, content, status, location
        ) VALUES (
            NEW.id, NEW.title, NEW.post_hash, NEW.content, NEW.status, NEW.location
        )
        ON CONFLICT (post_list_id) DO NOTHING; -- Prevent duplicate inserts
    END IF;
    
    -- Insert into `link_post` if type is 'link'
    IF NEW.TYPE = 'link' THEN
        INSERT INTO link_post (
            post_list_id, uri, title, content, post_hash, status, location
        ) VALUES (
            NEW.id, GET_URI_FROM_CONTENT(NEW.content), NEW.title, NEW.content, NEW.post_hash, NEW.status, NEW.location
        )
        ON CONFLICT (post_list_id) DO NOTHING; -- Prevent duplicate inserts
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



