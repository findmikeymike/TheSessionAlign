import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, X } from "lucide-react";

type Status = "pending" | "scheduled" | "completed" | "cancelled";

interface SessionStatusProps {
  status: Status;
  className?: string;
}

const StatusConfig = {
  pending: { icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  scheduled: { icon: Check, color: "bg-green-100 text-green-800" },
  completed: { icon: Check, color: "bg-[#1c1e1d] text-gray-300" },
  cancelled: { icon: X, color: "bg-red-100 text-red-800" },
};

const SessionStatus = ({ status, className = "" }: SessionStatusProps) => {
  const config = StatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} ${className} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      <span className="capitalize">{status}</span>
    </Badge>
  );
};

export default SessionStatus;
