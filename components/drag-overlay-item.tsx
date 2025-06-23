"use client";

import { GripVertical, FileText, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DragOverlayItemProps {
  type: "document" | "video";
  title: string;
  description: string;
  metadata: string;
  thumbnail: string | null;
}

export function DragOverlayItem({
  type,
  title,
  description,
  metadata,
  thumbnail,
}: DragOverlayItemProps) {
  return (
    <Card className="shadow-lg border-2 border-primary/20 bg-background/95 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-muted">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {thumbnail ? (
                  <img
                    src={thumbnail || "/placeholder.svg"}
                    alt={`${title} thumbnail`}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-md border flex items-center justify-center">
                    {type === "document" ? (
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <Play className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">
                  {title || `Untitled ${type}`}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {description || "No description provided"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {type === "document" ? "Document" : "Video"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {metadata}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
