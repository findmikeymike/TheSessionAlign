import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface CreatorSettings {
  genres: string;
  recentInspiration: string;
  recentCredits: string[];
  location: string;
  hasStudio: boolean;
  previewTrack?: string;
}

interface CreatorSettingsProps {
  settings?: CreatorSettings;
  onSave: (settings: CreatorSettings) => void;
}

const CreatorSettings = ({
  settings = {
    genres: "",
    recentInspiration: "",
    recentCredits: [],
    location: "",
    hasStudio: false,
  },
  onSave,
}: CreatorSettingsProps) => {
  const [genres, setGenres] = React.useState<string>(settings.genres);
  const [recentInspiration, setRecentInspiration] = React.useState(
    settings.recentInspiration,
  );
  const [recentCredits, setRecentCredits] = React.useState<string>(
    settings.recentCredits.join("\n"),
  );
  const [location, setLocation] = React.useState(settings.location);
  const [hasStudio, setHasStudio] = React.useState(settings.hasStudio);
  const [previewTrack, setPreviewTrack] = React.useState<string>(
    localStorage.getItem("previewTrack") || "",
  );
  const [audioFile, setAudioFile] = React.useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store audio data in localStorage
    if (audioFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const audioData = e.target?.result as string;
        localStorage.setItem("previewTrack", audioData);
      };
      reader.readAsDataURL(audioFile);
    }
    onSave({
      genres,
      recentInspiration,
      recentCredits: recentCredits.split("\n").filter(Boolean),
      location,
      hasStudio,
      previewTrack: localStorage.getItem("previewTrack") || "",
    });
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setPreviewTrack(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Genres</Label>
        <Textarea
          placeholder="Enter your genres (e.g. melodic rap, hyperpop, indie rock)"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Recent Inspiration</Label>
        <Textarea
          placeholder="What's inspiring you lately?"
          value={recentInspiration}
          onChange={(e) => setRecentInspiration(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Recent Credits</Label>
        <Textarea
          placeholder="Enter each credit on a new line"
          value={recentCredits}
          onChange={(e) => setRecentCredits(e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          placeholder="Enter your location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Preview Track</Label>
        <Input
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          className="cursor-pointer"
        />
        {previewTrack && (
          <audio controls className="w-full mt-2">
            <source src={previewTrack} type="audio/mpeg" />
          </audio>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="studio">Has Studio</Label>
        <Switch
          id="studio"
          checked={hasStudio}
          onCheckedChange={setHasStudio}
        />
      </div>

      <Button type="submit" className="w-full">
        Save Settings
      </Button>
    </form>
  );
};

export default CreatorSettings;
