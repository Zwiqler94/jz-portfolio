-- with x as (select convert_to(json_build_object('location', 0, 'type', ' ')::text, 'UTF8') as byte_result),
--  nvnv as (select encode(byte_result, 'base64') as encoded_result from x),
-- ncnc as (select decode(encoded_result, 'base64') as binary_result from nvnv)
-- select convert_from(binary_result, 'UTF8')::json from ncnc;

-- select json_build_object('location', 0, 'type', ' ')::text

-- with x as (select convert_to(json_build_object('location', 0, 'type', 90, 'status', 79, 'content', 'kl'::text)::text, 'UTF8') as byte_result)
-- select encode(byte_result, 'base64') as encoded_result from x


select hash_post('Main', 'text', 'pending', 'hello my name is jake')