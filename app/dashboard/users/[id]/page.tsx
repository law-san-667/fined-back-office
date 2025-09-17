"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IsLoadingScreen from "@/components/ui/is-loading-screen";
import { trpc } from "@/server/trpc/client";
import { IconArrowLeft, IconBuilding, IconFolder, IconMail, IconStar, IconUser } from "@tabler/icons-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import React from "react";

type UserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const UserDetailPage: React.FC<UserDetailPageProps> = ({ params }) => {
  const [resolvedParams, setResolvedParams] = React.useState<{id: string} | null>(null);

  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const { data: user, isLoading } = trpc.users.getUser.useQuery(
    {
      id: resolvedParams?.id || "",
    },
    {
      enabled: !!resolvedParams?.id,
    }
  );

  if (!resolvedParams || isLoading) return <IsLoadingScreen />;

  if (!user) {
    return (
      <div className="px-4">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/users">
            <Button variant="outline" size="icon">
              <IconArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Utilisateur non trouvé</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users">
          <Button variant="outline" size="icon">
            <IconArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Détails de l'utilisateur</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID
              </label>
              <p className="text-sm font-mono">{user.id}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nom
              </label>
              <p>{user.customer_accounts?.name || "Non renseigné"}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <div className="flex items-center gap-2">
                <IconMail className="h-4 w-4" />
                <p>{user.email}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Statut Premium
              </label>
              <Badge variant={user.customer_accounts?.is_premium ? "default" : "secondary"}>
                <IconStar className="h-3 w-3 mr-1" />
                {user.customer_accounts?.is_premium ? "Premium" : "Gratuit"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              Organisations & Packs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Organisations
              </label>
              {user.customer_accounts?.orgs && user.customer_accounts.orgs.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {user.customer_accounts.orgs.map((org: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {org}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune organisation</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Packs commencés
              </label>
              {user.customer_accounts?.started_packs && user.customer_accounts.started_packs.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <IconFolder className="h-4 w-4" />
                    <span>{user.customer_accounts.started_packs.length} pack(s)</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.customer_accounts.started_packs.slice(0, 3).map((pack: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {pack}
                      </Badge>
                    ))}
                    {user.customer_accounts.started_packs.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.customer_accounts.started_packs.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun pack commencé</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date de création
              </label>
              <p>
                {user.created_at
                  ? format(new Date(user.created_at), "dd MMMM yyyy 'à' HH:mm", {
                      locale: fr,
                    })
                  : "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Dernière mise à jour
              </label>
              <p>
                {user.updated_at
                  ? format(new Date(user.updated_at), "dd MMMM yyyy 'à' HH:mm", {
                      locale: fr,
                    })
                  : "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Dernière connexion
              </label>
              <p>
                {user.last_login
                  ? format(new Date(user.last_login), "dd MMMM yyyy 'à' HH:mm", {
                      locale: fr,
                    })
                  : "Jamais"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Dernière déconnexion
              </label>
              <p>
                {user.last_logout
                  ? format(new Date(user.last_logout), "dd MMMM yyyy 'à' HH:mm", {
                      locale: fr,
                    })
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailPage;
