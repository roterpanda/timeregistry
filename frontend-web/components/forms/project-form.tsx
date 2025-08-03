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
import {Textarea} from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least three letters long"),
  description: z.string(),
});

export function ProjectForm() {
  const [alert, setAlert] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {withCredentials: true})
      .then(() => {
        axios.post(`/api/proxy/v1/project`, {
          name: values.name,
          description: values.description,
        }, {
          withCredentials: true,
          withXSRFToken: true,
        })
          .then(() => {
            setAlert("Project created successfully");
            setSuccess(true);
            form.reset();
          })
          .catch((err: AxiosError) => {
            if (err.status === 422) {
              setSuccess(false);
              setAlert("Something went wrong. Try again.")
            }
          });
      })
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
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Project name</FormLabel>
                <FormControl>
                  <Input placeholder="Project name" {...field} />
                </FormControl>
                <FormDescription>
                  Your project name.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormDescription>
                  The project description
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