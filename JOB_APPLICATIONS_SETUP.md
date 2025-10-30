Job Applications Table (Supabase) Setup

Run these SQL statements in Supabase SQL editor.

1) Table

```sql
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade,
  full_name text not null,
  email text not null,
  location text,
  experience_level text,
  cover_letter text,
  cv_file_url text not null,
  cv_file_name text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_job_applications_job_id on public.job_applications(job_id);
```

2) Storage bucket (one-time)

```sql
-- Create bucket from UI Storage settings as "cv-files" (public=false recommended)
-- Or via RPC/CLI if needed.
```

3) RLS

```sql
alter table public.job_applications enable row level security;

-- Allow inserts from anon (form submissions) but no read
create policy "anon can insert job applications" on public.job_applications
  for insert to anon using (true) with check (true);

-- Allow admin/service role to read
create policy "authenticated can read job applications" on public.job_applications
  for select to authenticated using (true);

-- Optionally allow updates by authenticated roles (admin UI)
create policy "authenticated can update job applications" on public.job_applications
  for update to authenticated using (true) with check (true);
```

4) Storage policy (cv-files)

If the bucket is private (recommended), allow authenticated read and anon insert via signed uploads (or keep uploads client-side if anon permitted):

```sql
-- In Storage policies for bucket "cv-files":
-- Allow anon to upload (insert) paths
-- Allow authenticated to select (download)
```

Notes
- If you keep the bucket private, ensure the admin UI runs as authenticated and has permission to download files.
- If your existing `employee_applications` table remains, no changes are required; the admin job board in this repo reads from `job_applications` now.


