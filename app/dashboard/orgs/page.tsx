"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { orgsColumns } from "@/components/data-tables/orgs/orgs-columns";
import { OrgsTable } from "@/components/data-tables/orgs/orgs-table";
import TableSkeleton from "@/components/table-skeleton";
import { trpc } from "@/server/trpc/client";

type DashboardOrgsPageProps = {};

const DashboardOrgsPage: React.FC<DashboardOrgsPageProps> = ({}) => {
  const { data: orgs, isLoading } = trpc.orgs.getOrgs.useQuery();
  const { data: authed } = trpc.auth.me.useQuery();
  const isSystemAdmin = authed?.adminAccount?.org_id === null || authed?.adminAccount?.org_id === undefined;

  return (
    <div className="px-4 space-y-6">
      {isSystemAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Organisations</CardTitle>
            <CardDescription>Gérer les organisations et inviter des administrateurs d'organisation.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link href="/dashboard/orgs/members">
              <Button variant="secondary">Inviter un admin d'organisation</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="px-4">
          <TableSkeleton />
        </div>
      ) : (
        <div className="px-4">
          <OrgsTable columns={orgsColumns} data={orgs || []} />
        </div>
      )}
    </div>
  );
};

export default DashboardOrgsPage;
