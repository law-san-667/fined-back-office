"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/server/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import IsLoading from "@/components/ui/is-loading";

type OrgMembersPageProps = {};

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
});

const OrgMembersPage: React.FC<OrgMembersPageProps> = ({}) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  const utils = trpc.useUtils();
  const { mutate: invite, isPending } = trpc.orgs.inviteAdmin.useMutation({
    onSuccess: () => {
      toast.success("Invitation envoyée");
      form.reset();
    },
    onError: (e) => toast.error(e.message),
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    invite(values);
  };

  return (
    <div className="px-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inviter un administrateur d'organisation</CardTitle>
          <CardDescription>
            Renseignez le nom et l'email. L'admin sera rattaché à votre organisation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom complet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email professionnel</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="exemple@domaine.org" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <IsLoading /> : "Inviter"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgMembersPage;
