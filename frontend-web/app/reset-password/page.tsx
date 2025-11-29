import {ResetPasswordChangeForm} from "@/components/forms/reset-password-change";
import {use} from "react";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined}>;
}

export default function PasswordResetPage({ searchParams }: PageProps) {
  const params = use(searchParams);

  const token = params.token;
  const email = params.email;

  if (!token || !email) {
    return <div>Invalid token or missing email.</div>;
  }

  return (
    <div className="w-5/6 md:w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
      <h1 className="text-2xl">
        Reset your password
      </h1>
      <p>
        If you forgot your password, you can reset it here.
      </p>
      <ResetPasswordChangeForm token={token} email={email}/>
    </div>
  )
}