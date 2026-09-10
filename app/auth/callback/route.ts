import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const appOrigin = configuredOrigin || origin;
  const code = searchParams.get("code");
  const providerError = searchParams.get("error");
  const providerErrorCode = searchParams.get("error_code");
  const providerErrorDescription = searchParams.get("error_description");
  const requestedNext = searchParams.get("next") ?? "/dashboard";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/dashboard";

  if (providerError) {
    const loginUrl = new URL("/login", appOrigin);
    loginUrl.searchParams.set("error", providerError);
    if (providerErrorCode) loginUrl.searchParams.set("error_code", providerErrorCode);
    if (providerErrorDescription) {
      loginUrl.searchParams.set("error_description", providerErrorDescription);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${appOrigin}${next}`);
    }
    console.error("OAuth code exchange error:", error.message);
    const loginUrl = new URL("/login", appOrigin);
    loginUrl.searchParams.set("error", "auth-callback-failed");
    loginUrl.searchParams.set("error_description", error.message);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(`${appOrigin}/login?error=auth-callback-failed`);
}
