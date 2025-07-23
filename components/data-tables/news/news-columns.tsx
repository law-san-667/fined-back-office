import { Checkbox } from "@/components/ui/checkbox";
import { GetNewsResponse } from "@/config/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import NewsActions from "./news-actions";

export const newsColumns: ColumnDef<GetNewsResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <div className="w-24 h-24 aspect-square rounded-2xl overflow-hidden relative">
          <Image
            src={row.original.image || "/placeholder.svg"}
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => (
      <span className="truncate">{row.original.title.slice(0, 50)}...</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => <span>{row.original.category.name}</span>,
  },
  {
    accessorKey: "updated_at",
    header: "Dernière modification",
    cell: ({ row }) => (
      <span>
        {formatDate(row.original.updated_at || "", "PPpp", { locale: fr })}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <NewsActions article={row.original} />,
  },
];
