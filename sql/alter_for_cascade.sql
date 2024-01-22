alter table public.post_list
add constraint post_list_hash_fkey
	foreign key (post_hash)
	references text_post(post_hash)
	on update cascade
	on delete cascade;

