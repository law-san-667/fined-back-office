"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabaseClient } from "@/server/client";
import { Bell, Smartphone, Users } from "lucide-react";
import React from "react";

export function NotificationStats() {
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    usersWithTokens: 0,
    tokenPercentage: 0,
  });

  /*React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer le nombre total d'utilisateurs
        const { count: totalUsers } = await supabaseClient
          .from("customer_accounts")
          .select("*", { count: "exact", head: true });

        // Récupérer le nombre d'utilisateurs avec des tokens
        const { count: usersWithTokens } = await supabaseClient
          .from("customer_accounts")
          .select("*", { count: "exact", head: true })
          .not("expo_token", "is", null);

        const total = totalUsers || 0;
        const withTokens = usersWithTokens || 0;
        const percentage = total > 0 ? Math.round((withTokens / total) * 100) : 0;

        setStats({
          totalUsers: total,
          usersWithTokens: withTokens,
          tokenPercentage: percentage,
        });
      } catch (error) {
        console.error("Error fetching notification stats:", error);
      }
    };

    fetchStats();
  }, []);*/

  return (
    <div></div>
    /*<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Utilisateurs Totaux
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Comptes clients actifs
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avec Tokens
          </CardTitle>
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.usersWithTokens}</div>
          <p className="text-xs text-muted-foreground">
            Peuvent recevoir des notifications
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Couverture
          </CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.tokenPercentage}%</div>
          <p className="text-xs text-muted-foreground">
            Utilisateurs avec tokens
          </p>
        </CardContent>
      </Card>
    </div>*/
  );
}
