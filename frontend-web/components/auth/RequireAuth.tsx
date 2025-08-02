import React, {useEffect, useState} from "react";
import {useAuth} from "@/lib/authContext";
import {useRouter} from "next/navigation";


export function RequireAuth( {children}: {children: React.ReactNode }) {
  const {user, loading} = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user === null) {
        router.push("/login");
      } else {
        setAuthChecked(true);
      }
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  if (!authChecked) {
    return <div className="flex justify-center items-center h-screen">Verifying access...</div>;
  }

  return <>{children}</>;
}