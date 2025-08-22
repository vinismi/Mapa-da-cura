export type Message = {
  id: string;
  sender: "user" | "bot";
  type: "text" | "image" | "video" | "audio" | "button" | "bonuses" | "testimonial" | "status" | "live-call" | "call-summary";
  content: string;
  timestamp: Date;
  dataAiHint?: string;
  options?: string[];
  meta?: {
    title?: string;
    text?: string;
    image?: string;
    imageHint?: string;
    author?: string;
    audioText?: string;
    videoTitle?: string;
    posterUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    callDuration?: string;
  };
};
