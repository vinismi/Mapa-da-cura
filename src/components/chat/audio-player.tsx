
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Play, Pause, Headphones } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type AudioPlayerProps = {
  audioSrc: string;
  audioText?: string;
};

export function AudioPlayer({ audioSrc, audioText }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Audio play failed:", error);
        setIsPlaying(false); // Revert state if play fails
      }
    }
  };
  
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration > 0) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleLoadedData = () => {
    const audio = audioRef.current;
    if (audio) {
        setDuration(audio.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if(audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    if(audioRef.current && duration > 0) {
        const newTime = (value[0] / 100) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(value[0]);
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  if (!isMounted) {
    return null; // Don't render on the server to avoid hydration errors
  }

  return (
    <div className="w-full max-w-xs">
      <audio 
        ref={audioRef}
        src={audioSrc}
        onLoadedData={handleLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
        className="hidden"
      />
      <div className="flex items-center gap-3 w-full">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src="https://i.imgur.com/WNYMiGs.png"
            alt="Luz"
            data-ai-hint="person portrait"
          />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col justify-center gap-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 shrink-0 bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
            <Slider
              value={[progress]}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              className={cn(
                "[&>span]:h-1 [&>span>span]:bg-primary [&>span>span]:h-1 [&>span>button]:h-3 [&>span>button]:w-3 [&>span>button]:border-primary"
              )}
            />
          </div>
          <div className="flex justify-between items-center pl-10">
             <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
             <Headphones className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      {audioText && <p className="text-foreground mt-2">{audioText}</p>}
    </div>
  );
}
