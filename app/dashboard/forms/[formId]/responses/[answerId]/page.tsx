"use client";
import React from "react";
import { trpc } from "@/server/trpc/client";
import { useParams } from "next/navigation";
import TableSkeleton from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function ResponseDetailPage() {
  const params = useParams<{ formId: string; answerId: string }>();
  const userId = params.answerId as string;
  const formId = Number(params.formId);
  const { data: authed } = trpc.auth.me.useQuery();
  const isSystemAdmin = authed?.adminAccount?.org_id === null;
  const { data, isLoading } = trpc.forms.getResponseDetail.useQuery({ formId, userId }, {
    enabled: isSystemAdmin && Number.isFinite(formId) && typeof userId === "string",
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
        <h1 className="text-2xl font-semibold">Détail des réponses</h1>
      </div>
      <div className="space-y-3">
        {data?.answers?.map((a: any) => (
          <div key={a.questionId} className="rounded border p-3">
            <div className="font-medium mb-1">{a.title}</div>
            <div className="inline-flex items-center rounded bg-primary/10 px-2 py-1 text-primary text-sm">
              {a.selectedOption ?? "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


