"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: {
    video_id?: string;
    script?: string;
    error_message?: string;
  };
}

interface NotificationPopoverProps {
  userId: string;
  unreadCount: number;
  children: React.ReactNode;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "video_completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "video_failed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-blue-500" />;
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case "video_completed":
      return "border-l-green-500 bg-green-50/50";
    case "video_failed":
      return "border-l-red-500 bg-red-50/50";
    default:
      return "border-l-blue-500 bg-blue-50/50";
  }
}

export function NotificationPopover({
  userId,
  unreadCount,
  children,
}: NotificationPopoverProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchNotifications() {
    if (isLoading) return;

    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setNotifications(data);
    }
    setIsLoading(false);
  }

  async function markAsRead(notificationId: string) {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }

  async function markAllAsRead() {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (open && notifications.length === 0) {
      fetchNotifications();
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 w-full h-full">{children}</div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b last:border-b-0 hover:bg-muted/50 ${
                  !notification.read
                    ? getNotificationColor(notification.type)
                    : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(
                            new Date(notification.created_at),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 px-2 text-xs"
                        >
                          Mark read
                        </Button>
                      )}
                    </div>

                    {notification.data?.video_id && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>
                          <strong>Video ID:</strong>{" "}
                          {notification.data.video_id}
                        </p>
                        {notification.data.script && (
                          <p className="mt-1">
                            <strong>Script:</strong>{" "}
                            {notification.data.script.substring(0, 80)}
                            {notification.data.script.length > 80 && "..."}
                          </p>
                        )}
                        {notification.data.error_message && (
                          <p className="mt-1 text-red-600">
                            <strong>Error:</strong>{" "}
                            {notification.data.error_message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
