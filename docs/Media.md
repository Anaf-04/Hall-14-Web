# Specification & Implementation Addendum: Dormitory Media Library & Asset Management

## System Context & Architectural Goal
Extend the CityU Hall 14 Web Application with a dedicated **Dormitory Media Library**. This module acts as a centralized database and storage system to manage public and internal visual assets (t-shirts, trophies, facility photos, and more later), accessible for browsing while restricted to Admin uploads.

---

## 1. Feature Specification: Media Library

### Organization & Tagging
- **Categories:** Assets are classified under fixed categories: `Facilities`, `Trophies`, `T-Shirts`, `Events`, and `General`.
- **Media Types:** Supports `IMAGE` (`.webp`, `.png`, `.jpeg`), `VIDEO` (`.mp4`, `.webm`), file types.
- **Client-Side Image Optimization:** Image uploads are automatically scaled down and converted to `.webp` in the browser before hitting Supabase Storage to ensure sub-second page load times.

---

## 2. Database & Storage Schema Extensions

### 1. `media_assets` Table
```sql
CREATE TYPE media_type_enum AS ENUM ('IMAGE', 'VIDEO');

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    media_type media_type_enum NOT NULL DEFAULT 'IMAGE',
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    uploaded_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

```

### 2. Supabase Storage Bucket Setup

* **Bucket Name:** `dorm-media`
* **Configuration:** Public Read Access enabled, with max file size limits enforced per asset type.

---

## 3. Row Level Security (RLS) Rules

```sql
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access so any resident can browse photos/videos
CREATE POLICY "Allow public read access to media_assets" 
ON media_assets FOR SELECT 
USING (true);

-- Restrict uploads, updates, and deletes to authenticated admins
CREATE POLICY "Allow admin full access to media_assets" 
ON media_assets FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM admins));

```

---

## 4. Instructions for Claude Code Generation

Please build the media management features using React `.jsx` syntax:

### Components to Build

1. **`pages/media-library.jsx` (Public Gallery View):**
* **Filter Controls:** Category tabs (`All`, `Facilities`, `Trophies`, `T-Shirts`, `Events`) and a search bar for asset titles.
* **Responsive Grid Display:** Render cards with lazy-loaded image thumbnails (`loading="lazy"`), play icons for videos, and title tags.
* **Light-box Modal:** Clicking any item opens a high-res viewer modal (with HTML5 video player controls for video files).


2. **`pages/admin/media-upload.jsx` (Admin Upload & Management):**
* **Authentication Guard:** Restricts route access to verified admin sessions.
* **Upload Form:** Form fields for `title`, `description`, `category`, and `media_type`.
* **Pre-Upload Compression:** Automatically compresses `.png`/`.jpg` images to `.webp` prior to upload.
* **Storage Dispatcher:** Uploads the file to the `dorm-media` Supabase bucket, retrieves the public URL, and inserts a corresponding record into `media_assets`.
* **Asset Management Table:** Admin table view with one-click **Delete** functionality (which removes both the database entry and the file from `dorm-media` storage).



```

```