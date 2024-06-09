
CREATE TRIGGER add_post
	AFTER INSERT ON public.text_post 
	FOR EACH ROW
	EXECUTE function add_post();
	

