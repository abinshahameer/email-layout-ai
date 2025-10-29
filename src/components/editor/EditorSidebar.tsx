import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, FileText, Image, Trash2, Smile, BookOpen, LayoutGrid } from "lucide-react";
import { NewsletterSection } from "../NewsletterEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditorSidebarProps {
  sections: NewsletterSection[];
  onAddSection: (type: NewsletterSection["type"]) => void;
  onDeleteSection: (id: string) => void;
  onUpdateSection: (id: string, updates: Partial<NewsletterSection>) => void;
}

export const EditorSidebar = ({ sections, onAddSection, onDeleteSection, onUpdateSection }: EditorSidebarProps) => {
  const sectionIcons = {
    header: FileText,
    article: FileText,
    comic: Smile,
    puzzle: Image,
    footer: FileText,
    "extended-reading": BookOpen
  };

  return (
    <aside className="w-64 border-r bg-sidebar flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-semibold text-sidebar-foreground mb-3">Newsletter Sections</h2>
        
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onAddSection("article")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Article
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onAddSection("comic")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Comic
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onAddSection("puzzle")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Puzzle
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onAddSection("extended-reading")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Extended Reading
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {sections.map((section, index) => {
            const Icon = sectionIcons[section.type];
            const isRequired = section.id === "header" || section.id === "footer" || section.content.isHero;
            
            return (
              <div
                key={section.id}
                className="space-y-2 p-2 rounded-md bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Icon className="w-4 h-4 text-sidebar-foreground" />
                    <span className="text-sm text-sidebar-foreground">
                      {section.type === "header" && "Header"}
                      {section.type === "article" && (section.content.isHero ? "Hero" : `Article ${sections.slice(0, index + 1).filter(s => s.type === 'article' && !s.content.isHero).length}`)}
                      {section.type === "comic" && "Comic"}
                      {section.type === "puzzle" && "Puzzle"}
                      {section.type === "extended-reading" && "Extended Reading"}
                      {section.type === "footer" && "Footer"}
                    </span>
                  </div>
                  
                  {!isRequired && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteSection(section.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  )}
                </div>

                {((section.type === "article" && !section.content.isHero) || section.type === "comic" || section.type === "puzzle") && (
                  <Select
                    value={section.rowLayout || "full"}
                    onValueChange={(value: "full" | "half") => 
                      onUpdateSection(section.id, { rowLayout: value })
                    }
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <LayoutGrid className="w-3 h-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="half">Half Width</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
};
