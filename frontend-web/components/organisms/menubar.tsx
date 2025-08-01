"use client";

import {useAuth} from "@/lib/authContext";
import {Button} from "@/components/ui/button";

export default function MenuBar() {
  const {isAuthenticated} = useAuth();

  return (
    <header className="bg-primary-foreground w-full px-6 py-4 flex justify-between items-center border-b">
      <div className="font-sans font-bold text-xl text-foreground">TimeRegistry</div>

      {isAuthenticated ? (
        <Button variant="outline">Logout</Button>
      ) : (
        <Button variant="outline">Sign In</Button>
      )}
    </header>
  );

}