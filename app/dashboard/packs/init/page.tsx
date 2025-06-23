"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/extension/multi-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import IsLoading from "@/components/ui/is-loading";
import { Textarea } from "@/components/ui/textarea";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { initPackSchema } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type DashboardInitPackPageProps = {};

const DashboardInitPackPage: React.FC<DashboardInitPackPageProps> = ({}) => {
  const router = useRouter();

  const { data: tags, isLoading: tagsLoading } =
    trpc.packTags.getTags.useQuery();

  const form = useForm<z.infer<typeof initPackSchema>>({
    resolver: zodResolver(initPackSchema),
    defaultValues: {
      title: "",
      description: "",
      long_description: "",
      image: "",
      tags: [],
    },
  });

  const { mutate: createPack, isPending: isCreating } =
    trpc.packs.initPack.useMutation({
      onSuccess: (data) => {
        toast.success("Le pack a été initié avec succès");
        router.push(`/dashboard/packs/${data.id}/manage`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const props = useSupabaseUpload({
    bucketName: "packs",
    path: "thumbnail",
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1024 * 1024 * 16,
    upsert: true,
  });

  React.useEffect(() => {
    if (props.isSuccess) {
      form.setValue(
        "image",
        `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE}/${props.successes[0].path}`
      );
    }
  }, [props]);

  const onSubmit = async (values: z.infer<typeof initPackSchema>) => {
    try {
      createPack(values);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Ooops...", {
        description:
          "Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-3xl space-y-4"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miniature</FormLabel>
                <FormControl>
                  {form.watch("image") && form.watch("image") !== "" ? (
                    <div className="w-full h-72 rounded-2xl overflow-hidden relative">
                      <Image
                        src={form.watch("image") || ""}
                        alt="Logo"
                        fill
                        className="object-cover"
                      />
                      <Button
                        size={"icon"}
                        variant={"destructive"}
                        className="size-7 rounded-full absolute right-2 top-2"
                        onClick={() => {
                          form.setValue("image", undefined);
                        }}
                      >
                        <XIcon />
                      </Button>
                    </div>
                  ) : (
                    <Dropzone {...props}>
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
              <FormItem className="relative">
                <FormLabel>Description courte</FormLabel>
                <FormControl>
                  <div>
                    <Textarea {...field} maxLength={255} />
                    <span className="text-xs text-muted-foreground absolute bottom-2 right-2">
                      {/* Calc the length of the text */}
                      {field?.value?.length ?? 0}/{255}
                    </span>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="long_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description Longue</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={6} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {tags && (
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={tags.map((tag) => ({
                        label: tag.name,
                        value: tag.slug,
                      }))}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      animation={0}
                      maxCount={3}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button disabled={isCreating} className="w-full">
            {isCreating ? <IsLoading /> : "Créer"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DashboardInitPackPage;
