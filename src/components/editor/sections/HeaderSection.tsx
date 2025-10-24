import { useState } from "react";
import { Input } from "@/components/ui/input";

interface HeaderSectionProps {
  content: {
    company: string;
    title: string;
    date: string;
  };
  onUpdate: (content: any) => void;
}

export const HeaderSection = ({ content, onUpdate }: HeaderSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  return (
    <div className="bg-[hsl(var(--newsletter-header-bg))] text-white p-8">
      {isEditing === "company" ? (
        <Input
          value={content.company}
          onChange={(e) => onUpdate({ ...content, company: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="mb-4 text-2xl font-bold bg-white/10 border-white/20 text-white"
          autoFocus
        />
      ) : (
        <h1
          className="text-2xl font-bold mb-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setIsEditing("company")}
        >
          {content.company}
        </h1>
      )}

      {isEditing === "title" ? (
        <Input
          value={content.title}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="mb-2 text-lg bg-white/10 border-white/20 text-white"
          autoFocus
        />
      ) : (
        <h2
          className="text-lg mb-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setIsEditing("title")}
        >
          {content.title}
        </h2>
      )}

      <p className="text-sm opacity-80">{content.date}</p>
    </div>
  );
};
