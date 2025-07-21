"use client";

import { postTagsColumns } from "@/components/data-tables/post-tags/post-tags-columns";
import { PostTagsTable } from "@/components/data-tables/post-tags/post-tags-table";
import TableSkeleton from "@/components/table-skeleton";
import { trpc } from "@/server/trpc/client";

import React from "react";

type DashboardTagsPageProps = {};

const DashboardTagsPage: React.FC<DashboardTagsPageProps> = ({}) => {
  const { data: tags, isLoading } = trpc.postTags.getTags.useQuery();

  if (isLoading)
    return (
      <div className="px-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="px-4">
      <PostTagsTable columns={postTagsColumns} data={tags || []} />
    </div>
  );
};

export default DashboardTagsPage;
