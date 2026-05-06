import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ImagePlus, X, Upload, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
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
    linkText?: string;
    image?: string;
    imageAlt?: string;
    imageSize?: number;
    imagePosition?: "top" | "left" | "right";
    isHero?: boolean;
    date?: string;
  };
  onUpdate: (content: any) => void;
  isHalfWidth?: boolean;
  isAlternate?: boolean;
}

export const ArticleSection = ({ content, onUpdate, isHalfWidth, isAlternate }: ArticleSectionProps) => {
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

  // Hero section is now part of HeaderSection, but keep for backward compatibility
  if (content.isHero) {
    return null;
  }

  const imagePosition = content.imagePosition || "top";
  const brandBlue = "#4E84C4";

  return (
    <div 
      className={cn("p-4 sm:p-6 transition-colors", isAlternate ? "bg-[#F5F7FA]" : "bg-white")}
      style={{ fontFamily: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif' }}
    >
      {isEditing === "title" ? (
        <Input
          value={content.title || ""}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="mb-3 text-lg sm:text-xl font-bold border-brand"
          style={{ color: '#000000' }}
          placeholder="Article title..."
          autoFocus
        />
      ) : (
        <h3
          className="text-lg sm:text-xl font-bold mb-3 cursor-pointer hover:bg-black/5 rounded px-2 py-1 -mx-2 transition-colors"
          style={{ color: '#000000' }}
          onClick={() => setIsEditing("title")}
        >
          {content.title || "Click to add title..."}
        </h3>
      )}

      <div className="mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal border-gray-200",
                !content.date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {content.date ? (
                isNaN(new Date(content.date).getTime()) 
                  ? content.date 
                  : format(new Date(content.date), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={content.date && !isNaN(new Date(content.date).getTime()) ? new Date(content.date) : undefined}
              onSelect={(date) => onUpdate({ ...content, date: date?.toISOString() })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {content.image && (
        <div className="mb-4 space-y-3 p-3 border rounded-md bg-white/50">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Position</label>
              <Select value={imagePosition} onValueChange={(value: "top" | "left" | "right") => onUpdate({ ...content, imagePosition: value })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Above Text</SelectItem>
                  <SelectItem value="left">Left of Text</SelectItem>
                  <SelectItem value="right">Right of Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Width: {content.imageSize || 100}%</label>
              <Slider
                value={[content.imageSize || 100]}
                onValueChange={(value) => onUpdate({ ...content, imageSize: value[0] })}
                min={20}
                max={100}
                step={5}
                className="py-2"
              />
            </div>
          </div>

          <div className="relative group flex justify-center">
            <img
              src={content.image}
              alt={content.imageAlt || "Article image"}
              style={{ width: `${content.imageSize || 100}%`, maxWidth: "100%" }}
              className="h-auto rounded shadow-sm"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
              onClick={() => onUpdate({ ...content, image: undefined, imageAlt: undefined, imageSize: undefined, imagePosition: undefined })}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {!content.image && isEditing !== "image" && (
        <Button
          variant="outline"
          size="sm"
          className="mb-4 border-dashed border-2 h-10 w-full"
          onClick={() => setIsEditing("image")}
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      )}

      {isEditing === "image" && !content.image && (
        <div className="mb-4 space-y-3 p-3 border rounded-md bg-white shadow-sm">
          <Tabs defaultValue="url">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-2 mt-2">
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
            <TabsContent value="upload" className="space-y-2 mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </TabsContent>
          </Tabs>
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8"
            onClick={() => setIsEditing(null)}
          >
            Cancel
          </Button>
        </div>
      )}

      <div className={imagePosition === "left" || imagePosition === "right" ? "md:flex gap-5 md:items-start" : ""}>
        {content.image && imagePosition === "left" && (
          <div className="mb-4 md:mb-0" style={{ flex: `0 0 ${content.imageSize || 40}%` }}>
            <img
              src={content.image}
              alt={content.imageAlt || "Article image"}
              className="w-full h-auto rounded shadow-sm"
            />
          </div>
        )}

        <div className="flex-1 space-y-2 mb-4">
          {isEditing === "description" ? (
            <Textarea
              value={content.description || ""}
              onChange={(e) => onUpdate({ ...content, description: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="min-h-32 text-base text-gray-700 leading-relaxed border-brand"
              placeholder="Article content..."
              autoFocus
            />
          ) : (
            <p
              className="text-base text-gray-700 leading-relaxed cursor-pointer hover:bg-black/5 rounded px-2 py-1 -mx-2 transition-colors whitespace-pre-wrap"
              onClick={() => setIsEditing("description")}
            >
              {content.description || "Click to add content..."}
            </p>
          )}
        </div>

        {content.image && imagePosition === "right" && (
          <div className="mb-4 md:mb-0" style={{ flex: `0 0 ${content.imageSize || 40}%` }}>
            <img
              src={content.image}
              alt={content.imageAlt || "Article image"}
              className="w-full h-auto rounded shadow-sm"
            />
          </div>
        )}
      </div>

      <div className="mt-2">
        {isEditing === "link" ? (
          <div className="space-y-2 p-3 border rounded-md bg-white shadow-sm">
            <Input
              value={content.link || ""}
              onChange={(e) => onUpdate({ ...content, link: e.target.value })}
              className="text-sm"
              placeholder="https://..."
              autoFocus
            />
            <Input
              value={content.linkText || ""}
              onChange={(e) => onUpdate({ ...content, linkText: e.target.value })}
              className="text-sm"
              placeholder={`Link text`}
            />
            <Button variant="secondary" size="sm" className="w-full" onClick={() => setIsEditing(null)}>Done</Button>
          </div>
        ) : (
          <a
            href={content.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-bold hover:underline cursor-pointer inline-flex items-center"
            style={{ color: brandBlue }}
            onClick={(e) => {
              e.preventDefault();
              setIsEditing("link");
            }}
          >
            {content.link 
              ? (content.linkText ? `Read more: ${content.linkText}` : "Read more") 
              : "Click to add link..."}
          </a>
        )}
      </div>

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

