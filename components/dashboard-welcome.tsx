"use client";

import { trpc } from "@/server/trpc/client";
import { IconDashboard } from "@tabler/icons-react";

export function DashboardWelcome() {
  const { data: auth } = trpc.auth.me.useQuery();

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
          <IconDashboard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bienvenue sur Fined Back Office
          </h1>
          <p className="text-muted-foreground">
            {auth?.adminAccount.name ? (
              <>Bonjour {auth.adminAccount.name}, gérez votre plateforme depuis cette interface.</>
            ) : (
              "Gérez votre plateforme éducative depuis cette interface d'administration."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
