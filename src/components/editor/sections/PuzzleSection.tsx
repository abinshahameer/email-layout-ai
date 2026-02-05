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
    <div className={cn("p-4 sm:p-6 border-b border-[hsl(var(--newsletter-section-border))] bg-[hsl(var(--newsletter-puzzle-bg))]", isHalfWidth && "bg-[hsl(var(--newsletter-puzzle-bg-alt))]")}>
      <div className="mb-4 space-y-3">
        {isEditing === "title" ? (
          <Input
            value={content.title || ""}
            onChange={(e) => onUpdate({ ...content, title: e.target.value })}
            onBlur={() => setIsEditing(null)}
            className="text-xl sm:text-2xl font-bold text-primary"
            placeholder="Puzzle title..."
            autoFocus
          />
        ) : (
          <h3
            className="text-xl sm:text-2xl font-bold text-primary cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
            onClick={() => setIsEditing("title")}
          >
            {content.title || "Click to add puzzle title..."}
          </h3>
        )}

        <Tabs value={puzzleType} onValueChange={(value: "image" | "text") => onUpdate({ ...content, puzzleType: value })}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image">Image-Based Puzzle</TabsTrigger>
            <TabsTrigger value="text">Text-Based Puzzle</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          {puzzleType === "image" ? (
            content.puzzleImage ? (
            <div className="space-y-3">
              <div className="relative group">
                <img
                  src={content.puzzleImage}
                  alt="Puzzle"
                  style={{ width: `${content.puzzleImageSize || 100}%` }}
                  className="h-auto rounded border border-[hsl(var(--newsletter-section-border))] mx-auto"
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
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Image Size: {content.puzzleImageSize || 100}%</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={content.puzzleImageSize || 100}
                  onChange={(e) => onUpdate({ ...content, puzzleImageSize: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <>
              {isEditing !== "puzzleImage" ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditing("puzzleImage")}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Add Puzzle Image
                </Button>
              ) : (
                <div className="space-y-3 p-3 border rounded-md bg-muted/30">
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
                            onUpdate({ ...content, puzzleImage: e.target.value });
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
                        onChange={handleImageUpload("puzzleImage")}
                      />
                      <p className="text-xs text-muted-foreground">Image will be embedded as Base64</p>
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
            </>
          )
          ) : (
            isEditing === "puzzleText" ? (
              <Textarea
                value={content.puzzleText || ""}
                onChange={(e) => onUpdate({ ...content, puzzleText: e.target.value })}
                onBlur={() => setIsEditing(null)}
                className="min-h-32"
                placeholder="Enter your text-based puzzle here..."
                autoFocus
              />
            ) : (
              <div
                className="text-base whitespace-pre-wrap text-foreground/80 leading-relaxed cursor-pointer hover:bg-muted/50 rounded px-2 py-2 transition-colors min-h-32 border border-dashed border-[hsl(var(--newsletter-section-border))]"
                onClick={() => setIsEditing("puzzleText")}
              >
                {content.puzzleText || "Click to add text-based puzzle..."}
              </div>
            )
          )}
        </div>

        <div className="space-y-4">
          {puzzleType === "image" && (
            <>
              {isEditing === "instructions" ? (
                <Textarea
                  value={content.instructions || ""}
                  onChange={(e) => onUpdate({ ...content, instructions: e.target.value })}
                  onBlur={() => setIsEditing(null)}
                  className="min-h-32 text-base"
                  placeholder="Puzzle instructions..."
                  autoFocus
                />
              ) : (
                <div
                  className="text-base text-foreground/80 leading-relaxed cursor-pointer hover:bg-muted/50 rounded px-2 py-2 transition-colors min-h-32 whitespace-pre-wrap"
                  onClick={() => setIsEditing("instructions")}
                >
                  {content.instructions || "Click to add instructions..."}
                </div>
              )}
            </>
          )}

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Last Week's Answer</h4>
            
            {content.answerImage || content.answerText ? (
              <div className="space-y-2">
                {content.answerImage && (
                  <div className="relative group inline-block">
                    <img
                      src={content.answerImage}
                      alt="Answer"
                      className="max-w-full h-auto rounded border border-[hsl(var(--newsletter-section-border))]"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onUpdate({ ...content, answerImage: undefined })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                {content.answerText && (
                  <div className="relative group p-3 bg-muted/30 rounded border">
                    <p className="text-base whitespace-pre-wrap">{content.answerText}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    onClick={() => setIsEditing("answer")}
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Add Answer
                  </Button>
                ) : (
                  <div className="space-y-3 p-3 border rounded-md bg-muted/30">
                    <Tabs defaultValue="text">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="text">Text</TabsTrigger>
                        <TabsTrigger value="url">
                          <LinkIcon className="w-4 h-4 mr-2" />
                          URL
                        </TabsTrigger>
                        <TabsTrigger value="upload">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="text" className="space-y-2">
                        <Textarea
                          placeholder="Type the answer..."
                          defaultValue={content.answerText || ""}
                          onBlur={(e) => {
                            if (e.target.value) {
                              onUpdate({ ...content, answerText: e.target.value });
                              setIsEditing(null);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              onUpdate({ ...content, answerText: e.currentTarget.value });
                              setIsEditing(null);
                            }
                          }}
                          autoFocus
                          rows={3}
                        />
                      </TabsContent>
                      <TabsContent value="url" className="space-y-2">
                        <Input
                          placeholder="Image URL (https://...)"
                          onChange={(e) => {
                            if (e.target.value) {
                              onUpdate({ ...content, answerImage: e.target.value });
                              setIsEditing(null);
                            }
                          }}
                        />
                      </TabsContent>
                      <TabsContent value="upload" className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload("answerImage")}
                        />
                        <p className="text-xs text-muted-foreground">Image will be embedded as Base64</p>
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