import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { Download, Sparkles, Eye } from "lucide-react";
import { EditorSidebar } from "./editor/EditorSidebar";
import { NewsletterPreview } from "./editor/NewsletterPreview";
import { AIAssistant } from "./editor/AIAssistant";
import { exportToHTML } from "@/lib/htmlExport";
import { useToast } from "@/hooks/use-toast";

export interface NewsletterSection {
  id: string;
  type: "header" | "article" | "integration-list" | "table" | "image" | "footer";
  content: any;
}

const NewsletterEditor = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<NewsletterSection[]>([
    {
      id: "header",
      type: "header",
      content: {
        company: "TATA CONSULTANCY SERVICES",
        title: "Integrations & Functionalities",
        date: new Date().toLocaleDateString("en-US", { 
          month: "long", 
          day: "numeric", 
          year: "numeric" 
        })
      }
    },
    {
      id: "main-article",
      type: "article",
      content: {
        title: "DeepSomatic: Cancer Variant Detection",
        description: "DeepSomatic detects cancer variants in genomic data. First, sequencing data from the tumor cells and non-cancerous cells are turned into an image. DeepSomatic passes these images through its convolutional neural network to differentiate between the reference genome, the non-cancer germline variants in that individual, and the cancer-caused somatic variants in the tumor, while discarding variations caused by small sequencing errors. The result is a list of cancer-caused variants, or mutations."
      }
    },
    {
      id: "footer",
      type: "footer",
      content: {
        links: ["Unsubscribe", "View in Browser", "Privacy Policy"],
        copyright: "© 2025 Tata Consultancy Services. All rights reserved."
      }
    }
  ]);

  const [showAI, setShowAI] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const updateSection = (id: string, content: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, content } : s));
  };

  const addSection = (type: NewsletterSection["type"]) => {
    const newSection: NewsletterSection = {
      id: `section-${Date.now()}`,
      type,
      content: {}
    };
    setSections([...sections.slice(0, -1), newSection, sections[sections.length - 1]]);
  };

  const deleteSection = (id: string) => {
    if (id === "header" || id === "footer") {
      toast({
        title: "Cannot delete",
        description: "Header and footer sections are required.",
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

  return (
    <div className="flex h-screen w-full bg-background">
      <EditorSidebar 
        sections={sections}
        onAddSection={addSection}
        onDeleteSection={deleteSection}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Newsletter Builder</h1>
            <p className="text-sm text-muted-foreground">AI-powered email newsletter editor</p>
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
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAI(!showAI)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
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
    </div>
  );
};

export default NewsletterEditor;
