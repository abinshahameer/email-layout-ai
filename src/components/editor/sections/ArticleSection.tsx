import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";

interface ArticleSectionProps {
  content: {
    title?: string;
    description?: string;
    quote?: string;
    link?: string;
    image?: string;
    imageAlt?: string;
    isHero?: boolean;
  };
  onUpdate: (content: any) => void;
}

export const ArticleSection = ({ content, onUpdate }: ArticleSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  if (content.isHero) {
    return (
      <div className="relative bg-gradient-to-r from-[hsl(var(--newsletter-hero-gradient-start))] to-[hsl(var(--newsletter-hero-gradient-end))] text-white p-12">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing === "title" ? (
              <Input
                value={content.title || ""}
                onChange={(e) => onUpdate({ ...content, title: e.target.value })}
                onBlur={() => setIsEditing(null)}
                className="text-5xl font-black bg-white/10 border-white/20 text-white tracking-wider"
                placeholder="Newsletter title..."
                autoFocus
              />
            ) : (
              <h1
                className="text-5xl font-black cursor-pointer hover:opacity-90 transition-opacity tracking-wider"
                onClick={() => setIsEditing("title")}
              >
                {content.title || "NEWSLETTER TITLE"}
              </h1>
            )}
          </div>

          {content.quote && (
            <div className="ml-8 max-w-xs">
              {isEditing === "quote" ? (
                <Textarea
                  value={content.quote}
                  onChange={(e) => onUpdate({ ...content, quote: e.target.value })}
                  onBlur={() => setIsEditing(null)}
                  className="text-sm italic bg-white/10 border-white/20 text-white"
                  autoFocus
                />
              ) : (
                <p
                  className="text-sm italic cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setIsEditing("quote")}
                >
                  " {content.quote} "
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-[hsl(var(--newsletter-section-border))]">
      {isEditing === "title" ? (
        <Input
          value={content.title || ""}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="mb-3 text-lg font-bold text-primary"
          placeholder="Article title..."
          autoFocus
        />
      ) : (
        <h3
          className="text-lg font-bold text-primary mb-3 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
          onClick={() => setIsEditing("title")}
        >
          {content.title || "Click to add title..."}
        </h3>
      )}

      {content.image && (
        <div className="relative mb-4 group">
          <img
            src={content.image}
            alt={content.imageAlt || "Article image"}
            className="w-full h-auto rounded border border-[hsl(var(--newsletter-section-border))]"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onUpdate({ ...content, image: undefined, imageAlt: undefined })}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {!content.image && isEditing !== "image" && (
        <Button
          variant="outline"
          size="sm"
          className="mb-3"
          onClick={() => setIsEditing("image")}
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      )}

      {isEditing === "image" && !content.image && (
        <div className="mb-3 space-y-2 p-3 border rounded-md bg-muted/30">
          <Input
            placeholder="Image URL (https://...)"
            onChange={(e) => {
              if (e.target.value) {
                onUpdate({ ...content, image: e.target.value });
                setIsEditing(null);
              }
            }}
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(null)}
          >
            Cancel
          </Button>
        </div>
      )}

      {isEditing === "description" ? (
        <Textarea
          value={content.description || ""}
          onChange={(e) => onUpdate({ ...content, description: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="min-h-32 text-sm text-foreground/80 leading-relaxed mb-3"
          placeholder="Article content..."
          autoFocus
        />
      ) : (
        <p
          className="text-sm text-foreground/80 leading-relaxed mb-3 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
          onClick={() => setIsEditing("description")}
        >
          {content.description || "Click to add content..."}
        </p>
      )}

      {isEditing === "link" ? (
        <Input
          value={content.link || ""}
          onChange={(e) => onUpdate({ ...content, link: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="text-sm"
          placeholder="https://..."
          autoFocus
        />
      ) : (
        <a
          href={content.link || "#"}
          className="text-sm text-[hsl(var(--newsletter-link))] hover:underline cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setIsEditing("link");
          }}
        >
          {content.link || "Click to add link..."}
        </a>
      )}
    </div>
  );
};
