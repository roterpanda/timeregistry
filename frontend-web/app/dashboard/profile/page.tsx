import {ResetPasswordAuthorizedForm} from "@/components/forms/reset-password-authorized";
import {DeleteAccountForm} from "@/components/forms/delete-account-form";
import {Separator} from "@/components/ui/separator";


export default function ProfilePage() {
  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p>See and change your profile settings</p>

      <section className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold">Change your password</h2>
        <ResetPasswordAuthorizedForm />
      </section>

      <Separator />

      <section className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold">Delete account</h2>
        <p className="text-muted-foreground text-sm">
          Once you delete your account, there is no going back. All your projects and time registrations will be permanently removed.
        </p>
        <DeleteAccountForm />
      </section>

    </div>
  )
}