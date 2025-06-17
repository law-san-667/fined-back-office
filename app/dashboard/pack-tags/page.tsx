"use client";

import { packTagsColumns } from "@/components/data-tables/pack-tags/pack-tags-columns";
import { PackTagsTable } from "@/components/data-tables/pack-tags/pack-tags-table";
import TableSkeleton from "@/components/table-skeleton";
import { trpc } from "@/server/trpc/client";

import React from "react";

type DashboardTagsPageProps = {};

const DashboardTagsPage: React.FC<DashboardTagsPageProps> = ({}) => {
  const { data: tags, isLoading } = trpc.packTags.getTags.useQuery();

  if (isLoading)
    return (
      <div className="px-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="px-4">
      <PackTagsTable columns={packTagsColumns} data={tags || []} />
    </div>
  );
};

export default DashboardTagsPage;
