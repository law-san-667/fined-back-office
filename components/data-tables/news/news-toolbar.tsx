"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PlusCircle, X } from "lucide-react";
import Link from "next/link";

interface NewsToolbarProps<TData> {
  table: Table<TData>;
}

export function NewsToolbar<TData>({ table }: NewsToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex w-full items-center gap-4">
      <Button className="w-fit" asChild>
        <Link href={"/dashboard/news/create"}>
          <PlusCircle />
          <span>Créer un article</span>
        </Link>
      </Button>

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
