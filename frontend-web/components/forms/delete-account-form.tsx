"use client"

import {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import api from "@/lib/axios";
import {useAuth} from "@/lib/authContext";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const formSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export function DeleteAccountForm() {
  const {logout} = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    api.delete("/account", {data: {password: values.password}})
      .then(() => {
        toast.success("Your account has been deleted.");
        logout();
        router.push("/");
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          form.setError("password", {message: "Incorrect password."});
        }
        setOpen(false);
      });
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Confirm your password</FormLabel>
                <FormControl>
                  <Input {...field} type="password"/>
                </FormControl>
                <FormDescription>
                  Enter your current password to confirm account deletion.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  form.trigger().then((isValid) => {
                    if (isValid) setOpen(true);
                  });
                }}
              >
                Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all of your data including projects and time
                  registrations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={form.handleSubmit(onSubmit)}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </div>
  );
}