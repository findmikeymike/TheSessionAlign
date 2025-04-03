import React from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPreviewProps {
  url: string;
  isPlaying: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "secondary";
}

const AudioPreview = ({
  url,
  isPlaying,
  onToggle,
  size = "sm",
  variant = "ghost",
}: AudioPreviewProps) => {
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
        setIsLoading(false);
      });
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("loadedmetadata", () => {});
        audioRef.current.removeEventListener("timeupdate", () => {});
      }
    };
  }, []);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant={variant}
        size={size}
        className="h-6 w-6 relative"
        onClick={() => onToggle()}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent" />
        ) : isPlaying ? (
          <Pause className={`h-4 w-4 ${isPlaying ? "text-primary" : ""}`} />
        ) : (
          <Play className={`h-4 w-4 ${isPlaying ? "text-primary" : ""}`} />
        )}
      </Button>

      <div className="flex-1 h-1 bg-[#1c1e1d] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#58742e] transition-all duration-100"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      <span className="text-xs text-muted-foreground">
        {duration > 0
          ? `${Math.floor(currentTime)}s / ${Math.floor(duration)}s`
          : "--:--"}
      </span>

      <audio
        ref={audioRef}
        src={url}
        onEnded={() => onToggle()}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AudioPreview;
