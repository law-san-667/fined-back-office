import { shouldLog } from "@/config/global";
import { documentSchema } from "@/lib/validators";
import { supabase } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const docsRouter = createTRPCRouter({
  getDocs: privateProcedure
    .input(
      z.object({
        packId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { data, error } = await supabase
        .from("pack_documents")
        .select("*")
        .match({ pack_id: input.packId })
        .order("created_at", { ascending: false });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération des documents",
        });
      }

      if (!data) {
        if (shouldLog) console.error("No data found in documents");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Aucun document n'a été trouvé",
        });
      }

      return data;
    }),
  createDoc: privateProcedure
    .input(
      z.object({
        packId: z.string().uuid(),
        data: documentSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { packId, data } = input;

      const { data: foundPack, error: packError } = await supabase
        .from("packs")
        .select("id")
        .match({ id: packId });

      if (packError) {
        if (shouldLog) console.error(packError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération du pack",
        });
      }

      if (!foundPack) {
        if (shouldLog) console.error("No data found in packs");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le pack n'a pas été trouvé",
        });
      }

      const { data: foundDoc, error: docError } = await supabase
        .from("pack_documents")
        .select("id")
        .match({ pack_id: packId, title: data.title });

      if (docError) {
        if (shouldLog) console.error(docError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération du document",
        });
      }

      if (foundDoc && foundDoc.length > 0) {
        if (shouldLog) console.error("Document already exists");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le document existe déjà",
        });
      }

      const { data: lastDoc, error: lastDocError } = await supabase
        .from("pack_documents")
        .select("order")
        .match({ pack_id: packId })
        .order("order", { ascending: false })
        .limit(1);

      if (lastDocError) {
        if (shouldLog) console.error(lastDocError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération du dernier document",
        });
      }

      if (!lastDoc) {
        if (shouldLog) console.error("No data found in documents");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Nous n'avons pas pu trouvé le dernier document",
        });
      }

      const { title, description, url, pageCount, thumbnail } = data;

      const newOrder =
        lastDoc[0] && lastDoc[0].order > 0 ? lastDoc[0].order + 1 : 0;

      const { data: createdDoc, error: createError } = await supabase
        .from("pack_documents")
        .insert({
          title,
          description,
          url,
          page_count: pageCount,
          thumbnail,
          pack_id: packId,
          order: newOrder,
        })
        .select("*");

      if (createError) {
        if (shouldLog)
          console.error(
            `Something went wrong when trying to create the doc`,
            createError
          );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la création du document",
        });
      }

      if (!createdDoc) {
        if (shouldLog) console.error("No data found in documents");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le document n'a pas pu être créé",
        });
      }

      return createdDoc[0];
    }),
  updateDoc: privateProcedure
    .input(
      z.object({
        packId: z.string().uuid(),
        docId: z.string().uuid(),
        data: documentSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { packId, docId, data } = input;

      const { data: foundPack, error: packError } = await supabase
        .from("packs")
        .select("id")
        .match({ id: packId });

      if (packError) {
        if (shouldLog) console.error(packError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération du pack",
        });
      }

      if (!foundPack) {
        if (shouldLog) console.error("No data found in packs");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le pack n'a pas été trouvé",
        });
      }

      const { data: foundDoc, error: docError } = await supabase
        .from("pack_documents")
        .select("id")
        .match({ pack_id: packId, id: docId });

      if (docError) {
        if (shouldLog) console.error(docError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération du document",
        });
      }

      if (!foundDoc) {
        if (shouldLog) console.error("No data found in pack_documents");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le document n'a pas été trouvé",
        });
      }

      const { data: updatedDoc, error: updateError } = await supabase
        .from("pack_documents")
        .update({
          title: data.title,
          description: data.description,
          url: data.url,
          page_count: data.pageCount,
        })
        .match({ pack_id: packId, id: docId })
        .select("*");

      if (updateError) {
        if (shouldLog)
          console.error(
            `Something went wrong when updating the doc:`,
            updateError
          );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la mise à jour du document",
        });
      }

      if (!updatedDoc) {
        if (shouldLog) console.error("No data found in documents");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le document n'a pas été trouvé",
        });
      }

      return updatedDoc[0];
    }),
  deleteDoc: privateProcedure
    .input(
      z.object({
        packId: z.string().uuid(),
        docId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { packId, docId } = input;

      const { error } = await supabase
        .from("pack_documents")
        .delete()
        .match({ pack_id: packId, id: docId });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la suppression du document",
        });
      }

      // TODO: Delete the thumbnail and url

      return true;
    }),
});
