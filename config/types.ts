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
