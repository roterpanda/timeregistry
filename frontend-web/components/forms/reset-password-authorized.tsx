"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "sonner";

const formSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  password: z.string().min(10, "Password must be at least 10 characters long"),
});

export function ResetPasswordAuthorizedForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {withCredentials: true})
      .then(() => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/password/change`, {
          current_password: values.current_password,
          password: values.password,
        }, {
          withCredentials: true,
          withXSRFToken: true,
        })
          .then((res: AxiosResponse) => {
            toast.success(res.data?.message || "Success");
            form.reset();
          })
          .catch((error: AxiosError) => {
            if (error.response?.status === 403) {
              form.setError("current_password", {message: "Current password is incorrect."});
            }
          });
      })
      .catch(() => {
        toast.error("Failed to get CSRF token");
        form.reset();
      });
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="current_password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input {...field} type="password"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input {...field} type="password"/>
                </FormControl>
                <FormDescription>
                  Must be at least 10 characters long.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
          <Button type="submit">Change password</Button>
        </form>
      </Form>
    </div>
  );

}