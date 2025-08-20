import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video, Phone, MoreVertical } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="flex items-center justify-between p-2 md:p-3 border-b bg-secondary/50">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-background">
          <AvatarImage
            src="https://i.imgur.com/IhZA0Ke.png"
            alt="Luz"
            data-ai-hint="person portrait"
          />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-lg">Luz | Mentora do Despertar</h2>
          <p className="text-sm text-muted-foreground">online</p>
        </div>
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Video className="h-5 w-5" />
          <span className="sr-only">Video Call</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Phone className="h-5 w-5" />
          <span className="sr-only">Audio Call</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">More Options</span>
        </Button>
      </div>
    </header>
  );
}
