import { shouldLog } from "@/config/global";
import { initPackSchema, packDetailsSchema } from "@/lib/validators";
import { supabase } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const packsRouter = createTRPCRouter({
  getPacks: privateProcedure.query(async ({ ctx }) => {
    // TODO: Check if org, get only packs of the org
    const { data, error } = await (supabase as any)
      .from("packs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (shouldLog) console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Une erreur est survenue lors de la récupération des packs",
      });
    }

    if (!data) {
      if (shouldLog) console.error("No data found in packs");
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Aucun pack n'a été trouvé",
      });
    }

    return data;
  }),
  getPack: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const { data: pack, error: packError } = await (supabase as any)
        .from("packs")
        .select("*")
        .match({ id })
        .single();
      const { data: docs, error: docsError } = await (supabase as any)
        .from("pack_documents")
        .select("*")
        .match({ pack_id: id });
      const { data: videos, error: videosError } = await (supabase as any)
        .from("pack_videos")
        .select("*")
        .match({ pack_id: id });

      if (packError) {
        if (shouldLog) console.error(packError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération du pack",
        });
      }

      if (docsError) {
        if (shouldLog) console.error(docsError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération des documents",
        });
      }

      if (videosError) {
        if (shouldLog) console.error(videosError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération des vidéos",
        });
      }

      if (!pack) {
        if (shouldLog) console.error("No data found in packs");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Aucun pack n'a été trouvé",
        });
      }

      if (!docs) {
        if (shouldLog) console.error("No data found in pack_documents");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Aucun document n'a été trouvé",
        });
      }

      if (!videos) {
        if (shouldLog) console.error("No data found in pack_videos");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Aucune vidéo n'a été trouvée",
        });
      }

      return {
        pack,
        docs,
        videos,
      };
    }),
  initPack: privateProcedure
    .input(initPackSchema)
    .mutation(async ({ ctx, input }) => {
      const { data: foundPack, error: foundPackError } = await (supabase as any)
        .from("packs")
        .select("*")
        .match({
          title: input.title,
        });

      if (foundPackError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la recherche du pack",
        });
      }

      if (foundPack.length > 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le pack existe déjà",
        });
      }

      const { data, error: createError } = await (supabase as any)
        .from("packs")
        .insert({
          title: input.title,
          description: input.description,
          long_description: input.long_description,
          image: input.image,
          tags: input.tags,
          price: 0,
        })
        .select("id");

      if (createError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la création du pack",
        });
      }

      if (!data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le pack n'a pas pu être créé",
        });
      }

      return data[0];
    }),
    updatePack: privateProcedure.input(
      z.object({
        id: z.string().uuid(),
        data: packDetailsSchema
      })
    ).mutation(async ({input , ctx}) => {
            const { data: foundPack, error: foundPackError } = await (supabase as any)
        .from("packs")
        .select("*")
        .eq("title", input.data.title)
        .neq("id", input.id)


      if (foundPackError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la recherche du pack",
        });
      }

      if (foundPack.length > 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le pack existe déjà",
        });
      }

      const { error: updateError } = await (supabase as any)
        .from("packs")
        .update(input.data)
        .match({ id: input.id });

      if (updateError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la mise à jour du pack",
        });
      }

      return true;
    }),
    updatePackTags: privateProcedure
      .input(
        z.object({
          packId: z.string().uuid(),
          tags: z.array(z.string()).min(1, "Au moins un tag est requis"),
        })
      ).mutation(async ({ ctx, input }) => {
        const { packId, tags } = input;

        const {data: foundPack, error: packError} = await (supabase as any)
          .from("packs")
          .select("id")
          .match({ id: packId });

        if (packError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Une erreur est survenue lors de la recherche du pack",
          });
        }

        if (!foundPack || foundPack.length < 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Le pack n'a pas été trouvé",
          });
        }

        const { error: updateError } = await (supabase as any)
          .from("packs")
          .update({ tags })
          .match({ id: packId });

          if (updateError) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Une erreur est survenue lors de la mise à jour du pack",
            });
          }

        return true;
      }),
      removePackTag: privateProcedure
        .input(
          z.object({
            packId: z.string().uuid(),
            tag: z.string().min(1, "Le tag est requis"),
          })
        )
        .mutation(async ({ ctx, input }) => {
          const { packId, tag } = input;

          const {data: foundPack, error: packError} = await (supabase as any)
            .from("packs")
            .select("id, tags")
            .match({ id: packId });

          if (packError) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Une erreur est survenue lors de la recherche du pack",
            });
          }

          if (!foundPack || foundPack.length < 0) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Le pack n'a pas été trouvé",
            });
          }

          const newTags = foundPack[0].tags.filter((t: string) => t !== tag);

          const { error: updateError } = await (supabase as any)
            .from("packs")
            .update({ tags: newTags })
            .match({ id: packId });

            if (updateError) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Une erreur est survenue lors de la mise à jour du pack",
              });
            }

          return true;
        }),
  deleteSelectedPacks: privateProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;

      for (const id of ids) {
        const { error } = await (supabase as any).from("packs").delete().match({ id });

        if (error) {
          if (shouldLog) console.error(error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Une erreur est survenue lors de la suppression du pack",
          });
        }
      }

      return true;
    }),
  deletePack: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const { error } = await (supabase as any).from("packs").delete().match({ id });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la suppression du pack",
        });
      }

      return true;
    }),
});
