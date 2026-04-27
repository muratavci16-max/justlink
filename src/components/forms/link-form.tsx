"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Globe, Smartphone, Link2, Calendar, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { slugify } from "@/lib/utils";
import type { Link as LinkType } from "@/types";

interface LinkFormProps {
  link?: LinkType;
  mode: "create" | "edit";
}

export function LinkForm({ link, mode }: LinkFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    name: link?.name ?? "",
    slug: link?.slug ?? "",
    web_url: link?.web_url ?? "",
    ios_url: link?.ios_url ?? "",
    android_url: link?.android_url ?? "",
    is_active: link?.is_active ?? true,
    expires_at: link?.expires_at ? link.expires_at.split("T")[0] : "",
  });

  // Auto-generate slug from name
  useEffect(() => {
    if (mode === "create" && form.name && !link) {
      setForm((f) => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, mode, link]);

  // Debounced slug check
  useEffect(() => {
    if (!form.slug) {
      setSlugAvailable(null);
      return;
    }
    const timer = setTimeout(async () => {
      setCheckingSlug(true);
      const res = await fetch(
        `/api/links/check-slug?slug=${encodeURIComponent(form.slug)}${
          link?.id ? `&excludeId=${link.id}` : ""
        }`
      );
      const data = await res.json();
      setSlugAvailable(data.available);
      setCheckingSlug(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [form.slug, link?.id]);

  function handleChange(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.web_url) {
      toast.error("Web URL is required as a fallback");
      return;
    }
    if (slugAvailable === false) {
      toast.error("That slug is already taken");
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      web_url: form.web_url,
      ios_url: form.ios_url || null,
      android_url: form.android_url || null,
      is_active: form.is_active,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };

    const res = await fetch(
      mode === "create" ? "/api/links" : `/api/links/${link!.id}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      toast.success(mode === "create" ? "Link created!" : "Link updated!");
      router.push("/dashboard/links");
      router.refresh();
    } else {
      const err = await res.json();
      toast.error(err.error || "Something went wrong");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="w-4 h-4 text-violet-600" />
            Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Link Name *</Label>
            <Input
              id="name"
              placeholder="My App Campaign"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Custom Slug *</Label>
            <div className="flex items-center gap-2">
              <div className="flex h-10 items-center rounded-l-xl border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400 shrink-0">
                justlink.app/
              </div>
              <div className="relative flex-1">
                <Input
                  id="slug"
                  placeholder="myapp"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="rounded-l-none"
                  required
                />
                {form.slug && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {checkingSlug ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : slugAvailable === true ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : slugAvailable === false ? (
                      <span className="text-xs text-red-500 font-medium">Taken</span>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400">Only lowercase letters, numbers, and hyphens.</p>
          </div>
        </CardContent>
      </Card>

      {/* Destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="w-4 h-4 text-violet-600" />
            Destinations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="web_url" className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-violet-500" />
              Web URL (Fallback) *
            </Label>
            <Input
              id="web_url"
              type="url"
              placeholder="https://example.com"
              value={form.web_url}
              onChange={(e) => handleChange("web_url", e.target.value)}
              required
            />
            <p className="text-xs text-gray-400">Used when no specific device URL matches.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ios_url" className="flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              iOS URL
            </Label>
            <Input
              id="ios_url"
              type="url"
              placeholder="https://apps.apple.com/..."
              value={form.ios_url}
              onChange={(e) => handleChange("ios_url", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="android_url" className="flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-green-500" />
              Android URL
            </Label>
            <Input
              id="android_url"
              type="url"
              placeholder="https://play.google.com/store/..."
              value={form.android_url}
              onChange={(e) => handleChange("android_url", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4 text-violet-600" />
            Advanced Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_active">Active</Label>
              <p className="text-xs text-gray-400 mt-0.5">Disable to stop all redirects for this link.</p>
            </div>
            <Switch
              id="is_active"
              checked={form.is_active}
              onCheckedChange={(v) => handleChange("is_active", v)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expires_at">Expiration Date (optional)</Label>
            <Input
              id="expires_at"
              type="date"
              value={form.expires_at}
              onChange={(e) => handleChange("expires_at", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
            <p className="text-xs text-gray-400">Link will stop redirecting after this date.</p>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading || slugAvailable === false} className="gap-2 min-w-[120px]">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : mode === "create" ? (
            "Create Link"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
