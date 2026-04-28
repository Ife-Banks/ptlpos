import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const systemFont =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "PTLPOS – Cloud POS & Retail Management Platform",
    template: "%s | PTLPOS",
  },
  description:
    "Multi-tenant Point of Sale and retail management platform for SMEs. Manage sales, inventory, customers and analytics in one place.",
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "PTLPOS – Cloud POS & Retail Management Platform",
    description:
      "Multi-tenant Point of Sale and retail management platform for SMEs. Manage sales, inventory, customers and analytics in one place.",
    url: "/",
    siteName: "PTLPOS",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PTLPOS - Cloud POS & Retail Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PTLPOS – Cloud POS & Retail Management Platform",
    description:
      "Multi-tenant Point of Sale and retail management platform for SMEs. Manage sales, inventory, customers and analytics in one place.",
    images: [`${appUrl}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ fontFamily: systemFont }} className={systemFont}>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}