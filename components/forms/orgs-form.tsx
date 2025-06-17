import { orgSchema } from "@/lib/validators";
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
      description: initValues?.description || "",
      logo: initValues?.logo || undefined,
      website: initValues?.website || undefined,
      socialLinks: initValues?.socialLinks || undefined,
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

  const onSubmit = async (values: z.infer<typeof orgSchema>) => {
    try {
      if (id) {
        if (!initValues) {
          throw new Error("Données manquantes");
        }

        // Filter out undefined values from values.socialLinks
        const socialLinks = values.socialLinks
          ? Object.fromEntries(
              Object.entries(values.socialLinks).filter(
                ([_, value]) => value !== undefined
              )
            )
          : undefined;

        const newValues = {
          ...values,
          socialLinks,
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            disabled={isCreating || isUpdating}
            control={form.control}
            name="socialLinks.facebook"
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
            name="socialLinks.twitter"
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
            name="socialLinks.linkedin"
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
            name="socialLinks.instagram"
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
            name="socialLinks.youtube"
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
