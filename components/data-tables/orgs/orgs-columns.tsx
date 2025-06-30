import { Checkbox } from "@/components/ui/checkbox";
import { OrgsReponse } from "@/config/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import OrgsActions from "./orgs-actions";

export const orgsColumns: ColumnDef<OrgsReponse>[] = [
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
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      return (
        <div className="w-24 h-24 aspect-square rounded-2xl overflow-hidden relative">
          <Image
            src={row.original.logo || "/placeholder.svg"}
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nom",
    enableHiding: false,
  },
  {
    accessorKey: "domain",
    header: "Domaine",
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <OrgsActions org={row.original} />,
  },
];
