"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCheck, Gem, Shield, BookOpen, Sparkles, Phone, Video, Eye, CircleUserRound, MicOff, VideoOff, PlayCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "./audio-player";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

type ChatMessageProps = {
  message: Message;
  onSendMessage: (text: string) => void;
};

function BonusList() {
    const bonuses = [
        { icon: Gem, text: "Áudio de Meditação Guiada para alinhamento energético" },
        { icon: Shield, text: "Ritual de Proteção Ancestral para proteger sua energia" },
        { icon: BookOpen, text: "O Livro dos Salmos Ocultos com orações para prosperidade" },
        { icon: Sparkles, text: "Desconto especial em futuros produtos espirituais" },
    ];
    return (
        <Card className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-primary/20 shadow-lg w-full">
            <CardHeader>
                <CardTitle className="text-lg text-primary">Seus Bônus Exclusivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 !pt-0">
                {bonuses.map((bonus, index) => (
                    <div key={index} className="flex items-start gap-3 text-foreground">
                        <bonus.icon className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                        <span>{bonus.text}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
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
     const [callAccepted, setCallAccepted] = useState(false);
     const videoRef = useRef<HTMLVideoElement>(null);
     const [showNotification, setShowNotification] = useState(true);

    useEffect(() => {
        if (callAccepted && videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Video play failed:", error);
            });
        }
    }, [callAccepted]);

    const handleAcceptCall = () => {
        setShowNotification(false);
        setCallAccepted(true);
    }

    if (showNotification) {
        return (
            <div className="fixed inset-x-0 top-4 z-50 flex justify-center animate-in fade-in-25 slide-in-from-top-10 duration-500">
                 <Card className="bg-background/90 backdrop-blur-sm border-primary/20 shadow-xl w-full max-w-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                         <Avatar className="h-12 w-12 border-2 border-background">
                            <AvatarImage src="https://placehold.co/100x100.png" alt="Ana" data-ai-hint="person friendly"/>
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-bold">Ana</p>
                            <p className="text-sm text-green-500 animate-pulse">Chamada de vídeo recebida...</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full bg-green-500 hover:bg-green-600 text-white h-12 w-12" onClick={handleAcceptCall}>
                            <Phone className="h-6 w-6" />
                        </Button>
                    </CardContent>
                 </Card>
            </div>
        )
    }

    if (callAccepted) {
        return (
            <div className="fixed inset-0 bg-zinc-900/95 backdrop-blur-sm z-50 flex flex-col animate-in fade-in duration-500">
                 <div className="flex-1 flex items-center justify-center p-4 relative">
                     <div className="absolute top-4 left-4 text-white bg-black/40 p-2 rounded-lg text-sm">
                        <p className="font-bold">Ana</p>
                        <p className="text-xs">01:15</p>
                     </div>
                     <video 
                        ref={videoRef}
                        src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                        className="aspect-video w-full max-w-4xl rounded-lg shadow-2xl" 
                        muted
                        autoPlay 
                        loop
                    />
                </div>
                <div className="bg-black/40 p-4 flex justify-center items-center gap-4">
                    <Button variant="secondary" size="icon" className="rounded-full h-14 w-14 bg-white/20 hover:bg-white/30 text-white">
                        <VideoOff className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full h-14 w-14 bg-white/20 hover:bg-white/30 text-white">
                        <MicOff className="h-6 w-6" />
                    </Button>
                    <Button variant="destructive" size="icon" className="rounded-full h-16 w-16">
                        <Phone className="h-7 w-7 transform -rotate-[135deg]" />
                    </Button>
                </div>
            </div>
        )
    }
    
    return null;
}


export function ChatMessage({ message, onSendMessage }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = message.sender === "user";
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    if (message.timestamp) {
      setFormattedTime(format(new Date(message.timestamp), "HH:mm", { locale: ptBR }));
    }
  }, [message.timestamp]);


  const onButtonClick = () => {
    toast({
      title: "Jornada Iniciada!",
      description: message.meta?.text,
    });
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
            <video
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
              width={600}
              height={400}
              className="rounded-md object-cover bg-black"
              data-ai-hint={message.dataAiHint}
              controls
              poster={message.content}
            />
             {message.meta?.videoTitle && (
              <p className="font-semibold text-foreground mt-2 p-1">{message.meta.videoTitle}</p>
            )}
          </div>
        );
      case "audio":
        return <AudioPlayer audioSrc={message.content} audioText={message.meta?.audioText} />;
      case "bonuses":
        return <BonusList />;
       case "testimonial":
        return <Testimonial content={message.content} author={message.meta?.author} />;
       case "status":
         return (
             <Button variant="outline" className="bg-green-100 border-green-300 text-green-800 hover:bg-green-200 hover:text-green-900 w-full justify-start animate-in fade-in zoom-in-95 h-auto py-2" onClick={() => onSendMessage('Ver status')}>
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full bg-gradient-to-b from-green-400 to-green-600">
                         <PlayCircle className="h-8 w-8 text-white shrink-0"/>
                    </div>
                    <div className="text-left whitespace-normal">
                        <p className="font-bold">Status de João</p>
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
        // Split by newline and render paragraphs to respect formatting from AI
        return message.content.split('\n').map((paragraph, index) => (
          <p key={index} className="text-foreground">{paragraph}</p>
        ));
    }
  };

  if (message.type === 'button' || message.type === 'bonuses') {
    return (
      <div className={cn("flex w-full my-4", isUser ? "justify-end" : "justify-center")}>
        <div className="animate-in fade-in zoom-in-95 w-full max-w-md">
          {renderContent()}
        </div>
      </div>
    );
  }
  
  if (message.type === 'audio' || message.type === 'status') {
     return (
        <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
            <div className={cn(
                "relative max-w-xs md:max-w-md lg:max-w-lg rounded-lg shadow-sm animate-in fade-in zoom-in-95",
                 isUser
                    ? "bg-[#D9FDD3] dark:bg-green-900 rounded-br-none"
                    : "bg-white dark:bg-zinc-700 rounded-bl-none"
            )}>
                 <div className="flex flex-col gap-2 p-2">
                    {renderContent()}
                    <div className={cn(
                        "text-xs self-end",
                        isUser ? "text-green-800/70" : "text-muted-foreground"
                    )}>
                        {formattedTime}
                         {isUser && (
                            <CheckCheck className="inline-block ml-1 h-4 w-4 text-accent" />
                        )}
                    </div>
                 </div>
            </div>
        </div>
     )
  }

  if (message.type === 'live-call') {
      return <LiveCall content={message.content} />;
  }

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-sm animate-in fade-in zoom-in-95",
          isUser
            ? "bg-[#D9FDD3] dark:bg-green-900 rounded-br-none"
            : "bg-white dark:bg-zinc-700 rounded-bl-none",
           message.type === 'video' || message.type === 'image' ? "p-1" : "p-3"
        )}
      >
        <div className="break-words whitespace-pre-wrap flex flex-col">
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
