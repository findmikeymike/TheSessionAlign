import React from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Calendar,
  Settings,
  LogOut,
  Moon,
  Sun,
  Users,
} from "lucide-react";
import NotificationPanel from "./dashboard/NotificationPanel";
import { useTheme } from "./theme-provider";

interface DashboardHeaderProps {
  userName?: string;
  userAvatar?: string;
  unreadNotifications?: number;
  isPublisher?: boolean;
  notifications?: Array<{
    id: string;
    type: "session_request" | "session_accepted" | "session_declined";
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionTaken?: boolean;
    sessionDetails?: {
      date: string;
      time: string;
      location: string;
    };
  }>;
  onNotificationAccept?: (id: string) => void;
  onNotificationDecline?: (id: string) => void;
  onSettingsClick?: () => void;
  onApprovalsClick?: () => void;
  onLogoutClick?: () => void;
}

export default function DashboardHeader({
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  notifications = [],
  isPublisher = false,
  onNotificationAccept = (id: string) =>
    console.log("Notification accepted", id),
  onNotificationDecline = (id: string) =>
    console.log("Notification declined", id),
  onSettingsClick = () => console.log("Settings clicked"),
  onApprovalsClick = () => console.log("Approvals clicked"),
  onLogoutClick = () => console.log("Logout clicked"),
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="w-full h-[72px] px-6 border-b border-[#58742e] bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/60 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="text-xl font-bold">SessionAlign</div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/dashboard"
              >
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/calendar"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
        {showNotifications && (
          <div className="absolute right-0 top-16 z-50">
            <NotificationPanel
              notifications={notifications}
              onAccept={onNotificationAccept}
              onDecline={onNotificationDecline}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            {isPublisher && (
              <DropdownMenuItem onClick={onApprovalsClick}>
                <Users className="w-4 h-4 mr-2" />
                Pending Creators
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onLogoutClick}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
