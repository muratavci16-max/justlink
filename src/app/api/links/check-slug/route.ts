import { NextResponse } from "next/server";
import { checkSlugAvailable } from "@/lib/links";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const excludeId = searchParams.get("excludeId") ?? undefined;

  if (!slug) {
    return NextResponse.json({ available: false, error: "slug is required" }, { status: 400 });
  }

  const available = await checkSlugAvailable(slug, excludeId);
  return NextResponse.json({ available });
}
