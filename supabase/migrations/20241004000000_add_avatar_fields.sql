alter table public.avatar_previews
add column if not exists story text,
add column if not exists accent text;

comment on column public.avatar_previews.story is 'Character backstory/description';
comment on column public.avatar_previews.accent is 'Voice accent (e.g., American, British, Australian)';

