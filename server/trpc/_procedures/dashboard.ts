import { shouldLog } from "@/config/global";
import { supabase } from "@/server/supabase";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../init";

export const dashboardRouter = createTRPCRouter({
  getStats: privateProcedure.query(async ({ ctx }) => {
    const userOrgId = ctx.data?.adminAccount.org_id;

    try {
      // Get users count based on whether current user has an org
      let usersCount = 0;
      
      if (userOrgId) {
        // If user has an org, count customer_accounts with matching org
        const { data: customerAccountsData, error: usersError } = await supabase
          .from("customer_accounts")
          .select("id, orgs");

        if (usersError) {
          if (shouldLog) console.error("Error counting customer accounts:", usersError);
        } else if (customerAccountsData) {
          // Filter customer accounts that contain the user's org
          usersCount = customerAccountsData.filter(account => 
            account.orgs && account.orgs.includes(userOrgId)
          ).length;
        }
      } else {
        // If user has no org, count all active customer_accounts (those without orgs)
        const { data: customerAccountsData, error: usersError } = await supabase
          .from("customer_accounts")
          .select("id, orgs");

        if (usersError) {
          if (shouldLog) console.error("Error counting customer accounts:", usersError);
        } else if (customerAccountsData) {
          // Count customer accounts without orgs (null or empty array)
          usersCount = customerAccountsData.filter(account => 
            !account.orgs || account.orgs.length === 0
          ).length;
        }
      }

      // Get packs count
      const { count: packsCount, error: packsError } = await supabase
        .from("packs")
        .select("*", { count: "exact", head: true });

      if (packsError) {
        if (shouldLog) console.error("Error counting packs:", packsError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors du comptage des packs",
        });
      }

      return {
        users: usersCount,
        packs: packsCount || 0,
      };
    } catch (error) {
      if (shouldLog) console.error("Error in getStats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Une erreur est survenue lors de la récupération des statistiques",
      });
    }
  }),

  getRecentForumPosts: privateProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabase
      .from("forum_posts")
      .select(`
        *,
        customer_accounts (user_id, name)
      `)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      if (shouldLog) console.error("Error fetching recent forum posts:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Une erreur est survenue lors de la récupération des posts récents",
      });
    }

    return data || [];
  }),
});
