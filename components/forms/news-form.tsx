"use client";

import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { newsSchema } from "@/lib/validators";
import { Database } from "@/server/supabase-types";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../dropzone";
import Tiptap from "../editor/tiptap";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type NewsFormProps = {
  id?: string;
  news?: Database["public"]["Tables"]["news"]["Row"];
};

const NewsForm: React.FC<NewsFormProps> = ({ id, news }) => {
  const router = useRouter();

  const { data: newsCategories, isLoading: isLoadingCategories } =
    trpc.newsTags.getTags.useQuery();

  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: news?.title || "",
      content: news?.content || "",
      image: news?.image || "",
      category: news?.category || "",
    },
  });

  const utils = trpc.useUtils();

  const { mutate: createNews, isPending: isCreating } =
    trpc.news.createNews.useMutation({
      onSuccess: () => {
        toast.success("L'article a été créé avec succès");
        utils.news.getNews.invalidate();
        form.reset();
        router.push("/dashboard/news");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updateNews, isPending: isUpdating } =
    trpc.news.updateNews.useMutation({
      onSuccess: () => {
        toast.success("L'article a été modifié avec succès");
        utils.news.getNews.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onSubmit = (values: z.infer<typeof newsSchema>) => {
    if (id && news) {
      if (isEqual(news, values)) {
        return toast.info("Les données n'ont pas été modifiées");
      }

      updateNews({
        id,
        data: values,
      });
    } else {
      createNews(values);
    }
  };

  const props = useSupabaseUpload({
    bucketName: "news",
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

  return (
    <div className="w-full flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-xl space-y-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger className="bg-white shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {newsCategories &&
                      newsCategories?.map((type) => (
                        <SelectItem key={type.slug} value={type.slug}>
                          {type.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  {form.watch("image") && form.watch("image") !== "" ? (
                    <div className="w-full h-72 rounded-2xl overflow-hidden relative">
                      <Image
                        src={form.watch("image") || ""}
                        alt="image"
                        fill
                        className="object-cover"
                      />
                      <Button
                        size={"icon"}
                        variant={"destructive"}
                        className="size-7 rounded-full absolute right-2 top-2"
                        onClick={() => {
                          form.setValue("image", "");
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
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu</FormLabel>
                <FormControl>
                  <Tiptap description={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isCreating || isUpdating} className="w-full">
            {isCreating || isUpdating ? (
              <IsLoading />
            ) : id ? (
              "Modifier"
            ) : (
              "Créer"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewsForm;
