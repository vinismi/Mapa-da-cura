"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Play, Pause, Headphones } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type AudioPlayerProps = {
  audioSrc: string;
};

export function AudioPlayer({ audioSrc }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
   useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    const setAudioTime = () => {
        const newProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(newProgress);
        setCurrentTime(audio.currentTime);
    }

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const handleSliderChange = (value: number[]) => {
    if(audioRef.current) {
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

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center gap-3 w-full">
        <audio ref={audioRef} src={audioSrc} preload="metadata" />
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
            onValueChange={handleSliderChange}
            max={100}
            step={1}
            className={cn(
              "[&>span]:h-1 [&>span>span]:bg-primary [&>span>span]:h-1 [&>span>button]:h-3 [&>span>button]:w-3 [&>span>button]:border-primary"
            )}
          />
          <div className="flex justify-between items-center">
             <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
             <Headphones className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage
            src="https://placehold.co/100x100.png"
            alt="Sales Rep"
            data-ai-hint="person portrait"
          />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
