import { Card } from "@/components/ui/card";
import { NewsletterSection } from "../NewsletterEditor";
import { HeaderSection } from "./sections/HeaderSection";
import { ArticleSection } from "./sections/ArticleSection";
import { FooterSection } from "./sections/FooterSection";
import { ComicSection } from "./sections/ComicSection";
import { PuzzleSection } from "./sections/PuzzleSection";
import { ExtendedReadingSection } from "./sections/ExtendedReadingSection";
import { cn } from "@/lib/utils";

interface NewsletterPreviewProps {
  sections: NewsletterSection[];
  onUpdateSection: (id: string, content: any) => void;
  previewMode: "desktop" | "mobile";
}

export const NewsletterPreview = ({ sections, onUpdateSection, previewMode }: NewsletterPreviewProps) => {
  const renderSection = (section: NewsletterSection, isHalfWidth: boolean = false) => {
    const commonProps = {
      key: section.id,
      content: section.content,
      onUpdate: (content: any) => onUpdateSection(section.id, content),
      isHalfWidth
    };

    switch (section.type) {
      case "header":
        return <HeaderSection {...commonProps} />;
      case "article":
        return <ArticleSection {...commonProps} />;
      case "comic":
        return <ComicSection {...commonProps} />;
      case "puzzle":
        return <PuzzleSection {...commonProps} />;
      case "extended-reading":
        return <ExtendedReadingSection {...commonProps} />;
      case "footer":
        return <FooterSection {...commonProps} />;
      default:
        return null;
    }
  };

  const renderSections = () => {
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < sections.length) {
      const section = sections[i];

      // Header and footer are always full width
      if (section.type === "header" || section.type === "footer" || section.type === "extended-reading") {
        elements.push(renderSection(section));
        i++;
        continue;
      }

      // Check if current section is half width and there's a next section also half width
      if (section.rowLayout === "half" && i + 1 < sections.length && sections[i + 1].rowLayout === "half") {
        const nextSection = sections[i + 1];
        // Skip if next is header/footer
        if (nextSection.type !== "header" && nextSection.type !== "footer") {
          elements.push(
            <div key={`row-${section.id}-${nextSection.id}`} className="grid grid-cols-2 gap-0">
              {renderSection(section, true)}
              {renderSection(nextSection, true)}
            </div>
          );
          i += 2;
          continue;
        }
      }

      // Render single section
      elements.push(renderSection(section, section.rowLayout === "half"));
      i++;
    }

    return elements;
  };

  return (
    <Card className={cn(
      "mx-auto bg-white shadow-lg transition-all duration-300",
      previewMode === "desktop" ? "max-w-3xl" : "max-w-md"
    )}>
      <div className="newsletter-container">
        {renderSections()}
      </div>
    </Card>
  );
};
