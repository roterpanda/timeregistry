"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios, {AxiosError, AxiosResponse} from "axios";
import {useState} from "react";
import {Alert, AlertTitle} from "@/components/ui/alert";
import {useAuth} from "@/lib/authContext";

const formSchema = z.object({
  email: z.string().email("Must be an email"),
  password: z.string(),
});

export function LoginForm() {
  const [alert, setAlert] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const {login} = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, { withCredentials: true })
      .then(response => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          email: values.email,
          password: values.password,
        }, {
          headers: {"Content-Type": "application/json"},
          withCredentials: true,
          withXSRFToken: true,
        })
          .then((result: AxiosResponse) => {
            login({name: result.data.name});
            setAlert("Login successful");
            setSuccess(true);
            form.reset();
          })
          .catch((err: AxiosError) => {
            if (err.status === 401) {
              setSuccess(false);
              setAlert("Not authorized. Try again.")
            }
          });

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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );

}