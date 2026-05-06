import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Upload, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageCropper } from "../ImageCropper";
import { cn } from "@/lib/utils";

interface PuzzleSectionProps {
  content: {
    title?: string;
    puzzleType?: "image" | "text";
    puzzleImage?: string;
    puzzleImageSize?: number;
    puzzleText?: string;
    instructions?: string;
    answerImage?: string;
    answerText?: string;
  };
  onUpdate: (content: any) => void;
  isHalfWidth?: boolean;
}

export const PuzzleSection = ({ content, onUpdate, isHalfWidth }: PuzzleSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [croppingImage, setCroppingImage] = useState<{field: "puzzleImage" | "answerImage", src: string} | null>(null);
  const puzzleType = content.puzzleType || "image";
  const brandBlue = "#4E84C4";
  const brandOrange = "#F15A29";

  const handleImageUpload = (field: "puzzleImage" | "answerImage") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCroppingImage({ field, src: reader.result as string });
        setIsEditing(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = (croppedImage: string) => {
    if (croppingImage) {
      onUpdate({ ...content, [croppingImage.field]: croppedImage });
      setCroppingImage(null);
    }
  };

  return (
    <div 
      className={cn("p-4 sm:p-6 border-b border-gray-100 bg-[#E8F1F8]")}
      style={{ fontFamily: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif' }}
    >
      <div className="mb-6 space-y-4">
        {isEditing === "title" ? (
          <Input
            value={content.title || ""}
            onChange={(e) => onUpdate({ ...content, title: e.target.value })}
            onBlur={() => setIsEditing(null)}
            className="text-xl sm:text-2xl font-bold bg-white/50 border-brand"
            style={{ color: brandOrange }}
            placeholder="Puzzle title..."
            autoFocus
          />
        ) : (
          <h3
            className="text-xl sm:text-2xl font-bold cursor-pointer hover:bg-black/5 rounded px-2 py-1 -mx-2 transition-colors"
            style={{ color: brandOrange }}
            onClick={() => setIsEditing("title")}
          >
            {content.title || "Click to add puzzle title..."}
          </h3>
        )}

        <Tabs value={puzzleType} onValueChange={(value: "image" | "text") => onUpdate({ ...content, puzzleType: value })}>
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="image">Image Puzzle</TabsTrigger>
            <TabsTrigger value="text">Text Puzzle</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-4">
          {puzzleType === "image" ? (
            content.puzzleImage ? (
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={content.puzzleImage}
                  alt="Puzzle"
                  style={{ width: `${content.puzzleImageSize || 100}%` }}
                  className="h-auto rounded shadow-md mx-auto"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onUpdate({ ...content, puzzleImage: undefined })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 max-w-xs mx-auto sm:mx-0">
                <label className="text-xs font-bold uppercase text-gray-500">Image Size: {content.puzzleImageSize || 100}%</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={content.puzzleImageSize || 100}
                  onChange={(e) => onUpdate({ ...content, puzzleImageSize: Number(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4E84C4]"
                />
              </div>
            </div>
          ) : (
            <>
              {isEditing !== "puzzleImage" ? (
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2 h-32"
                  onClick={() => setIsEditing("puzzleImage")}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Add Puzzle Image
                </Button>
              ) : (
                <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
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
                            onUpdate({ ...content, puzzleImage: e.target.value });
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
                        onChange={handleImageUpload("puzzleImage")}
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
            </>
          )
          ) : (
            isEditing === "puzzleText" ? (
              <Textarea
                value={content.puzzleText || ""}
                onChange={(e) => onUpdate({ ...content, puzzleText: e.target.value })}
                onBlur={() => setIsEditing(null)}
                className="min-h-40 bg-white border-brand"
                placeholder="Enter your text-based puzzle here..."
                autoFocus
              />
            ) : (
              <div
                className="text-base whitespace-pre-wrap text-gray-700 leading-relaxed cursor-pointer hover:bg-white/50 rounded p-4 transition-colors min-h-40 border-2 border-dashed border-gray-300 bg-white/30"
                onClick={() => setIsEditing("puzzleText")}
              >
                {content.puzzleText || "Click to add text-based puzzle..."}
              </div>
            )
          )}
        </div>

        <div className="space-y-6">
          {puzzleType === "image" && (
            <>
              {isEditing === "instructions" ? (
                <Textarea
                  value={content.instructions || ""}
                  onChange={(e) => onUpdate({ ...content, instructions: e.target.value })}
                  onBlur={() => setIsEditing(null)}
                  className="min-h-32 text-base bg-white border-brand"
                  placeholder="Puzzle instructions..."
                  autoFocus
                />
              ) : (
                <div
                  className="text-base text-gray-700 leading-relaxed cursor-pointer hover:bg-white/50 rounded p-3 transition-colors min-h-32 whitespace-pre-wrap italic"
                  onClick={() => setIsEditing("instructions")}
                >
                  {content.instructions || "Click to add instructions..."}
                </div>
              )}
            </>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-bold uppercase text-gray-500 mb-3">Last Week's Answer</h4>
            
            {content.answerImage || content.answerText ? (
              <div className="space-y-4">
                {content.answerImage && (
                  <div className="relative group inline-block">
                    <img
                      src={content.answerImage}
                      alt="Answer"
                      className="max-w-full h-auto rounded shadow-sm border border-white"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={() => onUpdate({ ...content, answerImage: undefined })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                {content.answerText && (
                  <div className="relative group p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <p className="text-base text-gray-700 whitespace-pre-wrap">{content.answerText}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={() => onUpdate({ ...content, answerText: undefined })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {isEditing !== "answer" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-10"
                    onClick={() => setIsEditing("answer")}
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Add Answer
                  </Button>
                ) : (
                  <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
                    <Tabs defaultValue="text">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="text">Text</TabsTrigger>
                        <TabsTrigger value="url">URL</TabsTrigger>
                        <TabsTrigger value="upload">File</TabsTrigger>
                      </TabsList>
                      <TabsContent value="text" className="mt-2">
                        <Textarea
                          placeholder="Type the answer..."
                          defaultValue={content.answerText || ""}
                          onBlur={(e) => {
                            if (e.target.value) {
                              onUpdate({ ...content, answerText: e.target.value });
                              setIsEditing(null);
                            }
                          }}
                          className="min-h-24"
                          autoFocus
                        />
                      </TabsContent>
                      <TabsContent value="url" className="mt-2">
                        <Input
                          placeholder="Image URL"
                          onChange={(e) => {
                            if (e.target.value) {
                              onUpdate({ ...content, answerImage: e.target.value });
                              setIsEditing(null);
                            }
                          }}
                        />
                      </TabsContent>
                      <TabsContent value="upload" className="mt-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload("answerImage")}
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
              </>
            )}
          </div>
        </div>
      </div>

      {croppingImage && (
        <ImageCropper
          image={croppingImage.src}
          onCrop={handleCrop}
          onClose={() => setCroppingImage(null)}
        />
      )}
    </div>
  );
};