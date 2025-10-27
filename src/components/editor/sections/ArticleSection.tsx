import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Upload, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ArticleSectionProps {
  content: {
    title?: string;
    description?: string;
    quote?: string;
    link?: string;
    image?: string;
    imageAlt?: string;
    imageSize?: number;
    imageAlignment?: "left" | "center" | "right";
    textAlignment?: "left" | "center" | "right";
    isHero?: boolean;
  };
  onUpdate: (content: any) => void;
}

export const ArticleSection = ({ content, onUpdate }: ArticleSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...content, image: reader.result as string });
        setIsEditing(null);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <div className="mb-4 space-y-3 p-3 border rounded-md bg-muted/30">
          <div className={`relative group flex justify-${content.imageAlignment || "left"}`}>
            <img
              src={content.image}
              alt={content.imageAlt || "Article image"}
              style={{ width: `${content.imageSize || 100}%`, maxWidth: "100%" }}
              className="h-auto rounded border border-[hsl(var(--newsletter-section-border))]"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onUpdate({ ...content, image: undefined, imageAlt: undefined, imageSize: undefined, imageAlignment: undefined })}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Image Width: {content.imageSize || 100}%</label>
            <Slider
              value={[content.imageSize || 100]}
              onValueChange={(value) => onUpdate({ ...content, imageSize: value[0] })}
              min={20}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Image Alignment</label>
            <div className="flex gap-2">
              <Button
                variant={content.imageAlignment === "left" ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdate({ ...content, imageAlignment: "left" })}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={content.imageAlignment === "center" ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdate({ ...content, imageAlignment: "center" })}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={content.imageAlignment === "right" ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdate({ ...content, imageAlignment: "right" })}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
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
        <div className="mb-3 space-y-3 p-3 border rounded-md bg-muted/30">
          <Tabs defaultValue="url">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">
                <LinkIcon className="w-4 h-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-2">
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
            </TabsContent>
            <TabsContent value="upload" className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <p className="text-xs text-muted-foreground">Image will be embedded as Base64 for email compatibility</p>
            </TabsContent>
          </Tabs>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(null)}
          >
            Cancel
          </Button>
        </div>
      )}

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium">Text Alignment</label>
          <div className="flex gap-1">
            <Button
              variant={content.textAlignment === "left" ? "default" : "ghost"}
              size="sm"
              onClick={() => onUpdate({ ...content, textAlignment: "left" })}
            >
              <AlignLeft className="w-3 h-3" />
            </Button>
            <Button
              variant={content.textAlignment === "center" ? "default" : "ghost"}
              size="sm"
              onClick={() => onUpdate({ ...content, textAlignment: "center" })}
            >
              <AlignCenter className="w-3 h-3" />
            </Button>
            <Button
              variant={content.textAlignment === "right" ? "default" : "ghost"}
              size="sm"
              onClick={() => onUpdate({ ...content, textAlignment: "right" })}
            >
              <AlignRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {isEditing === "description" ? (
          <Textarea
            value={content.description || ""}
            onChange={(e) => onUpdate({ ...content, description: e.target.value })}
            onBlur={() => setIsEditing(null)}
            className="min-h-32 text-sm text-foreground/80 leading-relaxed"
            style={{ textAlign: content.textAlignment || "left" }}
            placeholder="Article content..."
            autoFocus
          />
        ) : (
          <p
            className="text-sm text-foreground/80 leading-relaxed cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
            style={{ textAlign: content.textAlignment || "left" }}
            onClick={() => setIsEditing("description")}
          >
            {content.description || "Click to add content..."}
          </p>
        )}
      </div>

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
