import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, FileText, Image, Trash2, Smile, BookOpen, LayoutGrid, GripVertical } from "lucide-react";
import { NewsletterSection } from "../NewsletterEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import React from "react";

interface EditorSidebarProps {
  sections: NewsletterSection[];
  onAddSection: (type: NewsletterSection["type"]) => void;
  onDeleteSection: (id: string) => void;
  onUpdateSection: (id: string, updates: Partial<NewsletterSection>) => void;
  onReorderSections: (sections: NewsletterSection[]) => void;
}

const sectionIcons = {
  header: FileText,
  article: FileText,
  comic: Smile,
  puzzle: Image,
  footer: FileText,
  "extended-reading": BookOpen
};

const SortableSection = ({ section, index, sections, onDeleteSection, onUpdateSection }: { section: NewsletterSection, index: number, sections: NewsletterSection[], onDeleteSection: (id: string) => void, onUpdateSection: (id: string, updates: Partial<NewsletterSection>) => void }) => {
  const isRequired = section.id === "header" || section.id === "footer" || section.content.isHero;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, disabled: isRequired });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const Icon = sectionIcons[section.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`space-y-2 p-2 rounded-md bg-sidebar-accent transition-colors ${isDragging ? 'shadow-lg' : 'hover:bg-sidebar-accent/80'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          {!isRequired && (
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-sidebar-foreground/50" />
            </button>
          )}
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
};

export const EditorSidebar = ({ sections, onAddSection, onDeleteSection, onUpdateSection, onReorderSections }: EditorSidebarProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      // Ensure we don't move un-draggable items
      const draggableSections = sections.filter(s => s.id !== "header" && s.id !== "footer" && !s.content.isHero);
      const draggableIds = draggableSections.map(s => s.id);

      if (!draggableIds.includes(active.id as string) || !draggableIds.includes(over.id as string)) {
        return;
      }
      
      const nonDraggableTop = sections.filter(s => s.id === "header" || s.content.isHero);
      const nonDraggableBottom = sections.filter(s => s.id === "footer");

      const oldDraggableIndex = draggableSections.findIndex(s => s.id === active.id);
      const newDraggableIndex = draggableSections.findIndex(s => s.id === over.id);
      
      const reorderedDraggable = arrayMove(draggableSections, oldDraggableIndex, newDraggableIndex);
      
      onReorderSections([...nonDraggableTop, ...reorderedDraggable, ...nonDraggableBottom]);
    }
  };

  const sectionIds = sections.map(s => s.id);

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext
            items={sectionIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="p-4 space-y-2">
              {sections.map((section, index) => (
                <SortableSection 
                  key={section.id}
                  section={section}
                  index={index}
                  sections={sections}
                  onDeleteSection={onDeleteSection}
                  onUpdateSection={onUpdateSection}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ScrollArea>
    </aside>
  );
};