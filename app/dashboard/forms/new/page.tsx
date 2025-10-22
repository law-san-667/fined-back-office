"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/server/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewFormPage() {
  const { data: authed } = trpc.auth.me.useQuery();
  const isSystemAdmin = authed?.adminAccount?.org_id === null;
  const router = useRouter();
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.forms.createForm.useMutation({
    onSuccess: (f) => {
      utils.forms.getForms.invalidate();
      router.push(`/dashboard/forms/${f.id}/edit`);
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (!isSystemAdmin) {
    return (
      <div className="px-4 py-6 text-center text-xl text-muted-foreground">
        Accès refusé. Réservé aux administrateurs système.
      </div>
    );
  }

  return (
    <div className="px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 w-9 rounded-full p-0" onClick={() => router.back()} aria-label="Retour" title="Retour">
            <IconArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-semibold">Nouveau formulaire</h1>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 gap-4 max-w-xl"
            onSubmit={handleSubmit((values) => mutate(values))}
          >
            <div>
              <label className="text-sm">Nom</label>
              <input className="mt-1 w-full rounded border px-3 py-2" {...register("name")} />
              {errors.name && (
                <div className="text-sm text-destructive mt-1">{errors.name.message}</div>
              )}
            </div>
            <div>
              <label className="text-sm">Description</label>
              <textarea className="mt-1 w-full rounded border px-3 py-2" rows={4} {...register("description")} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>Créer</Button>
              <Button type="button" variant="secondary" onClick={() => router.back()}>Annuler</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


