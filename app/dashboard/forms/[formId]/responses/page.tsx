"use client";
import React from "react";
import { trpc } from "@/server/trpc/client";
import { useParams } from "next/navigation";
import TableSkeleton from "@/components/table-skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function FormResponsesPage() {
  const params = useParams<{ formId: string }>();
  const formId = Number(params.formId);
  const { data: authed } = trpc.auth.me.useQuery();
  const isSystemAdmin = authed?.adminAccount?.org_id === null;
  const { data, isLoading } = trpc.forms.getFormRespondents.useQuery({ formId }, {
    enabled: isSystemAdmin && Number.isFinite(formId),
  });
  const router = useRouter();

  if (!isSystemAdmin) {
    return (
      <div className="px-4 py-6 text-center text-xl text-muted-foreground">
        Accès refusé. Réservé aux administrateurs système.
      </div>
    );
  }

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="px-4 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" className="h-9 w-9 rounded-full p-0" onClick={() => router.back()} aria-label="Retour" title="Retour">
          <IconArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-semibold">Réponses</h1>
      </div>
      <div className="rounded border">
        <div className="grid grid-cols-12 bg-muted px-3 py-2 text-sm font-medium">
          <div className="col-span-4">Utilisateur</div>
          <div className="col-span-4">Dernière réponse</div>
          <div className="col-span-4">Actions</div>
        </div>
        {data?.map((r: any) => (
          <div key={r.id} className="grid grid-cols-12 px-3 py-2 border-t items-center">
            <div className="col-span-4 truncate">{r.name}</div>
            <div className="col-span-4">{new Date(r.last_answer_at).toLocaleString()}</div>
            <div className="col-span-4">
              <Button asChild size="sm" variant="secondary">
                <Link href={`/dashboard/forms/${formId}/responses/${r.user_id}`}>Voir</Link>
              </Button>
            </div>
          </div>
        ))}
        {!data?.length && (
          <div className="px-3 py-6 text-center text-muted-foreground">Aucune réponse.</div>
        )}
      </div>
    </div>
  );
}


