import { orgsRouter } from "./_procedures/orgs";
import { packTagsRouter } from "./_procedures/pack-tags";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  orgs: orgsRouter,
  packTags: packTagsRouter,
});

export type AppRouter = typeof appRouter;
