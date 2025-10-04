import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { NotificationPopover } from "./notification-popover";

interface NotificationBellProps {
  userId: string;
}

export async function NotificationBell({ userId }: NotificationBellProps) {
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("read")
    .eq("user_id", userId);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <SidebarMenuItem>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton className="relative">
            <NotificationPopover userId={userId} unreadCount={unreadCount}>
              <Bell className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">
                Notifications
              </span>
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs group-data-[collapsible=icon]:ml-0"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </NotificationPopover>
          </SidebarMenuButton>
        </TooltipTrigger>
        <TooltipContent side="right">
          Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
        </TooltipContent>
      </Tooltip>
    </SidebarMenuItem>
  );
}
