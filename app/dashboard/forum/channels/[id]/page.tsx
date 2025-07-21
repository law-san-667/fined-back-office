"use client";

import { ChannelMessageSkeleton } from "@/components/channel-messages-skeleton";
import { ChannelMessagesTimeline } from "@/components/channel-messages-timeline";
import { trpc } from "@/server/trpc/client";
import React, { use } from "react";

type Params = Promise<{ id: string }>;

type DashboardForumChannelDetailPageProps = {
  params: Params;
};

const DashboardForumChannelDetailPage: React.FC<
  DashboardForumChannelDetailPageProps
> = ({ params }) => {
  const { id } = use(params);

  const { data, isLoading } = trpc.forumChannels.getChannel.useQuery({ id });

  if (isLoading) {
    return <ChannelMessageSkeleton />;
  }

  return (
    <div className="px-4">
      {data ? (
        <ChannelMessagesTimeline
          channel={data.channel}
          messages={data.messages}
        />
      ) : (
        <div>Aucun message</div>
      )}
    </div>
  );
};

export default DashboardForumChannelDetailPage;
