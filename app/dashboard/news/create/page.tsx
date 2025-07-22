import NewsForm from "@/components/forms/news-form";
import React from "react";

type DashboardCreateNewPageProps = {};

const DashboardCreateNewPage: React.FC<DashboardCreateNewPageProps> = ({}) => {
  return (
    <div className="px-4">
      <NewsForm />
    </div>
  );
};

export default DashboardCreateNewPage;
