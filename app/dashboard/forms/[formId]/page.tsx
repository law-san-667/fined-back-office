"use client";
import React from "react";
import { trpc } from "@/server/trpc/client";
import { useParams } from "next/navigation";
import TableSkeleton from "@/components/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function FormDetailPage() {
  const params = useParams<{ formId: string }>();
  const formId = Number(params.formId);
  const { data: authed } = trpc.auth.me.useQuery();
  const isSystemAdmin = authed?.adminAccount?.org_id === null;
  const { data, isLoading } = trpc.forms.getFormWithQuestions.useQuery({ formId }, {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 w-9 rounded-full p-0" onClick={() => router.back()} aria-label="Retour" title="Retour">
            <IconArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-semibold">{data?.form?.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/forms/${formId}/edit`}>Éditer</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/forms/${formId}/responses`}>Réponses</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data?.questions?.length ? (
            data?.questions?.map((q: any) => (
              <div key={q.id} className="rounded border p-3">
                <div className="font-medium">{q.title}</div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">Aucune question pour ce formulaire.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


