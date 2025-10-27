import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Upload, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PuzzleSectionProps {
  content: {
    title?: string;
    puzzleImage?: string;
    instructions?: string;
    qrCode?: string;
  };
  onUpdate: (content: any) => void;
}

export const PuzzleSection = ({ content, onUpdate }: PuzzleSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleImageUpload = (field: "puzzleImage" | "qrCode") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...content, [field]: reader.result as string });
        setIsEditing(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 border-b border-[hsl(var(--newsletter-section-border))] bg-[hsl(var(--newsletter-puzzle-bg))]">
      {isEditing === "title" ? (
        <Input
          value={content.title || ""}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          onBlur={() => setIsEditing(null)}
          className="mb-4 text-xl font-bold text-primary"
          placeholder="Puzzle title..."
          autoFocus
        />
      ) : (
        <h3
          className="text-xl font-bold text-primary mb-4 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
          onClick={() => setIsEditing("title")}
        >
          {content.title || "Click to add puzzle title..."}
        </h3>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {content.puzzleImage ? (
            <div className="relative group">
              <img
                src={content.puzzleImage}
                alt="Puzzle"
                className="w-full h-auto rounded border border-[hsl(var(--newsletter-section-border))]"
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
          )}
        </div>

        <div className="space-y-4">
          {isEditing === "instructions" ? (
            <Textarea
              value={content.instructions || ""}
              onChange={(e) => onUpdate({ ...content, instructions: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="min-h-32 text-sm"
              placeholder="Puzzle instructions..."
              autoFocus
            />
          ) : (
            <div
              className="text-sm text-foreground/80 leading-relaxed cursor-pointer hover:bg-muted/50 rounded px-2 py-2 transition-colors min-h-32"
              onClick={() => setIsEditing("instructions")}
            >
              {content.instructions || "Click to add instructions..."}
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Scan to Solve</h4>
            {content.qrCode ? (
              <div className="relative group inline-block">
                <img
                  src={content.qrCode}
                  alt="QR Code"
                  className="w-32 h-32 rounded border border-[hsl(var(--newsletter-section-border))]"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onUpdate({ ...content, qrCode: undefined })}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <>
                {isEditing !== "qrCode" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing("qrCode")}
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Add QR Code
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
                          placeholder="QR Code URL (https://...)"
                          onChange={(e) => {
                            if (e.target.value) {
                              onUpdate({ ...content, qrCode: e.target.value });
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
                          onChange={handleImageUpload("qrCode")}
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
    </div>
  );
};