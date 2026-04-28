import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "JustLink — One Link. Every Platform.",
  description:
    "Smart link redirection for iOS, Android, and Web. Create one link that routes users to the right destination based on their device.",
  keywords: ["smart link", "deep link", "app redirect", "onelink", "branch", "universal link"],
  openGraph: {
    title: "JustLink — One Link. Every Platform.",
    description: "Smart redirection for apps, campaigns, and growth.",
    url: "https://justlink.app",
    siteName: "JustLink",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
