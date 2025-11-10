import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { Download, Sparkles, Eye, Copy } from "lucide-react";
import { EditorSidebar } from "./editor/EditorSidebar";
import { NewsletterPreview } from "./editor/NewsletterPreview";
import { AIAssistant } from "./editor/AIAssistant";
import { exportToHTML } from "@/lib/htmlExport";
import { useToast } from "@/hooks/use-toast";
import { getSections, saveSections } from "@/lib/db";
import { useDebounce } from "@/hooks/use-debounce";
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
      episode: "Episode 02",
      lab: "Rapid Innovation Labs"
    }
  },
  {
    id: "hero",
    type: "article",
    content: {
      title: "RAPID CIRCUIT",
      isHero: true,
      quote: "Backup is not a feature; its a foundation.",
      date: "Oct 23th 2025"
    },
    rowLayout: "full"
  },
  {
    id: "article-1",
    type: "article",
    content: {
      title: "Claude Code for Web",
      description: "Have you ever wanted to write code without setting up an environment or even typing a single line? Introducing Prompt for Anthropic Claude Code for Web. The simple, web interface device users want to develop programs in various languages without running any commands on their local system.",
      link: "https://www.anthropic.com/news/claude-code-on-the-web",
      linkText: "Anthropic News"
    },
    rowLayout: "full"
  },
  {
    id: "article-2",
    type: "article",
    content: {
      title: "DeepSemantic",
      description: "Google Research, in collaboration with the University of California, Berkeley, recently introduced DeepSomatic v1.8—an upgrade that enhances somatic variant detection using deep learning. The model leverages convolutional neural networks to detect mutations. Compatible with Illumina, Pacific Biosciences (PacBio), and Oxford Nanopore Technologies (ONT) sequencing data, DeepSomatic provides highly accurate variant calls, seamlessly integrating with existing tools validated on real clinical samples.",
      link: "https://research.google/blog/deepsomatic-accurate-somatic",
      linkText: "Google Research Blog"
    },
    rowLayout: "full"
  },
  {
    id: "article-3",
    type: "article",
    content: {
      title: "Claude Code for Web",
      description: "Have you ever wanted to write code without setting up an environment or even typing a single line? Introducing Prompt for Anthropic Claude Code for Web. The simple, web interface device users want to develop programs in various languages without running any commands on their local system.",
      link: "https://www.anthropic.com/news/claude-code-on-the-web",
      linkText: "Anthropic News"
    },
    rowLayout: "full"
  },
  {
    id: "footer",
    type: "footer",
    content: {
      links: ["Subscribe", "View in Browser", "Privacy Policy"],
      url:["https://forms.office.com/r/8exqUT0nmD","https://www.tcs.com/who-we-are/newsroom/tcs-in-the-news/tcs-rapid-labs","https://www.tcs.com/who-we-are/newsroom/tcs-in-the-news/tcs-rapid-labs"],
      copyright: "© 2025 Rapid Innovation Labs. All rights reserved."
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
  

  return (
    <div className="flex h-screen w-full bg-background">
      <EditorSidebar 
        sections={sections}
        onAddSection={addSection}
        onDeleteSection={deleteSection}
        onUpdateSection={(id: string, updates: Partial<NewsletterSection>) => {
          setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
        }}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Newsletter Builder</h1>
            <p className="text-sm text-muted-foreground">Email newsletter editor</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(previewMode === "desktop" ? "mobile" : "desktop")}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode === "desktop" ? "Desktop" : "Mobile"}
            </Button>
            
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAI(!showAI)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </Button> */}

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
          <div className="flex-1 overflow-y-auto p-8">
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
