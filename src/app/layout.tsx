import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TzDalali - Global Real Estate & Car Marketplace",
  description: "Global marketplace for Real Estate and Cars with legal guarantees.",
};

import { ClaudeChat } from "@/components/ai/ClaudeChat";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <ClaudeChat />
              <Toaster />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
