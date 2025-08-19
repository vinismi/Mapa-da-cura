import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCheck, Gem, Shield, BookOpen, Sparkles, Phone, Video, Eye, CircleUserRound } from "lucide-react";
import { useState, useEffect } from "react";

import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "./audio-player";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

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

function LiveCall({ content }: { content: string }) {
    return (
        <Card className="bg-gradient-to-br from-primary/80 to-accent/80 border-primary/20 shadow-xl text-primary-foreground animate-in fade-in zoom-in-95">
            <CardContent className="p-4 flex flex-col items-center text-center gap-4">
                <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-background">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Especialista" data-ai-hint="person friendly expert"/>
                        <AvatarFallback>E</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 block h-5 w-5 rounded-full bg-green-500 border-2 border-background ring-2 ring-green-500"/>
                </div>
                <div className="space-y-1">
                    <p className="font-bold">{content}</p>
                    <p className="text-sm opacity-80">Chamada recebida...</p>
                </div>
                 <div className="flex items-center gap-4 mt-2">
                    <Button variant="destructive" size="icon" className="rounded-full h-14 w-14">
                        <Phone className="h-6 w-6 transform -rotate-[135deg]" />
                    </Button>
                     <Button variant="default" size="icon" className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600">
                        <Video className="h-6 w-6" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}


export function ChatMessage({ message }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = message.sender === "user";
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    // This check prevents hydration errors by ensuring `new Date()` is only used client-side
    if (typeof window !== "undefined") {
      setFormattedTime(format(new Date(message.timestamp), "HH:mm", { locale: ptBR }));
    }
  }, [message.timestamp]);


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
          <div className="relative">
            <Image
              src={message.content}
              alt="Conteúdo da mensagem"
              width={400}
              height={250}
              className="rounded-md object-cover"
              data-ai-hint={message.dataAiHint}
            />
            {message.meta?.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center font-bold rounded-b-md">
                {message.meta.title}
              </div>
            )}
          </div>
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
             {message.meta?.videoTitle && (
              <p className="font-semibold text-foreground mt-2">{message.meta.videoTitle}</p>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
              <div className="h-16 w-16 rounded-full bg-white/80 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="black"/></svg>
              </div>
            </div>
          </div>
        );
      case "audio":
        return <AudioPlayer text={message.meta?.audioText} />;
      case "bonuses":
        return <BonusList />;
       case "testimonial":
        return <Testimonial content={message.content} author={message.meta?.author} />;
       case "status":
         return (
            <Button variant="outline" className="bg-green-100 border-green-300 text-green-800 hover:bg-green-200 hover:text-green-900 w-full justify-start animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full bg-gradient-to-b from-green-400 to-green-600">
                        <CircleUserRound className="h-8 w-8 text-white"/>
                    </div>
                    <div className="text-left">
                        <p className="font-bold">ZapSales Status</p>
                        <p className="text-sm">{message.content}</p>
                    </div>
                </div>
            </Button>
         );
       case "live-call":
            return <LiveCall content={message.content} />;
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

  if (message.type === 'button' || message.type === 'live-call') {
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
            : "bg-white dark:bg-zinc-700 rounded-bl-none",
          message.type === 'audio' && 'p-2'
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
          {formattedTime}
          {isUser && (
            <CheckCheck className="inline-block ml-1 h-4 w-4 text-accent" />
          )}
        </div>
      </div>
    </div>
  );
}
