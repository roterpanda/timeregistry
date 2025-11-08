import type { Metadata } from "next";
import "./globals.css";
import {AuthProvider} from "@/lib/authContext";
import MenuBar from "@/components/organisms/menubar";
import {Toaster} from "@/components/ui/sonner";

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
        className="antialiased bg-background"
      >
       <AuthProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <MenuBar />
            {children}
            <footer className="w-full text-center text-xs text-muted-foreground py-4 border-t">
              TimeRegistry
            </footer>
          </div>
         <Toaster position={"top-center"} richColors={true}/>
       </AuthProvider>
      </body>
    </html>
  );
}
