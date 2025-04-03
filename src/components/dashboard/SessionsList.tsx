import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionCard from "./SessionCard";

interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: {
    name: string;
    avatar: string;
    role: string;
  }[];
  status: "scheduled" | "pending" | "completed" | "cancelled";
}

interface SessionsListProps {
  sessions?: Session[];
  onAcceptSession?: (sessionId: string) => void;
  onDeclineSession?: (sessionId: string, reason?: string) => void;
}

const SessionsList = ({
  sessions = [
    {
      id: "1",
      title: "Pop Writing Session",
      date: "2024-04-15",
      time: "14:00 - 16:00",
      location: "Studio A",
      participants: [
        {
          name: "John Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
          role: "Writer",
        },
        {
          name: "Jane Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
          role: "Producer",
        },
      ],
      status: "pending",
    },
    {
      id: "2",
      title: "R&B Production",
      date: "2024-04-16",
      time: "10:00 - 12:00",
      location: "Studio B",
      participants: [
        {
          name: "Mike Wilson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
          role: "Producer",
        },
        {
          name: "Sarah Lee",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
          role: "Writer",
        },
      ],
      status: "scheduled",
    },
    {
      id: "3",
      title: "Rock Session",
      date: "2024-04-14",
      time: "15:00 - 17:00",
      location: "Studio C",
      participants: [
        {
          name: "Tom Brown",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tom",
          role: "Writer",
        },
        {
          name: "Lisa Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
          role: "Producer",
        },
      ],
      status: "completed",
    },
  ],
  onAcceptSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      session.status = "scheduled";
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Session Accepted",
            description: `You have accepted the session for ${session.date}`,
            variant: "default",
          },
        }),
      );
    }
  },
  onDeclineSession = (sessionId: string, reason = "scheduling_conflict") => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      session.status = "cancelled";
      const declineMessages = {
        scheduling_conflict:
          "The writer's schedule has been filled for this time slot",
        technical_issues: "Unable to proceed with session at this time",
        calendar_update: "This time slot is no longer available",
        other: "Session cannot be confirmed at this time",
      };
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Session Update",
            description:
              declineMessages[reason as keyof typeof declineMessages],
            variant: "default",
          },
        }),
      );
    }
  },
}: SessionsListProps) => {
  const pendingSessions = sessions.filter(
    (session) => session.status === "pending",
  );
  const scheduledSessions = sessions.filter(
    (session) => session.status === "scheduled",
  );
  const completedSessions = sessions.filter(
    (session) =>
      session.status === "completed" || session.status === "cancelled",
  );

  return (
    <div className="w-[350px] h-full bg-[#0a0a0a]/95 border-l border-[#58742e] p-4">
      <h2 className="text-2xl font-semibold mb-4">Sessions</h2>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {scheduledSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  title={session.title}
                  date={session.date}
                  time={session.time}
                  location={session.location}
                  participants={session.participants}
                  status={session.status}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="pending">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {pendingSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  title={session.title}
                  date={session.date}
                  time={session.time}
                  location={session.location}
                  participants={session.participants}
                  status={session.status}
                  onAccept={() => onAcceptSession(session.id)}
                  onDecline={() => onDeclineSession(session.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="completed">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {completedSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  title={session.title}
                  date={session.date}
                  time={session.time}
                  location={session.location}
                  participants={session.participants}
                  status={session.status}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionsList;
