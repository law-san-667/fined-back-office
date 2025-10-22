import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { orgSchema } from "@/lib/validators";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import IsLoading from "../ui/is-loading";
import { Textarea } from "../ui/textarea";

type OrgsFormProps = {
  id?: string;
  initValues?: z.infer<typeof orgSchema>;
  setOpenUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrgsForm: React.FC<OrgsFormProps> = ({
  id,
  setOpenUpdate,
  initValues,
}) => {
  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: initValues?.name || "",
      domain: initValues?.domain || "",
      description: initValues?.description || "",
      logo: initValues?.logo || undefined,
      website: initValues?.website || "",
      social_links: initValues?.social_links || undefined,
    },
  });

  const utils = trpc.useUtils();

  const { mutate: createOrg, isPending: isCreating } =
    trpc.orgs.createOrg.useMutation({
      onSuccess: () => {
        toast.success("L'organisation a été créée avec succès");
        utils.orgs.getOrgs.invalidate();
        form.reset();
        setOpenUpdate?.(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updateOrg, isPending: isUpdating } =
    trpc.orgs.updateOrg.useMutation({
      onSuccess: () => {
        toast.success("L'organisation a été modifiée avec succès");
        utils.orgs.getOrgs.invalidate();
        form.reset();
        setOpenUpdate?.(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const props = useSupabaseUpload({
    bucketName: "orgs",
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1024 * 1024 * 16,
    upsert: true,
    preserveOriginalName: false, // Nettoyer les noms de fichiers
  });

  React.useEffect(() => {
    if (props.isSuccess) {
      form.setValue(
        "logo",
        `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE}/${props.successes[0].path}`
      );
    }
  }, [props, form]);

  const onSubmit = async (values: z.infer<typeof orgSchema>) => {
    try {
      if (id) {
        if (!initValues) {
          throw new Error("Données manquantes");
        }

        // Filter out undefined values from values.social_links
        const social_links = values.social_links
          ? Object.fromEntries(
              Object.entries(values.social_links).filter(
                ([_, value]) => value !== undefined
              )
            )
          : undefined;

        const newValues = {
          ...values,
          social_links,
        };

        if (isEqual(initValues, newValues)) {
          return toast.info("Les données n'ont pas été modifiées");
        }

        updateOrg({
          id,
          data: values,
        });
      } else {
        createOrg(values);
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
          disabled={isCreating || isUpdating}
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                {form.watch("logo") && form.watch("logo") !== "" ? (
                  <div className="w-full h-72 rounded-2xl overflow-hidden relative">
                    <Image
                      src={form.watch("logo") || ""}
                      alt="Logo"
                      fill
                      className="object-cover"
                    />
                    <Button
                      size={"icon"}
                      variant={"destructive"}
                      className="size-7 rounded-full absolute right-2 top-2"
                      onClick={() => {
                        form.setValue("logo", undefined);
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
          disabled={isCreating || isUpdating}
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domaine</FormLabel>
              <FormControl>
                <Input {...field} placeholder="example.com" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isCreating || isUpdating}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            disabled={isCreating || isUpdating}
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site internet</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isCreating || isUpdating}
            control={form.control}
            name="social_links.facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isCreating || isUpdating}
            control={form.control}
            name="social_links.twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter / X</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isCreating || isUpdating}
            control={form.control}
            name="social_links.linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isCreating || isUpdating}
            control={form.control}
            name="social_links.instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isCreating || isUpdating}
            control={form.control}
            name="social_links.youtube"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Youtube</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isCreating || isUpdating} className="w-full">
          {isCreating || isUpdating ? <IsLoading /> : id ? "Modifier" : "Créer"}
        </Button>
      </form>
    </Form>
  );
};

export default OrgsForm;
