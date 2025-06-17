import OrgsForm from "@/components/forms/orgs-form";
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
import { OrgsReponse } from "@/config/types";

import { trpc } from "@/server/trpc/client";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import React from "react";
import { toast } from "sonner";

type OrgsActionsProps = {
  org: OrgsReponse;
};

const OrgsActions: React.FC<OrgsActionsProps> = ({ org }) => {
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const utils = trpc.useUtils();

  const { mutate: deleteOrg, isPending: isDeleting } =
    trpc.orgs.deleteOrg.useMutation({
      onSuccess: () => {
        toast.success("L'organisation a été supprimée avec succès");
        utils.orgs.getOrgs.invalidate();
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
            <DialogTitle>Modifier l&apos;organisation</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de modifier l&apos;organisation{" "}
              <span className="text-primary">"{org.name}". </span>
              Cette action sera appliquée à tout le système.
            </DialogDescription>
          </DialogHeader>
          <OrgsForm
            id={org.id}
            initValues={{
              name: org.name,
              description: org.description || undefined,
              logo: org.logo || undefined,
              website: org.website || undefined,
              socialLinks: org.socialLinks || undefined,
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
            <DialogTitle>Supprimer l&apos;organisation</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de supprimer l&apos;organisation{" "}
              <span className="text-primary">"{org.name}". </span>
              Cette action sera appliquée à tout le système.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={async () => {
                  setOpenDelete(false);
                  deleteOrg({ id: org.id });
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

export default OrgsActions;
