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
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  FileText,
  FileVideo,
  Play,
  Plus,
  Tag,
  Trash2,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { DragOverlayItem } from "./drag-overlay-item";
import DocumentForm from "./forms/document-form";
import PackDetailsForm from "./forms/pack-details-form";
import VideoForm from "./forms/video-form";
import { SortableItem } from "./sortable-item";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { MultiSelect } from "./ui/extension/multi-select";
import IsLoading from "./ui/is-loading";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

type PackManagementProps = {
  id: string;
};

const PackManagement: React.FC<PackManagementProps> = ({ id }) => {
  const router = useRouter();

  const [data] = trpc.packs.getPack.useSuspenseQuery({ id }) as any;
  const [tags] = trpc.packTags.getTags.useSuspenseQuery() as any;

  const availableTags = tags.filter(
    (tag: any) => !data.pack.tags.includes(tag.slug)
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const handleAddTag = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleCleanTags = () => {
    setSelectedTags([]);
  };

  const [mode, setMode] = React.useState<"edit-pack" | "edit-tags" | "none">(
    "none"
  );

  const utils = trpc.useUtils();

  const { mutate: updatePackTags, isPending: isUpdatingTags } =
    trpc.packs.updatePackTags.useMutation({
      onSuccess: () => {
        toast.success("Les tags ont été modifiés avec succès");
        utils.packs.getPack.invalidate({ id });
        setMode("none");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: removePackTag, isPending: isDeletingTag } =
    trpc.packs.removePackTag.useMutation({
      onSuccess: () => {
        toast.success("Le tag a été supprimé avec succès");
        utils.packs.getPack.invalidate({ id });
        setMode("none");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: deletePack, isPending: isDeletingPack } =
    trpc.packs.deletePack.useMutation({
      onSuccess: () => {
        toast.success("Le pack a été supprimé avec succès");
        router.push("/dashboard/packs");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: deleteDoc, isPending: isDeletingDoc } =
    trpc.docs.deleteDoc.useMutation({
      onSuccess: () => {
        toast.success("Le document a été supprimé avec succès");
        utils.packs.getPack.invalidate({ id });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: deleteVideo, isPending: isDeletingVideo } =
    trpc.videos.deleteVideo.useMutation({
      onSuccess: () => {
        toast.success("Le video a été supprimé avec succès");
        utils.packs.getPack.invalidate({ id });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

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
      const activeDocument = data.docs.find((doc: any) => doc.id === active.id);
      const activeVideo = data.videos.find((video: any) => video.id === active.id);

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

    const activeDocument = data.docs.find((doc: any) => doc.id === activeId);
    if (activeDocument) {
      return {
        type: "document" as const,
        title: activeDocument.title,
        description: activeDocument.description || "",
        metadata: `${activeDocument.page_count} pages`,
        thumbnail: activeDocument.thumbnail,
      };
    }

    const activeVideo = data.videos.find((video: any) => video.id === activeId);
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
    <div className="min-h-screen">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"} size="lg" className="shadow-lg">
                <Trash2 className="w-5 h-5 mr-2" />
                Supprimer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suppression du pack</DialogTitle>
                <DialogDescription>
                  Vous êtes sur le point de supprimer ce pack. Cette action est{" "}
                  <span className="font-bold text-destructive">
                    irréversible
                  </span>{" "}
                  faites attention.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  disabled={isDeletingPack}
                  variant={"destructive"}
                  onClick={() => {
                    deletePack({ id });
                  }}
                >
                  {isDeletingPack ? <IsLoading /> : "Supprimer"}
                </Button>
                <DialogClose asChild>
                  <Button
                    disabled={isDeletingPack}
                    variant={"outline"}
                    size={"sm"}
                  >
                    Annuler
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <Button size={"sm"} onClick={() => setMode("edit-pack")}>
                    Modifier
                  </Button>
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
                tags={tags.map((tag: any) => ({ value: tag.slug, label: tag.name }))}
                setMode={setMode}
              />

              <Separator />

              {/* Pricing and Duration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="size-6 text-blue-600" />
                      <Label className="text-2xl font-medium">Documents</Label>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {data.docs.length} doc(s)
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileVideo className="size-7 text-rose-500" />
                      <Label className="text-2xl font-medium">Vidéos</Label>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-semibold text-rose-500">
                          {data.videos.length}
                        </span>{" "}
                        vidéo(s)
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-blue-600">
                          {data.videos
                            .map((video: any) => video.duration)
                            .reduce((a:any, b:any) => a + b, 0)}
                        </span>{" "}
                        minute(s)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Tags Section */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-600" />
                    <Label className="font-medium">Tags & Categories</Label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      size={"sm"}
                      disabled={isDeletingPack || isUpdatingTags}
                      onClick={() => {
                        if (mode !== "edit-tags") {
                          setMode("edit-tags");
                        } else {
                          if (selectedTags.length <= 0) {
                            return toast.info("Aucun tag sélectionné");
                          }

                          updatePackTags({
                            packId: id,
                            tags: selectedTags,
                          });
                        }
                      }}
                    >
                      {isUpdatingTags ? (
                        <IsLoading />
                      ) : mode === "edit-tags" ? (
                        "Enregistrer"
                      ) : (
                        "Modifier les tags"
                      )}
                    </Button>

                    {mode === "edit-tags" && (
                      <Button
                        disabled={isDeletingPack || isUpdatingTags}
                        variant={"outline"}
                        size={"sm"}
                        onClick={() => {
                          setMode("none");
                          handleCleanTags();
                        }}
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                  {data.pack.tags.length > 0 ? (
                    tags.map((tag: any) => {
                      const foundTag = data.pack.tags.find(
                        (t: any) => t === tag.slug
                      );

                      if (!foundTag) {
                        return null;
                      }

                      return (
                        <Badge key={tag.slug} variant="secondary">
                          {tag.name}
                          <Button
                            size="icon"
                            variant={"ghost"}
                            className="size-4 rounded-full"
                            disabled={isDeletingPack || isDeletingTag}
                            onClick={() =>
                              removePackTag({ packId: id, tag: tag.slug })
                            }
                          >
                            <XIcon />
                          </Button>
                        </Badge>
                      );
                    })
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Aucun tag sélectionné pour ce pack.
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  {availableTags.length > 0 ? (
                    <MultiSelect
                      placeholder="Choisissez les tags"
                      disabled={
                        isDeletingPack || isUpdatingTags || mode !== "edit-tags"
                      }
                      options={availableTags.map((tag: any) => ({
                        label: tag.name,
                        value: tag.slug,
                      }))}
                      onValueChange={(val) => {
                        handleAddTag(val);
                      }}
                      animation={0}
                      maxCount={3}
                    />
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
                      <DialogContent className="bg-white max-w-3xl h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Nouveau document</DialogTitle>
                        </DialogHeader>
                        <DocumentForm packId={id} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.docs.map((doc: any) => (
                      <SortableItem
                        packId={id}
                        data={doc}
                        key={doc.id}
                        id={doc.id}
                        type="document"
                        title={doc.title}
                        description={doc.description || ""}
                        metadata={`${doc.page_count} pages`}
                        thumbnail={doc.thumbnail}
                        isDeleteLoading={isDeletingDoc}
                        onDelete={() => {
                          deleteDoc({ docId: doc.id, packId: id });
                        }}
                      />
                    ))}
                    {data.docs.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-lg font-medium mb-2">
                          Aucun document pour le moment
                        </p>
                        <p className="text-sm">
                          Ajoutez un premier document pour commencer
                        </p>
                      </div>
                    )}
                  </div>

                  {/* <SortableContext
                    items={data.docs.map((doc) => doc.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    
                  </SortableContext> */}
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="shadow-sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter une vidéo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Nouvelle vidéo</DialogTitle>
                        </DialogHeader>
                        <VideoForm packId={id} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[40rem] w-full">
                    <div className="space-y-3">
                      {data.videos.map((video: any) => (
                        <SortableItem
                          packId={id}
                          data={video}
                          key={video.id}
                          id={video.id}
                          type="video"
                          title={video.title}
                          description={video.description || ""}
                          metadata={`${video.duration} min`}
                          thumbnail={video.thumbnail}
                          isDeleteLoading={isDeletingVideo}
                          onDelete={() => {
                            deleteVideo({ packId: id, videoId: video.id });
                          }}
                        />
                      ))}
                      {data.videos.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Play className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-lg font-medium mb-2">
                            Aucune vidéo pour le moment
                          </p>
                          <p className="text-sm">
                            Ajoutez une première vidéo pour commencer
                          </p>
                        </div>
                      )}
                    </div>
                    {/* <SortableContext
                      items={data.videos.map((video) => video.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      
                    </SortableContext> */}
                  </ScrollArea>
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
