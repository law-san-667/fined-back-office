import { orgsRouter } from "./_procedures/orgs";
import { packTagsRouter } from "./_procedures/pack-tags";
import { packsRouter } from "./_procedures/packs";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  orgs: orgsRouter,
  packs: packsRouter,
  packTags: packTagsRouter,
});

export type AppRouter = typeof appRouter;
