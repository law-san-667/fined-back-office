"use client";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { trpc } from "@/server/trpc/client";
import { useRouter } from "next/navigation";
import IsLoading from "./ui/is-loading";
import { Skeleton } from "./ui/skeleton";

export function NavUser({}) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const { data, isLoading } = trpc.auth.me.useQuery();
  const { mutate: logout, isPending } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });

  if (isLoading) {
    return <Skeleton className="h-14" />;
  }

  return (
    <SidebarMenu>
      {data && (
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${data.adminAccount.name}`}
                    alt={data.adminAccount.name}
                  />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {data.adminAccount.name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {data.user.email}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={`https://api.dicebear.com/8.x/initials/svg?seed=${data.adminAccount.name}`}
                      alt={data.adminAccount.name}
                    />
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {data.adminAccount.name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {data.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuGroup>
                <DropdownMenuItem>
                  <IconUserCircle />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconNotification />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-600 hover:text-red-600"
                onClick={() => logout()}
                disabled={isPending}
              >
                {isPending ? (
                  <IsLoading />
                ) : (
                  <>
                    <IconLogout className="text-red-500" />
                    <span>Déconnexion</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
