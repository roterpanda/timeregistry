import {LoginForm} from "@/components/forms/login-form";
import Link from "next/link";


export default function Login() {
    return (
        <div className="w-5/6 md:w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
            <h1 className="text-2xl">
                Log in.
            </h1>
            <LoginForm />
            <Link href="/forgot-password" className="text-sm text-secondary-foreground">
              Forgot your password?
            </Link>
        </div>


    )
}