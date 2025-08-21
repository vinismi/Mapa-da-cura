
"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCheck, Gem, Shield, BookOpen, Sparkles, Phone, VideoOff, MicOff, PlayCircle, Hand } from "lucide-react";
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
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-lg border-primary/20 shadow-lg w-full">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-primary flex items-center gap-2"><Sparkles className="h-5 w-5"/>Seus Presentes Exclusivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 !pt-0">
                {bonuses.map((bonus, index) => (
                    <div key={index} className="flex items-start gap-3 text-foreground">
                        <bonus.icon className="h-5 w-5 mt-1 text-primary shrink-0" />
                        <span>{bonus.text}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

function Testimonial({ content, author }: { content: string, author?: string }) {
    return (
        <Card className="bg-background/70 backdrop-blur-sm border-primary/20 shadow-lg">
            <CardContent className="p-4">
                <p className="italic text-foreground/80">"{content}"</p>
                {author && <p className="text-right font-bold text-primary mt-2">- {author}</p>}
            </CardContent>
        </Card>
    )
}

function LiveCall({ onCallEnd }: { onCallEnd?: () => void }) {
     const [callState, setCallState] = useState<'incoming' | 'accepted' | 'ended'>('incoming');
     const wistiaVideoId = 'lvss8iarc9';
     const [isMounted, setIsMounted] = useState(false);
     const ringtoneRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setIsMounted(true);
        // Preload ringtone on mount
        ringtoneRef.current = new Audio('https://unrivaled-gelato-f313ef.netlify.app/ring.mp3');
        ringtoneRef.current.loop = true;
    }, []);

    const handleAcceptCall = () => {
        if (callState === 'incoming') {
            setCallState('accepted');
        }
    }

    const handleEndCall = () => {
        setCallState('ended');
         if(onCallEnd) onCallEnd();
    }

    useEffect(() => {
        const ringtone = ringtoneRef.current;
        if (callState === 'incoming' && ringtone) {
            ringtone.play().catch(e => console.log("Ringtone play failed", e));
        } else if (ringtone) {
            ringtone.pause();
            ringtone.currentTime = 0;
        }
        return () => {
            if (ringtone) {
              ringtone.pause();
              ringtone.currentTime = 0;
            }
        }
    }, [callState]);


    useEffect(() => {
        if (callState === 'accepted') {
          const videoInterval = setInterval(() => {
            if (typeof window.Wistia?.api === 'function') {
              clearInterval(videoInterval);
              
              const video = window.Wistia.api(wistiaVideoId);
              if (video) {
                video.ready(() => {
                    video.play();
                    video.bind('end', handleEndCall);
                });
              } else {
                 console.error("Wistia video not found for ID:", wistiaVideoId);
                 handleEndCall(); // End call if video can't be loaded.
              }
            }
          }, 100);
          return () => clearInterval(videoInterval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callState]);

    if (!isMounted || callState === 'ended') {
        return null;
    }
    
    if (callState === 'incoming') {
        return (
            <div 
                className="fixed inset-0 bg-zinc-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-between p-8 text-white animate-in fade-in duration-500 cursor-pointer"
                onClick={handleAcceptCall}
            >
                <div className="flex flex-col items-center gap-4 mt-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <Avatar className="h-28 w-28 border-4 border-white/50 ring-4 ring-white/20">
                        <AvatarImage src="https://i.imgur.com/HAudfSt.png" alt="Ana" data-ai-hint="person friendly"/>
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <h2 className="text-3xl font-bold">Ana</h2>
                    <p className="text-lg text-white/80 animate-pulse">Chamada de vídeo recebida...</p>
                </div>
                <div className="flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                     <div 
                        className="w-full max-w-xs h-20 rounded-full bg-green-500/80 text-white text-xl font-bold flex items-center justify-center gap-3"
                    >
                        <Hand className="h-7 w-7 animate-pulse" />
                        Toque para atender
                    </div>
                </div>
            </div>
        )
    }

    if (callState === 'accepted') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-in fade-in duration-300" onClick={() => window.Wistia.api(wistiaVideoId)?.play()}>
                 <div className="w-full h-full max-w-md aspect-[9/16] relative">
                    <div
                        className={`wistia_embed wistia_async_${wistiaVideoId} videoFoam=true playerColor=56B787 controlsVisibleOnLoad=false playButton=false`}
                        style={{ height: "100%", position: "absolute", width: "100%", top: 0, left: 0 }}
                    >&nbsp;</div>
                </div>
                <div className="absolute bottom-5 p-4 flex justify-center items-center gap-4">
                    <Button variant="destructive" size="icon" className="rounded-full h-16 w-16" onClick={(e) => { e.stopPropagation(); handleEndCall(); }}>
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
      setIsMounted(true);
  }, []);

  useEffect(() => {
    if (message.timestamp) {
      setFormattedTime(format(new Date(message.timestamp), "HH:mm", { locale: ptBR }));
    }
  }, [message.timestamp]);


  const onButtonClick = () => {
    if (message.meta?.buttonUrl) {
        window.open(message.meta.buttonUrl, "_blank", "noopener,noreferrer");
    } else {
        toast({
            title: "Ação",
            description: "Botão clicado!",
        });
    }
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
          <div className="relative group">
            <video
              src={message.content}
              width={600}
              height={400}
              className="rounded-md object-cover bg-black"
              data-ai-hint={message.dataAiHint}
              controls
              poster={message.meta?.posterUrl}
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
             <Button variant="outline" className="bg-green-100/80 border-green-300/80 text-green-900 hover:bg-green-200/80 hover:text-green-900 w-full justify-start animate-in fade-in zoom-in-95 h-auto py-2" onClick={() => onSendMessage('Ver status')}>
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full bg-gradient-to-b from-green-400 to-green-600">
                         <PlayCircle className="h-8 w-8 text-white shrink-0"/>
                    </div>
                    <div className="text-left whitespace-normal">
                        <p className="font-bold">Status de Luz</p>
                        <p className="text-sm">{message.content}</p>
                    </div>
                </div>
            </Button>
         );
       case "live-call":
            return <LiveCall onCallEnd={(message.meta as any)?.onCallEnd} />;
      case "button":
        return (
          <div className="p-4 bg-background rounded-lg shadow-md border max-w-sm text-center animate-in fade-in zoom-in-95">
              <p className="text-foreground mb-4">{message.meta?.text || "Sua transformação começa agora!"}</p>
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

  if (!isMounted) return null;

  if (message.type === 'live-call') {
     return <LiveCall onCallEnd={(message.meta as any)?.onCallEnd} />;
  }

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
                "relative max-w-xs md:max-w-md lg:max-w-lg rounded-xl shadow-md animate-in fade-in zoom-in-95",
                 isUser
                    ? "bg-[#DCF8C6] dark:bg-green-900/80 rounded-br-none"
                    : "bg-background dark:bg-zinc-800/90 rounded-bl-none"
            )}>
                 <div className="flex flex-col gap-2 p-2">
                    {renderContent()}
                    <div className={cn(
                        "text-xs self-end -mb-1 -mr-1",
                        isUser ? "text-green-800/70 dark:text-green-300/60" : "text-muted-foreground"
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

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md animate-in fade-in zoom-in-95",
          isUser
            ? "bg-[#DCF8C6] dark:bg-green-900/80 rounded-br-none"
            : "bg-background dark:bg-zinc-800/90 rounded-bl-none",
           message.type === 'video' || message.type === 'image' ? "p-1 bg-transparent dark:bg-transparent shadow-none" : "p-3"
        )}
      >
        <div className="break-words whitespace-pre-wrap flex flex-col">
            {renderContent()}
        </div>
        <div
          className={cn(
            "text-xs text-right mt-1 -mb-1 -mr-1",
            isUser ? "text-green-800/70 dark:text-green-300/60" : "text-muted-foreground"
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

declare global {
  interface Window {
    Wistia: any;
  }
}
    
