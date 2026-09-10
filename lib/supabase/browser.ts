import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // It took me a while to figure out why sessions were randomly dropping.
  // Using `createBrowserClient` instead of the standard `@supabase/supabase-js` 
  // fixes the Next.js SSR cookie syncing issue perfectly!
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // FIXME: Don't ship to production without these env vars!
    console.warn("Supabase credentials missing! Falling back to mock data (will break DB calls).");
  }

  return createBrowserClient(
    supabaseUrl || "https://mock.supabase.co",
    supabaseKey || "mock-key"
  );
}
