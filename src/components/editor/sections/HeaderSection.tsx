import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import heroBackground from "@/assets/hero-background.jpg";

interface HeaderSectionProps {
  content: {
    logo: string;
    date: string;
    episode: string;
    lab: string;
    backgroundImage?: string;
    subtitle?: string;
  };
  onUpdate: (content: any) => void;
}

export const HeaderSection = ({ content, onUpdate }: HeaderSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...content, backgroundImage: reader.result as string });
        setIsEditing(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const backgroundImg = content.backgroundImage || heroBackground;

  return (
    <div className="relative">
      {/* Top bar with logo and location */}
      <div
        className="relative text-white px-6 py-3 flex items-center justify-between z-10"
        style={{ backgroundColor: 'rgba(10, 22, 40, 0.95)' }}
      >
        <div className="flex items-center gap-3">
          <img
            src="https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/logo-rgb-white.png"
            alt="TCS Logo"
            className="h-6 object-contain"
          />
        </div>

        <div className="flex items-center gap-6 text-sm">
          {isEditing === "lab" ? (
            <Input
              value={content.lab}
              onChange={(e) => onUpdate({ ...content, lab: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="w-48 h-7 bg-white/10 border-white/20 text-white text-sm"
              autoFocus
            />
          ) : (
            <span
              className="cursor-pointer hover:opacity-80 transition-opacity font-medium"
              onClick={() => setIsEditing("lab")}
            >
              {content.lab || "Pace Port, São Paulo"}
            </span>
          )}

          {isEditing === "episode" ? (
            <Input
              value={content.episode}
              onChange={(e) => onUpdate({ ...content, episode: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="w-24 h-7 bg-white/10 border-white/20 text-white text-sm"
              autoFocus
            />
          ) : (
            <span
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsEditing("episode")}
            >
              {content.episode || "Episode 01"}
            </span>
          )}
        </div>
      </div>

      {/* Hero section with background image */}
      <div
        className="relative py-16 px-8 text-center"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10,22,40,0.7) 0%, rgba(0,52,100,0.85) 100%)'
          }}
        />

        {/* Large background text */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
          style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.12)',
            lineHeight: 1.1,
            whiteSpace: 'nowrap'
          }}
        >
          <span>TCS Pace Port</span>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Date badge */}
          <div className="mb-6">
            <div
              className="inline-block px-10 py-2.5 font-semibold text-lg"
              style={{
                backgroundColor: '#f5c518',
                color: '#0a1628'
              }}
            >
              {isEditing === "date" ? (
                <Input
                  value={content.date}
                  onChange={(e) => onUpdate({ ...content, date: e.target.value })}
                  onBlur={() => setIsEditing(null)}
                  className="w-40 h-8 bg-transparent border-none text-center font-semibold"
                  style={{ color: '#0a1628' }}
                  autoFocus
                />
              ) : (
                <span
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setIsEditing("date")}
                >
                  {content.date || "January 2026"}
                </span>
              )}
            </div>
          </div>

          {/* Newsletter title */}
          <h1
            className="text-white font-black tracking-[0.35em] uppercase mb-4"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2.75rem)' }}
          >
            NEWSLETTER
          </h1>

          {/* Subtitle */}
          {isEditing === "subtitle" ? (
            <Input
              value={content.subtitle}
              onChange={(e) => onUpdate({ ...content, subtitle: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="w-full max-w-md mx-auto bg-white/10 border-white/20 text-white text-center text-base"
              placeholder="Your subtitle here..."
              autoFocus
            />
          ) : (
            <p
              className="text-white/80 text-base max-w-md mx-auto cursor-pointer hover:bg-white/10 rounded py-1"
              onClick={() => setIsEditing("subtitle")}
            >
              {content.subtitle || "A monthly digest of the latest news, events, and innovations from our ecosystem."}
            </p>
          )}
        </div>
      </div>

      {/* Background image edit button */}
      {isEditing === "backgroundImage" ? (
        <div className="absolute bottom-4 right-4 z-20 bg-white p-4 rounded-lg shadow-lg">
          <Tabs defaultValue="url" className="w-64">
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
                    onUpdate({ ...content, backgroundImage: e.target.value });
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
            </TabsContent>
          </Tabs>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setIsEditing(null)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 z-20 opacity-70 hover:opacity-100"
          onClick={() => setIsEditing("backgroundImage")}
        >
          <Upload className="w-4 h-4 mr-2" />
          Change Background
        </Button>
      )}
    </div>
  );
};
