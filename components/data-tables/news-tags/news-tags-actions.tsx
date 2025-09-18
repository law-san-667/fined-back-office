import NewsTagsForm from "@/components/forms/news-tags-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import IsLoading from "@/components/ui/is-loading";

import { trpc } from "@/server/trpc/client";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import React from "react";
import { toast } from "sonner";

type NewsTagsActionsProps = {
  tag: any;
};

const NewsTagsActions: React.FC<NewsTagsActionsProps> = ({ tag }) => {
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const utils = trpc.useUtils();

  const { mutate: deleteTag, isPending: isDeleting } =
    trpc.newsTags.deleteTag.useMutation({
      onSuccess: () => {
        toast.success("Le tag a été supprimé avec succès");
        utils.newsTags.getTags.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="flex items-center gap-2">
      <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
        <DialogTrigger asChild>
          <Button
            size={"icon"}
            className="size-7"
            onClick={() => setOpenUpdate(true)}
            disabled={isDeleting}
          >
            <IconPencil />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le tag</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de modifier le tag{" "}
              <span className="text-primary">"{tag.name}". </span>
              Cette action sera appliquée à tout le système.
            </DialogDescription>
          </DialogHeader>
          <NewsTagsForm name={tag.name} setOpenUpdate={setOpenUpdate} />
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogTrigger asChild>
          {isDeleting ? (
            <IsLoading />
          ) : (
            <Button
              variant={"destructive"}
              size={"icon"}
              className="size-7"
              onClick={() => setOpenDelete(true)}
              disabled={isDeleting}
            >
              <IconTrash />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le tag</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de supprimer le tag{" "}
              <span className="text-primary">"{tag.name}". </span>
              Cette action sera appliquée à tout le système.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={async () => {
                  setOpenDelete(false);
                  deleteTag({ slug: tag.slug });
                }}
              >
                Supprimer
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button variant={"outline"} onClick={() => setOpenDelete(false)}>
                {" "}
                Annuler{" "}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsTagsActions;
