import { shouldLog } from "@/config/global";
import { newsSchema } from "@/lib/validators";
import { supabase } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const newsRouter = createTRPCRouter({
  getNews: privateProcedure.query(async ({ ctx }) => {
    const { data, error } = await (supabase as any)
      .from("news")
      .select("*, category(*)")
      .order("created_at", { ascending: false });

    if (error) {
      if (shouldLog) console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Une erreur est survenue lors de la récupération des article",
      });
    }

    if (!data) {
      if (shouldLog) console.error("No data found in article");
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Aucun article n'a été trouvé",
      });
    }

    return data;
  }),
  getNew: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const { data, error } = await (supabase as any)
        .from("news")
        .select("*")
        .match({ id })
        .single();

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération de l'article",
        });
      }

      if (!data) {
        if (shouldLog) console.error("No data found in article");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Aucun article n'a été trouvé",
        });
      }

      return data;
    }),
  createNews: privateProcedure
    .input(newsSchema)
    .mutation(async ({ ctx, input }) => {
      const { data: foundNews, error: foundNewsError } = await (supabase as any)
        .from("news")
        .select("*")
        .match({
          title: input.title,
        });

      if (foundNewsError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la recherche de l'article",
        });
      }

      if (foundNews.length > 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "L'article existe déjà",
        });
      }

      const { data: created, error: createError } = await (supabase as any)
        .from("news")
        .insert(input)
        .select();

      if (createError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la création de l'article",
        });
      }

      if (!created) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "L'article n'a pas pu être créé",
        });
      }

      return created[0];
    }),
  updateNews: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: newsSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const { data: foundNews, error: foundNewsError } = await (supabase as any)
        .from("news")
        .select("*")
        .match({ id });

      if (foundNewsError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la recherche de l'article",
        });
      }

      if (foundNews.length <= 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "L'article n'a pas été trouvé",
        });
      }

      const { data: newsExists, error: newsExistsError } = await (supabase as any)
        .from("news")
        .select("*")
        .eq("title", data.title)
        .eq("category", data.category)
        .neq("id", id);

      if (newsExistsError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la recherche de l'article",
        });
      }

      if (newsExists.length > 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Un article similaire existe déjà",
        });
      }

      const { data: updated, error: updateError } = await (supabase as any)
        .from("news")
        .update(data)
        .match({ id })
        .select();

      if (updateError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la mise à jour de l'article",
        });
      }

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "L'article n'a pas pu être mis à jour",
        });
      }

      return updated[0];
    }),
  deleteSelectedNews: privateProcedure
    .input(z.object({ ids: z.array(z.string().uuid()) }))
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;

      for (const id of ids) {
        const { error } = await (supabase as any).from("news").delete().match({ id });

        if (error) {
          if (shouldLog) console.error(error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Une erreur est survenue lors de la suppression de l'article",
          });
        }
      }

      return true;
    }),
  deleteNews: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const { error } = await (supabase as any).from("news").delete().match({ id });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la suppression du article",
        });
      }

      return true;
    }),
});
