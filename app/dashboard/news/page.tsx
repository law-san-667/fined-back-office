"use client";

import { ArticleCard } from "@/components/article-card";
import { Button } from "@/components/ui/button";
import IsLoadingScreen from "@/components/ui/is-loading-screen";
import { GetNewsResponse } from "@/config/types";
import { trpc } from "@/server/trpc/client";
import Link from "next/link";
import React from "react";

type DashboardNewsPageProps = {};

const DashboardNewsPage: React.FC<DashboardNewsPageProps> = ({}) => {
  const { data: news, isLoading } = trpc.news.getNews.useQuery();

  const [filteredNews, setFilteredNews] = React.useState<GetNewsResponse[]>([]);

  React.useEffect(() => {
    if (news) {
      setFilteredNews(news);
    }
  }, [news]);

  if (isLoading) {
    return <IsLoadingScreen />;
  }

  return (
    <div className="px-4 flex flex-col gap-8">
      <div className="w-full flex items-center"></div>
      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            C&apos;est un peu vide par ici...
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/news/create">
              Créer votre premier article
            </Link>
          </Button>
        </div>
      )}

      {filteredNews.length > 0 &&
        filteredNews.map((news, index) => (
          <ArticleCard key={news.id} article={news} isLatest={index === 0} />
        ))}
    </div>
  );
};

export default DashboardNewsPage;
