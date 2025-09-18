import { shouldLog } from "@/config/global";
import { forumPostSchema } from "@/lib/validators";
import { supabase } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const forumPostsRouter = createTRPCRouter({
  getPosts: privateProcedure.query(async ({ ctx }) => {
    const { data, error } = await (supabase as any)
      .from("forum_posts")
      .select("*, customer_accounts(*)");

    if (error) {
      if (shouldLog) console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Une erreur est survenue lors de la récupération des questions",
      });
    }

    if (!data) {
      if (shouldLog) console.error("No data found in forum posts");
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Aucune question n'a été trouvée",
      });
    }

    return data;
  }),
  getPost: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const { data, error } = await (supabase as any)
        .from("post_answers")
        .select("*, users(*)")
        .eq("question_id", input.id);

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération de la question",
        });
      }

      if (!data) {
        if (shouldLog) console.error("No data found in forum posts");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "La question n'a pas été trouvée",
        });
      }

      const { data: post, error: postError } = await (supabase as any)
        .from("forum_posts")
        .select("*, users(*)")
        .match({ id })
        .single();

      if (postError) {
        if (shouldLog) console.error(postError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération de la question",
        });
      }

      if (!post) {
        if (shouldLog) console.error("No data found in forum posts");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "La question n'a pas été trouvée",
        });
      }

      const tagNames = [];

      if (post.tags && post.tags.length > 0) {
        for (const tag of post.tags) {
          const { data: tagExists, error: tagExistsError } = await (supabase as any)
            .from("post_tags")
            .select("*")
            .eq("slug", tag);

          if (tagExistsError) {
            if (shouldLog) console.error(tagExistsError);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Une erreur est survenue lors de la recherche du tag",
            });
          }

          if (!tagExists) {
            if (shouldLog) console.error("No data found in forum posts");
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Le tag n'a pas été trouvé",
            });
          }

          tagNames.push(tagExists[0].name);
        }
      }

      post.tags = tagNames;

      return {
        post,
        answers: data,
      };
    }),
  createPost: privateProcedure
    .input(forumPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { data: foundPost, error: postError } = await (supabase as any)
        .from("forum_posts")
        .select("*")
        .match({
          title: input.title,
        });

      if (postError) {
        if (shouldLog) console.error(postError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la recherche de la question",
        });
      }

      if (foundPost.length > 0) {
        if (shouldLog) console.error("Question already exists");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "La question existe déjà",
        });
      }

      const { data: created, error: createError } = await (supabase as any)
        .from("forum_posts")
        .insert({
          ...input,
          user_id: "58bd8f33-a1d1-4cb2-817e-fd1ff4944fb3",
        })
        .select();

      if (createError) {
        if (shouldLog) console.error(createError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la création de la question",
        });
      }

      if (!created) {
        if (shouldLog) console.error("No data found in forum posts");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "La question n'a pas pu être créée",
        });
      }

      return created[0];
    }),
  updatePost: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        values: forumPostSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, values } = input;

      const { data: foundPost, error: postError } = await (supabase as any)
        .from("forum_posts")
        .select("*")
        .match({ id });

      if (postError) {
        if (shouldLog) console.error(postError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la recherche de la question",
        });
      }

      if (foundPost.length <= 0) {
        if (shouldLog) console.error("No data found in forum posts");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "La question n'a pas été trouvée",
        });
      }

      const { data: exists, error: existsError } = await (supabase as any)
        .from("forum_posts")
        .select("*")
        .eq("title", values.title)
        .neq("id", id);

      if (existsError) {
        if (shouldLog) console.error(existsError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la recherche de la question",
        });
      }

      if (exists.length > 0) {
        if (shouldLog) console.error("Question already exists");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une question avec ce titre existe déjà",
        });
      }

      const { data: updated, error: updateError } = await (supabase as any)
        .from("forum_posts")
        .update(values)
        .match({ id })
        .select();

      if (updateError) {
        if (shouldLog) console.error(updateError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la mise à jour de la question",
        });
      }

      if (!updated) {
        if (shouldLog) console.error("No data found in forum posts");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "La question n'a pas pu être mise à jour",
        });
      }

      return updated[0];
    }),
  deleteSelectedPosts: privateProcedure
    .input(z.object({ ids: z.array(z.string().uuid()) }))
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;

      for (const id of ids) {
        const { error } = await (supabase as any)
          .from("forum_posts")
          .delete()
          .match({ id });

        if (error) {
          if (shouldLog) console.error(error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Une erreur est survenue lors de la suppression de la question",
          });
        }
      }

      return true;
    }),
  deletePost: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const { error } = await (supabase as any)
        .from("forum_posts")
        .delete()
        .match({ id });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la suppression de la question",
        });
      }

      return true;
    }),
  deletePostAnswer: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const { error } = await (supabase as any)
        .from("post_answers")
        .delete()
        .match({ id });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la suppression de l'answer",
        });
      }

      return true;
    }),
});
