-- ============================================================
-- TournamentX — Initial Schema Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── ENUMS ──────────────────────────────────────────────────
create type public.game_type as enum ('Free Fire MAX', 'BGMI');
create type public.game_mode as enum ('Solo', 'Duo', 'Squad');
create type public.tournament_status as enum ('Upcoming', 'Live', 'Completed', 'Cancelled');
create type public.user_role as enum ('user', 'admin', 'moderator');
create type public.payment_status as enum ('pending', 'approved', 'rejected');
create type public.registration_status as enum ('pending', 'approved', 'rejected', 'cancelled');
create type public.notification_type as enum ('tournament', 'registration', 'room', 'result', 'system', 'payment');
create type public.team_member_role as enum ('captain', 'member');

-- ─── PROFILES ───────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  username      text unique,
  full_name     text,
  avatar_url    text,
  free_fire_uid text,
  bgmi_uid      text,
  favorite_game public.game_type,
  state         text,
  country       text default 'India',
  role          public.user_role default 'user',
  verified      boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select using (true);
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- ─── TEAMS ──────────────────────────────────────────────────
create table public.teams (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null unique,
  logo_url   text,
  captain_id uuid references public.profiles(id) on delete set null,
  game       public.game_type not null,
  created_at timestamptz default now()
);
alter table public.teams enable row level security;

create policy "Teams are publicly readable"
  on public.teams for select using (true);
create policy "Authenticated users can create teams"
  on public.teams for insert with check (auth.uid() is not null);
create policy "Captains can update their team"
  on public.teams for update using (auth.uid() = captain_id);
create policy "Captains can delete their team"
  on public.teams for delete using (auth.uid() = captain_id);

-- ─── TEAM MEMBERS ────────────────────────────────────────────
create table public.team_members (
  id        uuid primary key default uuid_generate_v4(),
  team_id   uuid not null references public.teams(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  role      public.team_member_role default 'member',
  joined_at timestamptz default now(),
  unique(team_id, user_id)
);
alter table public.team_members enable row level security;

create policy "Team members are publicly readable"
  on public.team_members for select using (true);
create policy "Users can join teams"
  on public.team_members for insert with check (auth.uid() is not null);
create policy "Members can leave or captains can manage"
  on public.team_members for delete using (
    auth.uid() = user_id or
    auth.uid() = (select captain_id from public.teams where id = team_id)
  );

-- ─── TOURNAMENTS ─────────────────────────────────────────────
create table public.tournaments (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  game        public.game_type not null,
  mode        public.game_mode not null,
  map         text not null,
  prize_pool  integer not null default 0,
  entry_fee   integer not null default 0,
  total_slots integer not null default 100,
  filled_slots integer not null default 0,
  start_time  timestamptz not null,
  status      public.tournament_status default 'Upcoming',
  banner_url  text,
  banner_gradient text default 'from-red-600 via-rose-500 to-orange-500',
  rules       text,
  room_id     text,
  room_password text,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz default now()
);
alter table public.tournaments enable row level security;

create policy "Tournaments are publicly readable"
  on public.tournaments for select using (true);
create policy "Admins can manage tournaments"
  on public.tournaments for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── REGISTRATIONS ───────────────────────────────────────────
create table public.registrations (
  id                  uuid primary key default uuid_generate_v4(),
  tournament_id       uuid not null references public.tournaments(id) on delete cascade,
  team_id             uuid references public.teams(id) on delete set null,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  payment_status      public.payment_status default 'pending',
  registration_status public.registration_status default 'pending',
  created_at          timestamptz default now(),
  unique(tournament_id, team_id)
);
alter table public.registrations enable row level security;

create policy "Users can view their own registrations"
  on public.registrations for select using (auth.uid() = user_id);
create policy "Admins can view all registrations"
  on public.registrations for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Authenticated users can register"
  on public.registrations for insert with check (auth.uid() = user_id);
create policy "Users can cancel their registrations"
  on public.registrations for update using (auth.uid() = user_id);
create policy "Admins can update any registration"
  on public.registrations for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── PAYMENT SUBMISSIONS ─────────────────────────────────────
create table public.payment_submissions (
  id              uuid primary key default uuid_generate_v4(),
  tournament_id   uuid not null references public.tournaments(id) on delete cascade,
  registration_id uuid references public.registrations(id) on delete set null,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  utr_number      text not null,
  screenshot_url  text,
  payment_status  public.payment_status default 'pending',
  verified_by     uuid references public.profiles(id),
  amount          integer not null default 0,
  created_at      timestamptz default now()
);
alter table public.payment_submissions enable row level security;

create policy "Users can view their own payment submissions"
  on public.payment_submissions for select using (auth.uid() = user_id);
create policy "Admins can view all payment submissions"
  on public.payment_submissions for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Authenticated users can submit payments"
  on public.payment_submissions for insert with check (auth.uid() = user_id);
create policy "Admins can update payment status"
  on public.payment_submissions for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── REDEEM CODES ────────────────────────────────────────────
create table public.redeem_codes (
  id                  uuid primary key default uuid_generate_v4(),
  code                text not null unique,
  discount_percentage integer not null default 0 check (discount_percentage between 0 and 100),
  free_entry          boolean default false,
  expiry_date         date,
  max_usage           integer not null default 1,
  current_usage       integer not null default 0,
  status              boolean default true,
  created_at          timestamptz default now()
);
alter table public.redeem_codes enable row level security;

create policy "Active codes are publicly readable"
  on public.redeem_codes for select using (status = true);
create policy "Admins can manage redeem codes"
  on public.redeem_codes for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── NOTIFICATIONS ───────────────────────────────────────────
create table public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  message    text not null,
  type       public.notification_type default 'system',
  read       boolean default false,
  link       text,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select using (auth.uid() = user_id);
create policy "Users can mark notifications as read"
  on public.notifications for update using (auth.uid() = user_id);
create policy "System can insert notifications"
  on public.notifications for insert with check (true);

-- ─── ADMIN LOGS ──────────────────────────────────────────────
create table public.admin_logs (
  id          uuid primary key default uuid_generate_v4(),
  admin_id    uuid references public.profiles(id) on delete set null,
  action      text not null,
  entity_type text not null,
  entity_id   uuid,
  details     jsonb,
  created_at  timestamptz default now()
);
alter table public.admin_logs enable row level security;

create policy "Admins can view all logs"
  on public.admin_logs for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Admins can insert logs"
  on public.admin_logs for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── TRIGGERS ────────────────────────────────────────────────

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(
      new.raw_user_meta_data->>'preferred_username',
      split_part(coalesce(new.email, new.phone::text), '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at on profiles
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Increment filled_slots on tournament when registration is approved
create or replace function public.update_tournament_slots()
returns trigger language plpgsql security definer as $$
begin
  if new.registration_status = 'approved' and old.registration_status != 'approved' then
    update public.tournaments
    set filled_slots = filled_slots + 1
    where id = new.tournament_id;
  elsif old.registration_status = 'approved' and new.registration_status != 'approved' then
    update public.tournaments
    set filled_slots = greatest(0, filled_slots - 1)
    where id = new.tournament_id;
  end if;
  return new;
end;
$$;

create trigger on_registration_status_change
  after update on public.registrations
  for each row execute procedure public.update_tournament_slots();

-- ─── STORAGE BUCKETS ─────────────────────────────────────────
-- These are created via the Supabase Dashboard or can be run here if using the admin API.
-- Insert bucket records (works in Supabase SQL Editor with admin privileges):

insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('payment-proofs', 'payment-proofs', false),
  ('tournament-banners', 'tournament-banners', true),
  ('team-logos', 'team-logos', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload their own avatar"
  on storage.objects for insert with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "Users can update their own avatar"
  on storage.objects for update using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Payment proofs are private"
  on storage.objects for select using (
    bucket_id = 'payment-proofs' and (
      auth.uid()::text = (storage.foldername(name))[1] or
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    )
  );
create policy "Users can upload payment proofs"
  on storage.objects for insert with check (
    bucket_id = 'payment-proofs' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Tournament banners are public"
  on storage.objects for select using (bucket_id = 'tournament-banners');
create policy "Admins can upload tournament banners"
  on storage.objects for insert with check (
    bucket_id = 'tournament-banners' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Team logos are public"
  on storage.objects for select using (bucket_id = 'team-logos');
create policy "Team captains can upload logos"
  on storage.objects for insert with check (
    bucket_id = 'team-logos' and auth.uid() is not null
  );

-- ─── REALTIME ────────────────────────────────────────────────
-- Enable realtime for these tables in the Supabase Dashboard:
-- Database → Replication → Tables: notifications, registrations, tournaments
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.registrations;
alter publication supabase_realtime add table public.tournaments;
