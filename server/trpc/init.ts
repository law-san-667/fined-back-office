import { initTRPC } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {});

const t = initTRPC.create({
  transformer: superjson,
});
const middleWare = t.middleware;

// TODO: Add rate limiting

const isAuth = middleWare(async (opts) => {
  // TODO: Check if user is authenticated

  return opts.next({
    ctx: {
      // db: res,
    },
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
