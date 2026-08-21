# Specification & Implementation Addendum: PDF Resident List Parser & Database Ingestion

## System Context & Architectural Goal
Extend the CityU Hall 14 Web Application to support automated resident onboarding by parsing PDF printouts of the university portal's resident table directly within the browser, extracting structured student records, and upserting them into the Supabase database.

---

## 1. Feature Specification: `/resident-list.jsx`

### Page Access & Layout
- **Route:** `/resident-list.jsx` (Gated strictly by Admin OTP authentication).
- **Header Action (Top Right):** An **"Upload Resident List PDF"** button opening a file dropzone that accepts `.pdf` documents (webpage printouts).
- **Data Table View:** Displays the current list of residents fetched from Supabase, featuring live search (by Name, SID, or Room) and filter controls (by Cohort or Gender).

### PDF Parsing Pipeline
1. **In-Browser Text Extraction:** Uses `pdfjs-dist` to extract raw text content and table row structures directly on the client side (no sensitive resident data is sent to third-party OCR services).
2. **Regex Table Extraction:** Parses tabular rows from the CityU portal printout layout to reliably map the following fields:
   - `sid`: 8-digit numerical ID from CityU ID.
   - `name`: Student full name.
   - `room_number`: Hall 14 room assignment (e.g., `302`).
   - `gender`: Gender designation.
   - `cohort`: Student academic cohort / year level.
   - `nationality`: Country/Region of origin.
   - `phone_number`: For vacuum/shoe washer/laundry registration this field will be necessary
3. **Database Upsert:** Sends the parsed array to Supabase using `upsert()` on the `sid` primary key (updating existing records or inserting new ones seamlessly).

---

## 2. Updated Database Schema

### Database Table Definition (`residents`)
```sql
CREATE TABLE residents (
    sid TEXT PRIMARY KEY, -- 8-digit Student ID
    name TEXT NOT NULL,
    room_number TEXT NOT NULL,
    gender TEXT,
    cohort TEXT,
    nationality TEXT,
    phone_number TEXT
    created_at TIMESTAMPTZ DEFAULT NOW()
);

```

### Row Level Security (RLS) Rules

```sql
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

-- Allow public read access to validate SID during vacuum checkout
CREATE POLICY "Allow public read access for checkout validation" 
ON residents FOR SELECT 
USING (true);

-- Restrict insert/update/delete strictly to authenticated admins
CREATE POLICY "Allow admin full access to residents" 
ON residents FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM admins));

```

---

## 3. Instructions for Claude Code Generation

Please generate the code using React JSX (`.jsx`) syntax and modern React/Next.js conventions:

### File Structure & Components to Build

1. **`pages/resident-list.jsx` (Admin Resident Management):**
* **Authentication Guard:** Redirects unauthenticated users to `/admin/login`.
* **Top Right Header:** Includes the file input trigger (`.pdf`).
* **PDF Processing Indicator:** Displays parsing progress and batch ingestion status.
* **Resident Data Table:** Renders columns for Room, Name, SID, Gender, Cohort, and Nationality with dynamic search filtering.


2. **`utils/parseResidentPdf.js` (PDF Ingestion Engine):**
* Implements `pdfjs-dist` to extract structured line items from uploaded PDF files.
* Uses regex patterns to isolate the 8-digit SID, Room numbers, and accompanying text fields.
* Returns a structured array of objects ready for Supabase batch operations:
```javascript
[
  { sid: "56781234", name: "Chan Tai Man", room_number: "1401A", gender: "M", cohort: "2025", nationality: "Hong Kong", phone_number: "+85298755467" }
]

```




3. **Supabase Ingestion Script:**
* Performs `await supabase.from('residents').upsert(parsedResidents, { onConflict: 'sid' })` and returns success/error notifications.



```

```