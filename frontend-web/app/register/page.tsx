import {RegisterForm} from "@/components/forms/register-form";
import {Card, CardContent} from "@/components/ui/card";


export default function Register() {
    return (
        <main className="flex bg-secondary flex-1 flex-col justify-center items-center px-4">
          <Card className="max-w-lg w-full shadow-lg m-4">
            <CardContent className="flex flex-col gap-4">
              <h1 className="text-2xl">
                Sign up for a new account.
              </h1>
              <RegisterForm />
            </CardContent>
          </Card>
        </main>
    )
}