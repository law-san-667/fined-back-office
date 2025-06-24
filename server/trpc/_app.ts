import { docsRouter } from "./_procedures/docs";
import { orgsRouter } from "./_procedures/orgs";
import { packTagsRouter } from "./_procedures/pack-tags";
import { packsRouter } from "./_procedures/packs";
import { videosRouter } from "./_procedures/videos";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  orgs: orgsRouter,
  packs: packsRouter,
  packTags: packTagsRouter,
  docs: docsRouter,
  videos: videosRouter,
});

export type AppRouter = typeof appRouter;
