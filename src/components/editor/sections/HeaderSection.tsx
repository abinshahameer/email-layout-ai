import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Link as LinkIcon, Edit, Check } from "lucide-react";
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
  const subtitleRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!content.backgroundImage) {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");

      // 🔥 Resize logic (critical)
      const maxWidth = 1000;
      const scale = Math.min(1, maxWidth / img.width);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw resized image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 🔥 Gradient overlay (same effect as before)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);


      // 🔥 Compression
      let quality = 0.8;
      let base64 = canvas.toDataURL("image/jpeg", quality);

      // 🔥 Optional: ensure size stays under ~100KB
      // while (base64.length > 100 * 1024 && quality > 0.3) {
      //   quality -= 0.05;
      //   base64 = canvas.toDataURL("image/jpeg", quality);
      // }

      onUpdate({ ...content, backgroundImage: base64 });
    };

    img.src = heroBackground;
  }
}, []);

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');

      // 🔥 Resize logic
      const maxWidth = 1000;
      const scale = Math.min(1, maxWidth / img.width);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw resized image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 🔥 Gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 🔥 Compression
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

      onUpdate({ ...content, backgroundImage: dataUrl });
    };

    img.src = event.target?.result as string;
  };

  reader.readAsDataURL(file);
};

  const handleSubtitleSave = () => {
    if (subtitleRef.current) {
      onUpdate({ ...content, subtitle: subtitleRef.current.innerHTML });
    }
    setIsEditing(null);
  };

  const backgroundImg = content.backgroundImage || heroBackground;

  return (
    <div className="relative" style={{ fontFamily: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif' }}>
      {/* Hero section with background image */}
      <div
        className="relative py-10 sm:py-16 px-4 sm:px-8 text-center"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#000000'
        }}
      >
        {/* Overlay for black tint */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logos Row */}
          <div className="flex items-center justify-between mb-8">
            <img
              src="https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/logo-rgb-white.png"
              alt="TCS Logo"
              className="h-6 sm:h-7"
            />
            <img
              src="https://www.tata.com/etc.clientlibs/tata/clientlibs/assets/resources/img/pages/nav/Tata_Logo2.svg"
              alt="Tata Logo"
              className="h-8 sm:h-10"
            />
          </div>

          {/* Date */}
          <div className="mb-6">
            {isEditing === "date" ? (
              <Input
                value={content.date}
                onChange={(e) => onUpdate({ ...content, date: e.target.value })}
                onBlur={() => setIsEditing(null)}
                className="w-40 h-8 mx-auto bg-transparent border-white/20 text-white text-center uppercase tracking-widest text-xs"
                autoFocus
              />
            ) : (
              <span
                className="text-white/90 uppercase tracking-widest text-xs cursor-pointer hover:text-white"
                onClick={() => setIsEditing("date")}
              >
                {content.date || "JANUARY 2026"}
              </span>
            )}
          </div>

          {/* Main Title */}
          {isEditing === "title" ? (
             <Input
              value={content.title}
              onChange={(e) => onUpdate({ ...content, title: e.target.value })}
              onBlur={() => setIsEditing(null)}
              className="w-full bg-transparent border-y border-white/30 text-white text-center font-bold uppercase py-2 sm:py-4 text-2xl sm:text-3xl"
              placeholder="YOUR TITLE"
              autoFocus
            />
          ) : (
            <h1
              className="text-white font-bold uppercase border-y border-white/30 py-2 sm:py-4 text-2xl sm:text-3xl cursor-pointer hover:bg-white/5"
              onClick={() => setIsEditing("title")}
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}
            >
              {content.title || "Pace Port Insights"}
            </h1>
          )}
          
          {/* Subtitle */}
          {isEditing === "subtitle" ? (
            <div className="w-full max-w-xl mx-auto bg-black/40 p-4 rounded-lg border border-white/20 shadow-xl mt-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-white hover:bg-white/10" 
                    onMouseDown={(e) => {
                      e.preventDefault();
                      document.execCommand('bold', false);
                    }}
                    title="Bold"
                  >
                    <span className="font-bold text-base">B</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-white hover:bg-white/10" 
                    onMouseDown={(e) => {
                      e.preventDefault();
                      document.execCommand('italic', false);
                    }}
                    title="Italic"
                  >
                    <span className="italic text-base">I</span>
                  </Button>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 gap-1 px-3"
                  onClick={handleSubtitleSave}
                >
                  <Check className="h-3.5 w-3.5" />
                  Done
                </Button>
              </div>
              <div
                ref={subtitleRef}
                contentEditable
                className="text-white text-center text-sm sm:text-base outline-none min-h-[3rem]"
                dangerouslySetInnerHTML={{ __html: content.subtitle || "" }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleSubtitleSave();
                  }
                }}
                autoFocus
              />
            </div>
          ) : (
            <p
              className="text-white text-sm sm:text-base max-w-xl mx-auto mt-4 cursor-pointer hover:bg-white/5 rounded py-1"
              onClick={() => setIsEditing("subtitle")}
              dangerouslySetInnerHTML={{ __html: content.subtitle || "A monthly digest of the latest news, events, and innovations." }}
            />
          )}

          {/* CTA Button */}
          <div className="mt-8">
            {isEditing === "cta" ? (
              <div className="space-y-2 max-w-sm mx-auto p-4 bg-white/10 rounded-lg">
                <Input
                  value={content.ctaText}
                  onChange={(e) => onUpdate({ ...content, ctaText: e.target.value })}
                  className="w-full bg-white text-gray-800"
                  placeholder="Button Text"
                />
                <Input
                  value={content.ctaLink}
                  onChange={(e) => onUpdate({ ...content, ctaLink: e.target.value })}
                  className="w-full bg-white text-gray-800"
                  placeholder="https://example.com"
                />
                 <Button size="sm" className="mt-2" variant="secondary" onClick={() => setIsEditing(null)}>Done</Button>
              </div>
            ) : (
              <a href={content.ctaLink || "#"} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-[#FBB034] text-black font-bold hover:bg-[#FBB034]/90 relative group"
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

