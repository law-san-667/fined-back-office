import type { AppRouter } from "@/server/trpc/_app";
import type { inferRouterOutputs } from "@trpc/server";
import { JWTPayload } from "jose";

export type SocialLinks = {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
};

type RouterOutput = inferRouterOutputs<AppRouter>;

export type OrgsReponse = RouterOutput["orgs"]["getOrgs"][number];
export type PacksResponse = RouterOutput["packs"]["getPacks"][number];

export type GetForumChannelsResponse =
  RouterOutput["forumChannels"]["getChannels"][number];

export type GetForumPostsResponse =
  RouterOutput["forumPosts"]["getPosts"][number];

export type GetSingleForumChannelResponse =
  RouterOutput["forumChannels"]["getChannel"]["messages"][number];

export type GetSingleForumPostAnswersResponse =
  RouterOutput["forumPosts"]["getPost"]["answers"][number];
export type GetSingleForumPostResponse =
  RouterOutput["forumPosts"]["getPost"]["post"];

export type GetNewsResponse = RouterOutput["news"]["getNews"][number];

export type PackDetailsResponse = RouterOutput["packs"]["getPack"]["pack"];
export type DocumentResponse = RouterOutput["packs"]["getPack"]["docs"][number];
export type VideoResponse = RouterOutput["packs"]["getPack"]["videos"][number];

export type BackendResponse<T> = {
  error: string | null;
  success: boolean;
  data: T | null;
};

export interface JwtPayload extends JWTPayload {
  role: "ADMIN" | "CUSTOMER";
}
