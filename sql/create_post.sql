with post_info as 
(INSERT INTO POST_LIST (location,type,status,content)
VALUES ('Main', 'text', 'pending', 'jnkjn') 
RETURNING id, type, location ),
feed_id as (select feed_name_to_id('Main') )
insert into main_feed (list_id, post_id)
select feed_id.feed_name_to_id, post_info.id
from post_info, feed_id;
