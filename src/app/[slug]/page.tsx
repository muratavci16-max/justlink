import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { detectDevice } from "@/lib/utils";

// Known non-slug paths to ignore
const EXCLUDED = new Set(["dashboard", "auth", "api", "_next", "favicon.ico", "public"]);

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SlugRedirectPage({ params }: Props) {
  const { slug } = await params;

  if (EXCLUDED.has(slug)) notFound();

  const supabase = await createClient();

  // Fetch the link
  const { data: link, error } = await supabase
    .from("links")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !link) notFound();

  // Check expiry
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    notFound();
  }

  // Detect device
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") ?? "";
  const device = detectDevice(userAgent);

  // Determine destination with fallback chain
  let destination = link.web_url;
  if (device === "ios" && link.ios_url) destination = link.ios_url;
  else if (device === "android" && link.android_url) destination = link.android_url;
  else if (!link.web_url && link.ios_url) destination = link.ios_url;
  else if (!link.web_url && link.android_url) destination = link.android_url;

  // Log click asynchronously (fire and forget — no await)
  const referer = headersList.get("referer") ?? null;
  const forwarded = headersList.get("x-forwarded-for") ?? null;

  supabase
    .from("clicks")
    .insert({
      link_id: link.id,
      device,
      referrer: referer,
      ip: forwarded?.split(",")[0]?.trim() ?? null,
      country: null,
    })
    .then(() => {});

  redirect(destination);
}
