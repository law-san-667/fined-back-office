"use client";

import { orgsColumns } from "@/components/data-tables/orgs/orgs-columns";
import { OrgsTable } from "@/components/data-tables/orgs/orgs-table";
import TableSkeleton from "@/components/table-skeleton";
import { trpc } from "@/server/trpc/client";
import React from "react";

type DashboardOrgsPageProps = {};

const DashboardOrgsPage: React.FC<DashboardOrgsPageProps> = ({}) => {
  const { data: orgs, isLoading } = trpc.orgs.getOrgs.useQuery();

  if (isLoading)
    return (
      <div className="px-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="px-4">
      <OrgsTable columns={orgsColumns} data={orgs || []} />
    </div>
  );
};

export default DashboardOrgsPage;
