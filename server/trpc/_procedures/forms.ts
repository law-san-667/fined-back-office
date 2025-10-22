import { shouldLog } from "@/config/global";
import { supabase } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

// Guards: only system admins (org_id === null)
function assertSystemAdmin(ctx: any) {
  if (ctx.data?.adminAccount?.org_id !== null) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Accès réservé aux administrateurs système",
    });
  }
}

export const formsRouter = createTRPCRouter({
  // Create a new form
  createForm: privateProcedure
    .input(z.object({ name: z.string().min(1), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      assertSystemAdmin(ctx);
      const { data, error } = await (supabase as any)
        .from("forms")
        .insert({ name: input.name, description: input.description ?? null })
        .select("*")
        .maybeSingle();
      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors de la création du formulaire" });
      }
      return data;
    }),

  // Delete a form
  deleteForm: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      assertSystemAdmin(ctx);
      const { error } = await (supabase as any)
        .from("forms")
        .delete()
        .eq("id", input.id);
      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors de la suppression du formulaire" });
      }
      return { success: true };
    }),

  // List all forms
  getForms: privateProcedure.query(async ({ ctx }) => {
    assertSystemAdmin(ctx);
    const { data, error } = await (supabase as any)
      .from("forms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (shouldLog) console.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors du chargement des formulaires" });
    }
    return data ?? [];
  }),

  // Get a form with its questions
  getFormWithQuestions: privateProcedure
    .input(z.object({ formId: z.number() }))
    .query(async ({ ctx, input }) => {
      assertSystemAdmin(ctx);
      const [{ data: form, error: formErr }, { data: questions, error: qErr }] = await Promise.all([
        (supabase as any).from("forms").select("*").eq("id", input.formId).maybeSingle(),
        (supabase as any)
          .from("form_questions")
          .select("id, form_id, title, options, created_at")
          .eq("form_id", input.formId)
          .order("id", { ascending: true }),
      ]);

      if (formErr || qErr) {
        if (shouldLog) console.error(formErr || qErr);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors du chargement du formulaire" });
      }
      if (!form) throw new TRPCError({ code: "NOT_FOUND", message: "Formulaire introuvable" });

      return { form, questions: questions ?? [] };
    }),

  // CRUD Questions (basic create/update/delete)
  upsertQuestion: privateProcedure
    .input(
      z.object({
        id: z.number().optional(),
        formId: z.number(),
        title: z.string().min(1),
        options: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertSystemAdmin(ctx);
      const payload: any = {
        form_id: input.formId,
        title: input.title,
        options: input.options ?? [],
      };

      const { data, error } = input.id
        ? await (supabase as any)
            .from("form_questions")
            .update(payload)
            .eq("id", input.id)
            .select("*")
            .maybeSingle()
        : await (supabase as any)
            .from("form_questions")
            .insert(payload)
            .select("*")
            .maybeSingle();

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors de l'enregistrement de la question" });
      }
      return data;
    }),

  deleteQuestion: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      assertSystemAdmin(ctx);
      const { error } = await (supabase as any)
        .from("form_questions")
        .delete()
        .eq("id", input.id);
      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors de la suppression de la question" });
      }
      return { success: true };
    }),

  // Responses
  getFormRespondents: privateProcedure
    .input(z.object({ formId: z.number() }))
    .query(async ({ ctx, input }) => {
      assertSystemAdmin(ctx);
      // 1) find question ids for this form
      const { data: qs, error: qErr } = await (supabase as any)
        .from("form_questions")
        .select("id")
        .eq("form_id", input.formId);
      if (qErr) {
        if (shouldLog) console.error(qErr);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors du chargement des questions" });
      }
      const ids = (qs ?? []).map((x: any) => x.id);
      if (ids.length === 0) return [];
      // 2) fetch distinct users who answered these questions
      const { data, error } = await (supabase as any)
        .from("form_answers")
        .select("user_id, created_at")
        .in("question_id", ids)
        .order("created_at", { ascending: false });
      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors du chargement des répondants" });
      }
      const byUser: Record<string, { user_id: string; last_answer_at: string; count: number }> = {};
      for (const row of data ?? []) {
        const key = row.user_id;
        if (!byUser[key]) byUser[key] = { user_id: key, last_answer_at: row.created_at, count: 0 } as any;
        byUser[key].count += 1;
        if (new Date(row.created_at) > new Date(byUser[key].last_answer_at)) byUser[key].last_answer_at = row.created_at;
      }
      const usersIds = Object.keys(byUser);
      if (usersIds.length === 0) return [];
      const { data: users, error: uErr } = await (supabase as any)
        .from("users")
        .select("id, email, customer_accounts (name)")
        .in("id", usersIds);
      if (uErr) {
        if (shouldLog) console.error(uErr);
      }
      const usersMap: Record<string, { name?: string; email?: string }> = {};
      for (const u of users ?? []) {
        const ca = (u as any).customer_accounts;
        const name = Array.isArray(ca) ? ca[0]?.name : ca?.name;
        usersMap[u.id] = { name: name ?? undefined, email: (u as any).email };
      }
      return Object.values(byUser).map((r) => ({
        ...r,
        name: usersMap[r.user_id]?.name || usersMap[r.user_id]?.email || r.user_id,
      }));
    }),

  getResponseDetail: privateProcedure
    .input(z.object({ formId: z.number(), userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      assertSystemAdmin(ctx);
      // questions for the form
      const { data: qs, error: qErr } = await (supabase as any)
        .from("form_questions")
        .select("id, title, options")
        .eq("form_id", input.formId)
        .order("id", { ascending: true });
      if (qErr) {
        if (shouldLog) console.error(qErr);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors du chargement des questions" });
      }
      const qIds = (qs ?? []).map((x: any) => x.id);
      if (qIds.length === 0) return { answers: [] };
      // answers by this user for these questions
      const { data: ans, error: aErr } = await (supabase as any)
        .from("form_answers")
        .select("question_id, selected_index, created_at")
        .in("question_id", qIds)
        .eq("user_id", input.userId);
      if (aErr) {
        if (shouldLog) console.error(aErr);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors du chargement des réponses" });
      }
      const answers = (qs ?? []).map((q: any) => {
        const a = (ans ?? []).find((x: any) => x.question_id === q.id);
        const selectedOption = typeof a?.selected_index === "number" && Array.isArray(q.options)
          ? q.options[a.selected_index] ?? null
          : null;
        return {
          questionId: q.id,
          title: q.title,
          selectedIndex: a?.selected_index ?? null,
          selectedOption,
        };
      });
      return { answers };
    }),
});


