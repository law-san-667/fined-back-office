"use client";

import { newsTagsColumns } from "@/components/data-tables/news-tags/news-tags-columns";
import { NewsTagsTable } from "@/components/data-tables/news-tags/news-tags-table";
import TableSkeleton from "@/components/table-skeleton";
import { trpc } from "@/server/trpc/client";

import React from "react";

type DashboardNewsTagsPageProps = {};

const DashboardNewsTagsPage: React.FC<DashboardNewsTagsPageProps> = ({}) => {
  const { data: tags, isLoading } = trpc.newsTags.getTags.useQuery();

  if (isLoading)
    return (
      <div className="px-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="px-4">
      <NewsTagsTable columns={newsTagsColumns} data={tags || []} />
    </div>
  );
};

export default DashboardNewsTagsPage;
