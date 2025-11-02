import {ResendVerifyLinkForm} from "@/components/forms/resend-verify-link-form";


export default function VerifyEmail() {
  return (
    <div className="w-5/6 md:w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
      <h1 className="text-2xl">
        Your e-mail address is not verified.
      </h1>
      <p>
        Please check your e-mail and click on the verification link.
      </p>
      <h2>Resend verification link?</h2>
      <ResendVerifyLinkForm />
    </div>


  )
}