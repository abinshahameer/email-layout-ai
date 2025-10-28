import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FooterSectionProps {
  content: {
    links?: string[];
    copyright?: string;
  };
  onUpdate: (content: any) => void;
}

export const FooterSection = ({ content, onUpdate }: FooterSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  return (
    <div className="bg-muted p-8 text-center">
      <div className="flex justify-center gap-6 mb-4 text-sm">
        {(content.links || []).map((link, index) => (
          <a
            key={index}
            href="#"
            className="text-primary hover:underline"
          >
            {link}
          </a>
        ))}
      </div>

      {isEditing === "copyright" ? (
        <Input
          value={content.copyright || ""}
          onChange={(e) => onUpdate({ ...content, copyright: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="max-w-md mx-auto text-sm text-center"
          autoFocus
        />
      ) : (
        <p
          className="text-sm text-muted-foreground cursor-pointer hover:bg-background/50 rounded px-2 py-1 inline-block transition-colors"
          onClick={() => setIsEditing("copyright")}
        >
          {content.copyright || "Click to add copyright..."}
        </p>
      )}
    </div>
  );
};
