import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";

interface PendingGmail {
  email: string;
  name: string;
  requestedAt: Date;
  type: "writer" | "producer";
}

export default function GmailApprovalList() {
  const [pendingGmails, setPendingGmails] = useState<PendingGmail[]>([
    {
      email: "john.doe@gmail.com",
      name: "John Doe",
      requestedAt: new Date(),
      type: "writer",
    },
    {
      email: "jane.smith@gmail.com",
      name: "Jane Smith",
      requestedAt: new Date(),
      type: "producer",
    },
  ]);

  const handleApprove = (email: string) => {
    setPendingGmails((current) => current.filter((g) => g.email !== email));
    window.dispatchEvent(
      new CustomEvent("toast", {
        detail: {
          title: "Gmail Approved",
          description: `${email} has been approved and can now log in`,
          variant: "default",
        },
      }),
    );
  };

  const handleDeny = (email: string) => {
    setPendingGmails((current) => current.filter((g) => g.email !== email));
    window.dispatchEvent(
      new CustomEvent("toast", {
        detail: {
          title: "Gmail Denied",
          description: `${email} has been denied access`,
          variant: "destructive",
        },
      }),
    );
  };

  return (
    <Card className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Gmail Approvals</h2>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {pendingGmails.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No pending approvals
            </p>
          ) : (
            pendingGmails.map((gmail) => (
              <Card key={gmail.email} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">{gmail.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {gmail.email}
                        </p>
                      </div>
                      <Badge variant="outline">{gmail.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Requested {gmail.requestedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeny(gmail.email)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(gmail.email)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
