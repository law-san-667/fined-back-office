"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentResponse, VideoResponse } from "@/config/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, FileText, Play, Trash2 } from "lucide-react";
import DocumentForm from "./forms/document-form";
import VideoForm from "./forms/video-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import IsLoading from "./ui/is-loading";

interface SortableItemProps {
  packId: string;
  data?: DocumentResponse | VideoResponse;
  id: string;
  type: "document" | "video";
  title: string;
  description: string;
  metadata: string;
  thumbnail: string | null;
  isDeleteLoading: boolean;
  onDelete: () => void;
}

export function SortableItem({
  packId,
  data,
  id,
  type,
  title,
  description,
  metadata,
  thumbnail,
  isDeleteLoading,
  onDelete,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`transition-all duration-200 ${
        isDragging ? "opacity-50 scale-105 z-50" : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* <div
            className="flex items-center justify-center w-6 h-6 rounded bg-primary/50 cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-black" />
          </div> */}

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
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {title || `Untitled ${type}`}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {description || "Aucune description"}
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

                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          //   onClick={onEdit}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {type === "document"
                              ? "Modifier le document"
                              : "Modifier la vidéo"}
                          </DialogTitle>
                        </DialogHeader>
                        {type === "document" ? (
                          <DocumentForm
                            packId={packId}
                            doc={data as DocumentResponse}
                          />
                        ) : (
                          <VideoForm
                            packId={packId}
                            video={data as VideoResponse}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          disabled={isDeleteLoading}
                          variant={"destructive"}
                          size="sm"
                        >
                          {isDeleteLoading ? (
                            <IsLoading />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {type === "document"
                              ? "Supprimer le document"
                              : "Supprimer la vidéo"}
                          </DialogTitle>
                          <DialogDescription>
                            Vous êtes sur le point de supprimer{" "}
                            {type === "document" ? "le document" : "la vidéo"}{" "}
                            <span className="text-primary">"{title}". </span>
                            Cette action sera appliquée à tout le système.
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              variant={"destructive"}
                              onClick={async () => {
                                // setOpenDelete(false);
                                onDelete();
                              }}
                            >
                              Supprimer
                            </Button>
                          </DialogClose>

                          <DialogClose asChild>
                            <Button variant={"outline"}> Annuler </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
