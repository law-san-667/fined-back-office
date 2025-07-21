"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
import IsLoading from "@/components/ui/is-loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/server/trpc/client";
import React from "react";
import { toast } from "sonner";
import { DataTablePagination } from "../../data-table-pagination";
import { ForumChannelsToolbar } from "./forum-channels-toolbar";

interface ForumChannelsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  client?: boolean;
}

export function ForumChannelsTable<TData, TValue>({
  columns,
  data,
  client,
}: ForumChannelsTableProps<TData, TValue>) {
  const [openDelete, setOpenDelete] = React.useState(false);

  const utils = trpc.useUtils();

  const { mutate: deleteSelectedChannels, isPending: isDeleting } =
    trpc.forumChannels.deleteSelectedChannels.useMutation({
      onSuccess: () => {
        toast.success("Les groupes ont été supprimés avec succès");
        utils.forumChannels.getChannels.invalidate();
        setOpenDelete(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      columnFilters,
      rowSelection,
      sorting,
      columnVisibility,
    },
  });

  const handleDeleteSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const ids = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => (row.original as { id: string }).id);

    if (ids.length > 0) {
      deleteSelectedChannels({ ids });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex w-full items-center justify-end">
          <ForumChannelsToolbar table={table} />
        </div>

        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
            <AlertDialogTrigger asChild>
              <Button
                onClick={() => setOpenDelete(true)}
                className="w-fit"
                variant="destructive"
                disabled={isDeleting}
              >
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Etes-vous sûr?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut être annulée. Cette action supprimera
                  définitivement ces ressources du système.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/80"
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                >
                  {isDeleting ? <IsLoading /> : "Supprimer"}
                </AlertDialogAction>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="w-full">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={client ? columns.length : columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
