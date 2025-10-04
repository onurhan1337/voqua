"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  AudioLines,
  Bell,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NotificationPopover } from "./notification-popover";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Creators",
    url: "/dashboard/creators",
    icon: Users,
  },
  {
    title: "Content",
    url: "/dashboard/content",
    icon: AudioLines,
  },
  {
    title: "Campaigns",
    url: "/dashboard/campaigns",
    icon: FileText,
  },
];

interface SidebarNavigationProps {
  userId: string;
  unreadCount: number;
}

export function SidebarNavigation({
  userId,
  unreadCount,
}: SidebarNavigationProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={cn(
                      "border border-dashed rounded-md",
                      pathname === item.url
                        ? "border-neutral-500"
                        : "border-transparent"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </TooltipTrigger>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
          ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuItem className="p-2 cursor-pointer">
                <SidebarMenuButton
                  asChild
                  className="relative border border-dashed rounded-md border-transparent"
                >
                  <NotificationPopover
                    userId={userId}
                    unreadCount={unreadCount}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </NotificationPopover>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </TooltipTrigger>
            <TooltipContent side="right">
              Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
            </TooltipContent>
          </Tooltip>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
