import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, ExternalLink } from "lucide-react";

interface ExtendedReadingSectionProps {
  content: {
    links?: Array<{ title: string; url: string }>;
  };
  onUpdate: (content: any) => void;
}

export const ExtendedReadingSection = ({ content, onUpdate }: ExtendedReadingSectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const links = content.links || [];

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      onUpdate({ ...content, links: [...links, newLink] });
      setNewLink({ title: "", url: "" });
      setIsAdding(false);
    }
  };

  const handleRemoveLink = (index: number) => {
    onUpdate({ ...content, links: links.filter((_, i) => i !== index) });
  };

  return (
    <div className="p-6 border-b border-[hsl(var(--newsletter-section-border))] bg-accent/5">
      <h3 className="text-lg font-bold text-primary mb-4">Extended Reading</h3>

      {links.length > 0 && (
        <div className="space-y-2 mb-4">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-background rounded border group hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{link.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveLink(index)}
              >
                <X className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="space-y-3 p-3 border rounded-md bg-background">
          <Input
            placeholder="Link title..."
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            autoFocus
          />
          <Input
            placeholder="URL (https://...)"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddLink}>
              Add Link
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {
              setIsAdding(false);
              setNewLink({ title: "", url: "" });
            }}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reading Link
        </Button>
      )}
    </div>
  );
};
