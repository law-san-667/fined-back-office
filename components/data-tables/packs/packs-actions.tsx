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
import { PacksResponse } from "@/config/types";

import { trpc } from "@/server/trpc/client";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

type PacksActionsProps = {
  pack: PacksResponse;
};

const PacksActions: React.FC<PacksActionsProps> = ({ pack }) => {
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const utils = trpc.useUtils();

  const { mutate: deletePack, isPending: isDeleting } =
    trpc.packs.deletePack.useMutation({
      onSuccess: () => {
        toast.success("Le pack a été supprimé avec succès");
        utils.packs.getPacks.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="flex items-center gap-2">
      <Button
        size={"icon"}
        className="size-7"
        onClick={() => setOpenUpdate(true)}
        disabled={isDeleting}
        asChild
      >
        <Link href={`/dashboard/packs/${pack.id}/manage`}>
          <IconPencil />
          Modifier le pack
        </Link>
      </Button>

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
            <DialogTitle>Supprimer le pack</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de supprimer le pack{" "}
              <span className="text-primary">"{pack.title}". </span>
              Cette action sera appliquée à tout le système.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={async () => {
                  setOpenDelete(false);
                  deletePack({ id: pack.id });
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

export default PacksActions;
