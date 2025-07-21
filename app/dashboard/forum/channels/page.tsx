"use client";

import { forumChannelsColumns } from "@/components/data-tables/forum/channels/forum-channels-columns";
import { ForumChannelsTable } from "@/components/data-tables/forum/channels/forum-channels-table";
import TableSkeleton from "@/components/table-skeleton";
import { trpc } from "@/server/trpc/client";
import React from "react";

type DashboardForumChannelsProps = {};

const DashboardForumChannels: React.FC<DashboardForumChannelsProps> = ({}) => {
  const { data: channels, isLoading } =
    trpc.forumChannels.getChannels.useQuery();

  if (isLoading)
    return (
      <div className="px-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="px-4">
      <ForumChannelsTable
        columns={forumChannelsColumns}
        data={channels || []}
      />
    </div>
  );
};

export default DashboardForumChannels;
