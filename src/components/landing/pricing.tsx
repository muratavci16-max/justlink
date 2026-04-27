import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal projects and trying things out.",
    features: [
      "Up to 5 smart links",
      "Basic click analytics",
      "iOS, Android & Web routing",
      "QR code generation",
      "Custom slugs",
    ],
    cta: "Get started free",
    ctaHref: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For teams and campaigns that need more power.",
    features: [
      "Unlimited smart links",
      "Advanced analytics & charts",
      "Geo-based redirects",
      "Link expiration dates",
      "Password-protected links",
      "API access",
      "Priority support",
    ],
    cta: "Start Pro trial",
    ctaHref: "/auth/signup?plan=pro",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, transparent{" "}
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Start free, upgrade when you need more.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-2xl shadow-violet-500/30 scale-105"
                  : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? "text-violet-200" : "text-gray-500 dark:text-gray-400"}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.highlighted ? "text-violet-200" : "text-gray-500 dark:text-gray-400"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlighted ? "bg-white/20" : "bg-violet-100 dark:bg-violet-900/30"
                    }`}>
                      <Check className={`w-3 h-3 ${plan.highlighted ? "text-white" : "text-violet-600 dark:text-violet-400"}`} />
                    </div>
                    <span className={`text-sm ${plan.highlighted ? "text-violet-100" : "text-gray-600 dark:text-gray-300"}`}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "secondary" : "default"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
