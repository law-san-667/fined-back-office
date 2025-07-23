"use client";

import { forumPostsColumns } from "@/components/data-tables/forum/posts/forum-posts-columns";
import { ForumPostsTable } from "@/components/data-tables/forum/posts/forum-posts-table";
import TableSkeleton from "@/components/table-skeleton";
import { trpc } from "@/server/trpc/client";
import React from "react";

type DashboardForumPostsPageProps = {};

const DashboardForumPostsPage: React.FC<
  DashboardForumPostsPageProps
> = ({}) => {
  const { data: posts, isLoading } = trpc.forumPosts.getPosts.useQuery();

  if (isLoading)
    return (
      <div className="px-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="px-4">
      <ForumPostsTable columns={forumPostsColumns} data={posts || []} />
    </div>
  );
};

export default DashboardForumPostsPage;
