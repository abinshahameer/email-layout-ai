import { useState } from "react";
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
    <div className="bg-[hsl(var(--newsletter-header-bg))]">
      {/* Top bar with logo and location */}
      <div className="bg-[hsl(var(--newsletter-header-top-bg))] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/logo-rgb-white.png"
            alt="TCS Logo"
            className="h-6 object-contain"
          />
        </div>

        <div className="flex items-center gap-6 text-sm">
          {isEditing === "lab" ? (
            <Input
              value={content.lab}
              onChange={(e) => onUpdate({ ...content, lab: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="w-48 h-7 bg-white/10 border-white/20 text-white text-sm"
              autoFocus
            />
          ) : (
            <span
              className="cursor-pointer hover:opacity-80 transition-opacity font-medium"
              onClick={() => setIsEditing("lab")}
            >
              {content.lab || "Pace Port, São Paulo"}
            </span>
          )}

          {isEditing === "episode" ? (
            <Input
              value={content.episode}
              onChange={(e) => onUpdate({ ...content, episode: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="w-24 h-7 bg-white/10 border-white/20 text-white text-sm"
              autoFocus
            />
          ) : (
            <span
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsEditing("episode")}
            >
              {content.episode || "Episode 01"}
            </span>
          )}
        </div>
      </div>

      {/* Hero section with gradient background */}
      <div 
        className="relative py-16 px-8 text-center"
        style={{
          background: 'linear-gradient(180deg, hsl(213 100% 30%) 0%, hsl(220 60% 12%) 100%)'
        }}
      >
        {/* Large background text */}
        <div 
          className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-20 pointer-events-none"
          style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '0.1em', color: 'white' }}
        >
          TCS Pace Port
        </div>

        {/* Date badge */}
        <div className="relative z-10 mb-6">
          <div 
            className="inline-block px-8 py-2 rounded-sm font-semibold text-lg"
            style={{ 
              backgroundColor: 'hsl(46 100% 50%)',
              color: 'hsl(220 60% 10%)'
            }}
          >
            {isEditing === "date" ? (
              <Input
                value={content.date}
                onChange={(e) => onUpdate({ ...content, date: e.target.value })}
                onBlur={() => setIsEditing(null)}
                className="w-40 h-8 bg-transparent border-none text-center font-semibold"
                autoFocus
              />
            ) : (
              <span 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsEditing("date")}
              >
                {content.date || "January 2026"}
              </span>
            )}
          </div>
        </div>

        {/* Newsletter title */}
        <h1 
          className="relative z-10 text-white font-black tracking-[0.3em] uppercase"
          style={{ fontSize: '2.5rem' }}
        >
          NEWSLETTER
        </h1>
      </div>
    </div>
  );
};
