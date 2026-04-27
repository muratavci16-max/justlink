import { Link2, Settings, Share2 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Link2,
    title: "Create your smart link",
    description:
      "Enter your iOS App Store URL, Android Google Play URL, and web URL. Add a custom slug like justlink.app/myapp.",
  },
  {
    step: "02",
    icon: Settings,
    title: "Configure destinations",
    description:
      "Set up device-specific redirects, optional expiration dates, and enable QR code generation with one click.",
  },
  {
    step: "03",
    icon: Share2,
    title: "Share and track",
    description:
      "Share your single link everywhere. We automatically route each visitor and track every click in real time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Up and running in{" "}
            <span className="gradient-text">minutes</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Three simple steps to start routing users to the right destination automatically.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-violet-200 via-purple-200 to-pink-200 dark:from-violet-800/50 dark:via-purple-800/50 dark:to-pink-800/50" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative flex flex-col items-center text-center">
                  {/* Step number + icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-violet-500/25 relative z-10">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center z-20">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {s.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
