import ForumPostForm from "@/components/forms/forum-post-form";
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
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

type ForumPostsActionsProps = {
  post: any;
};

const ForumPostsActions: React.FC<ForumPostsActionsProps> = ({ post }) => {
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const utils = trpc.useUtils();

  const { mutate: deletePost, isPending: isDeleting } =
    trpc.forumPosts.deletePost.useMutation({
      onSuccess: () => {
        toast.success("La question a été supprimée avec succès");
        utils.forumPosts.getPosts.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="flex items-center gap-2">
      <Button asChild size={"icon"} className="size-7">
        <Link href={`/dashboard/forum/posts/${post.id}`}>
          <IconEye />
        </Link>
      </Button>
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
            <DialogTitle>Modifier la question</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de modifier la question{" "}
              <span className="text-primary">"{post.title}". </span>
              Cette action sera appliquée à tout le système.
            </DialogDescription>
          </DialogHeader>
          <ForumPostForm
            id={post.id}
            initValues={{
              title: post.title,
              description: post.description || "",
              tags: post.tags || [],
            }}
          />
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
            <DialogTitle>Supprimer la question</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de supprimer la question{" "}
              <span className="text-primary">"{post.title}". </span>
              Cette action sera appliquée à tout le système.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={async () => {
                  setOpenDelete(false);
                  deletePost({ id: post.id });
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

export default ForumPostsActions;
