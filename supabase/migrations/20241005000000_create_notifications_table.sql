-- Create notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null,
  title text not null,
  message text not null,
  data jsonb,
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Create RLS policies (drop first if they exist)
drop policy if exists "Users can view their own notifications" on public.notifications;
drop policy if exists "Users can insert their own notifications" on public.notifications;
drop policy if exists "Users can update their own notifications" on public.notifications;
drop policy if exists "Users can delete their own notifications" on public.notifications;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- Create function to automatically create notification when video status changes
create or replace function public.handle_video_status_change()
returns trigger as $$
begin
  -- Only create notification when status changes to completed or failed
  if new.status != old.status and new.status in ('completed', 'failed') then
    insert into public.notifications (
      user_id,
      type,
      title,
      message,
      data
    ) values (
      new.user_id,
      'video_' || new.status,
      case 
        when new.status = 'completed' then 'Video Generation Complete'
        when new.status = 'failed' then 'Video Generation Failed'
      end,
      case 
        when new.status = 'completed' then 'Your video has been successfully generated and is ready to view.'
        when new.status = 'failed' then 'Your video generation failed. Please try again.'
      end,
      jsonb_build_object(
        'video_id', new.id,
        'avatar_id', new.avatar_id,
        'script', new.script,
        'video_url', new.video_url,
        'error_message', new.error_message
      )
    );
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists
drop trigger if exists on_video_status_change on public.generated_videos;

-- Create trigger
create trigger on_video_status_change
  after update on public.generated_videos
  for each row
  execute function public.handle_video_status_change();
