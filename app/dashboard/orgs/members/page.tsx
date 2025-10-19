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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IsLoading from "@/components/ui/is-loading";

const baseSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  orgId: z.string().uuid().optional(),
});

const OrgMembersPage: React.FC = () => {
  const { data: authed } = trpc.auth.me.useQuery();
  const isSystemAdmin = authed?.adminAccount?.org_id === null || authed?.adminAccount?.org_id === undefined;

  const { data: orgs } = trpc.orgs.getOrgs.useQuery(undefined, {
    enabled: Boolean(isSystemAdmin),
  });

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: { name: "", email: "", orgId: undefined },
  });

  const inviteOrgAdmin = trpc.orgs.inviteAdminForOrg.useMutation({
    onSuccess: () => {
      toast.success("Invitation envoyée");
      form.reset();
    },
    onError: (e) => toast.error(e.message),
  });

  const onSubmit = (values: z.infer<typeof baseSchema>) => {
    if (!isSystemAdmin) {
      toast.error("Accès réservé aux administrateurs système");
      return;
    }
    if (!values.orgId) {
      toast.error("Veuillez choisir une organisation");
      return;
    }
    inviteOrgAdmin.mutate({ email: values.email, name: values.name, orgId: values.orgId });
  };

  const isSubmitting = inviteOrgAdmin.isPending;

  if (!isSystemAdmin) {
    return (
      <div className="px-4">
        <Card>
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>Cette section est réservée aux administrateurs système.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inviter un administrateur d'organisation</CardTitle>
          <CardDescription>
            Sélectionnez une organisation et renseignez les informations de l'admin.
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

              {isSystemAdmin && (
                <FormField
                  control={form.control}
                  name="orgId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une organisation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(orgs || []).map((o) => (
                            <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex items-end">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <IsLoading /> : "Inviter"}
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
