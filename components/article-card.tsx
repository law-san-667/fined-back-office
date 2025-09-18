"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { formatDate } from "date-fns";
import { fr } from "date-fns/locale";
import parse from "html-react-parser";
import { Calendar, Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import IsLoading from "./ui/is-loading";

interface ArticleCardProps {
  article: any;
  isLatest: boolean;
}

export function ArticleCard({ article, isLatest }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  const utils = trpc.useUtils();

  const { mutate: deleteNews, isPending: isDeleting } =
    trpc.news.deleteNews.useMutation({
      onSuccess: () => {
        toast.success("L'article a été supprimé avec succès");
        utils.news.getNews.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <Card
      className={cn(`group hover:shadow-lg transition-all duration-200`, {
        "ring-2 ring-blue-500 shadow-lg": isLatest,
      })}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {!imageError ? (
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {article.category.name}
            </Badge>

            {isLatest && <Badge variant={"info"}>Dernier article</Badge>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {parse(article.content || "<p></p>")}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              Dernière modificaiton:{" "}
              {formatDate(article.updated_at || "", "PPpp", { locale: fr })}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 flex items-center gap-2 bg-transparent"
          disabled={isDeleting}
          asChild
        >
          <Link href={`/dashboard/news/${article.id}`}>
            <Edit className="h-3 w-3" />
            Modifier
          </Link>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
              Supprimer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer l&apos;article</DialogTitle>
              <DialogDescription>
                Vous êtes sur le point de supprimer l&apos;article:{" "}
                <span className="text-primary">"{article.title}". </span>
                Cette action sera appliquée à tout le système.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  disabled={isDeleting}
                  variant={"destructive"}
                  onClick={async () => {
                    deleteNews({ id: article.id });
                  }}
                >
                  {isDeleting ? <IsLoading /> : "Supprimer"}
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button disabled={isDeleting} variant={"outline"}>
                  Annuler{" "}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
