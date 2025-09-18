import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import UsersActions from "./users-actions";

export const usersColumns: ColumnDef<any>[] = [
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
    accessorKey: "customer_accounts.name",
    header: "Nom",
    cell: ({ row }) => {
      return row.original.customer_accounts?.name || "N/A";
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: "Date de création",
    cell: ({ row }) => {
      return row.original.created_at
        ? format(new Date(row.original.created_at), "dd MMMM yyyy 'à' HH:mm", {
            locale: fr,
          })
        : "N/A";
    },
  },
  {
    accessorKey: "last_login",
    header: "Dernière connexion",
    cell: ({ row }) => {
      return row.original.last_login
        ? format(new Date(row.original.last_login), "dd MMMM yyyy 'à' HH:mm", {
            locale: fr,
          })
        : "Jamais";
    },
  },
  {
    accessorKey: "customer_accounts.is_premium",
    header: "Statut Premium",
    cell: ({ row }) => {
      const isPremium = row.original.customer_accounts?.is_premium;
      return (
        <Badge variant={isPremium ? "default" : "secondary"}>
          {isPremium ? "Premium" : "Gratuit"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "customer_accounts.orgs",
    header: "Organisations",
    cell: ({ row }) => {
      const orgs = row.original.customer_accounts?.orgs;
      if (!orgs || orgs.length === 0) {
        return <span className="text-muted-foreground">Aucune</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {orgs.slice(0, 2).map((org: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {org}
            </Badge>
          ))}
          {orgs.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{orgs.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UsersActions user={row.original} />,
  },
];
