"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import IsLoading from "./ui/is-loading";

const schema = z.object({
  email: z
    .string({
      required_error: "Veuillez entrer votre adresse email",
    })
    .email({
      message: "Veuillez entrer une adresse email valide",
    }),
});

type LoginFormProps = React.ComponentProps<"div"> & {
  setStep: React.Dispatch<React.SetStateAction<"login" | "otp">>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

export function LoginForm({
  className,
  setEmail,
  setStep,
  ...props
}: LoginFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { mutate: login, isPending } = trpc.auth.login.useMutation({
    onSuccess: (_, input) => {
      // toast.success("Connexion réussie", {
      //   description: "Vous allez être redirigé dans quelques secondes.",
      // });

      setStep("otp");
      setEmail(input.email);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      login(values);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Ooops...", {
        description:
          "Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.",
      });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenue</CardTitle>
          <CardDescription>
            Connectez vous pour accéder à votre tableau de bord.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto w-full max-w-3xl space-y-4"
            >
              <FormField
                disabled={isPending}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="exemple@email.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} className="w-full">
                {isPending ? <IsLoading /> : "Connexion"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
