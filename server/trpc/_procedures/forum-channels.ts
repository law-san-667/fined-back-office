import { shouldLog } from "@/config/global";
import { forumChannelSchema } from "@/lib/validators";
import { supabase } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const forumChannelsRouter = createTRPCRouter({
  getChannels: privateProcedure.query(async ({ ctx }) => {
    const { data, error } = await (supabase as any).from("forum_channels").select("*");

    if (error) {
      if (shouldLog) console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Une erreur est survenue lors de la récupération des channels",
      });
    }

    if (!data) {
      if (shouldLog) console.error("No data found in forum_channels");
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Aucun groupe n'a été trouvé",
      });
    }

    return data;
  }),
  getChannel: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await (supabase as any)
        .from("channel_messages")
        .select("*, users(*)")
        .eq("channel_id", input.id)
        .order("created_at", { ascending: false });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération du channel",
        });
      }

      if (!data) {
        if (shouldLog) console.error("No data found in forum_channels");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Aucun groupe n'a été trouvé",
        });
      }

      const { data: channel, error: channelError } = await (supabase as any)
        .from("forum_channels")
        .select("*")
        .eq("id", input.id)
        .single();

      if (channelError) {
        if (shouldLog) console.error(channelError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération du groupe",
        });
      }

      if (!channel) {
        if (shouldLog) console.error("No data found in forum_channels");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Aucun groupe n'a été trouvé",
        });
      }

      return {
        channel,
        messages: data,
      };
    }),
  deleteChannelMessage: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await (supabase as any)
        .from("channel_messages")
        .delete()
        .match({ id: input.id });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la suppression du message",
        });
      }

      return true;
    }),
  createChannel: privateProcedure
    .input(forumChannelSchema)
    .mutation(async ({ ctx, input }) => {
      const { data: foundChannel, error: foundChannelError } = await (supabase as any)
        .from("forum_channels")
        .select("id")
        .match({
          name: input.name,
        });

      if (foundChannelError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la recherche du channel",
        });
      }

      if (foundChannel.length > 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le groupe existe déjà",
        });
      }

      const { data, error: createError } = await (supabase as any)
        .from("forum_channels")
        .insert({
          name: input.name,
          description: input.description,
          color: input.color,
        })
        .select("id")
        .select();

      if (createError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la création du channel",
        });
      }

      if (!data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le groupe n'a pas pu être créé",
        });
      }

      return data[0];
    }),
  updateChannel: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        values: forumChannelSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data: foundChannel, error: foundChannelError } = await (supabase as any)
        .from("forum_channels")
        .select("id")
        .match({
          id: input.id,
        });

      if (foundChannelError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la recherche du channel",
        });
      }

      if (foundChannel.length <= 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Ce groupe n'existe pas",
        });
      }

      const { data: channelExists, error: channelExistsError } = await (supabase as any)
        .from("forum_channels")
        .select("id")
        .eq("name", input.values.name)
        .neq("id", input.id);

      if (channelExistsError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la recherche du channel",
        });
      }

      if (channelExists.length > 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Un groupe avec ce nom existe déjà",
        });
      }

      const { data, error: updateError } = await (supabase as any)
        .from("forum_channels")
        .update({
          name: input.values.name,
          description: input.values.description,
          color: input.values.color,
        })
        .match({ id: input.id })
        .select();

      if (updateError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la mise à jour du channel",
        });
      }

      if (!data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Le groupe n'a pas pu être mis à jour",
        });
      }

      return data[0];
    }),
  deleteSelectedChannels: privateProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;

      for (const id of ids) {
        const { error } = await (supabase as any)
          .from("forum_channels")
          .delete()
          .match({ id });

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
  deleteChannel: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const { error } = await (supabase as any)
        .from("forum_channels")
        .delete()
        .match({ id });

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
