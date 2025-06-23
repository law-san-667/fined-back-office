import type { AppRouter } from "@/server/trpc/_app";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

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
export type PackDetailsResponse = RouterOutput["packs"]["getPack"]["pack"];
export type DocumentResponse = RouterOutput["packs"]["getPack"]["docs"][number];
