import { Checkbox } from "@/components/ui/checkbox";
import {
  GetForumChannelsResponse,
  GetForumPostsResponse,
} from "@/config/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ForumChannelsActions from "./forum-posts-actions";
import ForumPostsActions from "./forum-posts-actions";

export const forumPostsColumns: ColumnDef<GetForumPostsResponse>[] = [
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
    accessorKey: "users.name",
    header: "Auteur",
    enableHiding: false,
  },
  {
    accessorKey: "answer_count",
    header: "Réponses",
    enableHiding: false,
  },
  {
    accessorKey: "upvotes",
    header: "Upvotes",
    enableHiding: false,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    enableHiding: false,
    cell: ({ row }) => <span>{row.original.tags?.length ?? 0}</span>,
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
    cell: ({ row }) => <ForumPostsActions post={row.original} />,
  },
];
