import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  type: "session_request" | "session_accepted" | "session_declined";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionTaken?: boolean;
  from?: {
    name: string;
    avatar: string;
  };
  sessionDetails?: {
    date: string;
    time: string;
    location: string;
  };
}

interface NotificationPanelProps {
  notifications: Notification[];
  onAccept?: (notificationId: string, sessionDetails?: any) => void;
  onDecline?: (
    notificationId: string,
    sessionDetails?: any,
    reason?: string,
  ) => void;
  onClose?: () => void;
}

const NotificationPanel = ({
  notifications = [],
  onAccept,
  onDecline,
  onClose,
}: NotificationPanelProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card className="w-[400px] p-4 shadow-lg bg-[#0a0a0a] border-[#58742e] border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} new</Badge>
          )}
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notifications yet
            </p>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onAccept={onAccept}
                onDecline={onDecline}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

const NotificationItem = ({
  notification,
  onAccept,
  onDecline,
}: {
  notification: Notification;
  onAccept?: (id: string, sessionDetails?: any) => void;
  onDecline?: (id: string, sessionDetails?: any, reason?: string) => void;
}) => {
  const declineReasons = [
    "scheduling_conflict",
    "technical_issues",
    "illness",
    "other",
  ];

  const handleDecline = () => {
    // Randomly select a reason to keep it natural
    const reason =
      declineReasons[Math.floor(Math.random() * declineReasons.length)];
    onDecline?.(notification.id, notification.sessionDetails, reason);
  };

  return (
    <Card
      className={`p-4 ${notification.read ? "bg-muted/50" : "bg-background"}`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium">{notification.title}</h4>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
          </div>
          {!notification.actionTaken &&
            notification.type === "session_request" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={handleDecline}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="h-8"
                  onClick={() =>
                    onAccept?.(notification.id, notification.sessionDetails)
                  }
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            )}
        </div>

        {notification.sessionDetails && (
          <div className="text-sm text-muted-foreground">
            <p>{notification.sessionDetails.date}</p>
            <p>{notification.sessionDetails.time}</p>
            <p>{notification.sessionDetails.location}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {new Date(notification.timestamp).toLocaleString()}
        </div>
      </div>
    </Card>
  );
};

export default NotificationPanel;
