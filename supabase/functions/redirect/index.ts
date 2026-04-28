import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function detectDevice(ua: string): string {
  const lower = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(lower)) return "ios";
  if (/android/.test(lower)) return "android";
  return "web";
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.pathname.replace(/^\//, "");

    if (!slug) {
      return Response.redirect(Deno.env.get("APP_URL") ?? "https://justlink.app", 302);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch link
    const { data: link, error } = await supabase
      .from("links")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !link) {
      return Response.redirect(Deno.env.get("APP_URL") ?? "https://justlink.app", 302);
    }

    // Check expiry
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return Response.redirect(Deno.env.get("APP_URL") ?? "https://justlink.app", 302);
    }

    // Detect device
    const userAgent = req.headers.get("user-agent") ?? "";
    const device = detectDevice(userAgent);

    // Determine destination
    let destination = link.web_url;
    if (device === "ios" && link.ios_url) destination = link.ios_url;
    if (device === "android" && link.android_url) destination = link.android_url;

    // Detect country from CF header (available on Supabase Edge)
    const country = req.headers.get("cf-ipcountry") ?? null;
    const referrer = req.headers.get("referer") ?? null;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    // Log click (fire and don't await to avoid latency)
    supabase.from("clicks").insert({
      link_id: link.id,
      device,
      country,
      referrer,
      ip,
    }).then(() => {});

    return Response.redirect(destination, 302);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
