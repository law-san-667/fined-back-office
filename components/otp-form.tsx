import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import IsLoading from "./ui/is-loading";

type OtpFormProps = { email: string };

const schema = z.object({
  otp: z
    .string({
      required_error: "Veuillez entrer le code",
    })
    .min(6, {
      message: "Le code doit contenir 6 chiffres",
    }),
});

const OtpForm: React.FC<OtpFormProps> = ({ email }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { mutate: verifyLogin, isPending } = trpc.auth.verifyLogin.useMutation({
    onSuccess: (res) => {
      toast.success("Connexion réussie", {
        description: "Vous allez être redirigé dans quelques secondes.",
      });

      if (res) {
        Cookies.set("accessToken", res.accessToken);
        Cookies.set("refreshToken", res.refreshToken);

        router.push("/dashboard");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      verifyLogin({
        email,
        code: values.otp,
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Ooops...", {
        description:
          "Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Vérification</CardTitle>
          <CardDescription>
            Renseignez le code que vous avez reçu par mail.
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
                name="otp"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Code OTP</FormLabel>
                    <FormControl className="w-full">
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="w-full">
                          <InputOTPSlot index={0} className="size-12" />
                          <InputOTPSlot index={1} className="size-12" />
                          <InputOTPSlot index={2} className="size-12" />
                          <InputOTPSlot index={3} className="size-12" />
                          <InputOTPSlot index={4} className="size-12" />
                          <InputOTPSlot index={5} className="size-12" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} className="w-full">
                {isPending ? <IsLoading /> : "Confirmer"}
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
};

export default OtpForm;
