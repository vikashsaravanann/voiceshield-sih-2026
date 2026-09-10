import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  
  // Note: Vercel documentation says not to use createServerClient in layout.tsx 
  // if you're writing cookies, because layouts can't set headers.
  // We only use this for read-only auth checks in page.tsx components.

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was throwing errors when called from a Server Component.
            // Catching it here is safe per Supabase SSR docs.
            // console.warn("Cookie set ignored in server component");
          }
        },
      },
    }
  );
}
