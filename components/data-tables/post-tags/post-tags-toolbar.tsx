"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import PostTagsForm from "@/components/forms/post-tags-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, X } from "lucide-react";

interface PostTagsToolbarProps<TData> {
  table: Table<TData>;
}

export function PostTagsToolbar<TData>({ table }: PostTagsToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex w-full items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-fit">
            <PlusCircle />
            <span>Créer un tag</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Formulaire de création de tag de pack</DialogTitle>
            <DialogDescription>
              Créer un nouveau tag ici et celui-ci sera disponible partout dans
              le système.
            </DialogDescription>
          </DialogHeader>
          <PostTagsForm />
        </DialogContent>
      </Dialog>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Filtrer par le nom..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-fit"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
