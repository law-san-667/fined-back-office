"use client";

import { usersColumns } from "@/components/data-tables/users/users-columns";
import { UsersTable } from "@/components/data-tables/users/users-table";
import TableSkeleton from "@/components/table-skeleton";
import { trpc } from "@/server/trpc/client";
import React from "react";

type DashboardUsersPageProps = {};

const DashboardUsersPage: React.FC<DashboardUsersPageProps> = ({}) => {
  const { data: users, isLoading } = trpc.users.getUsers.useQuery();

  if (isLoading)
    return (
      <div className="px-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="px-4">
      <UsersTable columns={usersColumns} data={users || []} />
    </div>
  );
};

export default DashboardUsersPage;