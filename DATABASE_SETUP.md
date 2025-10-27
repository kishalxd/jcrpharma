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

### 3. Jobs Table (`jobs`)

```sql
-- Create the jobs table
CREATE TABLE public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    work_mode TEXT NOT NULL CHECK (work_mode IN ('Remote', 'Hybrid', 'Onsite')),
    contract TEXT NOT NULL CHECK (contract IN ('Permanent', 'Contract', 'Interim')),
    salary TEXT,
    specialism TEXT NOT NULL CHECK (specialism IN ('Biostatistics', 'Clinical Data Management', 'Bioinformatics', 'Medical Affairs', 'Regulatory Affairs')),
    seniority TEXT NOT NULL CHECK (seniority IN ('Entry Level', 'Mid Level', 'Senior Level', 'Director Level', 'C-Suite')),
    description TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    show_company BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_specialism ON jobs(specialism);
CREATE INDEX idx_jobs_work_mode ON jobs(work_mode);
CREATE INDEX idx_jobs_contract ON jobs(contract);
CREATE INDEX idx_jobs_featured ON jobs(featured);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_location ON jobs(location);

-- Create a GIN index for skills array searching
CREATE INDEX idx_jobs_skills ON jobs USING GIN(skills);
```

### 4. Page Contents Table (`page_contents`)

```sql
-- Create the page contents table for CMS functionality
CREATE TABLE public.page_contents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_name TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_page_contents_page_name ON page_contents(page_name);
CREATE INDEX idx_page_contents_updated_at ON page_contents(updated_at DESC);
```

### 5. Disable RLS (for now)

```sql
-- Disable RLS for all tables (following the same pattern as your existing tables)
ALTER TABLE public.employee_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiring_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents DISABLE ROW LEVEL SECURITY;
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

### Jobs Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `title` | TEXT | Job title | NOT NULL |
| `company` | TEXT | Company name | NOT NULL |
| `location` | TEXT | Job location | NOT NULL |
| `work_mode` | TEXT | Work arrangement | NOT NULL, CHECK constraint |
| `contract` | TEXT | Contract type | NOT NULL, CHECK constraint |
| `salary` | TEXT | Salary range | Optional |
| `specialism` | TEXT | Job specialism | NOT NULL, CHECK constraint |
| `seniority` | TEXT | Seniority level | NOT NULL, CHECK constraint |
| `description` | TEXT | Job description | NOT NULL |
| `skills` | TEXT[] | Required skills array | Default: empty array |
| `featured` | BOOLEAN | Featured job flag | Default: FALSE |
| `show_company` | BOOLEAN | Show company name flag | Default: TRUE |
| `status` | TEXT | Job status | Default: 'active', CHECK constraint |
| `created_at` | TIMESTAMP | Creation timestamp | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-generated |

### Page Contents Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `page_name` | TEXT | Page identifier | NOT NULL, UNIQUE |
| `content` | JSONB | Page content data | NOT NULL, Default: '{}' |
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

### Jobs
- `active` - Job is live and accepting applications
- `archived` - Job is no longer accepting applications but kept for reference
- `draft` - Job is being prepared and not yet published

### Work Modes (Jobs)
- `Remote` - Fully remote work
- `Hybrid` - Mix of remote and office work
- `Onsite` - Office-based work

### Contract Types (Jobs)
- `Permanent` - Full-time permanent position
- `Contract` - Fixed-term contract position
- `Interim` - Temporary/consulting position

### Specialisms (Jobs)
- `Biostatistics` - Statistical analysis and programming
- `Clinical Data Management` - Clinical trial data management
- `Bioinformatics` - Computational biology and genomics
- `Medical Affairs` - Medical communications and strategy
- `Regulatory Affairs` - Regulatory submissions and compliance

### Seniority Levels (Jobs)
- `Entry Level` - 0-2 years experience
- `Mid Level` - 3-7 years experience
- `Senior Level` - 8-15 years experience
- `Director Level` - 15+ years experience, management role
- `C-Suite` - Executive level positions

## Skills Array Usage

The `jobs` table uses a PostgreSQL array (`TEXT[]`) to store required skills. This allows for flexible querying and filtering.

### Common Skills
The following skills are commonly used in the application:
- `SAS`, `R`, `Python`, `SQL` - Programming languages
- `CDISC`, `ADaM`, `SDTM`, `TLFs` - Clinical data standards
- `EDC`, `Data Quality`, `Clinical Trials`, `GCP` - Clinical operations
- `NGS`, `Machine Learning`, `Genomics` - Bioinformatics
- `Medical Communications`, `Oncology`, `Scientific Writing` - Medical affairs
- `FDA`, `CE Mark`, `Medical Devices`, `Regulatory Strategy` - Regulatory affairs

### Querying Skills Array

```sql
-- Find jobs that require SAS
SELECT * FROM jobs WHERE 'SAS' = ANY(skills);

-- Find jobs that require both SAS and R
SELECT * FROM jobs WHERE 'SAS' = ANY(skills) AND 'R' = ANY(skills);

-- Find jobs with any of these skills
SELECT * FROM jobs WHERE skills && ARRAY['SAS', 'R', 'Python'];

-- Find jobs with all of these skills
SELECT * FROM jobs WHERE skills @> ARRAY['SAS', 'R'];

-- Count jobs by skill
SELECT skill, COUNT(*) as job_count
FROM jobs, unnest(skills) as skill
GROUP BY skill
ORDER BY job_count DESC;
```

## Database Setup Instructions

1. **Run the SQL commands** in your Supabase SQL Editor in the order they appear in this document
2. **Create the storage bucket** for CV files as described in the File Storage Setup section
3. **Verify the tables** by checking that all tables exist and have the correct structure
4. **Test the functionality** by creating some sample data through the admin interface

## Sample Data

You can insert sample job data using:

```sql
-- Insert sample job
INSERT INTO jobs (
    title, company, location, work_mode, contract, salary, 
    specialism, seniority, description, skills, featured, status
) VALUES (
    'Senior Biostatistician - Oncology',
    'Global Pharma Inc.',
    'London, UK',
    'Hybrid',
    'Permanent',
    '£80,000 - £95,000',
    'Biostatistics',
    'Senior Level',
    'Lead statistical programming and analysis for Phase III oncology trials. Expertise in SAS, R, and CDISC standards required.',
    ARRAY['SAS', 'R', 'CDISC', 'Oncology', 'Phase III'],
    true,
    'active'
);
```
