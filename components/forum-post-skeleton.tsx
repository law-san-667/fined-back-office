import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ForumPostSkeleton() {
  return (
    <div className="space-y-6 px-4">
      {/* Forum Post Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-18 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={index > 0 ? "ml-6 border-l-2 border-muted pl-4" : ""}
              >
                <Card className={index > 0 ? "bg-muted/30" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                          <Skeleton className="mt-1 h-3 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                    <div className="mt-3 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
