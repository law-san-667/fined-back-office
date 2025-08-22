import { BackendResponse } from "@/config/types";
import api from "@/server/api";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../init";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await api.post<BackendResponse<null>>("/auth/login", {
        email: input.email,
      });

      if (res.data.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: res.data.error,
        });
      }

      if (res.data.success) {
        return true;
      }
    }),
  verifyLogin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await api.post<
        BackendResponse<{
          accessToken: string;
          refreshToken: string;
        }>
      >("/auth/verify-login", {
        email: input.email,
        code: input.code,
        type: "ADMIN",
      });

      if (res.data.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: res.data.error,
        });
      }

      if (res.data.success && res.data.data) {
        return res.data.data;
      }
    }),
  me: privateProcedure.query(async ({ ctx }) => {
    return ctx.data;
  }),
  logout: privateProcedure.mutation(async ({ ctx }) => {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return true;
  }),
});
