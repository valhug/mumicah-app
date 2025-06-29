import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/common/Toast";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { BrowserCompatibilityProvider } from "@/components/providers/BrowserCompatibilityProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mumicah - Language Learning Community",
  description: "Connect with native speakers, join language communities, and accelerate your language learning journey.",
  keywords: ["language learning", "community", "native speakers", "conversation practice"],
  authors: [{ name: "Mumicah Team" }],
  openGraph: {
    title: "Mumicah - Language Learning Community",
    description: "Connect with native speakers and accelerate your language learning",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mumicah - Language Learning Community",
    description: "Connect with native speakers and accelerate your language learning",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-inter antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center p-8"><div className="text-center"><h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1><p className="text-muted-foreground">Please refresh the page or try again later.</p></div></div>}>
              <ToastProvider position="top-right">
                <BrowserCompatibilityProvider>
                  <div className="min-h-screen flex flex-col">
                    {children}
                  </div>
                </BrowserCompatibilityProvider>
              </ToastProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
