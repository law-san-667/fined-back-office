"use client";

import { usePackThumbnailUpload } from "@/hooks/use-uploads";
import { packDetailsSchema } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import { XIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../dropzone";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import IsLoading from "../ui/is-loading";
import { Label } from "../ui/label";
import { NumberInput } from "../ui/number-input";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

type PackDetailsFornProps = {
  pack: any;
  mode: string;
  tags: { value: string; label: string }[];
  setMode: React.Dispatch<
    React.SetStateAction<"edit-pack" | "none" | "edit-tags">
  >;
};

const PackDetailsForn: React.FC<PackDetailsFornProps> = ({
  mode,
  pack,
  tags,
  setMode,
}) => {
  const disabled = mode !== "edit-pack";

  const form = useForm<z.infer<typeof packDetailsSchema>>({
    resolver: zodResolver(packDetailsSchema),
    defaultValues: {
      title: pack.title,
      description: pack.description || undefined,
      long_description: pack.long_description || undefined,
      image: pack.image || undefined,
      is_free: pack.is_free,
      price: pack.price,
      tags: pack.tags,
    },
  });

  const utils = trpc.useUtils();

  const { mutate: updatePack, isPending: isUpdating } =
    trpc.packs.updatePack.useMutation({
      onSuccess: () => {
        toast.success("Le pack a été modifié avec succès");
        utils.packs.getPack.refetch({ id: pack.id });
        setMode("none");
        // form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  React.useEffect(() => {
    if (mode !== "edit-pack") {
      form.reset();
    }
  }, [mode, form]);

  const props = usePackThumbnailUpload();

  React.useEffect(() => {
    if (props.isSuccess) {
      form.setValue(
        "image",
        `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE}/${props.successes[0].path}`
      );
    }
  }, [props, form]);

  const onSubmit = async (values: z.infer<typeof packDetailsSchema>) => {
    try {
      if (isEqual(values, pack)) {
        return toast.info("Les données n'ont pas été modifiées");
      }

      updatePack({
        id: pack.id,
        data: values,
      });
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="space-y-6">
          <FormField
            disabled={disabled}
            control={form.control}
            name="title"
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
            disabled={disabled}
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
            disabled={disabled}
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

          <FormField
            disabled={disabled}
            control={form.control}
            name="is_free"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-xs p-3 ">
                <div className="space-y-0.5">
                  <FormDescription>
                    Spécifiez ici si le pack est gratuit ou non
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!form.watch("is_free") && (
            <FormField
              disabled={disabled}
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix en FCFA</FormLabel>
                  <FormControl>
                    <NumberInput {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Miniature</Label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
              {mode !== "edit-pack" &&
              form.watch("image") &&
              form.watch("image") !== "" ? (
                <div className="space-y-4">
                  <img
                    src={pack.image || "/placeholder.svg"}
                    alt="Pack cover"
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                  />
                  <Button
                    variant="outline"
                    disabled={disabled}
                    onClick={() => {
                      form.setValue("image", undefined);
                    }}
                    className="w-full"
                  >
                    Modifier la miniature
                  </Button>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>

        {!disabled && (
          <Button
            disabled={disabled || isUpdating}
            type="submit"
            className="w-full col-span-full"
          >
            {isUpdating ? <IsLoading /> : "Sauvegarder"}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default PackDetailsForn;
