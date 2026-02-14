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
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { ClerkProvider } from "@clerk/nextjs";
import { UserSync } from "@/components/auth/user-sync";

// Primary sans-serif font / Primary sans-serif font
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Monospace font (code blocks mate) / Monospace font (for code blocks)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
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
