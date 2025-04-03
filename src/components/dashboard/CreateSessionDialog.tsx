import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

interface DayAvailability {
  date: Date;
  timeRanges: { startTime: string; endTime: string }[];
}

interface CreateSessionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddOpenings?: (openings: {
    availability: DayAvailability[];
    note?: string;
  }) => void;
}

const CreateSessionDialog = ({
  open,
  onOpenChange,
  onAddOpenings = () => console.log("Add openings"),
}: CreateSessionDialogProps) => {
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [dayAvailability, setDayAvailability] = React.useState<
    DayAvailability[]
  >([]);
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    const newDayAvailability = selectedDates.map((date) => {
      const existing = dayAvailability.find(
        (day) => day.date.toDateString() === date.toDateString(),
      );
      return {
        date,
        timeRanges: existing?.timeRanges || [
          { startTime: "09:00", endTime: "17:00" },
        ],
      };
    });
    const filteredAvailability = dayAvailability.filter((day) =>
      selectedDates.some(
        (date) => date.toDateString() === day.date.toDateString(),
      ),
    );
    const finalAvailability = [
      ...filteredAvailability,
      ...newDayAvailability.filter(
        (newDay) =>
          !filteredAvailability.some(
            (day) => day.date.toDateString() === newDay.date.toDateString(),
          ),
      ),
    ];
    setDayAvailability(finalAvailability);
  }, [selectedDates]);

  const addTimeRangeToDay = (date: Date) => {
    setDayAvailability((prev) =>
      prev.map((day) => {
        if (day.date.toDateString() === date.toDateString()) {
          return {
            ...day,
            timeRanges: [
              ...day.timeRanges,
              { startTime: "09:00", endTime: "17:00" },
            ],
          };
        }
        return day;
      }),
    );
  };

  const updateTimeRange = (
    date: Date,
    index: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setDayAvailability((prev) =>
      prev.map((day) => {
        if (day.date.toDateString() === date.toDateString()) {
          const newTimeRanges = [...day.timeRanges];
          newTimeRanges[index] = { ...newTimeRanges[index], [field]: value };
          return { ...day, timeRanges: newTimeRanges };
        }
        return day;
      }),
    );
  };

  const removeTimeRange = (date: Date, index: number) => {
    setDayAvailability((prev) =>
      prev.map((day) => {
        if (day.date.toDateString() === date.toDateString()) {
          return {
            ...day,
            timeRanges: day.timeRanges.filter((_, i) => i !== index),
          };
        }
        return day;
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dayAvailability.length > 0) {
      onAddOpenings({
        availability: dayAvailability,
        note,
      });
      onOpenChange?.(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Availability</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Optional Note</Label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 border rounded h-20"
                placeholder="Any additional details..."
              />
            </div>

            <div className="space-y-2">
              <Label>Select Days</Label>
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={setSelectedDates}
                className="rounded-md border border-[#58742e] bg-[#0a0a0a]"
              />
            </div>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            {dayAvailability.map((day) => (
              <div
                key={day.date.toISOString()}
                className="mb-6 p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    {day.date.toLocaleDateString()}
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeRangeToDay(day.date)}
                  >
                    Add Time Range
                  </Button>
                </div>
                {day.timeRanges.map((timeRange, index) => (
                  <div key={index} className="flex items-center gap-4 mt-2">
                    <input
                      type="time"
                      value={timeRange.startTime}
                      onChange={(e) =>
                        updateTimeRange(
                          day.date,
                          index,
                          "startTime",
                          e.target.value,
                        )
                      }
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={timeRange.endTime}
                      onChange={(e) =>
                        updateTimeRange(
                          day.date,
                          index,
                          "endTime",
                          e.target.value,
                        )
                      }
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {day.timeRanges.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeRange(day.date, index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </ScrollArea>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Availability</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionDialog;
