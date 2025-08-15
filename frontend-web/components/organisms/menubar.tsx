"use client";

import {useAuth} from "@/lib/authContext";
import {Button} from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import {LogInIcon, LogOutIcon} from "lucide-react";

export default function MenuBar() {
  const {isAuthenticated, user, logout} = useAuth();

  const handleLogout = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`,"", { withCredentials: true, withXSRFToken: true });
    logout();
  };

  return (
    <header className="bg-primary-foreground w-full px-6 py-4 flex justify-between items-center border-b">
      <div className="font-sans font-bold text-xl text-foreground">
        <Link href="/">
          TimeRegistry
        </Link>
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span>Hello, {user ? user.name : "Unknown"}</span>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOutIcon />
            Logout
          </Button>
        </div>
      ) : (
        <Button variant="outline" asChild={true}>
          <Link href="/login">
            <LogInIcon />
            Sign In
          </Link>
        </Button>
      )}
    </header>
  );

}