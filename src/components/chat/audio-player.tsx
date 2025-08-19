"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type AudioPlayerProps = {
  text?: string;
};

export function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25); // initial decorative progress

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center gap-3 w-full">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src="https://placehold.co/100x100.png"
            alt="Sales Rep"
            data-ai-hint="person portrait"
          />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-12 w-12 shrink-0 bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>
        <div className="flex-1 flex flex-col justify-center gap-1">
          <Slider
            value={[progress]}
            onValueChange={(value) => setProgress(value[0])}
            max={100}
            step={1}
            className={cn(
              "[&>span]:h-1 [&>span>span]:bg-primary [&>span>span]:h-1 [&>span>button]:h-3 [&>span>button]:w-3 [&>span>button]:border-primary"
            )}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0:12</span>
            <span>0:48</span>
          </div>
        </div>
      </div>
       {text && (
        <div className="mt-2 pt-2 border-t border-black/10">
          <p className="text-sm text-foreground">{text}</p>
        </div>
      )}
    </div>
  );
}
