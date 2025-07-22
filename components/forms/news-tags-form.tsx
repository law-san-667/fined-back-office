"use client";

import { slugify } from "@/lib/utils";

import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { newsTagsSchema } from "@/lib/validators";

type NewsTagsFormProps = {
  name?: string;
  setOpenUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewsTagsForm: React.FC<NewsTagsFormProps> = ({ name, setOpenUpdate }) => {
  const form = useForm<z.infer<typeof newsTagsSchema>>({
    resolver: zodResolver(newsTagsSchema),
    defaultValues: {
      name: name || "",
    },
  });

  const utils = trpc.useUtils();

  const { mutate: createTag, isPending: isCreating } =
    trpc.newsTags.createTag.useMutation({
      onSuccess: () => {
        toast.success("Le tag a été créé avec succès");
        utils.newsTags.getTags.invalidate();
        form.reset();
        setOpenUpdate?.(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updateTag, isPending: isUpdating } =
    trpc.newsTags.updateTag.useMutation({
      onSuccess: () => {
        toast.success("Le tag a été modifié avec succès");
        utils.newsTags.getTags.invalidate();
        form.reset();
        setOpenUpdate?.(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  async function onSubmit(values: z.infer<typeof newsTagsSchema>) {
    try {
      if (name && name.trim() !== "") {
        if (name === values.name) {
          toast.info("Le nom n'a pas été modifié");
          return;
        }

        updateTag({
          name: values.name,
          slug: slugify(values.name),
          prev: slugify(name),
        });
      } else {
        createTag({
          name: values.name,
          slug: slugify(values.name),
        });
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
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
          ) : name ? (
            "Modifier"
          ) : (
            "Créer"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default NewsTagsForm;
