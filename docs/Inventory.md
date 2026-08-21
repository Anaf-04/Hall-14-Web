# Specification & Implementation Addendum: Admin Inventory Management & OTP Authentication

## System Context & Architectural Goal
Extend the CityU Hall 14 Web Application to include a restricted **Admin Inventory Management System**. This feature allows hall admins to manage dorm assets (e.g., vacuums, extra equipment, spare parts) with full CRUD operations (Create, Read, Update, Delete) and image storage, secured by **Email One-Time Password (OTP) Authentication**.

---

## 1. Authentication & Access Control Specification

### Passwordless Email OTP Access
- **Allowed Admin Access:** Only authorized email addresses stored in the `admins` table can access the `/admin/inventory` route.
- **Login Flow:**
  1. Admin navigates to `/admin/login` and enters her authorized email address.
  2. Supabase Auth generates and sends a 6-digit One-Time Password (OTP) / Magic Code to her email inbox via SMTP.
  3. Admin enters the 6-digit code on the website to verify her session.
  4. Upon successful verification, Supabase issues a JWT session token that unlocks admin routes and RLS permissions.

---

## 2. Database Schema Extensions

### 1. `admins` Table (Access Control)
```sql
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

```

### 2. `inventory` Table (Asset Management)

```sql
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    quantity INT NOT NULL DEFAULT 0,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

```

### 3. Supabase Storage Bucket

* **Bucket Name:** `inventory-images` (Public read access, restricted upload/delete).

---

## 3. Row Level Security (RLS) Rules

* **`admins` Table:**
* `SELECT`: Only authenticated users whose `auth.jwt() ->> 'email'` matches an existing row in `admins`.


* **`inventory` Table:**
* `SELECT`: Public or Authenticated Admins (configurable based on whether students should see inventory levels).
* `INSERT / UPDATE / DELETE`: Strictly restricted to authenticated Admins matching the `admins` table.


* **`inventory-images` Storage Bucket:**
* `Public Read`: Anyone can fetch image URLs to render on the UI.
* `Upload / Delete`: Restricted to users with active Admin JWT sessions.



---

## 4. Instructions for Claude Code Generation

Please integrate the following Admin Inventory features into the existing project code structure:

### Frontend Pages & Components

1. **`app/admin/login/page.jsx` (OTP Login Screen):**
* Clean UI with an email input box.
* Triggers `supabase.auth.signInWithOtp({ email })`.
* Displays a 6-digit verification code input screen upon sending.
* On successful verification, redirects to `/admin/inventory`.


2. **`app/admin/inventory/page.jsx` (Admin Dashboard):**
* **Access Guard:** Redirects to `/admin/login` if no active admin session exists.
* **Inventory Table/Grid View:** Displays item image thumbnail, name, category, quantity, and description.
* **Quantity Controls:** Inline `+` and `-` buttons to quickly increase or decrease item counts.
* **Add Item Modal/Form:** Form inputs for `item_name`, `category`, `quantity`, `description`, and a file picker to upload an item image to the Supabase `inventory-images` bucket.
* **Delete Item Action:** Confirmation modal to safely delete an item and remove its associated image from storage.



### Supabase Utilities & Scripts

* Include updated `schema.sql` containing the `inventory` table definition, `inventory-images` bucket policies, and RLS rules for passwordless OTP access.

```

```