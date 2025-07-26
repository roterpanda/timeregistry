import {Card, CardContent} from "@/components/ui/card";
import {LoginForm} from "@/components/forms/login-form";


export default function Login() {
  return (
    <main className="flex bg-secondary flex-1 flex-col justify-center items-center px-4">
      <Card className="max-w-lg w-full shadow-lg m-4">
        <CardContent className="flex flex-col gap-4">
          <h1 className="text-2xl">
            Log in.
          </h1>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}