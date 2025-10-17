# Database Setup for JCR Application

## Required Tables

### 1. Employee Applications Table (`employee_applications`)

```sql
-- Create the employee applications table
CREATE TABLE public.employee_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    location TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    cv_file_name TEXT,
    cv_file_url TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'hired', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for better performance when filtering by status
CREATE INDEX idx_employee_applications_status ON employee_applications(status);

-- Create an index for better performance when ordering by creation date
CREATE INDEX idx_employee_applications_created_at ON employee_applications(created_at DESC);
```

### 2. Hiring Requests Table (`hiring_requests`)

```sql
-- Create the hiring requests table
CREATE TABLE public.hiring_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    person_name TEXT NOT NULL,
    title TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    role_overview TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for better performance when filtering by status
CREATE INDEX idx_hiring_requests_status ON hiring_requests(status);

-- Create an index for better performance when ordering by creation date
CREATE INDEX idx_hiring_requests_created_at ON hiring_requests(created_at DESC);
```

### 3. Disable RLS (for now)

```sql
-- Disable RLS for both tables (following the same pattern as your existing tables)
ALTER TABLE public.employee_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiring_requests DISABLE ROW LEVEL SECURITY;
```

## Table Structures

### Employee Applications Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `full_name` | TEXT | Candidate's full name | NOT NULL |
| `location` | TEXT | Candidate's location | NOT NULL |
| `email` | TEXT | Candidate's email | NOT NULL |
| `phone` | TEXT | Candidate's phone | NOT NULL |
| `cv_file_name` | TEXT | Original CV filename | Optional |
| `cv_file_url` | TEXT | Supabase storage URL for CV | Optional |
| `message` | TEXT | Candidate's message | NOT NULL |
| `status` | TEXT | Application status | Default: 'pending' |
| `created_at` | TIMESTAMP | Creation timestamp | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-generated |

### Hiring Requests Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `person_name` | TEXT | Contact person's name | NOT NULL |
| `title` | TEXT | Contact person's job title | NOT NULL |
| `business_name` | TEXT | Company name | NOT NULL |
| `email` | TEXT | Contact email | NOT NULL |
| `phone` | TEXT | Contact phone | NOT NULL |
| `location` | TEXT | Company location | NOT NULL |
| `role_overview` | TEXT | Role description | NOT NULL |
| `status` | TEXT | Request status | Default: 'pending' |
| `created_at` | TIMESTAMP | Creation timestamp | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-generated |

## File Storage Setup

For CV file uploads, you'll need to create a Supabase Storage bucket:

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a new bucket called `cv-files`
4. Set the bucket to be private (not public)
5. Configure RLS policies for the bucket (see below)

### Storage RLS Policies

Run these SQL commands in your Supabase SQL Editor to allow file uploads:

```sql
-- Allow anyone to upload files to cv-files bucket
CREATE POLICY "Allow file uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'cv-files');

-- Allow anyone to download files from cv-files bucket (for admin downloads)
CREATE POLICY "Allow file downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'cv-files');

-- Optional: Allow file updates (if you need to replace files)
CREATE POLICY "Allow file updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'cv-files');

-- Optional: Allow file deletions (for admin cleanup)
CREATE POLICY "Allow file deletions" ON storage.objects
FOR DELETE USING (bucket_id = 'cv-files');
```

**Alternative: Disable RLS for Storage (Less Secure)**

If you prefer to disable RLS entirely for the storage bucket (not recommended for production):

```sql
-- Disable RLS for storage objects (less secure)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

## Environment Variables

Make sure your `.env` file contains:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

## Status Options

### Employee Applications
- `pending` - New application, not yet reviewed
- `reviewed` - Application has been reviewed
- `contacted` - Candidate has been contacted
- `hired` - Candidate was hired
- `rejected` - Application was rejected

### Hiring Requests
- `pending` - New request, not yet reviewed
- `reviewed` - Request has been reviewed
- `contacted` - Client has been contacted
- `in_progress` - Actively working on the request
- `completed` - Request fulfilled
- `cancelled` - Request cancelled
