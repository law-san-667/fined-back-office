import { Checkbox } from "@/components/ui/checkbox";
import { Database } from "@/server/supabase-types";
import { ColumnDef } from "@tanstack/react-table";
import PostTagsActions from "./post-tags-actions";

export const postTagsColumns: ColumnDef<
  Database["public"]["Tables"]["post_tags"]["Row"]
>[] = [
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
    cell: ({ row }) => {
      return <div className="w-full">{row.original.name}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => {
      return <div className="w-full">{row.original.slug}</div>;
    },
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <PostTagsActions tag={row.original} />,
  },
];
