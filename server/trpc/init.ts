import { BackendResponse } from "@/config/types";
import { initTRPC, TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import api from "../api";

export const createTRPCContext = cache(async () => {});

const t = initTRPC.create({
  transformer: superjson,
});
const middleWare = t.middleware;

// TODO: Add rate limiting

const isAuth = t.middleware(async (opts) => {
  // Read cookies on the server
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")?.value;
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Call backend with explicit Authorization header
  const res = await api.get<
    BackendResponse<{
      user: {
        id: string;
        email: string;
        created_at: string;
        updated_at: string;
        last_login: string;
        last_logout: string | null;
      };
      adminAccount: {
        id: string;
        user_id: string;
        name: string;
        org_id: string | null;
        is_admin: boolean;
        created_at: string;
        updated_at: string;
      };
    }>
  >("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return opts.next({
    ctx: { data: res.data.data },
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
