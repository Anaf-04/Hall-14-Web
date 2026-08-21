# Vacuum Inventory & Tracking System

Build a lightweight, desktop/mobile-responsive web application for CityU Hall 14 (15 floors, 15 vacuums) that tracks vacuum cleaner availability in real time.

### Core Features
1. **NFC / QR Checkout Flow:** Residents tap an NFC sticker on a vacuum or scan a QR code carrying a URL parameter (e.g., `https://domain.com/?vacuum=floor_3`).
2. **Local Storage Memory:** First-time users enter their 8-digit Student ID (SID) and Room Number. Subsequent visits auto-fill and remember these credentials on that device.
3. **Real-Time Availability Dashboard:** Shows the status of all 15 floor vacuums across Hall 14 (`Available` vs `Checked Out` with borrower info and timestamp).
4. **Admin Dashboard (Protected):** Gated by **Google OAuth via Supabase** so only authorized Senior Residence Tutors / Admins can upload/update the master resident list via `.xlsx`/`.csv` and override vacuum statuses.

---

## Tech Stack & Architecture
- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide Icons, Shadcn UI components.
- **Backend & Database:** Supabase (Postgres, Database RLS, Supabase Auth with Google OAuth).
- **Deployment Target:** Vercel (Free Tier).

---


## Secured NFC Checkout via NTAG213 Password Protection & URL Key Verification
Extend the CityU Hall 14 Vacuum Inventory & Tracking System to strictly enforce **in-person physical scanning** using NTAG213 stickers. 

This update introduces dual-layer security:
1. **URL Secret Keys (`key` query param):** Prevents remote "troll bookings" by restricting checkout form access to users who physically scan the vacuum sticker.
2. **Hardware Password Protection (PWD Lock):** Protects the physical NTAG213 tags from being overwritten or tampered with by residents while allowing admins to re-program them if needed.

---

## 1. Physical Tag Configuration Specification

### Tag Type
- **NTAG213** (180 bytes memory, standard 13.56 MHz ISO 14443A).

### URL Payload Format
Each vacuum sticker must be written with a unique URL containing the floor ID and a cryptographically strong random secret key:
`https://<your-domain>/checkout?v=<VACUUM_ID>&key=<SECRET_KEY>`

*Example:* `https://hall14.app/checkout?v=3&key=x9F7aL2q91mP0vR4`

### Hardware Protection (NFC Tools Setup)
1. **Write URI Record:** Write the floor-specific URL to the tag.
2. **Apply 32-bit Password Lock (PWD):** Set a 4-byte hexadecimal password (e.g., `0x14` `0x14` `0x14` `0x14`) using the *NFC Tools* app.
3. **Behavior:**
   - **Public Read:** Any iOS or Android device can tap and open the URL without entering a password.
   - **Protected Write:** Any attempt to rewrite or modify the tag requires the 32-bit admin password.

---

## 2. Updated Database & API Logic Requirements

### Database Schema Updates (`vacuums` table)
Add a column to store each vacuum's unique secret key:
sql 
ALTER TABLE vacuums ADD COLUMN nfc_secret_key TEXT NOT NULL DEFAULT gen_random_uuid()::text;

    Checkout API Endpoint (POST /api/vacuums/borrow) Validation Flow
    When a checkout request is received, the server must validate:

    Presence of Parameters: Verify vacuum_id, sid, and key are provided.

    Secret Key Match: Query the vacuums table for vacuum_id and check if the provided key matches nfc_secret_key.

    If mismatch/missing: Reject with 403 Forbidden ("Invalid NFC Key. You must scan the vacuum sticker in person to borrow.").

    Resident Verification: Verify the sid exists in the residents master list.

    State Transition: Update status to 'CHECKED_OUT', set borrower_sid, and set checked_out_at = NOW().

    3. Instructions for Claude Code Generation
    Please update the project implementation to incorporate these secured checkout requirements:

    Frontend Behavior (app/checkout/page.jsx or app/page.jsx)
    Read-Only Public Dashboard: Visiting https://hall14.app without parameters displays room statuses but hides or disables the "Check Out" button.

    NFC Landing Mode: When opened with ?v=3&key=SECRET_KEY:

    Store key in state.

    Automatically pull saved sid and room_number from localStorage (if available).

    Display a single-click "Confirm Borrow Vacuum #3" button.

    Error Handling: Display an explicit user alert if the server returns a 403 Invalid NFC Key response.

    Backend & Database Scripts
    schema.sql: Update the table definition and include sample seed data populated with nfc_secret_key values for all 15 floors.

    Admin Panel (app/admin/page.jsx): Add an Admin View section displaying the active nfc_secret_key and generated target URL for each floor, allowing tutors to quickly copy and program new NTAG213 stickers using NFC Tools.

## Database Schema (Supabase / PostgreSQL)

### 1. `residents`
- `sid` (TEXT, Primary Key) — 8-digit Student ID.
- `name` (TEXT)
- `room_number` (TEXT)
- `gender` (TEXT)
- `cohort` (TEXT)
- `nationality` (TEXT)
- `phone_number` (TEXT)
- `created_at` (TIMESTAMPTZ, default `now()`)

### 2. `vacuums`
- `id` (INT, Primary Key) — 1 to 15 (representing Floor 1 to Floor 15).
- `floor` (INT) — Floor number.
- `status` (TEXT) — `'AVAILABLE'` or `'CHECKED_OUT'`.
- `borrower_sid` (TEXT, Foreign Key -> `residents.sid`, Nullable).
- `checked_out_at` (TIMESTAMPTZ, Nullable).
- `updated_at` (TIMESTAMPTZ, default `now()`).

### 3. `admins`
- `id` (UUID, Primary Key, default `auth.uid()`).
- `email` (TEXT, Unique) — Allowed admin Google email addresses.

---

## Security & Row Level Security (RLS) Rules
- **Vacuums Table:** 
  - `SELECT`: Public (Anyone can view vacuum availability).
  - `UPDATE`: Public (Only allowed if `status` changes and valid resident `sid` exists) or Admin.
- **Residents Table:**
  - `SELECT`: Public lookup for validation by `sid` during checkout.
  - `INSERT / UPDATE / DELETE`: Restricted strictly to authenticated Admins (`auth.role() = 'authenticated'`).

---

## Implementation Requirements for Claude

Please generate the complete codebase step-by-step with clean directory structures:

1. **Supabase Setup Script (`schema.sql`):**
   - Include SQL definitions for tables, foreign keys, enums, and Row Level Security (RLS) policies.

2. **Frontend Pages & Components:**
   - **`app/page.jsx` (Main Dashboard & Scanner Landing):**
     - Reads `?vacuum=X` URL query parameter.
     - Handles LocalStorage retrieval/saving for `sid` and `room_number`.
     - Displays 15 floor cards with live color-coded status badges (`Green` for Available, `Amber` for Checked Out).
     - Simple toggle button: "Check Out" or "Return Vacuum".
   - **`app/admin/page.jsx` (Admin Management):**
     - Google OAuth login button using Supabase Auth.
     - Excel/CSV drag-and-drop parser using `xlsx` library to batch upload/upsert the `residents` database table.
     - Manual override table to force-reset any stuck vacuum to `AVAILABLE`.

3. **Supabase Client Utilities:**
   - Browser client (`lib/supabase/client.ts`) and server client configurations.

---

## Instructions for Output
- Provide fully working, complete code without placeholders or omitted logic.
- Keep the UI slick, clean, and mobile-optimized for quick phone interaction.


