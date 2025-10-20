"use client";
import React from "react";
import { trpc } from "@/server/trpc/client";
import TableSkeleton from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FormsPage() {
  const { data: authed } = trpc.auth.me.useQuery();
  const isSystemAdmin = authed?.adminAccount?.org_id === null;
  const { data, isLoading } = trpc.forms.getForms.useQuery(undefined, {
    enabled: isSystemAdmin,
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
        <h1 className="text-2xl font-semibold">Formulaires</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/forms/new">Ajouter un formulaire</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="space-y-2">
          {data?.map((f: any) => (
            <div key={f.id} className="group rounded-lg border p-4 hover:bg-primary/10 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <Link href={`/dashboard/forms/${f.id}`} className="flex-1">
                  <button className="w-full text-left">
                    <div className="text-lg font-semibold truncate group-hover:underline">
                      {f.name}
                    </div>
                  </button>
                </Link>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/forms/${f.id}/edit`}>Éditer</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/forms/${f.id}/responses`}>Réponses</Link>
                  </Button>
                  <DeleteFormButton id={f.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteFormButton({ id }: { id: number }) {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.forms.deleteForm.useMutation({
    onSuccess: () => utils.forms.getForms.invalidate(),
  });
  return (
    <Button size="sm" variant="destructive" disabled={isPending} onClick={() => mutate({ id })}>
      Supprimer
    </Button>
  );
}


