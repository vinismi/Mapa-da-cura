
"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCheck, Gem, Shield, BookOpen, Sparkles, Phone, VideoOff, MicOff, PlayCircle, Hand, PhoneMissed, Download } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "./audio-player";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";

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

    const downloadableBonuses = [
        { name: "Meditacao_Guiada.mp3", size: "7.2 MB", type: "audio" },
        { name: "Ritual_Protecao.pdf", size: "1.8 MB", type: "pdf" },
        { name: "Salmos_Ocultos.pdf", size: "3.5 MB", type: "pdf" },
    ]

    return (
        <Card className="bg-teal-50 border-teal-200/80 shadow-lg w-full text-gray-800">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-teal-800 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-teal-600"/>
                    <span>Seus Presentes Foram Liberados!</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 !pt-2">
                <p className="text-teal-700">Aqui está o que você recebeu para iniciar sua transformação:</p>
                <div className="space-y-3">
                    {bonuses.map((bonus, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <bonus.icon className="h-5 w-5 mt-1 text-teal-600 shrink-0" />
                            <span className="font-medium text-gray-700">{bonus.text}</span>
                        </div>
                    ))}
                </div>
                <Separator className="bg-teal-200/80 my-4"/>
                <div>
                    <h4 className="font-bold text-teal-800 mb-3">Seus arquivos para baixar:</h4>
                    <div className="space-y-2">
                        {downloadableBonuses.map((file) => (
                             <div key={file.name} className="bg-white/70 p-3 rounded-lg flex items-center justify-between shadow-sm border border-teal-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-teal-100 p-2 rounded-md">
                                        <Download className="h-5 w-5 text-teal-700"/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">{file.name}</p>
                                        <p className="text-xs text-gray-500">{file.size}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="bg-white text-teal-700 border-teal-300 hover:bg-teal-50">
                                    Baixar
                                </Button>
                             </div>
                        ))}
                    </div>
                </div>
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
        if (callState === 'incoming' && ringtone && ringtone.paused) {
            ringtone.play().catch(e => console.log("Ringtone play failed", e));
        } else if (callState !== 'incoming' && ringtone && !ringtone.paused) {
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
    }, [callState, wistiaVideoId]);

    if (!isMounted) {
        return null;
    }
    
    if (callState === 'incoming') {
        return (
            <div 
                className="fixed inset-0 bg-zinc-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-between p-8 text-white animate-in fade-in duration-500"
            >
                <div className="flex flex-col items-center gap-4 mt-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="relative">
                        <Avatar className="h-28 w-28 border-4 border-white/50 animate-pulse">
                            <AvatarImage src="https://i.imgur.com/HAudfSt.png" alt="Ana" data-ai-hint="person friendly"/>
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 rounded-full border-4 border-green-500/50 animate-ping"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping [animation-delay:500ms]"></div>
                    </div>
                    <h2 className="text-3xl font-bold mt-4">Ana</h2>
                    <p className="text-lg text-white/80">Chamada de vídeo recebida...</p>
                </div>
                <div className="flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                     <button
                        onClick={handleAcceptCall}
                        className="w-20 h-20 rounded-full bg-green-500 text-white text-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-green-600 transition-all transform hover:scale-110"
                    >
                        <Phone className="h-8 w-8" />
                    </button>
                    <span className="text-lg">Atender</span>
                </div>
            </div>
        )
    }

    if (callState === 'accepted') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                 <div className="w-full h-full absolute top-0 left-0">
                    <div
                        className={`wistia_embed wistia_async_${wistiaVideoId} videoFoam=true playerColor=56B787 controlsVisibleOnLoad=false playButton=false`}
                        style={{ height: "100%", position: "absolute", width: "100%", top: 0, left: 0 }}
                    >&nbsp;</div>
                </div>
                <div className="absolute bottom-8 left-0 right-0 p-4 flex justify-center items-center gap-6 bg-gradient-to-t from-black/70 to-transparent">
                     <Button variant="ghost" size="icon" className="rounded-full h-14 w-14 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                        <VideoOff className="h-6 w-6" />
                    </Button>
                     <Button variant="ghost" size="icon" className="rounded-full h-14 w-14 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                        <MicOff className="h-6 w-6" />
                    </Button>
                    <Button variant="destructive" size="icon" className="rounded-full h-16 w-16 cursor-default">
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
              <p className="font-semibold text-foreground mt-2 p-1 text-base">{message.meta.videoTitle}</p>
            )}
          </div>
        );
      case "audio":
        return <AudioPlayer audioSrc={message.content} />;
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
          <p key={index} className="text-foreground text-base">{paragraph}</p>
        ));
    }
  };

  if (!isMounted) return null;

  if (message.type === 'live-call') {
     return <LiveCall onCallEnd={(message.meta as any)?.onCallEnd} />;
  }

  if (message.type === "call-summary") {
    return (
        <div className="flex justify-center items-center my-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/80 rounded-full px-3 py-1">
                <PhoneMissed className="h-3.5 w-3.5" />
                <span>{message.content}</span>
                {message.meta?.callDuration && <span>({message.meta.callDuration})</span>}
            </div>
        </div>
    )
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
                    ? "bg-[#DCF8C6] text-black rounded-br-none"
                    : "bg-secondary rounded-bl-none"
            )}>
                 <div className="flex flex-col gap-2 p-2">
                    {renderContent()}
                    <div className={cn(
                        "text-xs self-end -mb-1 -mr-1",
                        isUser ? "text-slate-500" : "text-muted-foreground"
                    )}>
                        {formattedTime}
                         {isUser && (
                            <CheckCheck className="inline-block ml-1 h-4 w-4 text-blue-400" />
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
          "relative max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-md animate-in fade-in zoom-in-95",
          isUser
            ? "bg-[#DCF8C6] text-black rounded-br-none"
            : "bg-secondary rounded-bl-none",
           message.type === 'video' || message.type === 'image' ? "p-1.5 bg-transparent dark:bg-transparent shadow-none" : "p-3"
        )}
      >
        <div className="break-words whitespace-pre-wrap flex flex-col">
            {renderContent()}
        </div>
        <div
          className={cn(
            "text-xs text-right mt-1.5 -mb-1 -mr-1",
            isUser ? "text-slate-500" : "text-muted-foreground"
          )}
        >
          {formattedTime}
          {isUser && (
            <CheckCheck className="inline-block ml-1 h-4 w-4 text-blue-400" />
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

    