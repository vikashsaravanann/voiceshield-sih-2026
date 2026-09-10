import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

export async function GET() {
  const supabase = await getAuthenticatedClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("user_profiles")
    .select("alert_phone_number, whatsapp_alerts, sms_alerts")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  return NextResponse.json({
    phone_number: data?.alert_phone_number ?? "",
    whatsapp_enabled: data?.whatsapp_alerts ?? false,
    sms_enabled: data?.sms_alerts ?? false,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone_number, whatsapp_enabled, sms_enabled } = body;

    const supabase = await getAuthenticatedClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Upsert user alert preferences
    const { error: dbError } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: user.id,
        alert_phone_number: phone_number,
        whatsapp_alerts: whatsapp_enabled,
        sms_alerts: sms_enabled,
        updated_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("DB Error:", dbError);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Settings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
