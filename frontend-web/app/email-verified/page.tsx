"use client";

import {useAuth} from "@/lib/authContext";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {toast} from "sonner";


export default function EmailVerifiedPage() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      toast.success("Email verified successfully. Please log in to continue.");
      return;
    }

  }, []);


  return (
    <div className="w-5/6 md:w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
      <h1 className="text-2xl">
        Log in.
      </h1>

    </div>


  )
}