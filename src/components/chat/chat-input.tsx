
"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type ChatInputProps = {
  userInput: string;
  onUserInput: (text: string) => void;
  onSendMessage: (text: string) => void;
  options?: string[];
  placeholder?: string;
};

export function ChatInput({
  userInput,
  onUserInput,
  onSendMessage,
  options,
  placeholder = "Digite uma mensagem...",
}: ChatInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      onSendMessage(userInput);
    }
  };

  const handleOptionClick = (option: string) => {
    onSendMessage(option);
  };
  
  const hasOnlyStatusOption = options && options.length === 1 && options[0] === 'Ver status';

  return (
    <div className="p-2 md:p-4 bg-background/80 backdrop-blur-sm border-t shrink-0">
       {options && options.length > 0 && !hasOnlyStatusOption && (
        <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex gap-2">
                {options.map((option) => (
                    <Button key={option} variant="outline" size="sm" className="bg-background" onClick={() => handleOptionClick(option)}>
                        {option}
                    </Button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={userInput}
          onChange={(e) => onUserInput(e.target.value)}
          className="flex-1 bg-secondary h-12 rounded-full px-5 border-transparent focus-visible:border-primary focus-visible:ring-primary"
          autoComplete="off"
          disabled={!!options && options.length > 0}
        />
        {userInput ? (
          <Button
            type="submit"
            size="icon"
            className="rounded-full shrink-0 w-12 h-12 bg-primary hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            className="rounded-full shrink-0 w-12 h-12 bg-primary hover:bg-primary/90"
            disabled={!!options && options.length > 0}
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Record audio</span>
          </Button>
        )}
      </form>
    </div>
  );
}
