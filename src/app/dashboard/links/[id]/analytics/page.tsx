import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, ExternalLink, MousePointerClick, Smartphone, Globe, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLinkById, getLinkAnalytics } from "@/lib/links";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { CopyButton } from "@/components/dashboard/copy-button";
import { ClicksChart, DeviceChart } from "@/components/dashboard/analytics-charts";
import { buildShortUrl, formatNumber } from "@/lib/utils";

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [link, analytics] = await Promise.all([
    getLinkById(id, user!.id),
    getLinkAnalytics(id, user!.id).catch(() => null),
  ]);

  if (!link) notFound();

  const shortUrl = buildShortUrl(link.slug);

  const statCards = [
    {
      label: "Total Clicks",
      value: formatNumber(analytics?.total_clicks ?? 0),
      icon: MousePointerClick,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      label: "iOS Clicks",
      value: formatNumber(analytics?.device_breakdown.find((d) => d.device === "ios")?.count ?? 0),
      icon: Smartphone,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Android Clicks",
      value: formatNumber(analytics?.device_breakdown.find((d) => d.device === "android")?.count ?? 0),
      icon: Smartphone,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Web Clicks",
      value: formatNumber(analytics?.device_breakdown.find((d) => d.device === "web")?.count ?? 0),
      icon: Globe,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <div>
      <DashboardHeader
        title={link.name}
        description="Click analytics and performance"
        action={
          <Link href={`/dashboard/links/${link.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Pencil className="w-3.5 h-3.5" />
              Edit Link
            </Button>
          </Link>
        }
      />

      {/* Link info */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{shortUrl}</span>
                <CopyButton value={shortUrl} />
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                {link.ios_url && <span className="flex items-center gap-1"><Smartphone className="w-3 h-3 text-blue-500" /> iOS</span>}
                {link.android_url && <span className="flex items-center gap-1"><Smartphone className="w-3 h-3 text-green-500" /> Android</span>}
                <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-violet-500" /> Web</span>
              </div>
            </div>
            <Badge variant={link.is_active ? "success" : "secondary"}>
              {link.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-4">
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clicks over time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Clicks Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {(analytics?.clicks_over_time.length ?? 0) > 0 ? (
              <ClicksChart data={analytics!.clicks_over_time} />
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <MousePointerClick className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No click data yet</p>
                <p className="text-xs mt-1">Share your link to start tracking</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <DeviceChart data={analytics?.device_breakdown ?? []} />
          </CardContent>
        </Card>
      </div>

      {/* Top referrers */}
      {(analytics?.top_referrers.length ?? 0) > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4 text-violet-600" />
              Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {analytics!.top_referrers.map((ref, i) => {
                const total = analytics!.total_clicks;
                const pct = total > 0 ? Math.round((ref.count / total) * 100) : 0;
                return (
                  <div key={ref.referrer} className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {ref.referrer === "direct" ? "Direct / Unknown" : ref.referrer}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white w-8 text-right">
                        {ref.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
