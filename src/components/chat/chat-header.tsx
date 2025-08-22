
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video, Phone, MoreVertical } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="flex items-center justify-between p-2 md:p-3 bg-primary text-primary-foreground shadow-lg shrink-0">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-white/50">
          <AvatarImage
            src="https://i.imgur.com/IhZA0Ke.png"
            alt="Luz"
            data-ai-hint="person portrait"
          />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-base md:text-lg">Luz | Mentora</h2>
          <p className="text-sm text-white/80 font-medium">online</p>
        </div>
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20">
          <Video className="h-5 w-5" />
          <span className="sr-only">Video Call</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20">
          <Phone className="h-5 w-5" />
          <span className="sr-only">Audio Call</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20">
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">More Options</span>
        </Button>
      </div>
    </header>
  );
}
