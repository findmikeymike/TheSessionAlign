import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SessionStatus from "./SessionStatus";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Participant {
  name: string;
  avatar: string;
  role: string;
}

interface SessionCardProps {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  participants?: Participant[];
  status?: "scheduled" | "pending" | "completed";
  onAccept?: () => void;
  onDecline?: () => void;
}

const SessionCard = ({
  title = "Songwriting Session",
  date = "2024-04-15",
  time = "14:00 - 16:00",
  location = "Studio A",
  participants = [
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
  status = "pending",
  onAccept = () => console.log("Session accepted"),
  onDecline = () => console.log("Session declined"),
}: SessionCardProps) => {
  const statusColors = {
    scheduled: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-gray-100 text-gray-800",
  };

  return (
    <Card className="w-[318px] bg-[#0a0a0a] border-[#58742e] border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{title}</h3>
          <SessionStatus status={status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Participants:</p>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={participant.avatar}
                      alt={participant.name}
                    />
                    <AvatarFallback>
                      {participant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-gray-500">{participant.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      {status === "pending" && (
        <CardFooter className="gap-2">
          <Button variant="outline" className="flex-1" onClick={onDecline}>
            Decline
          </Button>
          <Button className="flex-1" onClick={onAccept}>
            Accept
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SessionCard;
