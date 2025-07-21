"use client";

import { forumChannelSchema } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
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
import { Textarea } from "../ui/textarea";

type ForumChannelFormProps = {
  id?: string;
  initValues?: {
    name: string;
    description: string;
    color: string;
  };
  setOpenUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ForumChannelForm: React.FC<ForumChannelFormProps> = ({
  id,
  initValues,
  setOpenUpdate,
}) => {
  const form = useForm<z.infer<typeof forumChannelSchema>>({
    resolver: zodResolver(forumChannelSchema),
    defaultValues: {
      name: initValues?.name || "",
      description: initValues?.description || undefined,
      color: initValues?.color || "",
    },
  });

  const utils = trpc.useUtils();

  const { mutate: createChannel, isPending: isCreating } =
    trpc.forumChannels.createChannel.useMutation({
      onSuccess: () => {
        toast.success("Le groupe a été créé avec succès");
        utils.forumChannels.getChannels.invalidate();
        form.reset();
        setOpenUpdate?.(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updateChannel, isPending: isUpdating } =
    trpc.forumChannels.updateChannel.useMutation({
      onSuccess: () => {
        toast.success("Le groupe a été modifié avec succès");
        utils.forumChannels.getChannels.invalidate();
        form.reset();
        setOpenUpdate?.(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  async function onSubmit(values: z.infer<typeof forumChannelSchema>) {
    try {
      if (id && initValues) {
        if (isEqual(initValues, values)) {
          toast.info("Les données n'ont pas été modifiées");
          return;
        }

        updateChannel({
          id,
          values,
        });
      } else {
        createChannel(values);
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

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Couleur</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isCreating || isUpdating} className="w-full">
          {isCreating || isUpdating ? <IsLoading /> : id ? "Modifier" : "Créer"}
        </Button>
      </form>
    </Form>
  );
};

export default ForumChannelForm;
