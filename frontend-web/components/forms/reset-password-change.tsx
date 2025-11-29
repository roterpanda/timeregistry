"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

const formSchema = z.object({
  password: z.string().min(10, "Password must be at least 10 characters long."),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});

interface ResetPasswordChangeFormProps {
  token: string;
  email: string;
}

export function ResetPasswordChangeForm({token, email}: ResetPasswordChangeFormProps & { token: string; email: string;}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {withCredentials: true})
      .then(() => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/password/reset`, {
          token: token,
          email: email,
          password: values.password,
          password_confirmation: values.passwordConfirm
        }, {
          withCredentials: true,
          withXSRFToken: true,
        })
          .then(() => {
            toast.success("Password reset successful");
            form.reset();
            router.push("/login");
          })
          .catch(() => {
            toast.error("Password reset failed. Please try again later.");
          });
      })
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} type="password"/>
                </FormControl>
                <FormDescription>
                  Your new password.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({field}) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm Password" {...field} type="password"/>
                </FormControl>
                <FormDescription>
                  Confirm the new password
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
          <Button type="submit">Reset your password</Button>
        </form>
      </Form>
    </div>
  );

}