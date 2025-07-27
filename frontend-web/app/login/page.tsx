import {LoginForm} from "@/components/forms/login-form";


export default function Register() {
    return (
        <div className="w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
            <h1 className="text-2xl">
                Log in.
            </h1>
            <LoginForm />
        </div>


    )
}