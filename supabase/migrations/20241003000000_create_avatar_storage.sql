create table if not exists public.avatar_previews (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  style text not null,
  voice text not null,
  description text not null,
  video_url text not null,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.generated_videos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  avatar_id uuid references public.avatar_previews(id) on delete set null,
  script text not null,
  voice_settings jsonb not null,
  video_url text,
  audio_url text,
  status text not null default 'pending',
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.avatar_previews enable row level security;
alter table public.generated_videos enable row level security;

create policy "Avatar previews are viewable by everyone"
  on public.avatar_previews for select
  using (true);

create policy "Users can view their own generated videos"
  on public.generated_videos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generated videos"
  on public.generated_videos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own generated videos"
  on public.generated_videos for update
  using (auth.uid() = user_id);

