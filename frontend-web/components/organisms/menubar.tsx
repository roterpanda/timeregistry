"use client";

import {useAuth} from "@/lib/authContext";
import {Button} from "@/components/ui/button";
import axios from "axios";

export default function MenuBar() {
  const {isAuthenticated, user, logout} = useAuth();

  const handleLogout = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`,"", { withCredentials: true, withXSRFToken: true });
    logout();
  };

  return (
    <header className="bg-primary-foreground w-full px-6 py-4 flex justify-between items-center border-b">
      <div className="font-sans font-bold text-xl text-foreground">TimeRegistry</div>

      {isAuthenticated ? (
        <div className="flex gap-4">
          <span>Hello, {user ? user.name : "Unknown"}</span>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <Button variant="outline">Sign In</Button>
      )}
    </header>
  );

}