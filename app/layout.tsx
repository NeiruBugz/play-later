import "@/styles/globals.css";
import { Metadata } from "next";
import AuthProvider from "@/src/providers/auth";
import Query from "@/src/providers/query";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import SideNav from "@/components/side-nav";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Query>
                <div className="relative flex h-screen flex-col">
                  <SiteHeader />
                  {children}
                </div>
                <TailwindIndicator />
              </Query>
            </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    </>
  );
}
