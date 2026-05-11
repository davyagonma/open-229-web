import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/frontend/components/layout/SiteHeader";
import { SiteFooter } from "@/frontend/components/layout/SiteFooter";
import { SetupBanner } from "@/frontend/components/layout/SetupBanner";
import { ThemeProvider } from "@/frontend/components/theme/ThemeProvider";
import { isSupabaseConfigured } from "@/lib/env";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "open-229 | Bénin Open Source",
    template: "%s | open-229",
  },
  description:
    "Discover and share open source projects from Benin. Built for developers, by developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen overflow-x-hidden antialiased`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
            {!isSupabaseConfigured() ? <SetupBanner /> : null}
            <SiteHeader />
            <main className="flex-grow">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
