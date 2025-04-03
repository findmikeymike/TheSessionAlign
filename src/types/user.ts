export type CreatorType = "writer" | "producer" | "writer/producer";

export interface Creator {
  id: string;
  name: string;
  type: CreatorType;
  availability: {
    preferredDays: Date[];
    preferredHours: [number, number];
  };
  preferences: {
    genre: string;
    style: string;
    openToNewCollabs: boolean;
    openToCrossGenre: boolean;
  };
  collaborationHistory: string[];
}
