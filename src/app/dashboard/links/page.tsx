import Link from "next/link";
import { Plus, ExternalLink, Pencil, BarChart2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserLinks } from "@/lib/links";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { CopyButton } from "@/components/dashboard/copy-button";
import { QRModal } from "@/components/dashboard/qr-modal";
import { DeleteLinkButton } from "@/components/dashboard/delete-link-button";
import { buildShortUrl, formatNumber } from "@/lib/utils";
import { format } from "date-fns";

export default async function LinksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const links = await getUserLinks(user!.id);

  return (
    <div>
      <DashboardHeader
        title="My Links"
        description={`${links.length} smart link${links.length !== 1 ? "s" : ""}`}
        action={
          <Link href="/dashboard/links/new">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              New Link
            </Button>
          </Link>
        }
      />

      {links.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No links yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Create your first smart link and start routing users to the right destination automatically.
            </p>
            <Link href="/dashboard/links/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create your first link
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Created
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {links.map((link) => {
                  const shortUrl = buildShortUrl(link.slug);
                  return (
                    <tr key={link.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white text-sm">
                                {link.name}
                              </span>
                              <Badge variant={link.is_active ? "success" : "secondary"}>
                                {link.is_active ? "Active" : "Off"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-xs text-gray-400 font-mono">{shortUrl}</span>
                              <CopyButton value={shortUrl} />
                              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-xs text-gray-400">
                          {format(new Date(link.created_at), "MMM d, yyyy")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {formatNumber(link.total_clicks)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <QRModal url={shortUrl} name={link.name} />
                          <Link href={`/dashboard/links/${link.id}/analytics`} title="Analytics">
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all">
                              <BarChart2 className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                          <Link href={`/dashboard/links/${link.id}/edit`} title="Edit">
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                          <DeleteLinkButton linkId={link.id} linkName={link.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
