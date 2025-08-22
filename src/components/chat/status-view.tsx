
"use client";

import { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

const stories = [
  {
    type: "image",
    url: "https://i.imgur.com/zCowdDC.png",
    dataAiHint: "testimonial whatsapp",
    text: "A gratidão de ver uma vida transformada não tem preço. A jornada dela começou com um simples 'sim'.",
  },
  {
    type: "image",
    url: "https://i.imgur.com/dMFXsPL.png",
    dataAiHint: "testimonial whatsapp serene",
    text: "Quando a alma encontra o caminho certo, a cura acontece. Fico emocionada em fazer parte disso!",
  },
  {
    type: "image",
    url: "https://i.imgur.com/RsjRLRo.png",
    dataAiHint: "testimonial whatsapp energy",
    text: "Cada mentorada que floresce é uma prova de que estamos no caminho certo. A sua virada de chave também está próxima.",
  },
];

type StatusViewProps = {
  onFinish: () => void;
};

export function StatusView({ onFinish }: StatusViewProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const nextStory = useCallback(() => {
    setCurrentStoryIndex((prevIndex) => (prevIndex < stories.length - 1 ? prevIndex + 1 : prevIndex));
  }, []);

  const prevStory = useCallback(() => {
    setCurrentStoryIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  }, []);

  const currentStory = stories[currentStoryIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-2 mb-2">
            {stories.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
                    <div 
                        className="h-1 bg-white transition-all duration-300"
                        style={{ width: index === currentStoryIndex ? '100%' : '0%' }}
                    />
                </div>
            ))}
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage src="https://i.imgur.com/IhZA0Ke.png" alt="Luz" data-ai-hint="person portrait"/>
                    <AvatarFallback>L</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-white font-bold">Luz | Mentora do Despertar</p>
                    <p className="text-white/80 text-sm">agora mesmo</p>
                </div>
            </div>
          <button onClick={onFinish} className="text-white p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative flex items-center justify-center">
        {currentStory.type === "image" && (
          <>
            <Image
              src={currentStory.url}
              alt="Status"
              width={1080}
              height={1920}
              className="object-contain w-auto h-auto max-w-full max-h-full animate-in zoom-in-105 duration-500"
              data-ai-hint={currentStory.dataAiHint}
              priority={true}
            />
             <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-center text-lg md:text-xl font-medium italic">
                    {currentStory.text}
                </p>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-full w-32 bg-transparent hover:bg-black/10 text-white/50 hover:text-white disabled:opacity-0 transition-opacity"
            onClick={prevStory}
            disabled={currentStoryIndex === 0}
            aria-label="Previous Status"
          >
            <ChevronLeft size={32}/>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-full w-32 bg-transparent hover:bg-black/10 text-white/50 hover:text-white disabled:opacity-0 transition-opacity"
            onClick={nextStory}
            disabled={currentStoryIndex === stories.length - 1}
            aria-label="Next Status"
          >
            <ChevronRight size={32}/>
          </Button>
      </div>
    </div>
  );
}
