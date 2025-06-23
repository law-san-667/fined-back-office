"use client";

import { trpc } from "@/server/trpc/client";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Clock, FileText, Play, Plus, Save, Tag, XIcon } from "lucide-react";
import React from "react";
import { DragOverlayItem } from "./drag-overlay-item";
import DocumentForm from "./forms/document-form";
import PackDetailsForm from "./forms/pack-details-form";
import { SortableItem } from "./sortable-item";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";

type PackManagementProps = {
  id: string;
};

const PackManagement: React.FC<PackManagementProps> = ({ id }) => {
  const [data] = trpc.packs.getPack.useSuspenseQuery({ id });
  const [tags] = trpc.packTags.getTags.useSuspenseQuery();

  const availableTags = tags.filter(
    (tag) => !data.pack.tags.includes(tag.slug)
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const [mode, setMode] = React.useState<"edit-pack" | "edit-tags" | "none">(
    "none"
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Determine if we're dealing with documents or videos
      const activeDocument = data.docs.find((doc) => doc.id === active.id);
      const activeVideo = data.videos.find((video) => video.id === active.id);

      if (activeDocument) {
        // Handle document reordering
        // setPack((prev) => {
        //   const oldIndex = prev.documents.findIndex(
        //     (doc) => doc.id === active.id
        //   );
        //   const newIndex = prev.documents.findIndex(
        //     (doc) => doc.id === over?.id
        //   );
        //   return {
        //     ...prev,
        //     documents: arrayMove(prev.documents, oldIndex, newIndex),
        //   };
        // });
      } else if (activeVideo) {
        // Handle video reordering
        // setPack((prev) => {
        //   const oldIndex = prev.videos.findIndex(
        //     (video) => video.id === active.id
        //   );
        //   const newIndex = prev.videos.findIndex(
        //     (video) => video.id === over?.id
        //   );
        //   return {
        //     ...prev,
        //     videos: arrayMove(prev.videos, oldIndex, newIndex),
        //   };
        // });
      }
    }

    setActiveId(null);
  };

  const getActiveItem = () => {
    if (!activeId) return null;

    const activeDocument = data.docs.find((doc) => doc.id === activeId);
    if (activeDocument) {
      return {
        type: "document" as const,
        title: activeDocument.title,
        description: activeDocument.description || "",
        metadata: `${activeDocument.page_count} pages`,
        thumbnail: activeDocument.thumbnail,
      };
    }

    const activeVideo = data.videos.find((video) => video.id === activeId);
    if (activeVideo) {
      return {
        type: "video" as const,
        title: activeVideo.title,
        description: activeVideo.description || "",
        metadata: `${activeVideo.duration} min`,
        thumbnail: activeVideo.thumbnail,
      };
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Gestion du pack
            </h1>
            <p className="text-slate-600 mt-2">
              Create and manage educational packs with ease
            </p>
          </div>
          <Button size="lg" className="shadow-lg">
            <Save className="w-5 h-5 mr-2" />
            Sauvegarder
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Pack Details Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="text-2xl flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span>Détails du pack</span>
                </div>

                {mode !== "edit-pack" ? (
                  <Button onClick={() => setMode("edit-pack")}>Modifier</Button>
                ) : (
                  <Button variant={"outline"} onClick={() => setMode("none")}>
                    Annuler
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Basic Information */}
              <PackDetailsForm
                pack={data.pack}
                mode={mode}
                tags={tags.map((tag) => ({ value: tag.slug, label: tag.name }))}
              />

              <Separator />

              {/* Pricing and Duration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="size-6 text-blue-600" />
                      <Label className="text-2xl font-medium">
                        Durée totale
                      </Label>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {/* {formatDuration(calculateTotalDuration())} */}
                      0m
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Calculated from 0 video
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="size-7 text-green-600" />
                      <Label className="text-2xl font-medium">Resources</Label>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-semibold text-green-600">
                          {data.docs.length}
                        </span>{" "}
                        Documents
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-blue-600">
                          {data.videos.length}
                        </span>{" "}
                        Videos
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Tags Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <Label className="font-medium">Tags & Categories</Label>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <Badge key={tag.slug} variant="secondary">
                        {tag.name}
                        <XIcon
                          className="w-3 h-3 ml-1 cursor-pointer hover:text-purple-900"
                          //   onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No tags added yet
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  {availableTags.length > 0 ? (
                    <Select onValueChange={(value) => {}}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select from popular tags" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((tag) => (
                          <SelectItem key={tag.slug} value={tag.slug}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Aucun tag disponible. Vous les avez tous sélectionnés.
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pack Resources Section */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Documents */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      Documents
                      <Badge variant="outline" className="ml-2">
                        {data.docs.length}
                      </Badge>
                    </CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="shadow-sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter un document
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white">
                        <DialogHeader>
                          <DialogTitle>Nouveau document</DialogTitle>
                        </DialogHeader>
                        <DocumentForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <SortableContext
                    items={data.docs.map((doc) => doc.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {data.docs.map((doc) => (
                        <SortableItem
                          key={doc.id}
                          id={doc.id}
                          type="document"
                          title={doc.title}
                          description={doc.description || ""}
                          metadata={`${doc.page_count} pages`}
                          thumbnail={doc.thumbnail}
                          onDelete={() => {}}
                        />
                      ))}
                      {data.docs.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-lg font-medium mb-2">
                            No documents yet
                          </p>
                          <p className="text-sm">
                            Add your first document to get started
                          </p>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>

              {/* Videos */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      Videos
                      <Badge variant="outline" className="ml-2">
                        {data.videos.length}
                      </Badge>
                    </CardTitle>
                    <Button size="sm" className="shadow-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <SortableContext
                    items={data.videos.map((video) => video.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {data.videos.map((video) => (
                        <SortableItem
                          key={video.id}
                          id={video.id}
                          type="video"
                          title={video.title}
                          description={video.description || ""}
                          metadata={`${video.duration} min`}
                          thumbnail={video.thumbnail}
                          onDelete={() => {}}
                        />
                      ))}
                      {data.videos.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Play className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-lg font-medium mb-2">
                            No videos yet
                          </p>
                          <p className="text-sm">
                            Add your first video to get started
                          </p>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            </div>

            <DragOverlay>
              {activeId ? <DragOverlayItem {...getActiveItem()!} /> : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Dialogs */}
        {/* <DocumentDialog
          open={documentDialog.open}
          onOpenChange={(open) => setDocumentDialog({ open })}
          document={documentDialog.document}
          onSave={handleDocumentSave}
        /> */}

        {/* <VideoDialog
          open={videoDialog.open}
          onOpenChange={(open) => setVideoDialog({ open })}
          video={videoDialog.video}
          onSave={handleVideoSave}
        /> */}
      </div>
    </div>
  );
};

export default PackManagement;
