
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const stories = [
  {
    type: "image",
    url: "https://i.imgur.com/zCowdDC.png",
    dataAiHint: "testimonial whatsapp",
    duration: 10000,
    text: "A gratidão de ver uma vida transformada não tem preço. A jornada dela começou com um simples 'sim'.",
  },
  {
    type: "image",
    url: "https://i.imgur.com/dMFXsPL.png",
    dataAiHint: "testimonial whatsapp serene",
    duration: 10000,
    text: "Quando a alma encontra o caminho certo, a cura acontece. Fico emocionada em fazer parte disso!",
  },
  {
    type: "image",
    url: "https://i.imgur.com/RsjRLRo.png",
    dataAiHint: "testimonial whatsapp energy",
    duration: 10000,
    text: "Cada mentorada que floresce é uma prova de que estamos no caminho certo. A sua virada de chave também está próxima.",
  },
];

type StatusViewProps = {
  onFinish: () => void;
};

export function StatusView({ onFinish }: StatusViewProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const requestRef = useRef<number>();

  const nextStory = useCallback(() => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      onFinish();
    }
  }, [currentStoryIndex, onFinish]);

  useEffect(() => {
    if (isPaused) return;

    const currentStory = stories[currentStoryIndex];
    let startTime = Date.now() - (progress / 100) * currentStory.duration;

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / currentStory.duration) * 100;

      if (newProgress >= 100) {
        nextStory();
        return;
      }
      setProgress(newProgress);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [currentStoryIndex, isPaused, progress, nextStory]);

  const handleInteractionStart = () => {
    setIsPaused(true);
  };
  
  const handleInteractionEnd = () => {
    setIsPaused(false);
  };

  const currentStory = stories[currentStoryIndex];

  return (
    <div 
        className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in"
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onTouchEnd={handleInteractionEnd}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20">
        <div className="flex items-center gap-2 mb-2">
            {stories.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                        className="h-1 bg-white"
                        style={{ width: `${index === currentStoryIndex ? progress : index < currentStoryIndex ? 100 : 0}%` }}
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
          <button onClick={onFinish} className="text-white p-2">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {currentStory.type === "image" && (
          <>
            <Image
              src={currentStory.url}
              alt="Status"
              layout="fill"
              objectFit="contain"
              className="animate-in zoom-in-105 duration-500"
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
    </div>
  );
}
