import { shouldLog } from "@/config/global";
import { videoSchema } from "@/lib/validators";
import { supabase } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const videosRouter = createTRPCRouter({
  getVideos: privateProcedure
    .input(
      z.object({
        packId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { data, error } = await (supabase as any)
        .from("pack_videos")
        .select("*")
        .match({ pack_id: input.packId })
        .order("created_at", { ascending: false });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération des videos",
        });
      }

      if (!data) {
        if (shouldLog) console.error("No data found in videos");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Aucun video n'a été trouvé",
        });
      }

      return data;
    }),
  createVideo: privateProcedure
    .input(
      z.object({
        packId: z.string().uuid(),
        data: videoSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { packId, data } = input;

      const { data: foundPack, error: packError } = await (supabase as any)
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

      if (!foundPack || foundPack.length < 0) {
        if (shouldLog) console.error("No data found in packs");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le pack n'a pas été trouvé",
        });
      }

      const { data: foundVideo, error: videoError } = await (supabase as any)
        .from("pack_videos")
        .select("id")
        .match({ pack_id: packId, title: data.title });

      if (videoError) {
        if (shouldLog) console.error(videoError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération du video",
        });
      }

      if (foundVideo && foundVideo.length > 0) {
        if (shouldLog) console.error("Video already exists");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le video existe déjà",
        });
      }

      const { data: lastVideo, error: lastVideoError } = await (supabase as any)
        .from("pack_videos")
        .select("order")
        .match({ pack_id: packId })
        .order("order", { ascending: false })
        .limit(1);

      if (lastVideoError) {
        if (shouldLog) console.error(lastVideoError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération du dernier video",
        });
      }

      if (!lastVideo) {
        if (shouldLog) console.error("No data found in videos");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Nous n'avons pas pu trouvé le dernier video",
        });
      }

      const { title, description, url, duration, thumbnail } = data;

      const newOrder =
        lastVideo[0] && lastVideo[0].order > 0 ? lastVideo[0].order + 1 : 0;

      const { data: createdVideo, error: createError } = await (supabase as any)
        .from("pack_videos")
        .insert({
          title,
          description,
          url: url ?? "",
          duration: duration ?? 0,
          thumbnail,
          pack_id: packId,
          order: newOrder,
        })
        .select("*");

      if (createError) {
        if (shouldLog)
          console.error(
            `Something went wrong when trying to create the video`,
            createError
          );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la création du video",
        });
      }

      if (!createdVideo) {
        if (shouldLog) console.error("No data found in videos");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le video n'a pas pu être créé",
        });
      }

      return createdVideo[0];
    }),
  updateVideo: privateProcedure
    .input(
      z.object({
        packId: z.string().uuid(),
        videoId: z.string().uuid(),
        data: videoSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { packId, videoId, data } = input;

      const { data: foundPack, error: packError } = await (supabase as any)
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

      if (!foundPack || foundPack.length < 0) {
        if (shouldLog) console.error("No data found in packs");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le pack n'a pas été trouvé",
        });
      }

      const { data: foundVideo, error: videoError } = await (supabase as any)
        .from("pack_videos")
        .select("id")
        .match({ pack_id: packId, id: videoId });

      if (videoError) {
        if (shouldLog) console.error(videoError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération du video",
        });
      }

      if (!foundVideo) {
        if (shouldLog) console.error("No data found in videos");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le video n'a pas été trouvé",
        });
      }

      const { data: updatedVideo, error: updateError } = await (supabase as any)
        .from("pack_videos")
        .update({
          title: data.title,
          description: data.description,
          url: data.url ?? "",
          duration: data.duration,
          thumbnail: data.thumbnail,
        })
        .match({ pack_id: packId, id: videoId })
        .select("*");

      if (updateError) {
        if (shouldLog)
          console.error(
            `Something went wrong when updating the video:`,
            updateError
          );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la mise à jour du video",
        });
      }

      if (!updatedVideo) {
        if (shouldLog) console.error("No data found in videos");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le video n'a pas été trouvé",
        });
      }

      return updatedVideo[0];
    }),
  deleteVideo: privateProcedure
    .input(
      z.object({
        packId: z.string().uuid(),
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { packId, videoId } = input;

      const { error } = await (supabase as any)
        .from("pack_videos")
        .delete()
        .match({ pack_id: packId, id: videoId });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la suppression du video",
        });
      }

      // TODO: Delete the thumbnail and url

      return true;
    }),
});
