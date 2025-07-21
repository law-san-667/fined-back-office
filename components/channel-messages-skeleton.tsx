import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChannelMessageSkeleton() {
  return (
    <div className="px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-12"></div>

        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <Skeleton className="absolute left-6 top-6 h-4 w-4 rounded-full md:left-10" />

              <div className="ml-16 md:ml-24">
                <Card>
                  <CardContent className="p-4">
                    {/* Message header */}
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

                    {/* Message content */}
                    <div className="mt-3 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
