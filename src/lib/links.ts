import { createClient } from "@/lib/supabase/server";
import type { Link, LinkWithStats, AnalyticsData } from "@/types";

export async function getUserLinks(userId: string): Promise<LinkWithStats[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .select(`*, clicks(count)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((link) => ({
    ...link,
    total_clicks: link.clicks?.[0]?.count ?? 0,
  }));
}

export async function getLinkById(id: string, userId: string): Promise<Link | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function getLinkBySlug(slug: string): Promise<Link | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data;
}

export async function createLink(
  userId: string,
  payload: Omit<Link, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Link> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .insert({ ...payload, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLink(
  id: string,
  userId: string,
  payload: Partial<Omit<Link, "id" | "user_id" | "created_at">>
): Promise<Link> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLink(id: string, userId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function checkSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("links").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return !data || data.length === 0;
}

export async function getLinkAnalytics(
  linkId: string,
  userId: string
): Promise<AnalyticsData> {
  const supabase = await createClient();

  // Verify ownership
  const { data: link } = await supabase
    .from("links")
    .select("id")
    .eq("id", linkId)
    .eq("user_id", userId)
    .single();

  if (!link) throw new Error("Link not found");

  const { data: clicks } = await supabase
    .from("clicks")
    .select("timestamp, device, referrer")
    .eq("link_id", linkId)
    .order("timestamp", { ascending: true });

  const allClicks = clicks || [];
  const total_clicks = allClicks.length;

  // Clicks over time (group by date)
  const dateMap: Record<string, number> = {};
  allClicks.forEach((c) => {
    const date = c.timestamp.split("T")[0];
    dateMap[date] = (dateMap[date] || 0) + 1;
  });
  const clicks_over_time = Object.entries(dateMap)
    .map(([date, clicks]) => ({ date, clicks }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Device breakdown
  const deviceMap: Record<string, number> = {};
  allClicks.forEach((c) => {
    const d = c.device || "unknown";
    deviceMap[d] = (deviceMap[d] || 0) + 1;
  });
  const device_breakdown = Object.entries(deviceMap).map(([device, count]) => ({
    device,
    count,
  }));

  // Top referrers
  const refMap: Record<string, number> = {};
  allClicks.forEach((c) => {
    const r = c.referrer || "direct";
    refMap[r] = (refMap[r] || 0) + 1;
  });
  const top_referrers = Object.entries(refMap)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { total_clicks, clicks_over_time, device_breakdown, top_referrers };
}

export async function getDashboardStats(userId: string) {
  const supabase = await createClient();

  const { data: links } = await supabase
    .from("links")
    .select("id")
    .eq("user_id", userId);

  const linkIds = (links || []).map((l) => l.id);
  let total_clicks = 0;

  if (linkIds.length > 0) {
    const { count } = await supabase
      .from("clicks")
      .select("id", { count: "exact", head: true })
      .in("link_id", linkIds);
    total_clicks = count ?? 0;
  }

  return {
    total_links: linkIds.length,
    total_clicks,
  };
}
