"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IsLoading from "@/components/ui/is-loading";
import { UsersResponse } from "@/config/types";
import { trpc } from "@/server/trpc/client";
import { IconDotsVertical, IconStar, IconTrash, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

type UsersActionsProps = {
  user: UsersResponse;
};

const UsersActions: React.FC<UsersActionsProps> = ({ user }) => {
  const [open, setOpen] = React.useState(false);

  const utils = trpc.useUtils();

  const { mutate: deleteUser, isPending: isDeleting } =
    trpc.users.deleteUser.useMutation({
      onSuccess: () => {
        toast.success("L'utilisateur a été supprimé avec succès");
        utils.users.getUsers.invalidate();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: togglePremium, isPending: isTogglingPremium } =
    trpc.users.togglePremiumStatus.useMutation({
      onSuccess: () => {
        toast.success("Le statut premium a été mis à jour avec succès");
        utils.users.getUsers.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleDeleteUser = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    deleteUser({ id: user.id });
  };

  const handleTogglePremium = () => {
    const newPremiumStatus = !user.customer_accounts?.is_premium;
    togglePremium({ 
      userId: user.id, 
      isPremium: newPremiumStatus 
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <Link href={`/dashboard/users/${user.id}`}>
            <DropdownMenuItem>
              <IconUser className="mr-2 h-4 w-4" />
              Voir les détails
            </DropdownMenuItem>
          </Link>

          {user.customer_accounts && (
            <DropdownMenuItem 
              onClick={handleTogglePremium}
              disabled={isTogglingPremium}
            >
              <IconStar className="mr-2 h-4 w-4" />
              {user.customer_accounts.is_premium ? "Retirer premium" : "Activer premium"}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <IconTrash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Etes-vous sûr?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut être annulée. Cette action supprimera
            définitivement cet utilisateur et toutes ses données du système.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/80"
            onClick={handleDeleteUser}
            disabled={isDeleting}
          >
            {isDeleting ? <IsLoading /> : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UsersActions;
