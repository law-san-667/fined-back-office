"use client";

import { ArticleCard } from "@/components/article-card";
import { newsColumns } from "@/components/data-tables/news/news-columns";
import { NewsTable } from "@/components/data-tables/news/news-table";
import TableSkeleton from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import IsLoadingScreen from "@/components/ui/is-loading-screen";
import { GetNewsResponse } from "@/config/types";
import { trpc } from "@/server/trpc/client";
import Link from "next/link";
import React from "react";

type DashboardNewsPageProps = {};

const DashboardNewsPage: React.FC<DashboardNewsPageProps> = ({}) => {
  const { data: news, isLoading } = trpc.news.getNews.useQuery();

  if (isLoading)
    return (
      <div className="px-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="px-4">
      <NewsTable columns={newsColumns} data={news || []} />
    </div>
  );
};

export default DashboardNewsPage;
