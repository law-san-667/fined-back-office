"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/server/trpc/client";
import { IconArrowRight, IconMessageCircle } from "@tabler/icons-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

export function RecentForumPosts() {
  const { data: posts, isLoading } = trpc.dashboard.getRecentForumPosts.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3 p-3 rounded-lg border">
              <Skeleton className="h-4 w-4 mt-1" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <IconMessageCircle className="h-5 w-5" />
            Posts récents du forum
          </CardTitle>
          <CardDescription>
            Les 10 dernières questions posées sur le forum
          </CardDescription>
        </div>
        <Link href="/dashboard/forum/posts">
          <Button variant="outline" size="sm">
            Voir tout
            <IconArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/dashboard/forum/posts/${post.id}`}
                className="block"
              >
                <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <IconMessageCircle className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2 mb-1">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>
                        Par {post.users?.email || "Utilisateur inconnu"}
                      </span>
                      <span>•</span>
                      <span>
                        {post.created_at
                          ? format(new Date(post.created_at), "dd MMM yyyy", {
                              locale: fr,
                            })
                          : "Date inconnue"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <IconMessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucun post récent trouvé</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
