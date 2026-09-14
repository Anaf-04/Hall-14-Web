import { createClient } from "@supabase/supabase-js";

// Server-only client using the service role key — bypasses RLS.
// Never import this file from client components.
// Create a fresh client per request to avoid connection pooling issues in serverless
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

// Lazy singleton for backwards compatibility
let cachedClient = null;
export const supabaseAdmin = new Proxy({}, {
  get(target, prop) {
    if (!cachedClient) {
      cachedClient = getSupabaseAdmin();
    }
    return cachedClient[prop];
  }
});
