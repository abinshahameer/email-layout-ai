import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Link as LinkIcon, Edit } from "lucide-react";
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
    title?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  onUpdate: (content: any) => void;
}

export const HeaderSection = ({ content, onUpdate }: HeaderSectionProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    if (!content.backgroundImage) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, 'rgba(0, 20, 40, 0.7)');
          gradient.addColorStop(1, 'rgba(0, 40, 80, 0.8)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          onUpdate({ ...content, backgroundImage: dataUrl });
        }
      };
      img.src = heroBackground;
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(0, 20, 40, 0.7)');
            gradient.addColorStop(1, 'rgba(0, 40, 80, 0.8)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            onUpdate({ ...content, backgroundImage: dataUrl });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const backgroundImg = content.backgroundImage || heroBackground;

  return (
    <div className="relative font-sans">
      {/* Hero section with background image */}
      <div
        className="relative py-12 sm:py-20 px-4 sm:px-8 text-center"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
    {/* Dark overlay */}
    

        {/* Content */}
        <div className="relative z-10">
          {/* Logo and Date */}
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <img
              src="https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/logo-rgb-white.png"
              alt="TCS Logo"
              className="h-6 sm:h-7"
            />
            {isEditing === "date" ? (
              <Input
                value={content.date}
                onChange={(e) => onUpdate({ ...content, date: e.target.value })}
                onBlur={() => setIsEditing(null)}
                className="w-40 h-8 bg-transparent border-white/20 text-white text-right font-mono"
                autoFocus
              />
            ) : (
              <span
                className="text-white/80 font-mono text-sm cursor-pointer hover:text-white"
                onClick={() => setIsEditing("date")}
              >
                {content.date || "JAN 2026"}
              </span>
            )}
          </div>

          {/* Main Title */}
          {isEditing === "title" ? (
             <Input
              value={content.title}
              onChange={(e) => onUpdate({ ...content, title: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="w-full bg-transparent border-y-2 border-x-0 border-white/20 text-white text-center font-black tracking-[0.2em] uppercase py-2 sm:py-4 text-3xl sm:text-4xl"
              placeholder="YOUR TITLE"
              autoFocus
            />
          ) : (
            <h1
              className="text-white font-black tracking-[0.2em] uppercase border-y-2 border-white/20 py-2 sm:py-4 text-3xl sm:text-4xl cursor-pointer hover:bg-white/5"
              onClick={() => setIsEditing("title")}
              style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}
            >
              {content.title || "Pace Port Insights"}
            </h1>
          )}
          
          {/* Subtitle */}
          {isEditing === "subtitle" ? (
            <textarea
              value={content.subtitle}
              onChange={(e) => onUpdate({ ...content, subtitle: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="w-full max-w-2xl mx-auto bg-transparent border-none text-white text-center text-base sm:text-lg mt-6"
              placeholder="Your engaging subtitle here..."
              autoFocus
            />
          ) : (
            <p
              className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mt-6 cursor-pointer hover:bg-white/5 rounded py-2"
              onClick={() => setIsEditing("subtitle")}
            >
              {content.subtitle || "A monthly digest of the latest news, events, and innovations from Pace Port São Paulo, designed to inspire and inform."}
            </p>
          )}

          {/* CTA Button */}
          <div className="mt-6 sm:mt-10">
            {isEditing === "cta" ? (
              <div className="space-y-2 max-w-sm mx-auto">
                <Input
                  value={content.ctaText}
                  onChange={(e) => onUpdate({ ...content, ctaText: e.target.value })}
                  className="w-full bg-white/90 border-transparent text-gray-800 text-center"
                  placeholder="Button Text"
                />
                <Input
                  value={content.ctaLink}
                  onChange={(e) => onUpdate({ ...content, ctaLink: e.target.value })}
                  className="w-full bg-white/90 border-transparent text-gray-800 text-center"
                  placeholder="https://example.com"
                />
                 <Button size="sm" variant="secondary" onClick={() => setIsEditing(null)}>Done</Button>
              </div>
            ) : (
              <a href={content.ctaLink || "#"} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-[#f5c518] text-[#0a1628] font-bold hover:bg-[#f5c518]/90 relative group"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing("cta");
                  }}
                >
                  {content.ctaText || "Explore More"}
                  <Edit className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Background image edit button */}
      {isEditing !== "backgroundImage" && (
         <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 z-20 opacity-50 hover:opacity-100 hidden sm:flex"
          onClick={() => setIsEditing("backgroundImage")}
        >
          <Upload className="w-4 h-4 mr-2" />
          Change Background
        </Button>
      )}

      {isEditing === "backgroundImage" && (
        <div className="absolute top-4 right-4 z-20 bg-white p-4 rounded-lg shadow-lg w-full sm:w-64">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="url">
              <Input
                placeholder="Image URL"
                onChange={(e) => onUpdate({ ...content, backgroundImage: e.target.value })}
              />
            </TabsContent>
            <TabsContent value="upload">
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
            </TabsContent>
          </Tabs>
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setIsEditing(null)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

