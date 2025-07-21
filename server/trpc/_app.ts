import { docsRouter } from "./_procedures/docs";
import { forumChannelsRouter } from "./_procedures/forum-channels";
import { orgsRouter } from "./_procedures/orgs";
import { packTagsRouter } from "./_procedures/pack-tags";
import { packsRouter } from "./_procedures/packs";
import { postTagsRouter } from "./_procedures/post-tags";
import { videosRouter } from "./_procedures/videos";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  orgs: orgsRouter,
  packs: packsRouter,
  packTags: packTagsRouter,
  postTags: postTagsRouter,
  docs: docsRouter,
  videos: videosRouter,
  forumChannels: forumChannelsRouter,
});

export type AppRouter = typeof appRouter;
