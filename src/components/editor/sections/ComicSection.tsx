import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageCropper } from "../ImageCropper";
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

  return (
    <div
      className={cn("p-4 sm:p-6 bg-[#F5F7FA]")}
      style={{ fontFamily: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif' }}
    >
      <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#4E84C4' }}>Comic Section</h3>

      {content.image ? (
        <div className="space-y-4">
          <div className="relative group flex justify-center ">
            <img
              src={content.image}
              alt={content.caption || "Comic"}
              style={{ width: `${content.imageSize || 100}%` }}
              className="h-auto rounded shadow-sm"
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

          <div className="space-y-2 max-w-xs mx-auto">
            <label className="text-xs font-bold uppercase text-gray-500">Image Size: {content.imageSize || 100}%</label>
            <input
              type="range"
              min="20"
              max="100"
              value={content.imageSize || 100}
              onChange={(e) => onUpdate({ ...content, imageSize: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4E84C4]"
            />
          </div>

          {isEditing === "caption" ? (
            <Input
              value={content.caption || ""}
              onChange={(e) => onUpdate({ ...content, caption: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="max-w-md mx-auto text-center"
              placeholder="Add a caption..."
              autoFocus
            />
          ) : (
            <p
              className="text-base text-center italic text-gray-600 cursor-pointer hover:bg-black/5 rounded px-2 py-1 transition-colors"
              onClick={() => setIsEditing("caption")}
            >
              {content.caption || "Click to add caption..."}
            </p>
          )}
        </div>
      ) : (
        <div>
          {isEditing === "image" ? (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50 shadow-inner">
              <p className="text-xs text-gray-500 text-center">
                Need a comic? Try the <a href="http://172.210.248.28:3053/" target="_blank" rel="noopener noreferrer" className="text-[#4E84C4] font-bold underline">Comic Generation Tool</a>.
              </p>
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
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed border-2 h-20"
              onClick={() => setIsEditing("image")}
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Comic Image
            </Button>
          )}
        </div>
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

