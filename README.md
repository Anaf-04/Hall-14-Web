# Hall14 Web

Hall14 Web is a shared-facility management system for a university residence hall. Residents borrow and return shared facilities (vacuum, game controllers, laundry machines, etc.) by tapping an NFC sticker or scanning a QR code on the item, which checks the item in/out against a live status board. Built with Next.js (App Router), React, and Supabase.

## Facilities

All facilities are rows in a single Supabase `facilities` table (`id, item, floor, status, nfc_secret_key, last_borrower_sid, last_borrowed_at, last_returned_at`). Each physical item carries its own `nfc_secret_key`, used to authenticate a tap/scan before letting someone borrow it.

- **Portable Vacuum** — one per floor, tapped via NFC sticker.
- **PS5 Controller** — borrowed via QR code scan at the Ground Floor Security Desk.
- **Shoe Washer Key** — handed out manually by security; borrowing is confirmed via the facility's key/QR flow rather than a physical tap.
- **Nintendo Switch** — borrowed via QR code scan.
- **Table Tennis Set** — borrowed via QR code scan.
- **Laundry Room (Washers & Dryers)** — tracked differently, see below.

### Borrow / return flow (NFC & QR facilities)

For every facility except laundry, usage is tracked end-to-end:

1. Tapping the NFC sticker or scanning the QR code opens a URL like `/shoeWasherKey?v=<facility_id>&key=<nfc_secret_key>`.
2. The page posts to `POST /api/facilities/validate-key`, which looks up the facility by `facility_id` in Supabase and checks that the provided key matches `nfc_secret_key`.
3. On a valid match, the resident either registers their SID (first time) or is recognized automatically (returning via `localStorage`), and the item is marked borrowed/returned, updating `status`, `last_borrower_sid`, `last_borrowed_at`/`last_returned_at`.

This gives a full audit trail of who has what, and when it was picked up or returned.

### Laundry Room (IoT-based)

The laundry room works differently — it isn't tapped in/out by residents, because the hall's washers and dryers are instrumented directly:

- Each washing machine and dryer is connected to a **Raspberry Pi**, which reads the machine's remaining cycle time in real time.
- The Raspberry Pi exposes this data through an **external status API** (`https://misc.cityu-sro.hk/WMStatus/WMStatus.aspx?HallNo=14`), returning each machine's ID, type (washer/dryer), and remaining time.
- This app's `GET /api/laundry/status` route proxies that external API.
- `LaundryDashboard` fetches that status and overlays it with Supabase data (via Realtime subscriptions on `Washer_*`/`Dryer_*` rows) to additionally show who is currently using a given machine.
- `MachineCard` renders the full desktop view (status, remaining time, current/previous borrower, usage stats); `MobileLaundryDisplay` renders a compact icon-based grid for mobile.

So laundry usage is tracked automatically from the machine's own sensor data, while every other facility is tracked by resident check-in/check-out via NFC or QR code.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **Supabase** — Postgres database, auth, and Realtime subscriptions
- **Tailwind CSS 4**
- **Nodemailer** — resident email OTP verification
- External Raspberry Pi status API — live laundry machine data

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Requires a `.env.local` with Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) and any mail provider credentials used by the OTP flow. These are not committed to the repo.
