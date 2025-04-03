import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Play } from "lucide-react";
import {
  format,
  addWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

import CreateSessionDialog from "./CreateSessionDialog";

interface Creator {
  id: string;
  name: string;
  avatar: string;
  availability: {
    dates: Date[];
    timeRange: string;
  };
  type: "Writer" | "Producer" | "Writer/Producer";
  genres: string;
  recentInspiration: string;
  recentCredits: string[];
  location: string;
  hasStudio: boolean;
  previewTrack?: string;
}

const CalendarView = () => {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [playingAudio, setPlayingAudio] = React.useState<string | null>(null);

  const creators: Creator[] = [
    {
      id: "1",
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      type: "Writer",
      availability: {
        dates: [new Date(), new Date(Date.now() + 86400000)],
        timeRange: "10:00 - 16:00",
      },
      genres: "melodic rap, hyperpop, indie rock",
      recentInspiration:
        "Been listening to a lot of 80s synth-pop lately, really feeling the retro vibes and analog warmth",
      recentCredits: [
        "'Summer Nights' - The Weeknd",
        "'Dancing in Rain' - Ariana Grande",
        "'Midnight Drive' - Drake",
      ],
      location: "Los Angeles, CA",
      hasStudio: true,
      previewTrack:
        "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      type: "Producer",
      availability: {
        dates: [new Date(), new Date(Date.now() + 86400000 * 2)],
        timeRange: "09:00 - 17:00",
      },
      genres: "experimental bass, future garage, ambient",
      recentInspiration:
        "The new Fred Again album is blowing my mind, loving the texture and space in the production",
      recentCredits: [
        "'Electric Dreams' - Calvin Harris",
        "'Neon Lights' - Dua Lipa",
        "'Starlight' - Post Malone",
      ],
      location: "Nashville, TN",
      hasStudio: true,
      previewTrack: "https://example.com/demo2.mp3",
    },
    {
      id: "3",
      name: "Mike Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      type: "Writer/Producer",
      availability: {
        dates: [new Date(Date.now() + 86400000)],
        timeRange: "13:00 - 20:00",
      },
      genres: "neo soul, jazz fusion, alternative R&B",
      recentInspiration:
        "Been diving deep into old Motown records, the arrangements are incredible",
      recentCredits: [
        "'Soulful Night' - H.E.R.",
        "'Rhythm & Blues' - John Legend",
        "'Moonlight' - SZA",
      ],
      location: "Atlanta, GA",
      hasStudio: false,
      previewTrack: "https://example.com/demo3.mp3",
    },
  ];

  const weeks = [
    { label: "Today", start: new Date() },
    { label: "This Week", start: startOfWeek(new Date()) },
    { label: "Next Week", start: startOfWeek(addWeeks(new Date(), 1)) },
    { label: "Week After", start: startOfWeek(addWeeks(new Date(), 2)) },
  ];

  const getCreatorsForDay = (date: Date) => {
    return creators.filter((creator) =>
      creator.availability.dates.some(
        (d) => d.toDateString() === date.toDateString(),
      ),
    );
  };

  const handlePlayAudio = (trackUrl: string) => {
    if (playingAudio === trackUrl) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(trackUrl);
    }
  };

  return (
    <div className="flex gap-6">
      <div className="w-[300px] bg-[#0a0a0a] rounded-lg border border-[#58742e] shadow-sm p-4">
        <div className="mb-4">
          <Button onClick={() => setShowCreateDialog(true)} className="w-full">
            Add Openings
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border border-[#58742e] bg-[#0a0a0a] w-full"
        />
        <CreateSessionDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-helvetica mb-6">Get Aligned</h2>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="mb-4">
            {weeks.map((week) => (
              <TabsTrigger
                key={week.label}
                value={week.label.toLowerCase().replace(" ", "-")}
              >
                {week.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {getCreatorsForDay(new Date()).map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                isPlaying={playingAudio === creator.previewTrack}
                onPlayAudio={handlePlayAudio}
              />
            ))}
          </TabsContent>

          {weeks.slice(1).map((week) => (
            <TabsContent
              key={week.label}
              value={week.label.toLowerCase().replace(" ", "-")}
              className="space-y-6"
            >
              {eachDayOfInterval({
                start: week.start,
                end: endOfWeek(week.start),
              }).map((date) => {
                const availableCreators = getCreatorsForDay(date);
                if (availableCreators.length === 0) return null;

                return (
                  <div key={date.toISOString()}>
                    <h3 className="text-lg font-medium mb-4">
                      {format(date, "EEEE, MMMM d")}
                    </h3>
                    <div className="space-y-4">
                      {availableCreators.map((creator) => (
                        <CreatorCard
                          key={creator.id}
                          creator={creator}
                          isPlaying={playingAudio === creator.previewTrack}
                          onPlayAudio={handlePlayAudio}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

interface CreatorCardProps {
  creator: Creator;
  isPlaying: boolean;
  onPlayAudio: (trackUrl: string) => void;
}

const CreatorCard = ({ creator, isPlaying, onPlayAudio }: CreatorCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card
      className={`p-4 cursor-pointer bg-[#0a0a0a] border-[#58742e] hover:shadow-md transition-all ${isExpanded ? "shadow-md" : ""}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={creator.avatar} alt={creator.name} />
          <AvatarFallback>{creator.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-helvetica font-normal">{creator.name}</h3>
            {creator.previewTrack && (
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onPlayAudio(creator.previewTrack!)}
                >
                  <Play
                    className={`h-4 w-4 ${isPlaying ? "text-primary" : ""}`}
                  />
                </Button>
                <audio
                  src={creator.previewTrack}
                  autoPlay={isPlaying}
                  onEnded={() => onPlayAudio(creator.previewTrack!)}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs border-[#58742e]">
              {creator.type}
            </Badge>
            <span className="text-sm text-gray-400">
              {creator.availability.timeRange}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            const sessionDetails = {
              title: `Session with ${creator.name}`,
              date: selectedDate.toISOString().split("T")[0],
              time: creator.availability.timeRange,
              location: creator.hasStudio
                ? `${creator.name}'s Studio`
                : "Virtual Session",
              participants: [
                {
                  name: "You",
                  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
                  role: "Writer",
                },
                {
                  name: creator.name,
                  avatar: creator.avatar,
                  role: creator.type,
                },
              ],
              status: "pending",
            };
            // Add notification for the other user
            const notification = {
              id: Math.random().toString(),
              type: "session_request",
              title: "New Session Request",
              message: `${creator.name} has requested a session with you`,
              timestamp: new Date(),
              read: false,
              sessionDetails,
            };
            // Show success toast
            window.dispatchEvent(
              new CustomEvent("toast", {
                detail: {
                  title: "Session Request Sent",
                  description: `Your request has been sent to ${creator.name}`,
                  variant: "default",
                },
              }),
            );
          }}
        >
          Send Session Request
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#58742e] space-y-3">
          <div>
            <span className="text-sm font-medium">Genres:</span>
            <p className="text-sm text-gray-400 mt-1">{creator.genres}</p>
          </div>

          <div>
            <span className="text-sm font-medium">Recent Inspiration:</span>
            <p className="text-sm text-gray-400 mt-1">
              {creator.recentInspiration}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium">Recent Credits:</span>
            <ul className="text-sm text-gray-400 mt-1 list-disc pl-4">
              {creator.recentCredits.map((credit, index) => (
                <li key={index}>{credit}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-sm font-medium">Location:</span>
            <p className="text-sm text-gray-400 mt-1">{creator.location}</p>
          </div>

          <div>
            <span className="text-sm font-medium">Studio:</span>
            <p className="text-sm text-gray-400 mt-1">
              {creator.hasStudio ? "Has studio" : "No studio"}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CalendarView;
