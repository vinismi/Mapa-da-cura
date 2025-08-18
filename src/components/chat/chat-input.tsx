"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Mic, Send } from "lucide-react";

type ChatInputProps = {
  userInput: string;
  onUserInput: (text: string) => void;
  onSendMessage: (text: string) => void;
};

export function ChatInput({
  userInput,
  onUserInput,
  onSendMessage,
}: ChatInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      onSendMessage(userInput);
    }
  };

  return (
    <div className="p-2 md:p-4 bg-secondary/50 border-t">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full shrink-0">
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button>
        <Input
          type="text"
          placeholder="Digite uma mensagem..."
          value={userInput}
          onChange={(e) => onUserInput(e.target.value)}
          className="flex-1 bg-background h-12 rounded-full px-5"
          autoComplete="off"
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
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Record audio</span>
          </Button>
        )}
      </form>
    </div>
  );
}
