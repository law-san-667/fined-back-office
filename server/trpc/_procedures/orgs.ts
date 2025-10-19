import { shouldLog } from "@/config/global";
import { SocialLinks } from "@/config/types";
import { orgSchema } from "@/lib/validators";
import { supabase } from "@/server/supabase";
import api from "@/server/api";
import { cookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const orgsRouter = createTRPCRouter({
  getOrgs: privateProcedure.query(async ({ ctx }) => {
    const { data, error } = await (supabase as any)
      .from("organizations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (shouldLog) console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Une erreur est survenue lors de la récupération des organisations",
      });
    }

    if (!data) {
      if (shouldLog) console.error("No data found in organizations");
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Aucune organisation n'a été trouvée",
      });
    }

    // data.socialLinks is JSON
    // We need to convert it to an object that respects the schema
    let finalOrgs: {
      created_at: string | null;
      description: string | null;
      domain: string;
      id: string;
      logo: string | null;
      name: string;
      social_links: SocialLinks | null;
      updated_at: string | null;
      website: string | null;
    }[] = [];

    for (const org of data) {
      const socials = org.social_links as SocialLinks;

      finalOrgs.push({
        ...org,
        social_links: socials,
      });
    }

    return finalOrgs;
  }),
  createOrg: privateProcedure
    .input(orgSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, description, logo, website, social_links } = input;

      const { data: foundOrg, error: orgError } = await (supabase as any)
        .from("organizations")
        .select("id")
        .match({ name });

      if (orgError) {
        if (shouldLog) console.error(orgError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération de l'organisation",
        });
      }

      if (foundOrg.length > 0) {
        if (shouldLog) console.error("Org already exists");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "L'organisation existe déjà",
        });
      }

      const { error: createError } = await (supabase as any)
        .from("organizations")
        .insert(input);

      if (createError) {
        if (shouldLog)
          console.error(
            `Something went wrong when trying to create the org`,
            createError
          );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la création de l'organisation",
        });
      }

      return true;
    }),
  updateOrg: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: orgSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const { data: foundOrg, error: orgError } = await (supabase as any)
        .from("organizations")
        .select("id")
        .match({ id });

      if (orgError) {
        if (shouldLog) console.error(orgError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération de l'organisation",
        });
      }

      if (!foundOrg) {
        if (shouldLog) console.error("No data found in organizations");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "L'organisation n'a pas été trouvée",
        });
      }

      const { error: updateError } = await (supabase as any)
        .from("organizations")
        .update(data)
        .match({ id });

      if (updateError) {
        if (shouldLog)
          console.error(
            `Something went wrong when updating the org:`,
            updateError
          );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la mise à jour de l'organisation",
        });
      }

      return true;
    }),
  deleteSelectedOrgs: privateProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;

      for (const id of ids) {
        const { error } = await (supabase as any)
          .from("organizations")
          .delete()
          .match({ id });

        if (error) {
          if (shouldLog) console.error(error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Une erreur est survenue lors de la suppression de l'organisation",
          });
        }
      }

      return true;
    }),
  deleteOrg: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const { data, error } = await (supabase as any)
        .from("organizations")
        .select("*")
        .match({ id });

      if (error) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la récupération de l'organisation",
        });
      }

      if (!data) {
        if (shouldLog) console.error("No data found in organizations");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Aucune organisation n'a été trouvée",
        });
      }

      const { error: deleteError } = await (supabase as any)
        .from("organizations")
        .delete()
        .match({ id });

      if (deleteError) {
        if (shouldLog) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Une erreur est survenue lors de la suppression de l'organisation",
        });
      }

      return true;
    }),
  // For system admins (org_id null): invite an org admin by choosing orgId explicitly
  inviteAdminForOrg: privateProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
        orgId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isSystemAdmin = ctx.data?.adminAccount?.org_id === null;

      if (!isSystemAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Réservé aux admins système" });
      }

      try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;
        const res = await api.post(
          "/auth/admin/invite",
          {
            email: input.email,
            name: input.name,
            orgId: input.orgId,
          },
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );

        if (res.data?.error) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: res.data.error });
        }

        return true;
      } catch (e: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: e?.response?.data?.error || e.message || "Invitation échouée",
        });
      }
    }),
});
