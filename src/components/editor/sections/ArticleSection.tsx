import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ArticleSectionProps {
  content: {
    title?: string;
    description?: string;
  };
  onUpdate: (content: any) => void;
}

export const ArticleSection = ({ content, onUpdate }: ArticleSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  return (
    <div className="p-8 border-b border-[hsl(var(--newsletter-section-border))]">
      {isEditing === "title" ? (
        <Input
          value={content.title || ""}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="mb-4 text-xl font-semibold"
          placeholder="Article title..."
          autoFocus
        />
      ) : (
        <h3
          className="text-xl font-semibold mb-4 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
          onClick={() => setIsEditing("title")}
        >
          {content.title || "Click to add title..."}
        </h3>
      )}

      {isEditing === "description" ? (
        <Textarea
          value={content.description || ""}
          onChange={(e) => onUpdate({ ...content, description: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="min-h-32 text-foreground/80 leading-relaxed"
          placeholder="Article content..."
          autoFocus
        />
      ) : (
        <p
          className="text-foreground/80 leading-relaxed cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
          onClick={() => setIsEditing("description")}
        >
          {content.description || "Click to add content..."}
        </p>
      )}
    </div>
  );
};
