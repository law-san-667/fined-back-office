import { shouldLog } from "@/config/global";
import { supabase } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const postTagsRouter = createTRPCRouter({
  getTags: privateProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabase
      .from("post_tags")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (shouldLog) console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Une erreur est survenue lors de la récupération des tags",
      });
    }

    if (!data) {
      if (shouldLog) console.error("No data found in post_tags");
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Aucun tag n'a été trouvé",
      });
    }

    return data;
  }),
  createTag: privateProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, slug } = input;

      const { data, error } = await supabase
        .from("post_tags")
        .select("*")
        .match({ slug });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération du tag",
        });
      }

      if (data.length > 0) {
        if (shouldLog) console.error("Tag already exists");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le tag existe déjà",
        });
      }

      const { error: insertError } = await supabase.from("post_tags").insert({
        name,
        slug,
      });

      if (insertError) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la création du tag",
        });
      }

      return true;
    }),
  updateTag: privateProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        prev: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, slug, prev } = input;

      const { data: foundTag, error: tagError } = await supabase
        .from("post_tags")
        .select("*")
        .match({ slug });

      if (tagError) {
        if (shouldLog) console.error(tagError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération du tag",
        });
      }

      if (foundTag.length > 0) {
        if (shouldLog) console.error("Tag already exists");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le tag existe déjà",
        });
      }

      const { error: updateError } = await supabase
        .from("post_tags")
        .update({ name, slug })
        .match({ slug: prev });

      if (updateError) {
        if (shouldLog) console.error(updateError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la mise à jour du tag",
        });
      }

      return true;
    }),
  deleteSelectedTags: privateProcedure
    .input(z.object({ slugs: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { slugs } = input;

      for (const slug of slugs) {
        const { error } = await supabase
          .from("post_tags")
          .delete()
          .match({ slug });

        if (error) {
          if (shouldLog) console.error(error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Une erreur est survenue lors de la suppression du tag",
          });
        }
      }

      return true;
    }),
  deleteTag: privateProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { slug } = input;

      const { data, error } = await supabase
        .from("post_tags")
        .select("*")
        .match({ slug });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération du tag",
        });
      }

      if (!data) {
        if (shouldLog) console.error("No data found in post_tags");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Aucun tag n'a été trouvé",
        });
      }

      const { error: deleteError } = await supabase
        .from("post_tags")
        .delete()
        .match({ slug });

      if (deleteError) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la suppression du tag",
        });
      }

      return true;
    }),
});
