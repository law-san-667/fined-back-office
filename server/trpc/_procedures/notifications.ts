import api from "@/server/api";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

const notificationSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  body: z.string().min(1, "Le corps du message est requis"),
  data: z.record(z.any()).optional(),
  sound: z.string().optional(),
  badge: z.number().optional(),
  priority: z.enum(["default", "normal", "high"]).optional(),
  ttl: z.number().optional(),
  channelId: z.string().optional(),
});

const specificNotificationSchema = notificationSchema.extend({
  token: z.string().min(1, "Le token Expo est requis"),
});

export const notificationsRouter = createTRPCRouter({
  // Envoyer une notification générale à tous les utilisateurs
  sendGeneralNotification: privateProcedure
    .input(notificationSchema)
    .mutation(async ({ input }) => {
      try {
        const response = await api.post("/notifications/general", input);
        
        if (response.data.error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.data.error,
          });
        }

        return response.data.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.response?.data?.error || error.message || "Erreur lors de l'envoi de la notification",
        });
      }
    }),

  // Envoyer une notification à un utilisateur spécifique
  sendSpecificNotification: privateProcedure
    .input(specificNotificationSchema)
    .mutation(async ({ input }) => {
      try {
        const response = await api.post("/notifications/to", input);
        
        if (response.data.error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.data.error,
          });
        }

        return response.data.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.response?.data?.error || error.message || "Erreur lors de l'envoi de la notification",
        });
      }
    }),
});

