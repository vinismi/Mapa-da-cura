export type Message = {
  id: string;
  sender: "user" | "bot";
  type: "text" | "image" | "video" | "audio" | "button" | "bonuses" | "testimonial";
  content: string;
  timestamp: Date;
  dataAiHint?: string;
  options?: string[];
  meta?: {
    text?: string;
    image?: string;
    imageHint?: string;
    author?: string;
  };
};

    