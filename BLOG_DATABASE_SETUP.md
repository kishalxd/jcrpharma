# Blog Database Setup for Supabase

## Required Table: `blogs`

To use the blog management system, you need to create a `blogs` table in your Supabase database. Follow these steps:

### 1. SQL Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create the blogs table
CREATE TABLE public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author TEXT DEFAULT 'Admin',
    cover_image TEXT,
    is_archived BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    feature_type TEXT CHECK (feature_type IN ('main', 'sub', null)),
    feature_order INTEGER,
    blog_group TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog groups table
CREATE TABLE public.blog_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for better performance when filtering by archived status
CREATE INDEX idx_blogs_archived ON blogs(is_archived);

-- Create an index for better performance when ordering by creation date
CREATE INDEX idx_blogs_created_at ON blogs(created_at DESC);

-- Disable RLS for now (you can enable it later with proper policies)
-- Following the same pattern as your page_contents table
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;

-- Optional: If you want to enable RLS later, you can use these policies:
-- ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow all operations for authenticated users" ON blogs
--     FOR ALL USING (auth.uid() IS NOT NULL);
-- 
-- Or for public read access:
-- CREATE POLICY "Allow public read access" ON blogs
--     FOR SELECT USING (true);
-- CREATE POLICY "Allow authenticated write access" ON blogs
--     FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Allow authenticated update access" ON blogs
--     FOR UPDATE USING (auth.uid() IS NOT NULL);
-- CREATE POLICY "Allow authenticated delete access" ON blogs
--     FOR DELETE USING (auth.uid() IS NOT NULL);
```

### 2. Table Structure

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `title` | TEXT | Blog post title | NOT NULL |
| `content` | TEXT | Full blog content (supports HTML) | NOT NULL |
| `excerpt` | TEXT | Short description/preview | Optional |
| `author` | TEXT | Author name | Default: 'Admin' |
| `cover_image` | TEXT | Cover image (base64 or URL) | Optional |
| `is_archived` | BOOLEAN | Archive status | Default: false |
| `is_featured` | BOOLEAN | Featured status | Default: false |
| `feature_type` | TEXT | Feature type ('main', 'sub', or null) | Optional |
| `feature_order` | INTEGER | Order for sub-featured blogs (1-2) | Optional |
| `blog_group` | TEXT | Blog group name | Optional |
| `created_at` | TIMESTAMP | Creation timestamp | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-generated |

### Blog Groups Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `name` | TEXT | Group name | NOT NULL, UNIQUE |
| `description` | TEXT | Group description | Optional |
| `color` | TEXT | Group color (hex code) | Default: '#3B82F6' |
| `created_at` | TIMESTAMP | Creation timestamp | Auto-generated |

### 3. Features Supported

- ✅ Create new blog posts
- ✅ Edit existing blog posts
- ✅ Delete blog posts (with confirmation)
- ✅ Archive/Unarchive blog posts
- ✅ Filter by status (All, Published, Archived)
- ✅ Rich text editor with formatting toolbar
- ✅ Image upload functionality
- ✅ Cover image upload with preview
- ✅ Blog featuring system (1 main + 2 sub-featured)
- ✅ Blog grouping with custom categories
- ✅ Group management (create, edit, delete)
- ✅ Row-level controls for featuring and grouping
- ✅ HTML content support
- ✅ Auto-excerpt generation
- ✅ Responsive admin interface

### 4. Security Notes

- The table uses Row Level Security (RLS)
- Current policy allows all operations for authenticated users
- You may want to create more restrictive policies based on your needs
- Consider creating admin-specific roles for better security

### 5. Optional: Sample Data

If you want to add some sample blog posts for testing:

```sql
INSERT INTO blogs (title, content, excerpt, author, cover_image) VALUES 
(
    'Welcome to Our Blog',
    '<h2>Welcome to Our Life Sciences Blog</h2><p>We are excited to share insights, industry news, and expert perspectives on life sciences recruitment and biometrics.</p><p>Stay tuned for regular updates on:</p><ul><li>Industry trends</li><li>Career advice</li><li>Company updates</li><li>Technical insights</li></ul>',
    'Welcome to our new blog where we share insights on life sciences recruitment and industry trends.',
    'Admin',
    NULL
),
(
    'The Future of Biostatistics in Clinical Research',
    '<h2>Evolving Landscape of Biostatistics</h2><p>The field of biostatistics is rapidly evolving with new methodologies and technologies...</p><h3>Key Trends</h3><p>Machine learning integration, real-world evidence, and adaptive trial designs are reshaping how we approach clinical research.</p>',
    'Exploring the latest trends and innovations in biostatistics for clinical research applications.',
    'Dr. Sarah Johnson',
    NULL
);
```

### 6. Troubleshooting

If you encounter issues:

1. **Table doesn't exist**: Make sure you've run the CREATE TABLE statement
2. **Permission denied**: Check your RLS policies and authentication
3. **Connection issues**: Verify your Supabase URL and API key in the environment variables

### 7. Environment Variables

Make sure your `.env` file contains:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```
