import {RegisterForm} from "@/components/forms/register-form";


export default function Register() {
    return (
        <div className="w-5/6 md:w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
            <h1 className="text-2xl">
                Sign up for a new account.
            </h1>
            <RegisterForm />
        </div>


    )
}