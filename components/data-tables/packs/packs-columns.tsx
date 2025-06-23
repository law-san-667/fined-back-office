import { Checkbox } from "@/components/ui/checkbox";
import { PacksResponse } from "@/config/types";
import { ColumnDef } from "@tanstack/react-table";
import PacksActions from "./packs-actions";

export const packsColumns: ColumnDef<PacksResponse>[] = [
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
    accessorKey: "title",
    header: "Titre",
    enableHiding: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <PacksActions pack={row.original} />,
  },
];
