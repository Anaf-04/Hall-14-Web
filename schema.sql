-- Hall 14 Web Application — Supabase schema reference.
-- Already applied via the Supabase SQL editor; kept here for version control
-- and so a fresh Supabase project can be bootstrapped from this file.

-- 1. Admins (access control)
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Residents
CREATE TABLE residents (
    sid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    room_number TEXT NOT NULL,
    gender TEXT,
    cohort TEXT,
    nationality TEXT,
    phone_number TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vacuums
CREATE TABLE vacuums (
    id INT PRIMARY KEY,
    floor INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'AVAILABLE',
    borrower_sid TEXT REFERENCES residents(sid),
    checked_out_at TIMESTAMPTZ,
    reminder_sent_at TIMESTAMPTZ,
    nfc_secret_key TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Inventory
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    quantity INT NOT NULL DEFAULT 0,
    description TEXT,
    image_url TEXT,
    uploaded_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Media assets
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

-- Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacuums ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_residents" ON residents FOR SELECT USING (true);
CREATE POLICY "admin_write_residents" ON residents FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admins));

CREATE POLICY "public_read_vacuums" ON vacuums FOR SELECT USING (true);
-- No public UPDATE/INSERT/DELETE policy: writes only happen through the
-- server-side API routes (borrow/return/cron-timer), which use the
-- service_role key and bypass RLS. This is what stops anyone from
-- flipping vacuum status straight from the browser using the anon key.

CREATE POLICY "admin_read_admins" ON admins FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "public_read_inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "admin_write_inventory" ON inventory FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admins));

CREATE POLICY "public_read_media" ON media_assets FOR SELECT USING (true);
CREATE POLICY "admin_write_media" ON media_assets FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admins));

-- Seed: 15 vacuums, one per floor
INSERT INTO vacuums (id, floor, status)
SELECT n, n, 'AVAILABLE' FROM generate_series(1, 15) AS n;

-- Storage buckets (create via Dashboard → Storage, both public read):
--   inventory-images
--   dorm-media


-- =====================================================================
-- MIGRATION — run this block in the SQL Editor against your existing
-- Supabase project (tables/policies above already exist there).
-- =====================================================================

ALTER TABLE residents ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE vacuums ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

-- Security fix: remove the public UPDATE policy on vacuums. Vacuum
-- status now only changes through server-side API routes (borrow,
-- return, cron-timer) using the service_role key. Leaving this policy
-- in place let anyone with the anon key flip a vacuum's status directly
-- from the browser, skipping the NFC secret-key check entirely.
DROP POLICY IF EXISTS "public_update_vacuums" ON vacuums;

