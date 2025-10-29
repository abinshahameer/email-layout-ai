import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ComicSectionProps {
  content: {
    image?: string;
    caption?: string;
    imageSize?: number;
  };
  onUpdate: (content: any) => void;
  isHalfWidth?: boolean;
}

export const ComicSection = ({ content, onUpdate, isHalfWidth }: ComicSectionProps) => {
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

  return (
    <div className={cn("p-6 border-b border-[hsl(var(--newsletter-section-border))] bg-muted/20", isHalfWidth && "bg-muted/30")}>
      <h3 className="text-lg font-bold text-primary mb-4">Comic Section</h3>

      {content.image ? (
        <div className="space-y-3">
          <div className="relative group flex justify-center ">
            <img
              src={content.image}
              alt={content.caption || "Comic"}
              style={{ width: `${content.imageSize || 100}%` }}
              className="h-auto rounded border border-[hsl(var(--newsletter-section-border))]"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onUpdate({ ...content, image: undefined })}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Image Size: {content.imageSize || 100}%</label>
            <input
              type="range"
              min="20"
              max="100"
              value={content.imageSize || 100}
              onChange={(e) => onUpdate({ ...content, imageSize: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          {isEditing === "caption" ? (
            <Input
              value={content.caption || ""}
              onChange={(e) => onUpdate({ ...content, caption: e.target.value })}
              onBlur={() => setIsEditing(null)}
              placeholder="Add a caption..."
              autoFocus
            />
          ) : (
            <p
              className="text-sm text-center italic text-foreground/70 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors"
              onClick={() => setIsEditing("caption")}
            >
              {content.caption || "Click to add caption..."}
            </p>
          )}
        </div>
      ) : (
        <div>
          {isEditing === "image" ? (
            <div className="space-y-3 p-3 border rounded-md bg-background">
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
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsEditing("image")}
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Comic Image
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
