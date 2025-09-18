import { shouldLog } from "@/config/global";
import { supabase } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const usersRouter = createTRPCRouter({
  getUsers: privateProcedure.query(async ({ ctx }) => {
    const userOrgId = ctx.data?.adminAccount.org_id;

    let query = await (supabase as any)
      .from("users")
      .select(`
        *,
        customer_accounts (*)
      `)
      .order("created_at", { ascending: false });

    // Filter users based on organization
    if (userOrgId) {
      // If user has org, only show customer_accounts with matching org
      query = query.not("customer_accounts", "is", null);
    }

    const { data, error } = await query;

    if (error) {
      if (shouldLog) console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Une erreur est survenue lors de la récupération des utilisateurs",
      });
    }

    if (!data) {
      if (shouldLog) console.error("No data found in users");
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Aucun utilisateur n'a été trouvé",
      });
    }

    // Additional filtering for users with org (filter by org in customer_accounts)
    let filteredData = data;
    if (userOrgId) {
      filteredData = data.filter((user: any) =>
        user.customer_accounts &&
        user.customer_accounts.orgs &&
        user.customer_accounts.orgs.includes(userOrgId)
      );
    }

    return filteredData;
  }),

  getUser: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { data, error } = await (supabase as any)
        .from("users")
        .select(`
          *,
          customer_accounts (*)
        `)
        .eq("id", input.id)
        .single();

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la récupération de l'utilisateur",
        });
      }

      if (!data) {
        if (shouldLog) console.error("No user found with this id");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Utilisateur non trouvé",
        });
      }

      return data;
    }),

  deleteUser: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await (supabase as any)
        .from("users")
        .delete()
        .eq("id", input.id);

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la suppression de l'utilisateur",
        });
      }

      return true;
    }),

  deleteSelectedUsers: privateProcedure
    .input(
      z.object({
        ids: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await (supabase as any)
        .from("users")
        .delete()
        .in("id", input.ids);

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la suppression des utilisateurs",
        });
      }

      return true;
    }),

  togglePremiumStatus: privateProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        isPremium: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await (supabase as any)
        .from("customer_accounts")
        .update({ is_premium: input.isPremium })
        .eq("user_id", input.userId);

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de la mise à jour du statut premium",
        });
      }

      return true;
    }),

});
