import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, CheckCheck } from "lucide-react";

import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "./audio-player";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/hooks/use-toast";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = message.sender === "user";

  const onButtonClick = () => {
    toast({
      title: "Oferta de Upsell",
      description: message.meta?.text,
    });
  };

  const renderContent = () => {
    switch (message.type) {
      case "image":
        return (
          <Image
            src={message.content}
            alt="Conteúdo da mensagem"
            width={400}
            height={250}
            className="rounded-md object-cover"
            data-ai-hint={message.dataAiHint}
          />
        );
      case "video":
        return (
          <div className="relative">
            <Image
              src={message.content}
              alt="Video thumbnail"
              width={600}
              height={400}
              className="rounded-md object-cover"
              data-ai-hint={message.dataAiHint}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
              <div className="h-16 w-16 rounded-full bg-white/80 flex items-center justify-center">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="black"/></svg>
              </div>
            </div>
          </div>
        );
      case "audio":
        return <AudioPlayer />;
      case "button":
        return (
          <div className="p-4 bg-background rounded-lg shadow-md border max-w-sm">
              <p className="text-foreground mb-4">{message.meta?.text}</p>
              <Button onClick={onButtonClick} className="w-full bg-primary hover:bg-primary/90">
                {message.content}
              </Button>
          </div>
        );
      default:
        return <p className="text-foreground">{message.content}</p>;
    }
  };

  if (message.type === 'button') {
    return (
      <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
        <div className="animate-in fade-in zoom-in-95">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-xs md:max-w-md lg:max-w-lg p-2 rounded-lg shadow-sm animate-in fade-in zoom-in-95",
          isUser
            ? "bg-[#D9FDD3] dark:bg-green-900"
            : "bg-white dark:bg-zinc-700"
        )}
      >
        <div className="break-words whitespace-pre-wrap">
            {renderContent()}
        </div>
        <div
          className={cn(
            "text-xs text-right mt-1",
            isUser ? "text-green-800/70" : "text-muted-foreground"
          )}
        >
          {format(message.timestamp, "HH:mm", { locale: ptBR })}
          {isUser && (
            <CheckCheck className="inline-block ml-1 h-4 w-4 text-accent" />
          )}
        </div>
      </div>
    </div>
  );
}
