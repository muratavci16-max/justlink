import { Smartphone, BarChart3, Link2, QrCode, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Smart Redirect",
    description:
      "Automatically route visitors to iOS, Android, or Web destinations based on their device — no manual switching needed.",
    color: "violet",
  },
  {
    icon: Link2,
    title: "Custom Short Links",
    description:
      "Create branded short links with custom slugs. Share a single memorable URL across all your campaigns.",
    color: "blue",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Track every click with device breakdown, referrer data, geographic insights, and time-series charts.",
    color: "green",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description:
      "Generate QR codes for any link instantly. Perfect for print campaigns, packaging, and events.",
    color: "pink",
  },
  {
    icon: Smartphone,
    title: "Deep Link Support",
    description:
      "Send users directly to content inside your app with deep link URLs. Works with all major platforms.",
    color: "orange",
  },
  {
    icon: Shield,
    title: "Reliable & Secure",
    description:
      "Built on Supabase with row-level security, expiration dates, and instant enable/disable controls.",
    color: "teal",
  },
];

const colorMap: Record<string, string> = {
  violet: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  teal: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to{" "}
            <span className="gradient-text">grow smarter</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            One platform to create, manage, and analyze all your smart links — from a single dashboard.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[feature.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
