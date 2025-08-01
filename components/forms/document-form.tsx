"use client";

import { DocumentResponse } from "@/config/types";
import {
  useDocumentThumbnailUpload,
  useDocumentUpload,
} from "@/hooks/use-uploads";
import { documentSchema } from "@/lib/validators";
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
import { NumberInput } from "../ui/number-input";

type DocumentFormProps = {
  packId: string;
  doc?: DocumentResponse;
};

const DocumentForm: React.FC<DocumentFormProps> = ({ doc, packId }) => {
  const form = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: doc?.title || undefined,
      description: doc?.description || undefined,
      url: doc?.url || undefined,
      pageCount: doc?.page_count || 1,
      thumbnail: doc?.thumbnail || undefined,
    },
  });

  const utils = trpc.useUtils();

  const { mutate: createDoc, isPending: isCreating } =
    trpc.docs.createDoc.useMutation({
      onSuccess: () => {
        toast.success("Le document a été créé avec succès");
        utils.packs.getPack.invalidate({ id: packId });
        form.reset({
          title: "",
          description: "",
          url: "",
          pageCount: 0,
          thumbnail: "",
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updateDoc, isPending: isUpdating } =
    trpc.docs.updateDoc.useMutation({
      onSuccess: () => {
        toast.success("Le document a été modifié avec succès");
        utils.packs.getPack.invalidate({ id: packId });
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const thumbnailProps = useDocumentThumbnailUpload();
  const urlProps = useDocumentUpload();

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

  const onSubmit = async (values: z.infer<typeof documentSchema>) => {
    try {
      if (doc) {
        if (isEqual(doc, values)) {
          return toast.info("Les données n'ont pas été modifiées");
        }

        updateDoc({
          packId: packId,
          docId: doc.id,
          data: values,
        });
      } else {
        createDoc({
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
              <FormLabel>Document</FormLabel>
              <FormControl>
                <Dropzone {...urlProps}>
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Input
          readOnly
          value={form.watch("url")}
          placeholder="URL du document"
        />

        <FormField
          control={form.control}
          name="pageCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de pages</FormLabel>
              <FormControl>
                <NumberInput {...field} />
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

export default DocumentForm;
