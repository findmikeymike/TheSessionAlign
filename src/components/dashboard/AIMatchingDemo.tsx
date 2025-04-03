import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { findOptimalMatches } from "@/lib/aiScheduler";

const testCreators = [
  {
    id: "1",
    name: "John Doe",
    type: "Writer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    availability: {
      dates: [new Date()],
      timeRange: "09:00 - 17:00",
    },
    genres: ["Pop", "R&B"],
    location: "Los Angeles, CA",
    hasStudio: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    type: "Producer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    availability: {
      dates: [new Date()],
      timeRange: "10:00 - 18:00",
    },
    genres: ["Pop", "Electronic"],
    location: "Nashville, TN",
    hasStudio: true,
  },
];

export default function AIMatchingDemo() {
  const [matches, setMatches] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const testMatching = async () => {
    setLoading(true);
    try {
      const request = {
        title: "Test Session",
        type: "Writing",
        genre: "Pop",
        requiredRoles: ["Producer"],
        date: new Date(),
      };

      const results = await findOptimalMatches(request, testCreators);
      setMatches(results);
    } catch (error) {
      console.error("Matching error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Button onClick={testMatching} disabled={loading}>
        {loading ? "Finding Matches..." : "Test AI Matching"}
      </Button>

      <div className="space-y-2">
        {matches.map((creator) => (
          <Card key={creator.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{creator.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge>{creator.type}</Badge>
                  <Badge variant="outline">{creator.genres.join(", ")}</Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
