"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios, {AxiosResponse} from "axios";
import {toast} from "sonner";

const formSchema = z.object({
  email: z.email("Must be an email")
});

export function ResetPasswordEmailForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });



  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {withCredentials: true})
      .then(() => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/password/email`, {
          email: values.email,
        }, {
          withCredentials: true,
          withXSRFToken: true,
        })
          .then((res: AxiosResponse) => {
            toast.success(res.data?.message || "Success");
            form.reset();
          })
          .catch(() => {
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
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Your e-mail</FormLabel>
                <FormControl>
                  <Input {...field} type="email"/>
                </FormControl>
                <FormDescription>
                  Your e-mail address.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );

}