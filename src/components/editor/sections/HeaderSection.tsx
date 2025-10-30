import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderSectionProps {
  content: {
    logo: string;
    date: string;
    episode: string;
    lab: string;
  };
  onUpdate: (content: any) => void;
}

export const HeaderSection = ({ content, onUpdate }: HeaderSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  return (
    <div className="bg-[hsl(var(--newsletter-header-bg))] text-white px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isEditing === "logo" ? (
          <Input
            value={content.logo}
            onChange={(e) => onUpdate({ ...content, logo: e.target.value })}
            onBlur={() => setIsEditing(null)}
            className="w-32 text-base font-semibold bg-white/10 border-white/20 text-white"
            autoFocus
          />
        ) : (
          <div
            className="text-base font-semibold cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
            // onClick={() => setIsEditing("logo")}
          >
            <img
              src="https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/logo-rgb-white.png"
              alt="TCS Logo"
              className="h-8 object-contain"
            />
            {/* <span className="text-primary font-bold text-base">TCS</span>
            <span className="text-xs uppercase tracking-wide">TATA CONSULTANCY<br/>SERVICES</span> */}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 text-base">
          {isEditing === "episode" ? (
            <Input
              value={content.episode}
              onChange={(e) => onUpdate({ ...content, episode: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="w-32 bg-white/10 border-white/20 text-white"
              autoFocus
            />
          ) : (
            <span
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsEditing("episode")}
            >
              {content.episode}
            </span>
          )}

          {isEditing === "lab" ? (
            <Input
              value={content.lab}
              onChange={(e) => onUpdate({ ...content, lab: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="w-48 bg-white/10 border-white/20 text-white"
              autoFocus
            />
          ) : (
            <span
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsEditing("lab")}
            >
              {content.lab}
            </span>
          )}

          <Button
            asChild
            variant="outline"
            className="rounded-full bg-primary text-white border-primary hover:bg-white hover:text-primary"
          >
            <a href="https://forms.office.com/r/8exqUT0nmD" target="_blank">
              Subscribe
            </a>
          </Button>
        </div>
    </div>
  );
};
