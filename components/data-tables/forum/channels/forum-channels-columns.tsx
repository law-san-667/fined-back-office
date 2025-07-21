import { Checkbox } from "@/components/ui/checkbox";
import { GetForumChannelsResponse } from "@/config/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ForumChannelsActions from "./forum-channels-actions";

export const forumChannelsColumns: ColumnDef<GetForumChannelsResponse>[] = [
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
    accessorKey: "name",
    header: "Nom",
    enableHiding: false,
  },
  {
    accessorKey: "member_count",
    header: "Membres",
    enableHiding: false,
  },
  {
    accessorKey: "message_count",
    header: "Messages",
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: "Créé le",
    cell: ({ row }) => {
      return (
        <div className="w-full">
          {formatDate(row.original.created_at || "", "dd/MM/yyyy à HH:mm")}
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Dernière modification le",
    cell: ({ row }) => {
      return (
        <div className="w-full">
          {formatDate(row.original.updated_at || "", "dd/MM/yyyy à HH:mm")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ForumChannelsActions channel={row.original} />,
  },
];
