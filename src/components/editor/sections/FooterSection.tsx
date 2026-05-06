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
    <div style={{ fontFamily: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif' }}>
      {/* Footer links bar */}
      <div 
        className="py-4 px-4 sm:px-8 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-white"
        style={{ backgroundColor: '#4E84C4' }}
      >
        {links.map((link, index) => (
          <a
            key={index}
            href={content?.url?.[index] || "#"}
            className="hover:underline transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link}
          </a>
        ))}
      </div>

      {/* Copyright bar */}
      <div 
        className="py-3 px-4 sm:px-8 text-center text-[10px] sm:text-xs font-normal"
        style={{ 
          backgroundColor: '#000000',
          color: '#FFFFFF'
        }}
      >
        {isEditing === "copyright" ? (
          <Input
            value={content.copyright || ""}
            onChange={(e) => onUpdate({ ...content, copyright: e.target.value })}
            onBlur={() => setIsEditing(null)}
            className="max-w-md mx-auto h-6 text-[10px] sm:text-xs text-center bg-transparent border-white/20 text-white"
            autoFocus
          />
        ) : (
          <p
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsEditing("copyright")}
          >
            {content.copyright || "© TCS Pace Port. All rights reserved."}
          </p>
        )}
      </div>
    </div>
  );
};
