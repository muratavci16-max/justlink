import Link from "next/link";
import { Plus, Link2, MousePointerClick, TrendingUp, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getUserLinks } from "@/lib/links";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard/header";
import { buildShortUrl, formatNumber } from "@/lib/utils";
import { format } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [stats, recentLinks] = await Promise.all([
    getDashboardStats(user!.id),
    getUserLinks(user!.id).then((links) => links.slice(0, 5)),
  ]);

  const statCards = [
    {
      label: "Total Links",
      value: formatNumber(stats.total_links),
      icon: Link2,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      label: "Total Clicks",
      value: formatNumber(stats.total_clicks),
      icon: MousePointerClick,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Active Links",
      value: formatNumber(recentLinks.filter((l) => l.is_active).length),
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <div>
      <DashboardHeader
        title="Overview"
        description={`Welcome back, ${user?.email?.split("@")[0]}`}
        action={
          <Link href="/dashboard/links/new">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Link
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Links</CardTitle>
          <Link href="/dashboard/links" className="text-sm text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentLinks.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-semibold mb-2">No links yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Create your first smart link to get started.
              </p>
              <Link href="/dashboard/links/new">
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create your first link
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {recentLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                        {link.name}
                      </p>
                      <Badge variant={link.is_active ? "success" : "secondary"}>
                        {link.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate">
                      {buildShortUrl(link.slug)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatNumber(link.total_clicks)}
                      </p>
                      <p className="text-xs text-gray-400">clicks</p>
                    </div>
                    <Link href={`/dashboard/links/${link.id}/analytics`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
