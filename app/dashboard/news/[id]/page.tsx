"use client";

import NewsForm from "@/components/forms/news-form";
import IsLoadingScreen from "@/components/ui/is-loading-screen";
import { trpc } from "@/server/trpc/client";
import React, { use } from "react";

type Params = Promise<{ id: string }>;

type Props = {
  params: Params;
};

const ComponentName: React.FC<Props> = (props) => {
  const { id } = use(props.params);

  const { data: news, isLoading } = trpc.news.getNew.useQuery({
    id,
  });

  if (isLoading) {
    return <IsLoadingScreen />;
  }

  return (
    <div className="px-4">
      <NewsForm id={id} news={news} />
    </div>
  );
};

export default ComponentName;
