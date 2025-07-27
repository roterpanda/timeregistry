"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios, {AxiosError} from "axios";
import {useState} from "react";
import {Alert, AlertTitle} from "@/components/ui/alert";

const formSchema = z.object({
  email: z.email("Must be an email"),
  password: z.string().min(10, "Password must be at least 10 characters long."),
  passwordConfirm: z.string(),
  username: z.string()
    .min(3, "Username must be at least 3 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});

export function RegisterForm() {
  const [alert, setAlert] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.post("/api/proxy/register", {
      name: values.username,
      email: values.email,
      password: values.password,
      password_c: values.passwordConfirm
    })
      .then(() => {
        setAlert("User registered successfully");
        setSuccess(true);
        form.reset();
      })
      .catch((err: AxiosError) => {
        if (err.status === 422) {
          setSuccess(false);
          setAlert("Something went wrong. Try again.")
        }
      });
  }

  return (
    <div className="flex flex-col gap-4">
      {alert && <Alert variant={success ? "success" : "destructive"}>
          <AlertTitle>{alert}</AlertTitle></Alert>
      }
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, () => {
          setAlert("");
          setSuccess(false);
        })} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({field}) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormDescription>
                  Your username.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormDescription>
                  Your email address.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
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
                  Your password.
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
                  Confirm the password
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