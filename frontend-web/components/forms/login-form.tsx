"use client"

import { z } from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios from "axios";

const formSchema = z.object({
  email: z.email("Must be an email"),
  password: z.string(),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {

    axios.get('/api/proxy/sanctum/csrf-cookie', {
      withCredentials: true,
    }).then(() => {
      return axios.post("/api/proxy/login", {
        email: values.email,
        password: values.password,}, {
        withCredentials: true,
      });
    })
    .then(() => {
      console.log("Login successful");
      window.location.href = '/dashboard';
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>
                Your email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} type="password" />
              </FormControl>
              <FormDescription>
                Your password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <Button type="submit">Sign In</Button>
      </form>
    </Form>
  );

}