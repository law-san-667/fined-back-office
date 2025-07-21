import ForumChannelForm from "@/components/forms/forum-channel-form";
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
import { GetForumChannelsResponse } from "@/config/types";

import { trpc } from "@/server/trpc/client";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

type ForumChannelsActionsProps = {
  channel: GetForumChannelsResponse;
};

const ForumChannelsActions: React.FC<ForumChannelsActionsProps> = ({
  channel,
}) => {
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const utils = trpc.useUtils();

  const { mutate: deleteChannel, isPending: isDeleting } =
    trpc.forumChannels.deleteChannel.useMutation({
      onSuccess: () => {
        toast.success("Le groupe a été supprimé avec succès");
        utils.forumChannels.getChannels.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="flex items-center gap-2">
      <Button asChild size={"icon"} className="size-7">
        <Link href={`/dashboard/forum/channels/${channel.id}`}>
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
            <DialogTitle>Modifier le groupe</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de modifier le groupe{" "}
              <span className="text-primary">"{channel.name}". </span>
              Cette action sera appliquée à tout le système.
            </DialogDescription>
          </DialogHeader>
          <ForumChannelForm
            id={channel.id}
            initValues={{
              name: channel.name,
              description: channel.description || "",
              color: channel.color || "",
            }}
            setOpenUpdate={setOpenUpdate}
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
            <DialogTitle>Supprimer le groupe</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de supprimer le groupe{" "}
              <span className="text-primary">"{channel.name}". </span>
              Cette action sera appliquée à tout le système.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={async () => {
                  setOpenDelete(false);
                  deleteChannel({ id: channel.id });
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

export default ForumChannelsActions;
