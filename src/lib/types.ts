export type Message = {
  id: string;
  sender: "user" | "bot";
  type: "text" | "image" | "video" | "audio" | "button";
  content: string;
  timestamp: Date;
  dataAiHint?: string;
  meta?: {
    text?: string;
  };
};
