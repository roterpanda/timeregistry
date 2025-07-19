import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Button} from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
        className={`${geistSans.variable} antialiased bg-background`}
      >
          <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-primary-foreground w-full px-6 py-4 flex justify-between items-center border-b">
              <div className="font-sans font-bold text-xl text-foreground">TimeRegistry</div>
              <Button variant="outline">Sign In</Button>
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
