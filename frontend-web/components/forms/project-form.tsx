"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios, {AxiosError} from "axios";
import React, {useState} from "react";
import {Alert, AlertTitle} from "@/components/ui/alert";
import {Textarea} from "@/components/ui/textarea";
import {useRouter} from "next/navigation";
import {Checkbox} from "@/components/ui/checkbox";
import {ErrorResponse, ProjectFormProps} from "@/lib/types";

const formSchema = z.object({
  name: z.string().nonempty().min(3, "Name must be at least three letters long"),
  description: z.string(),
  projectCode: z.string().max(32, "Project code must be at most 32 characters long"),
  isPublic: z.boolean(),
});

export function ProjectForm({ isEdit = false, project = undefined } : ProjectFormProps) {
  const [alert, setAlert] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      projectCode: project?.project_code || "",
      isPublic: project?.is_public === undefined ? true : project.is_public,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {withCredentials: true})
      .then(() => {
        axios.post("/api/proxy/v1/project", {
          name: values.name,
          description: values.description,
          project_code: values.projectCode,
          is_public: values.isPublic,
        }, {
          withCredentials: true,
          withXSRFToken: true,
        })
          .then(() => {
            setAlert("Project created successfully");
            setSuccess(true);
            form.reset();
            router.push("/dashboard");
          })
          .catch((err: AxiosError<ErrorResponse>) => {
            const errorData: ErrorResponse = err.response?.data;
            if (err.status === 422 || err.status === 400) {
              if (errorData) {
                let alertMsg = errorData.error?.message || "Something went wrong. Try again.";
                if (errorData.error?.details) {
                  for (const detail of Object.keys(errorData.error.details)) {
                    alertMsg += ` ${errorData.error.details[detail]}`;
                  }
                }
                setSuccess(false);
                setAlert(alertMsg);
              }
            } else {
              setSuccess(false);
              setAlert("A server error or other error occurred. Please try again later.")
            }
          });
      })
  }

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.back();
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
            name="projectCode"
            render={({field}) => (
              <FormItem>
                <FormLabel>Project code</FormLabel>
                <FormControl>
                  <Input placeholder="Project code" {...field} />
                </FormControl>
                <FormDescription>
                  The project code.
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
          <FormField
            control={form.control}
            name="isPublic"
            render={({field}) => (
              <FormItem>

                <FormControl>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} ref={field.ref} />
                    <FormLabel>Is public?</FormLabel>
                  </div>
                </FormControl>
                <FormDescription>
                  Determines if project is available to other users.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
          <div className="flex gap-4">
            <Button type="submit">{isEdit ? "Update" : "Create"} Project</Button>
            <Button variant={"secondary"} onClick={handleCancel}>Go back</Button>
          </div>
        </form>
      </Form>
    </div>
  );

}