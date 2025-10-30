import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Upload, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageCropper } from "../ImageCropper";
import { cn } from "@/lib/utils";

interface ArticleSectionProps {
  content: {
    title?: string;
    description?: string;
    quote?: string;
    link?: string;
    image?: string;
    imageAlt?: string;
    imageSize?: number;
    imagePosition?: "top" | "left" | "right";
    isHero?: boolean;
  };
  onUpdate: (content: any) => void;
  isHalfWidth?: boolean;
}

export const ArticleSection = ({ content, onUpdate, isHalfWidth }: ArticleSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCroppingImage(reader.result as string);
        setIsEditing(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = (croppedImage: string) => {
    onUpdate({ ...content, image: croppedImage });
    setCroppingImage(null);
  };

  if (content.isHero) {
    return (
      <div className="relative text-white p-12"  style={{
        background: "linear-gradient(to right, #0B63E5, #1242AC)"
      }}>
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
                  className="text-base italic bg-white/10 border-white/20 text-white"
                  autoFocus
                />
              ) : (
                <p
                  className="text-base italic cursor-pointer hover:opacity-90 transition-opacity"
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

  const imagePosition = content.imagePosition || "top";

  return (
    <div className={cn("p-6 border-b border-[hsl(var(--newsletter-section-border))]", isHalfWidth && "bg-muted/10")}>
      {isEditing === "title" ? (
        <Input
          value={content.title || ""}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="mb-3 text-xl font-bold text-primary"
          placeholder="Article title..."
          autoFocus
        />
      ) : (
        <h3
          className="text-xl font-bold text-primary mb-3 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
          onClick={() => setIsEditing("title")}
        >
          {content.title || "Click to add title..."}
        </h3>
      )}

      {content.image && (
        <div className="mb-4 space-y-3 p-3 border rounded-md bg-muted/30">
          <div className="space-y-2">
            <label className="text-xs font-medium">Image Position</label>
            <Select value={imagePosition} onValueChange={(value: "top" | "left" | "right") => onUpdate({ ...content, imagePosition: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Above Text</SelectItem>
                <SelectItem value="left">Left of Text</SelectItem>
                <SelectItem value="right">Right of Text</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="relative group flex justify-center">
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
              onClick={() => onUpdate({ ...content, image: undefined, imageAlt: undefined, imageSize: undefined, imagePosition: undefined })}
            >
              <X className="w-4 h-4" />
            </Button>
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

      <div className={imagePosition === "left" || imagePosition === "right" ? "flex gap-4 items-start" : ""}>
        {content.image && imagePosition === "left" && (
          <div style={{ flex: `0 0 ${content.imageSize || 40}%` }}>
            <img
              src={content.image}
              alt={content.imageAlt || "Article image"}
              className="w-full h-auto rounded border border-[hsl(var(--newsletter-section-border))]"
            />
          </div>
        )}

        <div className="flex-1 space-y-2 mb-3">
          {isEditing === "description" ? (
            <Textarea
              value={content.description || ""}
              onChange={(e) => onUpdate({ ...content, description: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="min-h-32 text-base text-foreground/80 leading-relaxed"
              placeholder="Article content..."
              autoFocus
            />
          ) : (
            <p
              className="text-base text-foreground/80 leading-relaxed cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
              onClick={() => setIsEditing("description")}
            >
              {content.description || "Click to add content..."}
            </p>
          )}
        </div>

        {content.image && imagePosition === "right" && (
          <div style={{ flex: `0 0 ${content.imageSize || 40}%` }}>
            <img
              src={content.image}
              alt={content.imageAlt || "Article image"}
              className="w-full h-auto rounded border border-[hsl(var(--newsletter-section-border))]"
            />
          </div>
        )}
      </div>

      {isEditing === "link" ? (
        <Input
          value={content.link || ""}
          onChange={(e) => onUpdate({ ...content, link: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="text-base"
          placeholder="https://..."
          autoFocus
        />
      ) : (
        <a
          href={content.link || "#"}
          className="text-base text-[hsl(var(--newsletter-link))] hover:underline cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setIsEditing("link");
          }}
        >
          {content.link || "Click to add link..."}
        </a>
      )}

      {croppingImage && (
        <ImageCropper
          image={croppingImage}
          onCrop={handleCrop}
          onClose={() => setCroppingImage(null)}
        />
      )}
    </div>
  );
};
