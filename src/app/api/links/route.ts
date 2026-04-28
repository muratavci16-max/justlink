import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkSlugAvailable, createLink } from "@/lib/links";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, web_url, ios_url, android_url, is_active, expires_at } = body;

  if (!name || !slug || !web_url) {
    return NextResponse.json({ error: "name, slug and web_url are required" }, { status: 400 });
  }

  // Check slug
  const available = await checkSlugAvailable(slug);
  if (!available) {
    return NextResponse.json({ error: "Slug is already taken" }, { status: 409 });
  }

  try {
    const link = await createLink(user.id, {
      name,
      slug,
      web_url,
      ios_url: ios_url || null,
      android_url: android_url || null,
      is_active: is_active ?? true,
      expires_at: expires_at || null,
    });
    return NextResponse.json(link, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
