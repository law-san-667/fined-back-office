"use client";

import { ForumPostSkeleton } from "@/components/forum-post-skeleton";
import ForumPostView from "@/components/forum-post-view";
import { trpc } from "@/server/trpc/client";
import React, { use } from "react";

type Params = Promise<{ id: string }>;

type DashboardForumPostDetailPageProps = { params: Params };

const DashboardForumPostDetailPage: React.FC<
  DashboardForumPostDetailPageProps
> = ({ params }) => {
  const { id } = use(params);

  const { data, isLoading } = trpc.forumPosts.getPost.useQuery({ id });

  if (isLoading) {
    return <ForumPostSkeleton />;
  }

  return (
    <div className="px-4">
      {data ? (
        <ForumPostView answers={data.answers} post={data.post} />
      ) : (
        <div>Aucun message</div>
      )}
    </div>
  );
};

export default DashboardForumPostDetailPage;
