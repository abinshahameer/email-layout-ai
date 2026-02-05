import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { Download, Sparkles, Eye, Copy, Upload, Menu } from "lucide-react";
import { EditorSidebar } from "./editor/EditorSidebar";
import { NewsletterPreview } from "./editor/NewsletterPreview";
import { AIAssistant } from "./editor/AIAssistant";
import { exportToHTML } from "@/lib/htmlExport";
import { parseImportedHTML } from "@/lib/htmlImport";
import { useToast } from "@/hooks/use-toast";
import { getSections, saveSections } from "@/lib/db";
import { useDebounce } from "@/hooks/use-debounce";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface NewsletterSection {
  id: string;
  type: "header" | "article" | "comic" | "footer" | "puzzle" | "extended-reading";
  content: any;
  rowLayout?: "full" | "half"; // full = 1 item per row, half = 2 items per row
}

const initialSections: NewsletterSection[] = [
  {
    id: "header",
    type: "header",
    content: {
      logo: "TCS",
      episode: "Episode 01",
      lab: "Pace Port, São Paulo",
      date: "January 2026"
    }
  },
  {
    id: "article-1",
    type: "article",
    content: {
      title: "Innovation Workshop",
      description: "Join us for an exciting innovation workshop at Pace Port São Paulo. This event brings together industry leaders and creative minds to explore the latest trends in technology and business transformation. Learn from experts and network with peers.",
      link: "#",
      linkText: "Learn More"
    },
    rowLayout: "half"
  },
  {
    id: "article-2",
    type: "article",
    content: {
      title: "Tech Summit 2026",
      description: "The annual Tech Summit returns to São Paulo with keynote speakers from around the world. Discover breakthrough technologies, AI innovations, and digital transformation strategies that are shaping the future of business.",
      link: "#",
      linkText: "Register Now"
    },
    rowLayout: "half"
  },
  {
    id: "article-3",
    type: "article",
    content: {
      title: "Design Thinking Session",
      description: "Experience our hands-on design thinking workshop. This interactive session helps teams develop creative problem-solving skills and innovative approaches to complex challenges. Perfect for product teams and innovators.",
      link: "#",
      linkText: "Book Your Spot"
    },
    rowLayout: "half"
  },
  {
    id: "article-4",
    type: "article",
    content: {
      title: "Cloud Computing Masterclass",
      description: "Deep dive into cloud architecture and best practices with our expert-led masterclass. Learn about scalable solutions, security frameworks, and cost optimization strategies for enterprise cloud deployments.",
      link: "#",
      linkText: "Enroll Today"
    },
    rowLayout: "half"
  },
  {
    id: "article-5",
    type: "article",
    content: {
      title: "Startup Pitch Day",
      description: "Calling all entrepreneurs! Present your innovative ideas to a panel of investors and industry experts. This is your chance to get funding, mentorship, and valuable feedback for your startup.",
      link: "#",
      linkText: "Apply Now"
    },
    rowLayout: "half"
  },
  {
    id: "article-6",
    type: "article",
    content: {
      title: "AI & Machine Learning Forum",
      description: "Explore the cutting edge of artificial intelligence and machine learning. Industry practitioners share real-world case studies and implementation strategies for AI-powered solutions.",
      link: "#",
      linkText: "Join Us"
    },
    rowLayout: "half"
  },
  {
    id: "footer",
    type: "footer",
    content: {
      links: ["Subscribe", "View in browser", "Privacy policy"],
      url: ["#", "#", "#"],
      copyright: "TCS Pace Port, São Paulo. All rights reserved"
    }
  }
];

const NewsletterEditor = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<NewsletterSection[]>(initialSections);
  const [showAI, setShowAI] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [showLoadPrompt, setShowLoadPrompt] = useState(false);
  const [savedSections, setSavedSections] = useState<NewsletterSection[] | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const isMobile = useIsMobile();

  const debouncedSections = useDebounce(sections, 500);

  useEffect(() => {
    // Don't save the initial default state until it's modified
    if (JSON.stringify(debouncedSections) !== JSON.stringify(initialSections)) {
        saveSections(debouncedSections);
    }
  }, [debouncedSections]);

  useEffect(() => {
    const checkForSavedData = async () => {
      const loadedSections = await getSections();
      if (loadedSections && loadedSections.length > 0) {
        setSavedSections(loadedSections);
        setShowLoadPrompt(true);
      }
    };
    checkForSavedData();
  }, []);

  const handleLoadSaved = () => {
      if (savedSections) {
          setSections(savedSections);
      }
      setShowLoadPrompt(false);
  };

  const handleDeclineLoad = () => {
      setShowLoadPrompt(false);
  };

  const reorderSections = (reorderedSections: NewsletterSection[]) => {
    setSections(reorderedSections);
  };

  const updateSection = (id: string, content: NewsletterSection['content']) => {
    setSections(sections.map(s => s.id === id ? { ...s, content } : s));
  };

  const addSection = (type: NewsletterSection["type"]) => {
    const newSection: NewsletterSection = {
      id: `section-${Date.now()}`,
      type,
      content: {},
      rowLayout: "full" // Set default layout
    };
    setSections([...sections.slice(0, -1), newSection, sections[sections.length - 1]]);
  };

  const deleteSection = (id: string) => {
    const sectionToDelete = sections.find(s => s.id === id);
    if (id === "header" || id === "footer" || sectionToDelete?.content?.isHero) {
      toast({
        title: "Cannot delete",
        description: "Header, footer, and hero sections are required.",
        variant: "destructive"
      });
      return;
    }
    setSections(sections.filter(s => s.id !== id));
  };

  const handleExport = () => {
    const html = exportToHTML(sections);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter.html";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Newsletter exported!",
      description: "Your HTML file is ready for email clients."
    });
  };


  const handleCopyHtml = async () => {
    const html = exportToHTML(sections);
  
    try {
      // Modern Clipboard API approach
      await navigator.clipboard.writeText(html);
      toast({
        title: "HTML copied!",
        description: "Your HTML is now in the clipboard."
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = html;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);
  
      try {
        const successful = document.execCommand("copy");
        if (successful) {
          toast({
            title: "HTML copied!",
            description: "Your HTML is now in the clipboard."
          });
        } else {
          throw new Error("execCommand copy failed");
        }
      } catch (error) {
        console.error("Fallback: Unable to copy", error);
        toast({
          title: "Copy failed",
          description: "Please manually select and copy the HTML."
        });
      }
  
      document.body.removeChild(textArea);
    }
  };

  const handleImport = () => {
    importInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const html = e.target?.result as string;
        try {
          const importedSections = parseImportedHTML(html);
          if (importedSections.length > 0) {
            setSections(importedSections);
            toast({
              title: "Import successful",
              description: "The newsletter has been loaded into the editor.",
            });
          } else {
            throw new Error("No sections found in the imported file.");
          }
        } catch (error) {
          console.error("Import failed:", error);
          toast({
            title: "Import failed",
            description: "The selected file could not be parsed. Please make sure it's a valid newsletter HTML file.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (importInputRef.current) {
      importInputRef.current.value = "";
    }
  };
  
  const editorSidebar = (
    <EditorSidebar
      sections={sections}
      onAddSection={addSection}
      onDeleteSection={deleteSection}
      onReorderSections={reorderSections}
      onUpdateSection={(id: string, updates: Partial<NewsletterSection>) => {
        setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
      }}
    />
  );

  return (
    <div className="flex h-screen w-full bg-background">
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="absolute top-5 left-4 z-30">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            {editorSidebar}
          </SheetContent>
        </Sheet>
      ) : (
        editorSidebar
      )}
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4 flex items-center justify-between flex-wrap gap-4 md:justify-between justify-center">
          <div className={isMobile ? "pl-12" : ""}>
            <h1 className="text-2xl font-bold text-foreground">Newsletter Builder</h1>
            <p className="text-sm text-muted-foreground">Email newsletter editor</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(previewMode === "desktop" ? "mobile" : "desktop")}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode === "desktop" ? "Desktop" : "Mobile"}
            </Button>
            


            <input
              type="file"
              ref={importInputRef}
              className="hidden"
              accept=".html"
              onChange={handleFileChange}
            />
            <Button onClick={handleImport} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import HTML
            </Button>

            <Button onClick={handleCopyHtml}>
              <Copy className="w-4 h-4 mr-2" />
              Copy HTML
            </Button>
            
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export HTML
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <NewsletterPreview
              sections={sections}
              onUpdateSection={updateSection}
              previewMode={previewMode}
            />
          </div>
          
          {showAI && (
            <AIAssistant
              sections={sections}
              onUpdateSections={setSections}
              onClose={() => setShowAI(false)}
            />
          )}
        </div>
      </main>
      <AlertDialog open={showLoadPrompt} onOpenChange={setShowLoadPrompt}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Load Saved Newsletter?</AlertDialogTitle>
                <AlertDialogDescription>
                    You have a previously saved newsletter. Would you like to load it?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={handleDeclineLoad}>No, start fresh</AlertDialogCancel>
                <AlertDialogAction onClick={handleLoadSaved}>Yes, load saved</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsletterEditor;
