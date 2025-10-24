import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { X, Send, Loader2 } from "lucide-react";
import { NewsletterSection } from "../NewsletterEditor";
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  sections: NewsletterSection[];
  onUpdateSections: (sections: NewsletterSection[]) => void;
  onClose: () => void;
}

export const AIAssistant = ({ sections, onUpdateSections, onClose }: AIAssistantProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    
    // TODO: Integrate with Lovable AI once Lovable Cloud is enabled
    toast({
      title: "AI Assistant",
      description: "AI integration will be available after enabling Lovable Cloud.",
    });

    setIsLoading(false);
    setPrompt("");
  };

  return (
    <Card className="w-96 m-4 flex flex-col shadow-xl">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">Try asking:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>"Add a new news item about AI advances"</li>
            <li>"Rewrite this article to be more concise"</li>
            <li>"Summarize the main article in 2 sentences"</li>
            <li>"Add an integration list section"</li>
          </ul>
        </div>

        <div className="p-3 bg-muted rounded-lg text-sm">
          <p className="font-medium mb-1">💡 Tip</p>
          <p className="text-muted-foreground">
            Enable Lovable Cloud to unlock AI-powered content generation and editing.
          </p>
        </div>
      </div>

      <div className="p-4 border-t space-y-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to do..."
          className="min-h-24 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />
        
        <Button 
          onClick={handleGenerate} 
          disabled={!prompt.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Generate with AI
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
