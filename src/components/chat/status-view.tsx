
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const stories = [
  {
    type: "image",
    url: "https://placehold.co/1080x1920.png",
    dataAiHint: "spiritual testimonial happy",
    duration: 5000,
    text: "“Eu me sentia perdida, sem rumo. O Mapa da Cura me deu a clareza que eu precisava para seguir em frente.” - Maria S.",
  },
  {
    type: "image",
    url: "https://placehold.co/1080x1920.png",
    dataAiHint: "peaceful serene journey",
    duration: 5000,
    text: "“Encontrei uma paz interior que não sentia há anos. Sou muito grata por essa jornada de autoconhecimento.” - Carlos P.",
  },
  {
    type: "image",
    url: "https://placehold.co/1080x1920.png",
    dataAiHint: "energy alignment light",
    duration: 5000,
    text: "“Minha energia está completamente renovada. As meditações são poderosas e transformadoras.” - Ana L.",
  },
];

type StatusViewProps = {
  onFinish: () => void;
};

export function StatusView({ onFinish }: StatusViewProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentStory = stories[currentStoryIndex];
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            return 0;
          } else {
            clearInterval(interval);
            onFinish();
            return 100;
          }
        }
        return prev + 100 / (currentStory.duration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, onFinish]);
  
  const goToPrevious = () => {
    setCurrentStoryIndex((prev) => {
       const newIndex = prev > 0 ? prev - 1 : 0;
       if (prev !== newIndex) setProgress(0);
       return newIndex;
    });
  };
  
  const goToNext = () => {
     if (currentStoryIndex < stories.length - 1) {
        setCurrentStoryIndex((prev) => prev + 1);
        setProgress(0);
    } else {
        onFinish();
    }
  };


  const currentStory = stories[currentStoryIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20">
        <div className="flex items-center gap-2 mb-2">
            {stories.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
                    <div 
                        className="h-1 bg-white rounded-full transition-all duration-100 linear"
                        style={{ width: `${index === currentStoryIndex ? progress : index < currentStoryIndex ? 100 : 0}%` }}
                    />
                </div>
            ))}
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage src="https://i.imgur.com/WNYMiGs.png" alt="Luz" data-ai-hint="person portrait"/>
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
         <div className="absolute left-0 top-0 bottom-0 w-1/3 z-30" onClick={goToPrevious}></div>
         <div className="absolute right-0 top-0 bottom-0 w-2/3 z-30" onClick={goToNext}></div>

        {currentStory.type === "image" && (
          <>
            <Image
              src={currentStory.url}
              alt="Status"
              layout="fill"
              objectFit="cover"
              className="animate-in zoom-in-105 duration-500"
              data-ai-hint={currentStory.dataAiHint}
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
