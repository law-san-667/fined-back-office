"use client";

import { forumPostSchema } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { MultiSelect } from "../ui/extension/multi-select";
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

type ForumPostFormProps = {
  id?: string;
  initValues?: {
    title: string;
    description: string;
    tags: string[];
  };
  setOpenUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ForumPostForm: React.FC<ForumPostFormProps> = ({
  id,
  initValues,
  setOpenUpdate,
}) => {
    const { data: questionTags, isLoading: questionTagsLoading } =
    trpc.postTags.getTags.useQuery() as any;

  const form = useForm<z.infer<typeof forumPostSchema>>({
    resolver: zodResolver(forumPostSchema),
    defaultValues: {
      title: initValues?.title || "",
      description: initValues?.description || "",
      tags: initValues?.tags || [],
    },
  });

  const utils = trpc.useUtils();

  const { mutate: createPost, isPending: isCreating } =
    trpc.forumPosts.createPost.useMutation({
      onSuccess: () => {
        toast.success("La question a été créée avec succès");
        utils.forumPosts.getPosts.invalidate();
        form.reset();
        setOpenUpdate?.(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updatePost, isPending: isUpdating } =
    trpc.forumPosts.updatePost.useMutation({
      onSuccess: () => {
        toast.success("La question a été modifiée avec succès");
        utils.forumPosts.getPosts.invalidate();
        form.reset();
        setOpenUpdate?.(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  async function onSubmit(values: z.infer<typeof forumPostSchema>) {
    try {
      if (id && initValues) {
        if (isEqual(initValues, values)) {
          toast.info("Les données n'ont pas été modifiées");
          return;
        }

        updatePost({
          id,
          values,
        });
      } else {
        createPost(values);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Ooops...", {
        description:
          "Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-3xl space-y-4"
      >
        <FormField
          disabled={isCreating || isUpdating}
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
                  <Textarea {...field} maxLength={512} />
                  <span className="text-xs text-muted-foreground absolute bottom-2 right-2">
                    {/* Calc the length of the text */}
                    {field?.value?.length ?? 0}/{512}
                  </span>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {questionTags && (
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <MultiSelect
                    placeholder="Choisissez les tags qui correspondent à votre question"
                    options={questionTags.map((tag: any) => ({
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

        <Button disabled={isCreating || isUpdating} className="w-full">
          {isCreating || isUpdating ? <IsLoading /> : id ? "Modifier" : "Créer"}
        </Button>
      </form>
    </Form>
  );
};

export default ForumPostForm;
