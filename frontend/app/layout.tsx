// ============================================================================
// Learnix LMS - Root Layout (રૂટ લેઆઉટ)
// ============================================================================
// Aa file Next.js App Router nu root layout chhe.
// This file is the Next.js App Router root layout.
//
// Providers / પ્રોવાઇડર્સ:
// - ClerkProvider: Authentication context
// - ThemeProvider: Dark/Light theme support
// - UserSync: Clerk → DB background sync component
// - Toaster: Toast notification system (sonner)

//
// Fonts / ફોન્ટ્સ:
// - Geist Sans: Primary font
// - Geist Mono: Code/mono font
// ============================================================================

import type { Metadata } from "next";
import { Geist, Space_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { ClerkProvider } from "@clerk/nextjs";
import { UserSync } from "@/components/auth/user-sync";

// Primary sans-serif font (Body & UI)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Serif font for headings (technical aesthetic)
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Monospace font for code and data
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// SEO metadata / SEO metadata
export const metadata: Metadata = {
  title: "Learnix",
  description: "Learn from the best",
};

// Root layout component - badha pages ne wrap kare chhe
// Root layout component - wraps all pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${spaceMono.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
          <ThemeProvider>
            {/* Clerk user ne DB sathe background sync karo / Background sync Clerk user to DB */}
            <UserSync />
            {children}
            {/* Toast notifications - bottom-center position */}
            <Toaster closeButton position="bottom-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
