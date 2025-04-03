import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Clock, Music, Users, Wand2 } from "lucide-react";
import CreatorSettings from "./CreatorSettings";

interface PreferencesPanelProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PreferencesPanel = ({
  open = true,
  onOpenChange = () => console.log("Dialog state changed"),
}: PreferencesPanelProps) => {
  // Set the API key from the URL parameter if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get("apiKey");
    if (apiKey) {
      localStorage.setItem("openai_api_key", apiKey);
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "API Key Saved",
            description:
              "Your OpenAI API key has been saved from URL parameter",
            variant: "default",
          },
        }),
      );
      // Remove the API key from the URL to prevent it from being visible
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] bg-[#0a0a0a] border-[#58742e] border">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="availability" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="availability">
              <Clock className="w-4 h-4 mr-2" />
              Time
            </TabsTrigger>
            <TabsTrigger value="collaboration">
              <Users className="w-4 h-4 mr-2" />
              Collab
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Music className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Wand2 className="w-4 h-4 mr-2" />
              AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="availability" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Days</Label>
                <Calendar
                  mode="multiple"
                  selected={[new Date()]}
                  className="rounded-md border border-[#58742e] bg-[#0a0a0a]"
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Hours</Label>
                <Slider
                  defaultValue={[9, 17]}
                  max={24}
                  min={0}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>12 AM</span>
                  <span>12 PM</span>
                  <span>11 PM</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Calendar Sync</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Open to New Collaborators</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <CreatorSettings
              onSave={(settings) => {
                console.log("Settings saved:", settings);
                onOpenChange(false);
              }}
            />
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <Input
                  type="password"
                  placeholder="Enter your OpenAI API key"
                  value={localStorage.getItem("openai_api_key") || ""}
                  onChange={(e) => {
                    localStorage.setItem("openai_api_key", e.target.value);
                    console.log("[AI Matching] API key saved to localStorage");
                    window.dispatchEvent(
                      new CustomEvent("toast", {
                        detail: {
                          title: "API Key Saved",
                          description: "Your OpenAI API key has been saved",
                          variant: "default",
                        },
                      }),
                    );
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is stored locally and used for AI matching
                  features
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => {
                      const apiKey = localStorage.getItem("openai_api_key");
                      if (apiKey) {
                        // Test if API key is valid
                        fetch("https://api.openai.com/v1/models", {
                          headers: {
                            Authorization: `Bearer ${apiKey}`,
                          },
                        })
                          .then((response) => {
                            if (response.ok) {
                              window.dispatchEvent(
                                new CustomEvent("toast", {
                                  detail: {
                                    title: "API Key Valid",
                                    description: "Your OpenAI API key is valid",
                                    variant: "default",
                                  },
                                }),
                              );
                            } else {
                              window.dispatchEvent(
                                new CustomEvent("toast", {
                                  detail: {
                                    title: "API Key Invalid",
                                    description:
                                      "Your OpenAI API key is invalid",
                                    variant: "destructive",
                                  },
                                }),
                              );
                            }
                          })
                          .catch((error) => {
                            console.error("API key validation error:", error);
                            window.dispatchEvent(
                              new CustomEvent("toast", {
                                detail: {
                                  title: "API Key Validation Error",
                                  description:
                                    "Could not validate your API key",
                                  variant: "destructive",
                                },
                              }),
                            );
                          });
                      }
                    }}
                    className=""
                    variant="outline"
                    size="sm"
                  >
                    Test API Key
                  </Button>
                  <Button
                    onClick={() => {
                      const input = document.querySelector(
                        'input[type="password"]',
                      ) as HTMLInputElement;
                      const apiKey = input?.value;
                      if (apiKey) {
                        localStorage.setItem("openai_api_key", apiKey);
                        console.log(
                          "[AI Matching] API key saved to localStorage",
                        );
                        window.dispatchEvent(
                          new CustomEvent("toast", {
                            detail: {
                              title: "API Key Saved",
                              description: "Your OpenAI API key has been saved",
                              variant: "default",
                            },
                          }),
                        );
                      }
                    }}
                    className=""
                    variant="default"
                    size="sm"
                  >
                    Save API Key
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesPanel;
