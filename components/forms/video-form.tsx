"use client";

import { DocumentResponse } from "@/config/types";
import { useVideoThumbnailUpload, useVideoUpload } from "@/hooks/use-uploads";
import { videoSchema } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import { XIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../dropzone";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import IsLoading from "../ui/is-loading";
import { Textarea } from "../ui/textarea";

type VideoFormProps = {
  packId: string;
  doc?: DocumentResponse;
};

const VideoForm: React.FC<VideoFormProps> = ({ doc, packId }) => {
  const form = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: doc?.title || undefined,
      description: doc?.description || undefined,
      url: doc?.url || undefined,
      duration: doc?.page_count || undefined,
      thumbnail: doc?.thumbnail || undefined,
    },
  });

  const utils = trpc.useUtils();

  const { mutate: createVideo, isPending: isCreating } =
    trpc.videos.createVideo.useMutation({
      onSuccess: () => {
        toast.success("Le document a été créé avec succès");
        utils.packs.getPack.invalidate({ id: packId });
        form.reset({
          title: "",
          description: "",
          url: "",
          duration: 0,
          thumbnail: "",
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updateVideo, isPending: isUpdating } =
    trpc.videos.updateVideo.useMutation({
      onSuccess: () => {
        toast.success("Le document a été modifié avec succès");
        utils.packs.getPack.invalidate({ id: packId });
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const thumbnailProps = useVideoThumbnailUpload();
  const urlProps = useVideoUpload();

  React.useEffect(() => {
    if (thumbnailProps.isSuccess) {
      form.setValue(
        "thumbnail",
        `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE}/${thumbnailProps.successes[0].path}`
      );
    }

    if (urlProps.isSuccess) {
      form.setValue(
        "url",
        `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE}/${urlProps.successes[0].path}`
      );
    }
  }, [thumbnailProps, urlProps]);

  const onSubmit = async (values: z.infer<typeof videoSchema>) => {
    try {
      if (doc) {
        if (isEqual(doc, values)) {
          return toast.info("Les données n'ont pas été modifiées");
        }

        updateVideo({
          packId: packId,
          videoId: doc.id,
          data: values,
        });
      } else {
        createVideo({
          packId: packId,
          data: values,
        });
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Ooops...", {
        description:
          "Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-3xl space-y-4"
      >
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miniature</FormLabel>
              <FormControl>
                {form.watch("thumbnail") && form.watch("thumbnail") !== "" ? (
                  <div className="w-full h-72 rounded-2xl overflow-hidden relative">
                    <Image
                      src={form.watch("thumbnail") || ""}
                      alt="Logo"
                      fill
                      className="object-cover"
                    />
                    <Button
                      size={"icon"}
                      variant={"destructive"}
                      className="size-7 rounded-full absolute right-2 top-2"
                      onClick={() => {
                        form.setValue("thumbnail", undefined);
                      }}
                    >
                      <XIcon />
                    </Button>
                  </div>
                ) : (
                  <Dropzone {...thumbnailProps}>
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                )}
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vidéo</FormLabel>
              <FormControl>
                {form.watch("url") && form.watch("url") !== "" ? (
                  <div className="w-full h-72 rounded-2xl overflow-hidden relative">
                    <video
                      className="h-full w-full rounded-md object-cover"
                      src={form.watch("url") || ""}
                      controls
                      autoPlay={false}
                    />

                    <Button
                      size={"icon"}
                      variant={"destructive"}
                      className="size-7 rounded-full absolute right-2 top-2"
                      onClick={() => {
                        form.setValue("url", "");
                      }}
                    >
                      <XIcon />
                    </Button>
                  </div>
                ) : (
                  <Dropzone {...urlProps}>
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                )}
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée de la vidéo (minutes)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isCreating || isUpdating} className="w-full">
          {isCreating || isUpdating ? (
            <IsLoading />
          ) : doc ? (
            "Modifier"
          ) : (
            "Créer"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default VideoForm;
