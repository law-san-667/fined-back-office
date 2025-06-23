"use client";
import { packsColumns } from "@/components/data-tables/packs/packs-columns";
import { PacksTable } from "@/components/data-tables/packs/packs-table";
import TableSkeleton from "@/components/table-skeleton";
import { trpc } from "@/server/trpc/client";
import React from "react";

type DashboardPacksPageProps = {};

const DashboardPacksPage: React.FC<DashboardPacksPageProps> = ({}) => {
  const { data: packs, isLoading } = trpc.packs.getPacks.useQuery();

  if (isLoading)
    return (
      <div className="px-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="px-4">
      <PacksTable columns={packsColumns} data={packs || []} />
    </div>
  );
};

export default DashboardPacksPage;
