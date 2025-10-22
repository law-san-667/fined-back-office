"use client";
import React from "react";
import { trpc } from "@/server/trpc/client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TableSkeleton from "@/components/table-skeleton";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

export default function EditFormQuestionsPage() {
  const params = useParams<{ formId: string }>();
  const formId = Number(params.formId);
  const { data: authed } = trpc.auth.me.useQuery();
  const isSystemAdmin = authed?.adminAccount?.org_id === null;
  const { data, isLoading } = trpc.forms.getFormWithQuestions.useQuery({ formId }, {
    enabled: isSystemAdmin && Number.isFinite(formId),
  });

  const utils = trpc.useUtils();
  const { mutate: saveQuestion, isPending } = trpc.forms.upsertQuestion.useMutation({
    onSuccess: () => utils.forms.getFormWithQuestions.invalidate({ formId }),
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
          <h1 className="text-2xl font-semibold">Éditer: {data?.form?.name}</h1>
        </div>
        <AddQuestionDialog onAdd={(values) => saveQuestion({ formId, title: values.title, options: values.options })} disabled={isPending} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data?.questions?.map((q: any) => (
            <QuestionRow key={q.id} q={q} formId={formId} />
          ))}
          {!data?.questions?.length && (
            <Button variant="outline" size="sm" onClick={() => saveQuestion({ formId, title: "Nouvelle question" })}>Ajouter une question</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionRow({ q, formId }: { q: any; formId: number }) {
  const utils = trpc.useUtils();
  const { mutate: saveQuestion, isPending } = trpc.forms.upsertQuestion.useMutation({
    onSuccess: () => utils.forms.getFormWithQuestions.invalidate({ formId }),
  });
  const { mutate: deleteQuestion, isPending: deleting } = trpc.forms.deleteQuestion.useMutation({
    onSuccess: () => utils.forms.getFormWithQuestions.invalidate({ formId }),
  });
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState(q.title as string);
  const [open, setOpen] = React.useState(false);
  const [optValue, setOptValue] = React.useState("");
  const options: string[] = Array.isArray(q.options) ? q.options : [];
  return (
    <div className="rounded border p-3 hover:bg-primary/10 transition-colors">
      <button className="w-full text-left" onClick={() => setOpen((v) => !v)}>
        <div className="flex items-center justify-between">
          {editing ? (
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mr-4 rounded border px-2 py-1" />
          ) : (
            <div className="font-medium">{q.title}</div>
          )}
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button size="sm" variant="secondary" disabled={isPending} onClick={() => { saveQuestion({ id: q.id, formId, title, options }); setEditing(false); }}>Enregistrer</Button>
                <Button size="sm" variant="outline" onClick={() => { setTitle(q.title); setEditing(false); }}>Annuler</Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setEditing(true)} onMouseDown={(e) => e.stopPropagation()}>Modifier</Button>
                <Button size="sm" variant="destructive" disabled={deleting} onMouseDown={(e) => e.stopPropagation()} onClick={() => deleteQuestion({ id: q.id })}>Supprimer</Button>
              </>
            )}
          </div>
        </div>
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          <div className="text-sm text-muted-foreground">Options</div>
          <div className="flex flex-wrap gap-2">
            {options.map((opt, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 rounded bg-muted px-2 py-1 text-sm">
                {opt}
                <button className="text-destructive" onClick={(e) => { e.stopPropagation(); const next = options.filter((_, i) => i !== idx); saveQuestion({ id: q.id, formId, title, options: next }); }}>×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={optValue} onChange={(e) => setOptValue(e.target.value)} className="flex-1 rounded border px-2 py-1" placeholder="Nouvelle option" />
            <Button size="sm" onClick={(e) => { e.stopPropagation(); if (!optValue.trim()) return; const next = [...options, optValue.trim()]; setOptValue(""); saveQuestion({ id: q.id, formId, title, options: next }); }}>Ajouter</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddQuestionDialog({ onAdd, disabled }: { onAdd: (values: { title: string; options: string[] }) => void; disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [option, setOption] = React.useState("");
  const [options, setOptions] = React.useState<string[]>([]);
  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), options });
    setTitle("");
    setOption("");
    setOptions([]);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={disabled}>Ajouter une question</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle question</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm">Intitulé</label>
            <input className="mt-1 w-full rounded border px-2 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Options (QCM)</label>
            <div className="flex gap-2 mt-1">
              <input className="flex-1 rounded border px-2 py-2" value={option} onChange={(e) => setOption(e.target.value)} placeholder="Ajouter une option" />
              <Button type="button" onClick={() => { if (!option.trim()) return; setOptions((prev) => [...prev, option.trim()]); setOption(""); }}>Ajouter</Button>
            </div>
            {!!options.length && (
              <div className="mt-2 flex flex-wrap gap-2">
                {options.map((o, i) => (
                  <span key={i} className="inline-flex items-center gap-2 rounded bg-muted px-2 py-1 text-sm">
                    {o}
                    <button className="text-destructive" onClick={() => setOptions((prev) => prev.filter((_, idx) => idx !== i))}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={submit} disabled={disabled}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


