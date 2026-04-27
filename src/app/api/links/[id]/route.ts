import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateLink, deleteLink, getLinkById, checkSlugAvailable } from "@/lib/links";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // If slug is changing, verify it's available
  if (body.slug) {
    const available = await checkSlugAvailable(body.slug, id);
    if (!available) {
      return NextResponse.json({ error: "Slug is already taken" }, { status: 409 });
    }
  }

  try {
    const link = await updateLink(id, user.id, body);
    return NextResponse.json(link);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteLink(id, user.id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
