import Link from "next/link";
import { ArrowRight, Smartphone, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-950 dark:to-violet-950/20" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-200/40 dark:bg-violet-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/30 dark:bg-pink-900/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Smart link routing for every platform
          <ChevronRight className="w-3 h-3" />
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          One Link.{" "}
          <span className="gradient-text">Every Platform.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Create a single smart link that automatically routes users to the right destination —
          App Store, Google Play, or web — based on their device.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2 shadow-lg shadow-violet-500/25">
              Create Your Link
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="outline" className="gap-2">
              See how it works
            </Button>
          </Link>
        </div>

        {/* Mock URL bar */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 font-mono">
                justlink.app/myapp
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200/50 dark:border-blue-800/50">
                <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">iOS</span>
                <span className="text-xs text-blue-500 dark:text-blue-400 truncate w-full text-center">App Store</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border border-green-200/50 dark:border-green-800/50">
                <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-300">Android</span>
                <span className="text-xs text-green-500 dark:text-green-400 truncate w-full text-center">Google Play</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/10 border border-violet-200/50 dark:border-violet-800/50">
                <Globe className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">Web</span>
                <span className="text-xs text-violet-500 dark:text-violet-400 truncate w-full text-center">Website</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          Join thousands of developers and marketers using JustLink
        </p>
      </div>
    </section>
  );
}
