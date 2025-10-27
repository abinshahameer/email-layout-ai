import { Card } from "@/components/ui/card";
import { NewsletterSection } from "../NewsletterEditor";
import { HeaderSection } from "./sections/HeaderSection";
import { ArticleSection } from "./sections/ArticleSection";
import { FooterSection } from "./sections/FooterSection";
import { ComicSection } from "./sections/ComicSection";
import { PuzzleSection } from "./sections/PuzzleSection";
import { cn } from "@/lib/utils";

interface NewsletterPreviewProps {
  sections: NewsletterSection[];
  onUpdateSection: (id: string, content: any) => void;
  previewMode: "desktop" | "mobile";
}

export const NewsletterPreview = ({ sections, onUpdateSection, previewMode }: NewsletterPreviewProps) => {
  return (
    <Card className={cn(
      "mx-auto bg-white shadow-lg transition-all duration-300",
      previewMode === "desktop" ? "max-w-3xl" : "max-w-md"
    )}>
      <div className="newsletter-container">
        {sections.map((section, index) => {
          switch (section.type) {
            case "header":
              return (
                <HeaderSection
                  key={section.id}
                  content={section.content}
                  onUpdate={(content) => onUpdateSection(section.id, content)}
                />
              );
            case "article":
              return (
                <ArticleSection
                  key={section.id}
                  content={section.content}
                  onUpdate={(content) => onUpdateSection(section.id, content)}
                />
              );
            case "comic":
              return (
                <ComicSection
                  key={section.id}
                  content={section.content}
                  onUpdate={(content) => onUpdateSection(section.id, content)}
                />
              );
            case "puzzle":
              return (
                <PuzzleSection
                  key={section.id}
                  content={section.content}
                  onUpdate={(content) => onUpdateSection(section.id, content)}
                />
              );
            case "footer":
              return (
                <FooterSection
                  key={section.id}
                  content={section.content}
                  onUpdate={(content) => onUpdateSection(section.id, content)}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </Card>
  );
};
