-- Supabase pg_cron setup for the vacuum 10/15-minute timer.
--
-- IMPORTANT: pg_cron runs inside Supabase's Postgres and calls out over the
-- network via pg_net — it needs a PUBLIC URL, so this only works once the
-- app is deployed on Vercel. Running this against localhost will not work.
--
-- Run this in the Supabase SQL Editor AFTER deploying to Vercel and setting
-- the CRON_SECRET env var on both Vercel and here.

-- 1. Enable required extensions (one-time, per project)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Schedule a call to the cron API route every 5 minutes.
--    Replace <YOUR_VERCEL_URL> and <CRON_SECRET> with real values.
--    CRON_SECRET must match the CRON_SECRET env var set in Vercel.
SELECT cron.schedule(
  'vacuum-timer-check',
  '*/5 * * * *', -- every 5 minutes
  $$
  SELECT net.http_post(
    url := 'https://<YOUR_VERCEL_URL>/api/cron/vacuum-timer',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <CRON_SECRET>'
    )
  );
  $$
);

-- To inspect scheduled jobs:
-- SELECT * FROM cron.job;

-- To remove the job if needed:
-- SELECT cron.unschedule('vacuum-timer-check');
