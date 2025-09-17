import { DashboardStatsCards } from "@/components/dashboard-stats-cards";
import { DashboardWelcome } from "@/components/dashboard-welcome";
import { RecentForumPosts } from "@/components/recent-forum-posts";

export default function Page() {
  return (
    <div className="space-y-8">
      <DashboardWelcome />
      <DashboardStatsCards />
      <div className="px-4 lg:px-6">
        <RecentForumPosts />
      </div>
    </div>
  );
}
