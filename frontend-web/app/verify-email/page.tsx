import {Suspense} from "react";
import VerifyEmailPageContent from "@/components/organisms/verify-email-page-content";

export default function VerifyEmailPage() {
  return <Suspense fallback={<div>Loading...</div>}>
    <VerifyEmailPageContent />
  </Suspense>
}