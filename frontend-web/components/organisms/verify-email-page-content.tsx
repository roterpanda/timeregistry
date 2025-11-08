"use client";

import {useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {toast} from "sonner";
import {ResendVerifyLinkForm} from "@/components/forms/resend-verify-link-form";


export default function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "invalid") {
      toast.error("Invalid verification link.");
    } else if (status === "already_verified") {
      toast.error("Your e-mail address is already verified.");
    }
  }, [searchParams]);

  return (
    <div className="w-5/6 md:w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
    <h1 className="text-2xl">
      Verify your email address
    </h1>
    <p>
      Please check your inbox for a verification link. If you don&apos;t see it, you can request a new one.
    </p>
    <h2>Resend verification link?</h2>
      <ResendVerifyLinkForm />
    </div>)

}