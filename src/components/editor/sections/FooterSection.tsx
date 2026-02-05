import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FooterSectionProps {
  content: {
    links?: string[];
    url?: string[];
    copyright?: string;
  };
  onUpdate: (content: any) => void;
}

export const FooterSection = ({ content, onUpdate }: FooterSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const defaultLinks = ["Subscribe", "View in browser", "Privacy policy"];
  const links = content.links?.length ? content.links : defaultLinks;

  return (
    <div>
      {/* Footer links */}
      <div 
        className="py-3 sm:py-4 px-4 sm:px-8 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-white"
        style={{ backgroundColor: '#0052a3' }}
      >
        {links.map((link, index) => (
          <a
            key={index}
            href={content?.url?.[index] || "#"}
            className="hover:underline hover:opacity-80 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <div 
        className="py-2 sm:py-3 px-4 sm:px-8 text-center text-[10px] sm:text-xs"
        style={{ 
          backgroundColor: '#003d7a',
          color: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        {isEditing === "copyright" ? (
          <Input
            value={content.copyright || ""}
            onChange={(e) => onUpdate({ ...content, copyright: e.target.value })}
            onBlur={() => setIsEditing(null)}
            className="max-w-md mx-auto text-[10px] sm:text-xs text-center bg-transparent border-white/20 text-white"
            autoFocus
          />
        ) : (
          <p
            className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
            onClick={() => setIsEditing("copyright")}
          >
            {content.copyright || "TCS Pace Port, São Paulo. All rights reserved"}
          </p>
        )}
      </div>
    </div>
  );
};
