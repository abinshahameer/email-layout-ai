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
        // Skip hero articles (now integrated into header)
        if (section.content.isHero) return null;
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

      // Skip hero articles (handled by header now)
      if (section.type === "article" && section.content.isHero) {
        i++;
        continue;
      }

      // Header, footer, and extended reading are always full width
      if (section.type === "header" || section.type === "footer" || section.type === "extended-reading") {
        const rendered = renderSection(section);
        if (rendered) elements.push(rendered);
        i++;
        continue;
      }

      // Check if current section is half width and there's a next section also half width
      if (section.rowLayout === "half" && i + 1 < sections.length && sections[i + 1].rowLayout === "half") {
        const nextSection = sections[i + 1];
        // Skip if next is header/footer/extended-reading or hero
        if (nextSection.type !== "header" && nextSection.type !== "footer" && nextSection.type !== "extended-reading" && !nextSection.content?.isHero) {
          const firstRendered = renderSection(section, true);
          const secondRendered = renderSection(nextSection, true);
          if (firstRendered && secondRendered) {
            elements.push(
              <div key={`row-${section.id}-${nextSection.id}`} className="grid grid-cols-2">
                <div className="border-r border-gray-200">{firstRendered}</div>
                <div>{secondRendered}</div>
              </div>
            );
          }
          i += 2;
          continue;
        }
      }

      // Render single section
      const rendered = renderSection(section, section.rowLayout === "half");
      if (rendered) elements.push(rendered);
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
