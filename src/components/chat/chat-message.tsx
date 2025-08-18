import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCheck, Gem, Shield, BookOpen, Sparkles } from "lucide-react";

import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "./audio-player";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "../ui/card";

type ChatMessageProps = {
  message: Message;
};

function BonusList() {
    const bonuses = [
        { icon: Gem, text: "Áudio de Meditação Guiada para alinhamento energético" },
        { icon: Shield, text: "Ritual de Proteção Ancestral para proteger sua energia" },
        { icon: BookOpen, text: "O Livro dos Salmos Ocultos com orações para prosperidade" },
        { icon: Sparkles, text: "Desconto especial em futuros produtos espirituais" },
    ];
    return (
        <div className="space-y-3">
            {bonuses.map((bonus, index) => (
                 <div key={index} className="flex items-start gap-3 text-foreground">
                    <bonus.icon className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                    <span>{bonus.text}</span>
                 </div>
            ))}
        </div>
    )
}

function Testimonial({ content, author }: { content: string, author?: string }) {
    return (
        <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg">
            <CardContent className="p-4">
                <p className="italic text-foreground/80">"{content}"</p>
                {author && <p className="text-right font-bold text-primary mt-2">- {author}</p>}
            </CardContent>
        </Card>
    )
}


export function ChatMessage({ message }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = message.sender === "user";

  const onButtonClick = () => {
    toast({
      title: "Jornada Iniciada!",
      description: message.meta?.text,
    });
    // Here you would typically redirect to a checkout URL
    // window.location.href = 'https://checkout.example.com';
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
      case "bonuses":
        return <BonusList />;
       case "testimonial":
        return <Testimonial content={message.content} author={message.meta?.author} />;
      case "button":
        return (
          <div className="p-4 bg-background rounded-lg shadow-md border max-w-sm text-center animate-in fade-in zoom-in-95">
              <p className="text-foreground mb-4">Sua transformação começa agora!</p>
              <Button onClick={onButtonClick} className="w-full bg-primary hover:bg-primary/90 text-lg font-bold py-6">
                {message.content}
              </Button>
              {message.meta?.image && (
                <Image 
                    src={message.meta.image} 
                    width={600} 
                    height={400} 
                    alt="Oferta Final" 
                    className="mt-4 rounded-md"
                    data-ai-hint={message.meta.imageHint}
                />
              )}
          </div>
        );
      default:
        return <p className="text-foreground">{message.content}</p>;
    }
  };

  if (message.type === 'button') {
    return (
      <div className={cn("flex w-full my-4", isUser ? "justify-end" : "justify-center")}>
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
          "relative max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-sm animate-in fade-in zoom-in-95",
          isUser
            ? "bg-[#D9FDD3] dark:bg-green-900 rounded-br-none"
            : "bg-white dark:bg-zinc-700 rounded-bl-none"
        )}
      >
        <div className="break-words whitespace-pre-wrap">
            {renderContent()}
        </div>
        <div
          className={cn(
            "text-xs text-right mt-1.5",
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

    