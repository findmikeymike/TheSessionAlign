import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  format,
  addWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import {
  Check,
  Clock,
  Users,
  Wand2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { findOptimalMatches } from "@/lib/aiScheduler";

interface Creator {
  id: string;
  name: string;
  type: "Writer" | "Producer" | "Writer/Producer";
  avatar: string;
  availability: {
    dates: Date[];
    timeRange: string;
  };
  genres: string[];
  recentInspiration?: string;
  recentCredits?: string[];
  location?: string;
  hasStudio?: boolean;
}

interface PublisherViewProps {
  creators?: Creator[];
  onSuggestMatch?: (creator1: Creator, creator2: Creator) => void;
}

const mockCreators = [
  {
    id: "1",
    name: "John Doe",
    type: "Writer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    availability: {
      dates: [new Date(), addWeeks(new Date(), 1)],
      timeRange: "10:00 - 16:00",
    },
    genres: ["Pop", "R&B", "Hip Hop"],
    recentInspiration:
      "Been exploring new sounds and collaborating with diverse artists",
    recentCredits: [
      "'Summer Vibes' - Featured Artist",
      "'Midnight Dreams' - Producer",
      "'Urban Soul' - Writer",
    ],
    location: "Los Angeles, CA",
    hasStudio: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    type: "Producer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    availability: {
      dates: [new Date(), addWeeks(new Date(), 2)],
      timeRange: "09:00 - 17:00",
    },
    genres: ["Pop", "Electronic", "Future Bass"],
    recentInspiration: "The new Fred Again album is blowing my mind",
    recentCredits: ["'Electric Dreams' - Producer", "'Neon Lights' - Writer"],
    location: "Nashville, TN",
    hasStudio: true,
  },
];

const weeks = [
  { label: "Today", start: new Date() },
  { label: "This Week", start: startOfWeek(new Date()) },
  { label: "Next Week", start: startOfWeek(addWeeks(new Date(), 1)) },
  { label: "Week After", start: startOfWeek(addWeeks(new Date(), 2)) },
];

const getCreatorsForDay = (date: Date) => {
  return mockCreators.filter((creator) =>
    creator.availability.dates.some(
      (d) => d.toDateString() === date.toDateString(),
    ),
  );
};

const PublisherView = ({ creators = mockCreators }: PublisherViewProps) => {
  const [selectedCreator, setSelectedCreator] = React.useState<Creator | null>(
    null,
  );
  const [matches, setMatches] = React.useState<Creator[]>([]);
  const [showMatches, setShowMatches] = React.useState(false);
  const { toast } = useToast();

  const testAIMatching = async () => {
    console.log("[AI Matching] Starting test with creators:", creators);

    // Check if OpenAI API key is set
    const apiKey =
      import.meta.env.VITE_OPENAI_API_KEY ||
      localStorage.getItem("openai_api_key");
    if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY") {
      toast({
        title: "API Key Missing",
        description:
          "Please add your OpenAI API key in the preferences panel and click Save",
        variant: "destructive",
      });
      return;
    }

    // Log a masked version of the API key for debugging
    if (apiKey) {
      const maskedKey =
        apiKey.length > 8
          ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
          : "[Key too short to mask]";
      console.log("[AI Matching] Using API key (masked):", maskedKey);
    }

    const testRequest = {
      title: "Test Session",
      type: "Writing",
      genre: "Pop",
      requiredRoles: ["Producer"],
      date: new Date(),
    };
    console.log("[AI Matching] Test request:", testRequest);

    try {
      console.log("[AI Matching] Calling findOptimalMatches...");
      const matchResults = await findOptimalMatches(testRequest, creators);
      console.log("[AI Matching] Results received:", matchResults);
      setMatches(matchResults);
      setShowMatches(true);
      toast({
        title: "AI Matching Results",
        description: `Found ${matchResults.length} optimal matches based on genre, style, and availability.`,
      });
    } catch (error) {
      console.error("AI matching error:", error);
      toast({
        title: "AI Matching Error",
        description:
          error instanceof Error
            ? error.message
            : "There was an error testing the AI matching.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-t from-[#161414] via-[#1c1e1d] via-70% to-[#58742e]/5 to-90%">
      <Card className="mb-6 bg-[#0a0a0a] border-[#58742e]">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-lg">AI Matching Test</h3>
                <p className="text-sm text-muted-foreground">
                  Test the AI matching system with diverse creators and genres
                </p>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={testAIMatching}
              >
                <Wand2 className="w-4 h-4" />
                Test AI Matching
              </Button>
            </div>

            {showMatches && matches.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#58742e]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Found {matches.length} Optimal Matches:
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMatches(false)}
                    className="h-8 px-2"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {matches.map((creator, index) => (
                    <Card
                      key={index}
                      className="p-3 bg-[#0a0a0a] border-[#58742e]"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>{creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{creator.name}</p>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className="text-xs border-[#58742e]"
                            >
                              {creator.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {creator.genres.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 bg-[#0a0a0a] border-[#58742e]">
          <CardHeader>
            <CardTitle>Creator Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Active Writers</span>
                </div>
                <p className="text-2xl font-semibold">24</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Sessions Today</span>
                </div>
                <p className="text-2xl font-semibold">8</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <p className="text-2xl font-semibold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-[#0a0a0a] border-[#58742e]">
          <CardHeader>
            <CardTitle>Weekly Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="this-week" className="w-full">
              <TabsList className="mb-4">
                {weeks.slice(1).map((week) => (
                  <TabsTrigger
                    key={week.label}
                    value={week.label.toLowerCase().replace(" ", "-")}
                  >
                    {week.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {weeks.slice(1).map((week) => (
                <TabsContent
                  key={week.label}
                  value={week.label.toLowerCase().replace(" ", "-")}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-7 gap-4">
                    {eachDayOfInterval({
                      start: week.start,
                      end: endOfWeek(week.start),
                    }).map((date) => (
                      <div
                        key={date.toISOString()}
                        className="text-center p-2 bg-[#0a0a0a] rounded-md border border-[#58742e]"
                      >
                        <p className="font-medium">{format(date, "EEE")}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(date, "MMM d")}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-4">
                    {eachDayOfInterval({
                      start: week.start,
                      end: endOfWeek(week.start),
                    }).map((date) => {
                      const dayCreators = getCreatorsForDay(date);
                      return (
                        <div key={date.toISOString()} className="space-y-2">
                          {dayCreators.map((creator) => (
                            <Card
                              key={creator.id}
                              className="p-4 cursor-pointer bg-[#0a0a0a] border-[#58742e] hover:shadow-md transition-all"
                              onClick={() =>
                                setSelectedCreator(
                                  selectedCreator?.id === creator.id
                                    ? null
                                    : creator,
                                )
                              }
                            >
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={creator.avatar} />
                                  <AvatarFallback>
                                    {creator.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-medium">{creator.name}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs border-[#58742e]"
                                    >
                                      {creator.type}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {creator.availability.timeRange}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-auto"
                                >
                                  {selectedCreator?.id === creator.id ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>

                              {selectedCreator?.id === creator.id && (
                                <div className="mt-4 pt-4 border-t border-[#58742e] space-y-3">
                                  <div>
                                    <span className="text-sm font-medium">
                                      Genres:
                                    </span>
                                    <p className="text-sm text-gray-400 mt-1">
                                      {creator.genres.join(", ")}
                                    </p>
                                  </div>

                                  {creator.recentInspiration && (
                                    <div>
                                      <span className="text-sm font-medium">
                                        Recent Inspiration:
                                      </span>
                                      <p className="text-sm text-gray-400 mt-1">
                                        {creator.recentInspiration}
                                      </p>
                                    </div>
                                  )}

                                  {creator.recentCredits && (
                                    <div>
                                      <span className="text-sm font-medium">
                                        Recent Credits:
                                      </span>
                                      <ul className="text-sm text-gray-400 mt-1 list-disc pl-4">
                                        {creator.recentCredits.map(
                                          (credit, index) => (
                                            <li key={index}>{credit}</li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                  {creator.location && (
                                    <div>
                                      <span className="text-sm font-medium">
                                        Location:
                                      </span>
                                      <p className="text-sm text-gray-400 mt-1">
                                        {creator.location}
                                      </p>
                                    </div>
                                  )}

                                  <div>
                                    <span className="text-sm font-medium">
                                      Studio:
                                    </span>
                                    <p className="text-sm text-gray-400 mt-1">
                                      {creator.hasStudio
                                        ? "Has studio"
                                        : "No studio"}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublisherView;
