export const dynamic = "force-dynamic";

import ErrorBoundary from "@/components/error-boundary";
import PackManagement from "@/components/pack-management";
import { HydrateClient, trpc } from "@/server/trpc/server";
import React, { Suspense } from "react";

type Params = Promise<{
  id: string;
}>;
// type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Props = {
  params: Params;
  // searchParams: SearchParams;
};

const DashboardPackManagementPage: React.FC<Props> = async (props) => {
  const { id } = await props.params;
  trpc.packs.getPack.prefetch({ id });
  trpc.packTags.getTags.prefetch();

  return (
    <div className="px-4">
      <HydrateClient>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>
            <PackManagement id={id} />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  );
};

export default DashboardPackManagementPage;
