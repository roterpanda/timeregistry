import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Button} from "@/components/ui/button";
import {LogInIcon} from "lucide-react";
import Link from "next/link";

const interFont = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TimeRegistry",
  description: "A time tracking app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interFont.className} antialiased bg-background`}
      >
          <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-primary-foreground w-full px-6 py-4 flex justify-between items-center border-b">
              <div className="font-bold text-xl text-foreground">
                <Link href="/">TimeRegistry</Link>
              </div>
              <Button variant="outline" asChild={true}>
                <Link href="/login">
                  <LogInIcon /> Sign In
                </Link>
              </Button>
            </header>
            {children}
            <footer className="w-full text-center text-xs text-muted-foreground py-4 border-t">
              TimeRegistry
            </footer>
          </div>
      </body>
    </html>
  );
}
