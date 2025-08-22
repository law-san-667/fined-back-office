import { authRouter } from "./_procedures/auth";
import { docsRouter } from "./_procedures/docs";
import { forumChannelsRouter } from "./_procedures/forum-channels";
import { forumPostsRouter } from "./_procedures/forum-posts";
import { newsRouter } from "./_procedures/news";
import { newsTagsRouter } from "./_procedures/news-tags";
import { orgsRouter } from "./_procedures/orgs";
import { packTagsRouter } from "./_procedures/pack-tags";
import { packsRouter } from "./_procedures/packs";
import { postTagsRouter } from "./_procedures/post-tags";
import { videosRouter } from "./_procedures/videos";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  orgs: orgsRouter,
  packs: packsRouter,
  docs: docsRouter,
  videos: videosRouter,
  news: newsRouter,
  forumChannels: forumChannelsRouter,
  forumPosts: forumPostsRouter,
  packTags: packTagsRouter,
  postTags: postTagsRouter,
  newsTags: newsTagsRouter,
});

export type AppRouter = typeof appRouter;
