import {ResetPasswordEmailForm} from "@/components/forms/reset-password-email";


export default function PasswordResetPage() {
  return (
    <div className="w-5/6 md:w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
      <h1 className="text-2xl">
        Forgot your password?
      </h1>
      <p>
        If you forgot your password, you can reset it here.
      </p>
      <ResetPasswordEmailForm />
    </div>
  )
}