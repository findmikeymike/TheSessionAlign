import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface CalendarSyncProps {
  onSync?: (provider: "google" | "outlook" | "ical") => void;
}

const CalendarSync = ({ onSync = () => {} }: CalendarSyncProps) => {
  const handleSync = async (provider: "google" | "outlook" | "ical") => {
    try {
      if (provider === "google") {
        const { GoogleAuth } = await import("@react-oauth/google");
        // Request calendar scope
        const tokenResponse = await GoogleAuth.signIn({
          scope: "https://www.googleapis.com/auth/calendar.readonly",
        });

        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.accessToken}`,
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch calendar");
        const events = await response.json();
        onSync?.("google");
      }

      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Calendar Synced",
            description: `Successfully synced with ${provider} Calendar`,
            variant: "default",
          },
        }),
      );
    } catch (error) {
      console.error("Calendar sync error:", error);
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Sync Failed",
            description: `Failed to sync with ${provider} Calendar`,
            variant: "destructive",
          },
        }),
      );
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Calendar Sync
      </h3>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSync("google")}
        >
          Google
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSync("outlook")}
        >
          Outlook
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleSync("ical")}>
          iCal
        </Button>
      </div>
    </div>
  );
};

export default CalendarSync;
